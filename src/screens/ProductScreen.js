import React, { useState, useEffect, useRef } from "react";
import { BsFillCheckCircleFill } from "react-icons/bs";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import { useParams } from "react-router";
import { toast } from "sonner";
import RecentlyViewed from "../components/RecentlyViewed/RecentlyViewed";
import RelatedProducts from "../components/Catalog/RelatedProducts";
import { Link, useNavigate } from "react-router-dom";
import "./Checkout.css";
import { useQuery, useMutation } from "@apollo/client/react";
import { GET_PRODUCT_DETAILS, GET_CHECKOUT_BY_TOKEN, GET_PRODUCT_LIST } from "../GraphQL/Queries";
import {
  CREATE_CHECKOUT_MUTATION,
  CHECKOUT_ADD_PRODUCT_LINE_MUTATION,
  UPDATE_WISHLIST_MUTATION ,CHECKOUT_LINE_UPDATE
} from "../GraphQL/Mutation";
import "./ProductScreen.css";
import "./HomeScreen.css";
import axios from "axios";
import { Helmet } from "react-helmet-async";
import {
  Star, Heart, Truck, RotateCcw, CheckCircle, ChevronRight, ChevronLeft, ChevronDown,
  Plus, Minus, ShoppingCart, Info, Banknote, Landmark, CreditCard, Wallet,
  ShieldCheck, FileText, List, Package, ClipboardList, BookOpen,
  Sparkles, PackageSearch, Search, Share2, Loader2, ArrowRight, X
} from "lucide-react";



function VariantRow({ variant, productName, product, onAddToCart }) {
  const [qty, setQty] = React.useState(1);

  return (
    <div className="variant-row">

      <div className="variant-row-content">

        {/* Product Image */}
        <div className="variant-image-wrapper">

          <img
            src={product.image}
            alt={variant.name}
            className="variant-image"
          />

          {/* Huge Popup Image */}
          <div className="variant-image-popup">
            <img
              src={product.image}
              alt={variant.name}
              className="variant-popup-image"
            />
          </div>

        </div>

        {/* Product Information */}
        <div className="variant-info">

          {/* Product Name */}
          <div className="variant-name">
            {productName} - {variant.name}
          </div>

          {/* Price */}
          <div className="variant-price-row">

            <span className="variant-price">
              ₹{variant.pricing?.price?.net?.amount || variant.price}
            </span>

            {Number(variant.originalPrice) >
              (variant.pricing?.price?.net?.amount || variant.price) && (
                <>
                  <span className="variant-original-price">
                    ₹{variant.originalPrice}
                  </span>

                  <span className="variant-discount">
                    {Math.round(
                      ((Number(variant.originalPrice) -
                        (variant.pricing?.price?.net?.amount ||
                          variant.price)) /
                        Number(variant.originalPrice)) *
                      100
                    )}
                    % OFF
                  </span>
                </>
              )}

          </div>

          {/* Delivery + Actions */}
          <div className="variant-bottom-row">

            {/* Delivery Information */}
            <div className="variant-delivery-info">

              <span className="delivery-item">
                <Truck size={14} />
                Arrives in 3-5 days
              </span>

              <span className="delivery-divider">
                |
              </span>

              <span className="delivery-item">
                <CheckCircle size={14} />
                COD Available
              </span>

            </div>

            {/* Quantity + Add */}
            <div className="variant-actions">

              {/* Quantity */}
              <div className="variant-quantity">

                <button
                  type="button"
                  onClick={() =>
                    setQty(q => Math.max(1, q - 1))
                  }
                  className="variant-quantity-button"
                >
                  <Minus size={13} />
                </button>

                <input
                  type="text"
                  value={qty}
                  onChange={(e) => {
                    let val = e.target.value.replace(/\D/g, "");

                    if (val === "") {
                      setQty("");
                      return;
                    }

                    let num = parseInt(val, 10);

                    if (num > 99) {
                      num = 99;
                    }

                    setQty(num);
                  }}
                  onBlur={() => {
                    if (qty === "" || qty < 1) {
                      setQty(1);
                    }
                  }}
                  className="variant-quantity-input"
                />

                <button
                  type="button"
                  onClick={() =>
                    setQty(q => Math.min(99, q + 1))
                  }
                  className="variant-quantity-button"
                >
                  <Plus size={13} />
                </button>

              </div>

              {/* Add To Cart */}
              <button
                type="button"
                onClick={() =>
                  onAddToCart(variant.id, qty)
                }
                disabled={qty === 0}
                className="variant-add-button"
              >
                <ShoppingCart size={15} />
                <span>ADD</span>
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

function MobileAccordion({ descriptionObj, attributes }) {
  const [openId, setOpenId] = React.useState(null);

  const renderContent = (id) => {
    if (id === "description") return (
      <div className="text-[14px] text-slate-700 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: descriptionObj?.blocks?.[0]?.data?.text || "No description available." }} />
    );
    if (id === "features") return <p className="text-[14px] text-slate-600">Features will be updated soon.</p>;
    if (id === "specifications") return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {attributes?.map(attr => (
          <div key={attr.attribute.name} className="flex flex-col gap-0.5 border-b border-slate-100 pb-2">
            <span className="text-[13px] font-bold text-slate-900">{attr.attribute.name}</span>
            <p className="text-[13px] text-slate-500">{attr.values?.length > 0 ? attr.values.map(v => v.name).join(", ") : "N/A"}</p>
          </div>
        ))}
      </div>
    );
    if (id === "packaging") return <p className="text-[14px] text-slate-600">Packaging information will be updated soon.</p>;
    if (id === "direction") return <p className="text-[14px] text-slate-600">Direction to Use information will be updated soon.</p>;
    if (id === "additionInfo") return <p className="text-[14px] text-slate-600">Additional information will be updated soon.</p>;
    return <p className="text-[14px] text-slate-600">Information not available.</p>;
  };

  const items = [
    { id: "features", label: "Features", iconBg: "bg-blue-500", Icon: List },
    { id: "description", label: "Description", iconBg: "bg-orange-500", Icon: FileText },
    { id: "packaging", label: "Packaging", iconBg: "bg-green-500", Icon: Package },
    { id: "specifications", label: "Key Specifications", iconBg: "bg-purple-500", Icon: ClipboardList },
    { id: "direction", label: "Direction To Use", iconBg: "bg-pink-500", Icon: BookOpen },
    { id: "additionInfo", label: "Additional Info", iconBg: "bg-teal-500", Icon: Info },
  ];

  return (
    <div className="w-full rounded-3xl border overflow-hidden mb-2 bg-white  shadow-sm">
      {items.map(({ id, label, iconBg, Icon }, index) => {
        const isOpen = openId === id;
        const isLast = index === items.length - 1;

        return (
          <div
            key={id}
            className={!isLast ? " " : ""}
          >
            {/* Header */}
            <button
              type="button"
              onClick={() => setOpenId(isOpen ? null : id)}
              className="
              w-full
              min-h-[58px]
              px-4
              py-2
              flex
              border border-blue-600
              items-center
              justify-between
              gap-3
              text-left
              bg-white
              hover:bg-slate-50
              transition-colors
            "
            >
              {/* Icon + Label */}
              <div className="flex items-center gap-3 min-w-0">

                <div
                  className={`
                  w-11
                  h-11
                  rounded-full
                  ${iconBg}
                  flex
                  items-center
                  justify-center
                  shrink-0
                `}
                >
                  <Icon
                    size={18}
                    className="text-white"
                    strokeWidth={2}
                  />
                </div>

                <span className="text-[15px] font-medium text-slate-800 leading-none">
                  {label}
                </span>

              </div>

              {/* Arrow */}
              <ChevronDown
                size={18}
                strokeWidth={1.8}
                className={`
                shrink-0
                text-slate-600
                transition-transform
                duration-200
                ${isOpen ? "rotate-180" : ""}
              `}
              />
            </button>

            {/* Content */}
            {isOpen && (
              <div className="px-4 pb-4 pt-3 bg-slate-50/70 border-t border-slate-100">
                {renderContent(id)}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function TabContent({ activeTab, descriptionObj, attributes }) {
  return (
    <div className="py-2 px-3 sm:px-10 mb-6 bg-white rounded-b-2xl text-slate-800 text-base sm:text-[17px] leading-relaxed">
      {activeTab === "description" && (
        <div className="space-y-3" dangerouslySetInnerHTML={{ __html: descriptionObj?.blocks?.[0]?.data?.text || "No description available." }}>
        </div>
      )}
      {activeTab === "specifications" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {attributes?.map(attr => (
            <div key={attr.attribute.name} className="flex flex-col gap-1 border-b border-slate-100 pb-2">
              <span className="font-bold text-slate-900">{attr.attribute.name}</span>
              <p className="text-slate-600">{attr.values?.length > 0 ? attr.values.map(v => v.name).join(", ") : "N/A"}</p>
            </div>
          ))}
        </div>
      )}
      {activeTab === "direction" && (
        <div className="space-y-3">
          <p>Direction to Use information will be updated soon.</p>
        </div>
      )}
      {activeTab === "additionInfo" && (
        <div className="space-y-3">
          <p>Additional information will be updated soon.</p>
        </div>
      )}
      {activeTab === "service" && (
        <div className="space-y-3">
          <p>Service and warranty information will be updated soon.</p>
        </div>
      )}
      {activeTab !== "description" && activeTab !== "specifications" && activeTab !== "direction" && activeTab !== "additionInfo" && activeTab !== "service" && (
        <div className="space-y-3">
          <p>Information not available.</p>
        </div>
      )}
    </div>
  );
}

const paymentOptions = [
  { icon: <Banknote className="w-[18px] h-[18px] text-green-600" strokeWidth={2.5} />, label: "COD" },
  { icon: <span className="text-[16px] font-bold text-green-600">↠</span>, label: "UPI" },
  { icon: <CreditCard className="w-[18px] h-[18px] text-blue-600" strokeWidth={2.5} />, label: "Card" },
  { icon: <Landmark className="w-[18px] h-[18px] text-blue-700" strokeWidth={2.5} />, label: "NetBank" },
  { icon: <Wallet className="w-[18px] h-[18px] text-amber-500" strokeWidth={2.5} />, label: "EMI" },
  { icon: <Wallet className="w-[18px] h-[18px] text-violet-600" strokeWidth={2.5} />, label: "Wallet" },
];

const benefits = [
  {
    icon: "🛡️",
    title: "100% Genuine Products",
    desc: "Authentic & quality assured",
  },
  {
    icon: "₹",
    title: "Best Price Guarantee",
    desc: "Lowest prices, always",
  },
  {
    icon: "🚚",
    title: "Fast & Reliable Delivery",
    desc: "On-time delivery across India",
  },
  {
    icon: "🎧",
    title: "Expert Support",
    desc: "24x7 customer assistance",
  },
  {
    icon: "🧾",
    title: "GST Invoice",
    desc: "With every order",
  },
];

const benefits1 = [
  {
    icon: "🛡️",
    title: "100% Genuine ",
    desc: "Authentic & quality assured",
  },
  {
    icon: "₹",
    title: "Best Price ",
    desc: "Lowest prices, always",
  },
  {
    icon: "🚚",
    title: "Fast Ship",
    desc: "On-time delivery across India",
  },
  {
    icon: "🎧",
    title: "Support",
    desc: "24x7 customer assistance",
  },
  {
    icon: "🧾",
    title: "GST Invoice",
    desc: "With every order",
  },
];

const TABS = [
  { id: "description", label: "Description", icon: FileText },
  { id: "specifications", label: "Specifications", icon: ClipboardList },
  { id: "direction", label: "Direction to Use", icon: BookOpen },
  { id: "additionInfo", label: "Addition Info", icon: Info },
  { id: "service", label: "Service & Warranty", icon: ShieldCheck },
  { id: "features", label: "Features", icon: List },
  { id: "packaging", label: "Packaging", icon: Package },
];


function ProductScreen() {
  const navigate = useNavigate();
  const [showBulkEnquiry, setShowBulkEnquiry] = useState(false);
  const [currentImage, setCurrentImage] = useState(
    "assets/images/products/zoom/Woodpecker Dpex III Apex Locator 001.jpg"
  );
  const [bulkEnquirySuccessMessage, setBulkEnquirySuccessMessage] =
    useState(false);
  const [product, setProducts] = useState({});
  const [productQuantity, setProductQuantity] = useState(1);
  const [description, setDescription] = useState({});
  const [variantId, setVariantId] = useState("");
  let { slug } = useParams();
  useEffect(() => {
    window.scrollTo(0, 0);
    console.log("[ProductScreen] Resetting scroll to top for product:", slug);
  }, [slug]);
  const [cartTokenState, setCartTokenState] = useState(localStorage.getItem("cartToken"));
  const [cartCount, setCartCount] = useState(0);

  const { data: checkoutData, refetch: refetchCheckout } = useQuery(GET_CHECKOUT_BY_TOKEN, {
    fetchPolicy: "network-only",
    skip: !cartTokenState,
    context: {
      headers: {
        Authorization: localStorage.getItem("user") ? "JWT " + localStorage.getItem("token") : "",
      },
    },
    variables: { token: cartTokenState },
  });

  useEffect(() => {
    if (checkoutData?.checkout?.lines) {
      setCartCount(checkoutData.checkout.lines.length || 0);
    } else {
      setCartCount(0);
    }
  }, [checkoutData]);

  useEffect(() => {
    const handleCartUpdated = () => {
      const token = localStorage.getItem("cartToken");
      setCartTokenState(token);
      if (refetchCheckout) refetchCheckout();
    };
    window.addEventListener("cart-updated", handleCartUpdated);
    return () => window.removeEventListener("cart-updated", handleCartUpdated);
  }, [refetchCheckout]);

  const [CreateCheckout] = useMutation(CREATE_CHECKOUT_MUTATION);
  const [updateWishlist] = useMutation(UPDATE_WISHLIST_MUTATION, {
    context: {
      headers: {
        Authorization: "JWT " + localStorage.getItem("token"),
      },
    },
  });
  const [bulkErrorMsg, setBulkErrorMsg] = useState(false);
  const [addLineCheckout] = useMutation(CHECKOUT_ADD_PRODUCT_LINE_MUTATION);
  const [, setLoader] = useState(false);
  const [bulkEnquiryLoader, setBulkEnquiryLoader] = useState("Submit");
  const [setattributes, setattributeList] = useState([]);
  const [setvariants, setvariantList] = useState([]);
  const [metaList, setmetaList] = useState([]);
  const [updateLineCheckout] = useMutation(CHECKOUT_LINE_UPDATE);
  const [notMatchRecently, setNotMatchRecently] = useState();
  const [name, setName] = useState();
  const [phone, setPhone] = useState();
  const [email, setEmail] = useState();
  const [pincode, setPincode] = useState();
  const [price, setPrice] = useState();
  const [quantity, setQuantity] = useState();
  const [, errorMessage] = useState([]);
  const [, setProductReviewData] = useState("");
  const [productA, setProductA] = useState(() => {
    const saved = localStorage.getItem("delivery_pincode");
    if (saved) {
      const pin = saved.split(' - ')[0]; // Extract the pincode part
      if (/^\d{6}$/.test(pin)) return pin;
    }
    return "";
  });
  const [modals, setModals] = useState("");
  const [activeTab, setActiveTab] = useState("description");

  const getProductDescription = () => {
    try {
      const description =
        typeof product?.description === "string"
          ? JSON.parse(product.description)
          : product?.description;

      return (
        description?.blocks
          ?.map(block => block?.data?.text || block?.text)
          .filter(Boolean)
          .join(" ") || ""
      );
    } catch {
      return "";
    }
  };
const handleMobileQuantityChange = (newQty) => {
    const validQty = Math.max(1, Math.min(99, Number(newQty) || 1));
    const token = localStorage.getItem("cartToken");
    const activeVariantId = variantId || product?.variants?.[0]?.id;


    console.log("[ProductScreen:handleMobileQuantityChange]", {
      token,
      variantId: activeVariantId,
      newQty: validQty,
      productName: product?.name,
    });


    setProductQuantity(validQty);


    if (!token || !activeVariantId) return;


    updateLineCheckout({
      variables: {
        token,
        lines: [
          {
            quantity: validQty,
            variantId: activeVariantId,
          },
        ],
      },
      onCompleted: (data) => {
        console.log("[ProductScreen:handleMobileQuantityChange:onCompleted]", data);
        if (data?.checkoutLinesUpdate?.errors?.length > 0) {
          toast.error(
            data.checkoutLinesUpdate.errors[0]?.message ||
            "Unable to update product quantity"
          );
          return;
        }
        window.dispatchEvent(new CustomEvent("cart-updated"));
        if (refetchCheckout) refetchCheckout();
      },
      onError: (err) => {
        console.error("[ProductScreen:handleMobileQuantityChange:onError]", err);
        toast.error("Unable to update product quantity");
      },
    });
  };


  useEffect(() => {
    const activeVariantId = variantId || product?.variants?.[0]?.id;
    if (!activeVariantId || !checkoutData?.checkout?.lines) return;


    const existingLine = checkoutData.checkout.lines.find(
      (line) => line?.variant?.id === activeVariantId
    );


    if (existingLine) {
      console.log("[ProductScreen:syncCartWithBottomBar] Product found in active cart:", {
        variantId: activeVariantId,
        quantity: existingLine.quantity,
      });
      setIsAdded(true);
      setProductQuantity(existingLine.quantity);
    } else {
      setIsAdded(false);
    }
  }, [checkoutData, variantId, product]);
  const productDescription = getProductDescription();

  const customAddToCart = (id, qty) => {
    setLoader(true);
    if (!localStorage.getItem("cartToken")) {
      CreateCheckout({
        variables: {
          channel: "default-channel",
          email: localStorage.getItem("user") !== null ? localStorage.getItem("email") : "hegmakart@gmail.com",
          lines: [{ quantity: qty, variantId: id }],
        },
        onCompleted: (data) => {
          if (data.checkoutCreate?.checkout) {
            localStorage.setItem("cartToken", data.checkoutCreate.checkout.token);
            setCartTokenState(data.checkoutCreate.checkout.token);
          }
          window.dispatchEvent(new CustomEvent('cart-updated'));
          toast.success("Added to cart!");
        },
        onError: () => {
          localStorage.removeItem("cartToken");
          setCartTokenState(null);
        }
      });
    } else {
      addLineCheckout({
        variables: {
          token: localStorage.getItem("cartToken"),
          lines: [{ quantity: qty, variantId: id }],
        },
        onCompleted: (data) => {
          window.dispatchEvent(new CustomEvent('cart-updated'));
          toast.success("Added to cart!");
        },
        onError: () => {
          localStorage.removeItem("cartToken");
          setCartTokenState(null);
          // Retry by creating a fresh checkout
          CreateCheckout({
            variables: {
              channel: "default-channel",
              email: localStorage.getItem("user") !== null ? localStorage.getItem("email") : "hegmakart@gmail.com",
              lines: [{ quantity: qty, variantId: id }],
            },
            onCompleted: (data) => {
              if (data.checkoutCreate?.checkout) {
                localStorage.setItem("cartToken", data.checkoutCreate.checkout.token);
                setCartTokenState(data.checkoutCreate.checkout.token);
              }
              window.dispatchEvent(new CustomEvent('cart-updated'));
              toast.success("Added to cart!");
            }
          });
        }
      });
    }
  };

  const buyNow = (id, qty) => {
    setLoader(true);
    if (localStorage.getItem("cartToken") === null) {
      CreateCheckout({
        variables: {
          channel: "default-channel",
          email: localStorage.getItem("user") !== null ? localStorage.getItem("email") : "hegmakart@gmail.com",
          lines: [{ quantity: qty, variantId: id }],
        },
        onCompleted: (data) => {
          if (data.checkoutCreate.checkout !== null) {
            localStorage.setItem("cartToken", data.checkoutCreate.checkout.token);
          }
          window.dispatchEvent(new CustomEvent('cart-updated'));
          navigate('/checkout');
        }
      });
    } else {
      addLineCheckout({
        variables: {
          token: localStorage.getItem("cartToken"),
          lines: [{ quantity: qty, variantId: id }],
        },
        onCompleted: () => {
          window.dispatchEvent(new CustomEvent('cart-updated'));
          navigate('/checkout');
        }
      });
    }
  };

  const [ServiceAvailabilityPopup, setServiceAvailabilityPopup] = useState(false);
  const [ServiceUnavailabilityPopup, setServiceUnavailabilityPopup] = useState(false);
  const [addwishlist, setAddWishlist] = useState([]);
  const [, setCheckAvailabilityError] = useState(false);
  const [, setCheckAvailabilityLoader] = useState("Check Availability");
  const [wishlist, setWishlist] = useState([]);
  const [checkWishlist, setCheckWishlist] = useState([]);
  const [isAdded, setIsAdded] = useState(false);
  //console.log("slug",(slug))

  useEffect(() => {
    let wt = [];
    try {
      wt = JSON.parse(localStorage.getItem('wishlistToken')) || [];
    } catch (e) { }
    setCheckWishlist(wt);
    setWishlist(wt);
  }, []);

  useEffect(() => {
    const handleLocationUpdate = () => {
      const saved = localStorage.getItem("delivery_pincode");
      if (saved) {
        const pin = saved.split(' - ')[0];
        if (/^\d{6}$/.test(pin)) {
          setProductA(pin);
        }
      }
    };
    window.addEventListener("locationUpdated", handleLocationUpdate);
    return () => window.removeEventListener("locationUpdated", handleLocationUpdate);
  }, []);



  const { data: productQueryData, refetch } = useQuery(GET_PRODUCT_DETAILS, {
    fetchPolicy: "no-cache",
    variables: {
      slug: slug,
      channel: "default-channel"
    },
  })
  useEffect(() => {
    if (!productQueryData?.product) return;
    console.log("SINGLE PRODUCT DETAILS GRAPHQL:", productQueryData.product);
    const p = productQueryData.product;
    setNotMatchRecently(p.id);
    setProducts(p);
    setattributeList(p.attributes);
    setCurrentImage(p?.media?.[0]?.url);
    setDescription(p?.description);
    if (p.variants?.length > 0) {
      setVariantId(p.variants[0].id);
    }
    setvariantList(p.variants);
    setmetaList(p.metadata);
  }, [productQueryData]);

  const checkProductAvailability = (e) => {
    e.preventDefault();
    setCheckAvailabilityLoader(
      <div className="pinCodeLoader"></div>
    );
    var options = {
      method: 'post',
      url: (process.env.REACT_APP_REST_API_URL || window.location.origin) + "/api/v1/checkPostalCode",
      data: JSON.stringify({
        'postal_code': productA
      }),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    };
    axios(options)
      .then((response) => {
        setCheckAvailabilityLoader("Check Availability")
        if (response.data !== '') {
          setServiceAvailabilityPopup(true);
        } else {
          setServiceUnavailabilityPopup(true);
        }
      })
      .catch((error) => {
        setCheckAvailabilityLoader("Check Availability")
        setCheckAvailabilityError(true);
      })
  };

  useEffect(() => {
    if (!notMatchRecently) return;
    let recentList = [];
    try {
      recentList = JSON.parse(localStorage.getItem("recentData")) || [];
      if (!Array.isArray(recentList)) recentList = [];
    } catch (e) {
      recentList = [];
    }
    recentList = recentList.filter(id => id && typeof id === 'string' && id !== '[]' && id.trim() !== '');
    recentList = recentList.filter(id => id !== notMatchRecently);
    recentList.push(notMatchRecently);
    if (recentList.length > 7) recentList = recentList.slice(-7);
    localStorage.setItem("recentData", JSON.stringify(recentList));
  }, [notMatchRecently]);

  useEffect(() => {
    if (!(localStorage.getItem("wishlistToken") === null || localStorage.getItem("wishlistToken") === undefined || localStorage.getItem("wishlistToken") === '')) {
      setAddWishlist([])
      let wishToken = localStorage.getItem("wishlistToken").replaceAll("[", "").replaceAll("]", "").replaceAll("'", "").replaceAll(" ", "")
      for (let index = 0; index < wishToken.split(",").length; index++) {
        setAddWishlist((addwishlist) => [...addwishlist, wishToken.split(",")[index]])
      }
    }
  }, [])

  const hasFetchedReview = useRef(null);

  useEffect(() => {
    if (slug && hasFetchedReview.current !== slug) {
      hasFetchedReview.current = slug;
      getProductReviewData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);



  const getProductReviewData = async (e) => {
    var options = {
      method: "post",
      url: (process.env.REACT_APP_REST_API_URL || window.location.origin) + "/api/v1/getProductReviewData",
      data: JSON.stringify({
        product_slug: slug
      }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    axios(options)
      .then((response) => {
        console.log(response.data);
        setProductReviewData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };



  // if (loading1) {
  //   return (
  //     <>
  //       <Header />
  //       <div className="loading-overlay">
  //         <div className="bounce-loader">
  //           <div className="bounce1"></div>
  //           <div className="bounce2"></div>
  //           <div className="bounce3"></div>
  //         </div>
  //       </div>
  //       <Footer />
  //     </>
  //   );
  // }

  let obj = { blocks: [] };
  try {
    if (description && typeof description === "string") {
      obj = JSON.parse(description);
    } else if (description && typeof description === "object") {
      obj = description;
    }
  } catch (e) {
  }
  // eslint-disable-next-line no-unused-vars
  const onAddToCart = async (e) => {

    setLoader(true);

    e.preventDefault();

    const { id } = e.target;

    if (localStorage.getItem("cartToken") === null) {
      CreateCheckout({
        variables: {
          channel: "default-channel",
          email: localStorage.getItem("user") !== null ? localStorage.getItem("email") : "hegmakart@gmail.com",
          lines: [
            {
              quantity: productQuantity,
              variantId: id,
            },
          ],
        },
        onCompleted: (data) => {
          console.log(data);
          if (data.checkoutCreate.checkout !== null) {
            localStorage.setItem("cartToken", data.checkoutCreate.checkout.token);
          }
          window.dispatchEvent(new CustomEvent('cart-updated'));
        },
        onError: (err) => {
          console.error(err);
          localStorage.removeItem("cartToken");
        }
      });
    } else {
      addLineCheckout({
        variables: {
          token: localStorage.getItem("cartToken"),
          lines: [
            {
              quantity: productQuantity,
              variantId: id,
            },
          ],
        },
        onCompleted: (data) => {
          console.log(data);
          if (data?.checkoutLinesAdd?.errors?.length > 0) {
            localStorage.removeItem("cartToken");
          }
          window.dispatchEvent(new CustomEvent('cart-updated'));
        },
        onError: (err) => {
          console.error(err);
          localStorage.removeItem("cartToken");
        }
      });
    }
  };

  const onAddToWishlist = async (id) => {
    if (!wishlist.includes(id)) {
      setWishlist([...wishlist, id])
      setAddWishlist([...addwishlist, id])
      setCheckWishlist([...checkWishlist, id])
      if (localStorage.getItem("wishlistToken") === null) {
        localStorage.setItem("wishlistToken", JSON.stringify([id]));
      } else {
        if (!localStorage.getItem("wishlistToken").includes(id)) {
          localStorage.setItem("wishlistToken", JSON.stringify([
            ...JSON.parse(localStorage.getItem("wishlistToken")),
            id,
          ]));
        }
      }

      toast.success("Added to Wishlist!");

      if (localStorage.getItem("token")) {
        updateWishlist({
          variables: {
            input: {
              wishlistToken: JSON.stringify([...addwishlist, id]),
            },
          },
          onCompleted: (data) => {
            console.log("updateWishlist", data);
            refetch()
          },
        });
      }
    }
  };
  const removeWishlist = (id) => {
    if (wishlist.includes(id)) {
      let unWishlist = wishlist.filter((item) => item !== id);
      setWishlist(unWishlist)
      setAddWishlist(unWishlist)
      setCheckWishlist(unWishlist)
      localStorage.setItem("wishlistToken", JSON.stringify(unWishlist));

      toast.success("Removed from Wishlist!");

      if (localStorage.getItem("token")) {
        updateWishlist({
          variables: {
            input: {
              wishlistToken: JSON.stringify(unWishlist),
            },
          },
          onCompleted: (data) => {
            console.log("Removed from Wishlist DB", data);
          },
        });
      }
      console.log("REMOVE TO WISHLIST")
    }

  }

  const sendEmail = async (e) => {
    e.preventDefault();
    setBulkEnquiryLoader(
      <div style={{ top: 10, left: 172 }} className="loaderr"></div>
    );
    if (!name || !phone || !email || !pincode || !price || !quantity) {
      setBulkErrorMsg('Please fill the all fields')
      setBulkEnquiryLoader("submit");
      return false
    } else {
      setBulkErrorMsg(false)
    }

    if (pincode?.length !== 6) {
      setBulkErrorMsg('Please enter valid pincode')
      setBulkEnquiryLoader("submit");
      return false
    } else if (!pincode.startsWith("1")) {
      setBulkErrorMsg('Please enter valid pincode')
      setBulkEnquiryLoader("submit");
      return false
    } else {
      setBulkErrorMsg(false)
    }


    var options = {
      method: "post",
      url: (process.env.REACT_APP_REST_API_URL || window.location.origin) + "/api/v1/bulkEnquiry",
      data: JSON.stringify({
        name: name,
        email: email,
        phone: phone,
        pinCode: pincode,
        price: price,
        quantity: quantity,
        productName: product.name,
      }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    axios(options)
      .then((response) => {
        console.log(response);
        setShowBulkEnquiry(false);
        setBulkEnquiryLoader("submit");
        setBulkEnquirySuccessMessage(true);
        setBulkErrorMsg(false)
      })
      .catch((error) => {
        console.log(error);
        setBulkErrorMsg(false)
        errorMessage("There is some technical error.");
      });
  };


  // eslint-disable-next-line no-unused-vars
  const increaseProductQuantity = (e) => {

    e.target.parentElement.children[1].value = parseInt(e.target.parentElement.children[1].value) + 1

    setProductQuantity(e.target.parentElement.children[1].value)
  }

  // eslint-disable-next-line no-unused-vars
  const decreaseProductQuantity = (e) => {
    if (e.target.parentElement.children[1].value > 1) {
      e.target.parentElement.children[1].value = parseInt(e.target.parentElement.children[1].value) - 1
    }
    else (
      e.target.parentElement.children[1].value = 1
    )


    setProductQuantity(e.target.parentElement.children[1].value);

  };

  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Live product search for mobile header
  const { data: searchProductData, loading: searchLoading } = useQuery(GET_PRODUCT_LIST, {
    fetchPolicy: "cache-first",
    skip: !showSearch || !searchQuery || searchQuery.trim().length < 2,
    variables: {
      first: 8,
      channel: "default-channel",
      sortBy: { direction: "ASC", field: "PRIORITY" },
      filter: { search: searchQuery.trim() },
    },
  });
  const [isScrolled, setIsScrolled] = useState(false);
  const isScrolledRef = useRef(false);
  const searchInputRef = useRef(null);


  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY || document.documentElement.scrollTop;
      const scrolled = scrollPosition > 40;
      if (scrolled !== isScrolledRef.current) {
        isScrolledRef.current = scrolled;
        setIsScrolled(scrolled);
        console.log("[ProductScreen Mobile Header] Scroll state changed:", {
          scrollPosition,
          isScrolled: scrolled,
        });
      }
    };


    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();


    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);


  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearch]);

  const searchResults = searchProductData?.products?.edges || [];

  useEffect(() => {
    if (showSearch && searchQuery.trim().length >= 2) {
      console.log("[ProductScreen Search] Query:", searchQuery, "Found:", searchResults.length, "Loading:", searchLoading);
    }
  }, [showSearch, searchQuery, searchResults.length, searchLoading]);

  const handleSelectSearchProduct = (slug, productName) => {
    console.log("[ProductScreen Search] Navigating to product:", { slug, productName });
    setShowSearch(false);
    setSearchQuery("");
    navigate(`/product/${encodeURIComponent(slug)}`);
  };

  const handleSearchSubmit = (e) => {
    if (e) {
      e.preventDefault();
    }
    const trimmed = searchQuery.trim();
    if (!trimmed) return;
    console.log("[ProductScreen Search] Submitting query to /search/:", trimmed);
    setShowSearch(false);
    navigate(`/search/${encodeURIComponent(trimmed)}`);
  };
  return (
    <>
      <Helmet>
        <title>{`Hegmakart: ${product?.name || ''}`}</title>
        <meta name="description" content={product?.name || ''} />
        {(metaList || []).map((value1) => (
          <meta name={value1.key} content={value1.value} key={value1.key} />
        ))}
      </Helmet>
      {bulkEnquirySuccessMessage && (
        <div
          onClick={() => {
            setBulkEnquirySuccessMessage(false);
          }}
          style={{
            width: "100%",
            zIndex: 1060,
            height: "100vh",
            position: "fixed",
            background: "rgba(0, 0, 0, 0.6)",
          }}
        >
          {bulkEnquirySuccessMessage && (
            <div className="errorBoxContentt">
              <div style={{ position: "relative", padding: 15 }}>
                <BsFillCheckCircleFill
                  style={{ color: "green", marginRight: 6 }}
                ></BsFillCheckCircleFill>
                We have received your query. We will get back to you soon!
                <div
                  className="closeBtn"
                  onClick={() => {
                    setBulkEnquirySuccessMessage(false);
                    setModals("")
                  }}
                >
                  X
                </div>
              </div>
            </div>
          )}
        </div>
      )}


      <main style={{ position: "relative", backgroundColor: "#f8fafc" }} className={`main ${modals}`}>
        {/* ── Desktop Header (hidden on mobile) ── */}
        <div className="hidden lg:block">
          <Header />
        </div>

        {/* ── Mobile Header (hidden on desktop) ── */}
        {/* ── Mobile Header (hidden on desktop) ── */}
        <header className="lg:hidden sticky top-0 z-[100] bg-white border-b border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
          {isScrolled || showSearch ? (
            /* Pill Search Header: Back | Pill Search Bar | Cart */
            <div className="flex items-center h-[54px] px-3 gap-2.5 bg-white">
              {/* Back Button */}
              <button
                type="button"
                onClick={() => {
                  console.log("[ProductScreen Mobile Header] Back clicked in search header", {
                    showSearch,
                    searchQuery,
                    isScrolled,
                  });
                  if (showSearch || searchQuery) {
                    setShowSearch(false);
                    setSearchQuery("");
                    if (searchInputRef.current) {
                      searchInputRef.current.blur();
                    }
                  } else {
                    navigate(-1);
                  }
                }}
                className="w-10 h-10 flex items-center justify-center bg-transparent border-0 p-0 text-slate-700 hover:bg-slate-100 rounded-full active:scale-95 transition-all shrink-0 cursor-pointer"
                aria-label="Back"
              >
                <ChevronLeft size={24} strokeWidth={2.2} className="text-slate-800" />
              </button>


              {/* Rounded Pill Search Bar */}
              <form onSubmit={handleSearchSubmit} className="relative flex-1 flex items-center min-w-0 m-0">
                <div className="relative w-full flex items-center">
                  <Search
                    size={19}
                    className="absolute left-3.5 text-slate-900 pointer-events-none shrink-0"
                  />


                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => {
                      console.log("[ProductScreen Mobile Header] Search input focused");
                      setShowSearch(true);
                    }}
                    placeholder="Search products"
                    className="w-full h-14 pl-14 pr-9 rounded-2xl border border-slate-900 bg-white text-[14px] text-slate-800 placeholder:text-slate-600 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-normal"
                  />


                  {searchQuery ? (
                    <button
                      type="button"
                      onClick={() => {
                        console.log("[ProductScreen Mobile Header] Clear search query clicked");
                        setSearchQuery("");
                        if (searchInputRef.current) {
                          searchInputRef.current.focus();
                        }
                      }}
                      className="absolute right-3 flex items-center justify-center w-5 h-5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors text-xs border-0 bg-transparent cursor-pointer"
                      aria-label="Clear search"
                    >
                      <X size={15} />
                    </button>
                  ) : null}
                </div>
              </form>


              {/* Shopping Cart Icon with circular blue Badge */}
              <Link
                to="/cart"
                onClick={() => console.log("[ProductScreen Mobile Header] Cart clicked -> navigate to /cart")}
                className="relative w-10 h-10 flex items-center justify-center rounded-full bg-white hover:bg-slate-50 active:scale-95 transition-all text-slate-800 no-underline shrink-0"
                aria-label="Shopping Cart"
              >
                <ShoppingCart size={22} strokeWidth={1.8} className="text-slate-800" />


                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[19px] h-[19px] px-1 rounded-full bg-blue-600 text-white text-[11px] font-bold flex items-center justify-center leading-none shadow-sm">
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </Link>
            </div>
          ) : (
            /* Default Mobile Header: Back | Logo | Search Icon | Cart */
            <div className="flex items-center justify-between h-[54px] px-3 bg-white">
              {/* Back Button */}
              <button
                type="button"
                onClick={() => {
                  console.log("[ProductScreen Mobile Header] Default header back clicked -> navigate(-1)");
                  navigate(-1);
                }}
                className="w-10 h-10 flex items-center justify-center bg-transparent border-0 p-0 text-slate-700 hover:bg-transparent active:scale-95 transition-all shrink-0 cursor-pointer"
                aria-label="Go back"
              >
                <ChevronLeft size={24} strokeWidth={2.2} className="text-slate-800" />
              </button>


              {/* Brand Logo */}
              <Link
                to="/"
                onClick={() => console.log("[ProductScreen Mobile Header] Logo clicked -> navigate to /")}
                className="flex items-center justify-start shrink-0 no-underline ml-1 border-0 p-0"
              >
                <img
                  src="/assets/images/logo3.png"
                  alt="HegmaKart"
                  className="h-11 w-auto object-contain"
                />
              </Link>


              {/* Right Icons: Search + Cart */}
              <div className="ml-auto flex items-center gap-1.5">
                {/* Search Button (triggers search header) */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log("[ProductScreen Mobile Header] Opening search header via search button");
                    setShowSearch(true);
                  }}
                  className="w-14 h-14 flex items-center justify-center rounded-full bg-white hover:bg-slate-50 active:scale-95 transition-all text-slate-800 no-underline border-0 cursor-pointer"
                  aria-label="Search"
                >
                  <Search size={20} className="text-slate-800" />
                </button>


                {/* Cart with Badge */}
                <Link
                  to="/cart"
                  onClick={() => console.log("[ProductScreen Mobile Header] Cart clicked -> navigate to /cart")}
                  className="relative w-10 h-10 flex items-center justify-center rounded-full bg-white hover:bg-slate-50 active:scale-95 transition-all text-slate-800 no-underline"
                  aria-label="Shopping Cart"
                >
                  <ShoppingCart size={22} strokeWidth={1.8} className="text-slate-800" />


                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[19px] h-[19px] px-1 rounded-full bg-blue-600 text-white text-[11px] font-bold flex items-center justify-center leading-none shadow-sm">
                      {cartCount > 9 ? "9+" : cartCount}
                    </span>
                  )}
                </Link>
              </div>
            </div>
          )}


          {/* Search Live Suggestions Overlay */}
          {showSearch && (
            <>
              {/* Dimmed backdrop to close search on outside tap */}
              <div
                className="fixed inset-0 top-[54px] bg-slate-900/40 z-[998] backdrop-blur-[2px]"
                onClick={() => {
                  console.log("[ProductScreen Mobile Header] Backdrop clicked, closing search");
                  setShowSearch(false);
                  setSearchQuery("");
                }}
              />


              {/* Suggestions List Container */}
              {searchQuery.trim().length >= 2 && (
                <div className="absolute left-0 right-0 top-[54px] z-[999] bg-white border-b border-slate-200 shadow-xl max-h-[60vh] overflow-y-auto divide-y divide-slate-100">
                  {/* Loading State */}
                  {searchLoading && searchResults.length === 0 && (
                    <div className="flex items-center justify-center gap-2.5 py-6 text-slate-500 text-sm">
                      <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                      <span>Searching products...</span>
                    </div>
                  )}


                  {/* Products Found */}
                  {searchResults.length > 0 && (
                    <>
                      <div className="px-3 py-2 bg-slate-50 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        Matching Products ({searchResults.length})
                      </div>
                      {searchResults.map(({ node }) => {
                        const currentPrice = node.pricing?.priceRange?.start?.net?.amount;
                        const originalPrice = node.variants?.[0]?.originalPrice;
                        const hasDiscount = originalPrice && Number(originalPrice) > Number(currentPrice);
                        const discountPercent = hasDiscount
                          ? Math.round(((Number(originalPrice) - Number(currentPrice)) / Number(originalPrice)) * 100)
                          : 0;


                        const brandAttr = node.attributes?.find(
                          (a) => a.attribute?.name?.toLowerCase() === "manufacturer" || a.attribute?.slug?.toLowerCase() === "manufacturer"
                        );
                        const brandOrCategory = brandAttr?.values?.[0]?.name || node.category?.name || "";


                        return (
                          <div
                            key={node.id}
                            onClick={() => handleSelectSearchProduct(node.slug, node.name)}
                            className="flex items-center gap-3 p-2.5 hover:bg-blue-50/50 active:bg-blue-50 transition-colors cursor-pointer"
                          >
                            <div className="w-12 h-12 rounded-lg border border-slate-200 bg-white p-1 flex items-center justify-center shrink-0 overflow-hidden">
                              <img
                                src={node.media?.[0]?.url || "/assets/images/logo3.png"}
                                alt={node.name}
                                className="w-full h-full object-contain"
                              />
                            </div>


                            <div className="flex-1 min-w-0">
                              <h4 className="text-[13px] font-semibold text-slate-900 truncate leading-snug m-0">
                                {node.name}
                              </h4>
                              {brandOrCategory && (
                                <span className="text-[11px] text-slate-400 font-medium truncate block mt-0.5">
                                  {brandOrCategory}
                                </span>
                              )}
                              {currentPrice && (
                                <div className="flex items-center gap-1.5 mt-0.5">
                                  <span className="text-[12px] font-bold text-slate-900">₹{currentPrice}</span>
                                  {hasDiscount && discountPercent > 0 && (
                                    <span className="text-[10px] font-semibold text-green-600 bg-green-50 px-1 rounded">
                                      {discountPercent}% OFF
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>


                            <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />
                          </div>
                        );
                      })}


                      {/* View all results button */}
                      <button
                        type="button"
                        onClick={handleSearchSubmit}
                        className="w-full py-2.5 px-3 flex items-center justify-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50/40 hover:bg-blue-50 border-0 cursor-pointer transition-colors"
                      >
                        <span>View all results for &ldquo;{searchQuery}&rdquo;</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}


                  {/* No Products Found */}
                  {!searchLoading && searchResults.length === 0 && (
                    <div className="py-6 px-4 text-center">
                      <p className="text-sm font-semibold text-slate-700 m-0">
                        No products found for &ldquo;{searchQuery}&rdquo;
                      </p>
                      <p className="text-xs text-slate-400 mt-1 mb-3">
                        Check for spelling errors or try searching for another product or brand.
                      </p>
                      <button
                        type="button"
                        onClick={handleSearchSubmit}
                        className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors border-0 cursor-pointer"
                      >
                        <span>Search in All Products</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </header>

        <div className="w-full px-4 sm:px-6 lg:px-8 pt-3 pb-10">
          <div className="hidden lg:flex items-center gap-1.5 text-[13px] mt-0 mb-3">
            <Link to="/" className="text-slate-400 hover:text-slate-600 cursor-pointer transition-colors no-underline">Home</Link>
            {product.category && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                <Link to={`/category/${product.category.slug || product.category.id}`} className="text-slate-400 hover:text-slate-600 cursor-pointer transition-colors no-underline">{product.category.name}</Link>
              </>
            )}
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            <span className="font-medium text-slate-700 truncate">{product.name}</span>
          </div>

          <div className="grid lg:grid-cols-[498px_minmax(0,650px)_280px] gap-6 w-full justify-start">

            {/* LEFT SIDE - Sticky */}
            <div className={product?.productType?.hasVariants ? "lg:sticky lg:top-28 lg:self-start w-full" : "w-full"}>
              <div className="flex flex-col gap-4">

                {/* ===== MOBILE IMAGE GALLERY (full-bleed with arrows + dots) ===== */}
                <div className="relative bg-white lg:rounded-xl lg:border lg:border-slate-200 flex items-center justify-center h-[320px] sm:h-[360px] lg:h-[398px] w-full overflow-hidden group">

                  {/* POPULAR CHOICE badge — mobile only */}
                  <div className="absolute top-3 left-0 z-10 flex items-center gap-1.5 bg-[#00897B] text-white text-[11px] font-bold uppercase tracking-wide px-3 py-1.5 rounded-r-full shadow lg:hidden">
                    <Sparkles size={11} />
                    Popular Choice
                  </div>

                  {/* Brand badge — desktop only */}
                  {setattributes.map((attr) => attr.attribute.name === "Manufacturer" && attr.values[0]?.name && (
                    <Link
                      key="brand"
                      to={`/brand/${attr.values[0]?.name.replace(/\s+/g, '-').toLowerCase()}`}
                      className="hidden lg:flex absolute top-4 left-0 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-[14px] font-bold uppercase tracking-wide rounded-r-lg shadow-md z-10 transition-colors items-center cursor-pointer"
                    >
                      {attr.values[0]?.name}
                    </Link>
                  ))}

                  {/* Main image */}
                  <img src={currentImage} alt={product.name} className="w-full h-[full] object-contain p-4 transition-transform duration-300 group-hover:scale-105" />


                  {/* Wishlist button */}
                  <button
                    onClick={() => checkWishlist.includes(product.id) ? removeWishlist(product.id) : onAddToWishlist(product.id)}
                    className="absolute top-3 right-3 w-12 h-12 lg:w-11 lg:h-11 rounded-full bg-white shadow-md border border-slate-100 flex items-center justify-center hover:scale-110 transition-transform z-10"
                  >
                    <Heart size={20} className={checkWishlist.includes(product.id) ? "fill-red-500 text-red-500" : "text-slate-400"} />
                  </button>

                  {/* Share button */}
                  <button
                    type="button"
                    title="Share product"
                    onClick={async () => {
                      const shareData = {
                        title: product.name,
                        text: `Check out ${product.name} on HegmaKart`,
                        url: window.location.href,
                      };

                      try {
                        // Mobile / supported browsers
                        if (navigator.share) {
                          if (!navigator.canShare || navigator.canShare(shareData)) {
                            await navigator.share(shareData);
                            return;
                          }
                        }

                        // Clipboard fallback
                        if (navigator.clipboard) {
                          await navigator.clipboard.writeText(window.location.href);
                          toast.success("Link copied to clipboard!");
                          return;
                        }

                        // Final fallback
                        const textArea = document.createElement("textarea");
                        textArea.value = window.location.href;
                        textArea.style.position = "fixed";
                        textArea.style.opacity = "0";
                        document.body.appendChild(textArea);
                        textArea.focus();
                        textArea.select();
                        document.execCommand("copy");
                        document.body.removeChild(textArea);

                        toast.success("Link copied to clipboard!");
                      } catch (error) {
                        // User closing/canceling the share sheet is not an error
                        if (error?.name !== "AbortError") {
                          toast.error("Unable to share product");
                        }
                      }
                    }}
                    className="absolute top-3 right-[44px] lg:top-4 lg:right-[52px] w-12 h-12 lg:w-11 lg:h-11 rounded-full bg-white shadow-md border border-slate-100 flex items-center justify-center hover:scale-110 transition-transform z-10"
                  >
                    <Share2 size={17} className="text-slate-400" />
                  </button>

                </div>

                {/* Thumbnail strip — visible on all screens */}


                <div className="flex w-full gap-2 lg:gap-3 overflow-x-auto pb-2 scrollbar-hide">
                  {product.media?.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setCurrentImage(img.url)}
                      style={{
                        border: currentImage === img.url
                          ? "2px solid #2563eb"
                          : "2px solid #e2e8f0",
                        outline: "none",
                        boxShadow: "none",
                        appearance: "none",
                      }}
                      className="shrink-0 w-[50px] h-[50px] lg:w-[110px] lg:h-[110px] rounded-xl lg:rounded-2xl overflow-hidden bg-white p-1.5 lg:p-2 transition-colors"
                    >
                      <img
                        src={img.url}
                        alt={`Product thumbnail ${idx + 1}`}
                        className="block w-full h-full object-contain"
                      />
                    </button>
                  ))}
                </div>



              </div>
            </div>

            {/* MIDDLE SIDE - Scrollable */}
            <div className={`space-y-5 pb-10 min-w-0 max-w-[650px] ${product?.productType?.hasVariants ? "min-h-[800px]" : ""}`}>
              <h1 className="text-[22.5px] font-semibold text-slate-900 leading-tight mb-1">{product.name}</h1>
              {productDescription && (
                <h1 className="text-[13px] font-medium text-slate-500 leading-relaxed line-clamp-2 mb-1">
                  {productDescription}
                </h1>
              )}
              <div className="flex flex-row items-center gap-3 whitespace-nowrap">
                {setattributes.map((attr) => attr.attribute.name === "Manufacturer" && (<p key={attr.attribute.name}
                  className="text-sm text-slate-500 font-medium m-0" > By {attr.values[0]?.name} </p>
                ))}
                <span className="px-2.5 py-1 rounded-md bg-green-100 text-green-600 text-xs font-semibold">
                  ✔ In Stock
                </span>
              </div>



              <div className="flex items-center gap-2 flex-wrap mt-1.5 hidden">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star key={star} size={16} className={star <= (product.rating || 5) ? "fill-[#F57C00] text-[#F57C00]" : "text-slate-300"} />
                  ))}
                </div>
                <span className="text-lg font-semibold text-slate-800">{(product.rating || 5).toFixed(1)}</span>
              </div>


              {!product.productType?.hasVariants ? (
                <>
                  <div className="flex items-end gap-3 mt-1.5">

                    <span className="text-4xl font-bold text-slate-900">₹{product?.pricing?.priceRange?.start?.net?.amount}</span>
                    {Number(product?.variants?.[0]?.originalPrice) > product?.pricing?.priceRange?.start?.net?.amount && (
                      <>
                        <span className="text-xl text-slate-400 line-through mb-1 font-medium">₹{product.variants[0].originalPrice}</span>
                        <span className="text-base font-bold text-green-600 mb-1.5 bg-green-50 px-3 py-1 rounded-md border border-green-100">
                          {Math.round(((Number(product.variants[0].originalPrice) - product.pricing.priceRange.start.net.amount) / Number(product.variants[0].originalPrice)) * 100)}% OFF
                        </span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1.5">
                    {[
                      { quantity: 2 },
                      { quantity: 5 },
                    ].map((offer) => {
                      const unitPrice = product?.pricing?.priceRange?.start?.net?.amount ?? 0;
                      const totalPrice = Math.round(unitPrice * offer.quantity);
                      return (
                        <button
                          key={offer.quantity}
                          type="button"
                          onClick={() => {
                            setProductQuantity(offer.quantity);
                            customAddToCart(variantId, offer.quantity);
                          }}
                          className="h-[44px] px-3.5 rounded-lg border border-blue-600 bg-white text-blue-700 hover:bg-blue-50 active:scale-95 transition-all duration-200"
                        >
                          <span className="text-[12px] font-semibold whitespace-nowrap">
                            Buy {offer.quantity} for ₹{totalPrice}
                          </span>
                        </button>
                      );
                    })}
                  </div>


                  {/* ================= QUANTITY + CART + BUY NOW ================= */}
                  <div className="lg:flex product-actions-wv">

                    {/* Quantity */}
                    <span className="quantity-label-wv">
                      Qty:
                    </span>

                    {/* Quantity Control */}
                    <div className="quantity-control-wv">

                      {/* Minus */}
                      <button
                        type="button"
                        onClick={() =>
                          setProductQuantity(
                            Math.max(1, Number(productQuantity) - 1)
                          )
                        }
                        className="quantity-button-wv"
                      >
                        −
                      </button>

                      {/* Quantity */}
                      <input
                        type="text"
                        value={productQuantity}
                        onChange={(e) => {
                          let value = e.target.value.replace(/\D/g, "");

                          if (value === "") {
                            setProductQuantity("");
                            return;
                          }

                          let num = parseInt(value, 10);

                          if (num > 99) {
                            num = 99;
                          }

                          setProductQuantity(num);
                        }}
                        onBlur={() => {
                          if (
                            productQuantity === "" ||
                            Number(productQuantity) < 1
                          ) {
                            setProductQuantity(1);
                          }
                        }}
                        className="quantity-input-wv"
                      />

                      {/* Plus */}
                      <button
                        type="button"
                        onClick={() =>
                          setProductQuantity(
                            Math.min(99, Number(productQuantity) + 1)
                          )
                        }
                        className="quantity-button-wv"
                      >
                        +
                      </button>

                    </div>

                    {/* Add to Cart */}
                    <button
                      type="button"
                      onClick={() =>
                        customAddToCart(variantId, productQuantity)
                      }
                      className="product-action-button-wv"
                    >
                      <ShoppingCart
                        size={15}

                      />
                      Add
                    </button>

                    {/* Buy Now */}
                    <button
                      type="button"
                      onClick={() =>
                        buyNow(variantId, productQuantity)
                      }
                      className="product-action-button-wv"
                    >
                      Buy
                    </button>

                  </div>
                </>
              ) : (
                <div className="mt-1">
                  {setvariants.map(variant => (
                    <VariantRow key={variant.id} variant={variant} productName={product.name} product={{ image: currentImage }} onAddToCart={customAddToCart} />
                  ))}
                </div>
              )}

              {/* BROCHURE + CATALOGUE */}
              <div className="flex items-center gap-2 mt-1.5 hidden">

                {/* Brochure */}
                <a
                  href="/brochure.pdf"
                  download
                  className="flex items-center justify-center gap-1.5 px-4 w-[140px] h-[40px] border border-slate-300 rounded-lg bg-white hover:border-blue-600 hover:text-blue-600 transition-all duration-200 no-underline"
                >
                  <FileText className="w-[13px] h-[13px] text-blue-600" />

                  <span className="text-[11px] font-medium text-slate-800">
                    Brochure
                  </span>
                </a>

                {/* Catalogue */}
                <a
                  href="/catalogue.pdf"
                  download
                  className="flex items-center justify-center gap-1.5 px-4 w-[140px] h-[40px] border border-blue-500 rounded-lg bg-white hover:bg-blue-50 transition-all duration-200 no-underline"
                >
                  <FileText className="w-[13px] h-[13px] text-blue-600" />

                  <span className="text-[11px] font-medium text-blue-700">
                    Catalogue
                  </span>
                </a>

              </div>

              {/* ================= OFFICIAL BRAND ================= */}
              {(() => {
                const brandAttr = setattributes?.find(
                  attr => attr.attribute?.name === "Manufacturer"
                );

                const brandName = brandAttr?.values?.[0]?.name;

                if (!brandName) return null;

                return (
                  <div className="brand-card">

                    {/* Brand Icon */}
                    <div className="brand-icon">
                      <span>
                        {brandName.charAt(0).toUpperCase()}
                      </span>
                    </div>

                    {/* Brand Information */}
                    <div className="brand-info">
                      <span className="brand-label">
                        Official Brand
                      </span>

                      <span className="brand-name">
                        {brandName}
                      </span>
                    </div>

                    {/* View All */}
                    <Link
                      to={`/brand/${brandName.replace(/\s+/g, "-").toLowerCase()}`}
                      className="brand-view-button"
                    >
                      View All

                      <ChevronRight className="brand-arrow" />
                    </Link>

                  </div>
                );
              })()}



              {/* ================= TRUST & DELIVERY ================= */}
              <div className="trust-info-container hidden lg:block">

                <div className="trust-info-grid">

                  {/* Established */}
                  <div className="trust-info-card">

                    <div className="trust-info-icon trust-icon-blue">
                      <span>🛡️</span>
                    </div>

                    <div className="trust-info-text">
                      <span className="trust-info-title">
                        Established 2019
                      </span>

                      <span className="trust-info-subtitle">
                        Trusted Quality
                      </span>
                    </div>

                  </div>


                  {/* Secure Checkout */}
                  <div className="trust-info-card">

                    <div className="trust-info-icon trust-icon-green">
                      <span>🔒</span>
                    </div>

                    <div className="trust-info-text">
                      <span className="trust-info-title">
                        Secure Checkout
                      </span>

                      <span className="trust-info-subtitle">
                        100% Protected
                      </span>
                    </div>

                  </div>

                </div>

              </div>

              {/* Delivery / Return / COD */}
              <div className="delivery-info-box">

                {/* Get it by */}
                <div className="delivery-info-section delivery-section-left">

                  <div className="delivery-icon delivery-icon-blue">
                    <Truck
                      size={16}
                      strokeWidth={1.8}
                    />
                  </div>

                  <div className="delivery-text">
                    <span className="delivery-title">
                      Get it by
                    </span>

                    <span className="delivery-subtitle">
                      Order Before{" "}
                      <span className="delivery-highlight">
                        1-2 days
                      </span>
                    </span>
                  </div>

                  <Info
                    size={13}
                    strokeWidth={1.8}
                    className="delivery-info-icon"
                  />

                </div>


                {/* Divider */}
                <span className="delivery-divider-in">|</span>


                {/* Returnable */}
                <div className="delivery-info-section delivery-return">

                  <div className="delivery-icon delivery-icon-gray">
                    <RotateCcw
                      size={16}
                      strokeWidth={1.8}
                    />
                  </div>

                  <span className="return-text">
                    10-Days Returnable
                  </span>

                </div>


                {/* Divider */}
                <span className="delivery-divider-in">|</span>


                {/* COD */}
                <div className="delivery-info-section delivery-cod">

                  <div className="delivery-icon delivery-icon-green">
                    <CheckCircle
                      size={17}
                      strokeWidth={1.8}
                    />
                  </div>

                  <span className="cod-text">
                    COD
                  </span>

                  <Info
                    size={13}
                    strokeWidth={1.8}
                    className="delivery-info-icon delivery-cod-info"
                  />

                </div>

              </div>




              {/* ================= CHECK DELIVERY ================= */}
              <div className="mt-2 mb-3">

                {/* Heading */}
                <p className="text-[14px] font-semibold text-slate-900 mb-1">
                  Check Delivery Availability
                </p>

                {(ServiceAvailabilityPopup || ServiceUnavailabilityPopup) ? (

                  /* ================= RESULT ================= */
                  <div className="flex items-center gap-2 h-[44px]">

                    <div className="h-[44px] px-3 rounded-xl border border-slate-200 bg-white flex items-center">
                      <span className="text-[13px] font-semibold text-slate-800">
                        {productA}
                      </span>
                    </div>

                    {ServiceAvailabilityPopup && (
                      <span className="text-[12px] font-semibold text-emerald-600 flex items-center gap-1">
                        <CheckCircle size={13} />
                        Available
                      </span>
                    )}

                    {ServiceUnavailabilityPopup && (
                      <span className="text-[12px] font-semibold text-red-500 flex items-center gap-1">
                        <Info size={13} />
                        Not Available
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        setServiceAvailabilityPopup(false);
                        setServiceUnavailabilityPopup(false);
                      }}
                      className="text-[11px] font-bold text-blue-600 hover:underline"
                    >
                      CHANGE
                    </button>

                  </div>

                ) : (

                  /* ================= PINCODE INPUT ================= */
                  <div className="flex items-center gap-2">

                    <input
                      type="text"
                      value={productA}
                      onChange={(e) => setProductA(e.target.value)}
                      placeholder="Enter 6-digit pincode"
                      maxLength={6}
                      className="w-[180px] h-[34px] rounded-xl border border-slate-200 bg-white px-4 text-[11px] font-medium text-slate-700 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                    />

                    <button
                      type="button"
                      onClick={checkProductAvailability}
                      className="w-[80px] h-[34px] rounded-xl bg-blue-600 text-white text-[12px] broder border-blue-600 font-bold hover:bg-blue-700 active:scale-95 transition-all"
                    >
                      CHECK
                    </button>

                  </div>

                )}

              </div>
              <div className="bulk-quote-box">

                {/* Left Side */}
                <div className="bulk-quote-content">

                  <div className="bulk-quote-icon">
                    <PackageSearch size={20} />
                  </div>

                  <div className="bulk-quote-text">
                    <h3>Need a Bulk Quote?</h3>

                    <p>
                      Get the best wholesale pricing for bulk orders.
                    </p>
                  </div>

                </div>

                {/* Right Side Button */}
                <button
                  type="button"
                  onClick={() => {
                    setShowBulkEnquiry(true);
                    setModals("pageBg");
                  }}
                  className="bulk-quote-button"
                >
                  Get Bulk Quote
                </button>

              </div>
            </div>

            {/* RIGHT SIDE - Benefits & Payment */}
            {/* Desktop: sticky sidebar */}
            <div className={`hidden lg:block ${product?.productType?.hasVariants ? "sticky top-8 self-start " : ""}w-[300px] space-y-10`}>
              <div className="border border-slate-100 rounded-2xl bg-white p-4 shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
                <h3 className="font-bold text-slate-900 mb-2 text-[16.875px] tracking-tight">
                  HegmaKart Benefits
                </h3>
                <div className="space-y-2 mt-1">
                  {benefits.map((b, i) => (
                    <div key={i} className="flex gap-4 items-center">
                      <div className="w-[33.75px] h-[33.75px] rounded-full bg-[oklch(0.97_0.02_240)] flex items-center justify-center text-[17px] shrink-0 border border-slate-100">
                        {b.icon}
                      </div>
                      <div className="flex flex-col gap-[4px] justify-center">
                        <p className="text-[13px] font-bold text-slate-800 leading-none m-0">
                          {b.title}
                        </p>
                        <p className="text-[11px] font-medium text-slate-500 leading-none m-0">
                          {b.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border border-slate-100 rounded-2xl bg-white p-3 shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
                <h3 className="font-bold text-slate-900 mb-2 text-[16.875px] tracking-tight">
                  Payment Options
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {paymentOptions.map((opt, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2 rounded-xl border border-slate-200 bg-white hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 cursor-pointer">
                      <div className="w-[32px] h-[32px] rounded-full bg-slate-50 flex items-center justify-center shrink-0">
                        {opt.icon}
                      </div>
                      <span className="text-[13px] font-semibold text-slate-700">{opt.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Mobile: compact cards shown inline below product info */}
            <div className="lg:hidden w-full space-y-5 ">
              {/* Payment Options — icon grid */}
              <div className="border border-slate-100 rounded-xl bg-white p-3 shadow-sm">
                <h3 className="font-semibold text-slate-800 text-[13px] mb-2 tracking-tight">Payment Options</h3>
                <div className="flex justify-around">
                  {paymentOptions.map((opt, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-1">
                      <div className="w-[36px] h-[36px] rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center">
                        {opt.icon}
                      </div>
                      <span className="text-[10px] font-semibold text-slate-600 text-center leading-tight">{opt.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* HegmaKart Benefits — icon grid */}
              <div className="border border-slate-100 rounded-xl bg-white p-3 shadow-sm">
                <h3 className="font-semibold text-slate-800 text-[13px] mb-2 tracking-tight">HegmaKart Benefits</h3>
                <div className="flex justify-around">
                  {benefits1.map((b1, i) => (
                    <div key={i} className="flex flex-col items-center gap-1">
                      <div className="w-[36px] h-[36px] rounded-full bg-[oklch(0.97_0.02_240)] border border-slate-100 flex items-center justify-center text-[16px]">
                        {b1.icon}
                      </div>
                      <span className="text-[10px] font-semibold text-slate-600 text-center leading-tight">{b1.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div >

        {/* ================= PRODUCT INFORMATION ================= */}
        <div className="w-[100%] px-4 sm:px-6 -mt-6 lg:px-8 flex flex-col lg:flex-row gap-4 items-start">

          {/* ── MOBILE ACCORDION (< lg) ── */}
          <div className="w-full lg:hidden mt-2 mx-2">
            <MobileAccordion descriptionObj={obj} attributes={setattributes} />
          </div>

          {/* ── DESKTOP TAB BAR + CONTENT (>= lg) ── */}
          <div className="hidden lg:block flex-1 min-w-0">

            <div className="hidden lg:block w-full h-[250px] rounded-xl border border-slate-200 bg-white overflow-hidden">

              {/* Tab bar */}
              <div className="flex w-full h-[44px] border-b-2 border-slate-200 bg-slate-200 overflow-x-auto scrollbar-hide">
                {TABS.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-1 min-w-[110px] h-full flex items-center justify-center gap-1.5 px-3 text-[12px] font-medium whitespace-nowrap transition-all border-0 outline-none
                      ${isActive ? "bg-blue-600 rounded-xl hover:bg-blue-700 text-white" : "bg-white text-slate-700 hover:bg-slate-50"}`}
                    >
                      {Icon && (
                        <Icon
                          size={14}
                          className={isActive ? "text-white" : "text-slate-500"}
                        />
                      )}
                      {tab.label}
                    </button>
                  );
                })}
              </div>
              <div className="w-full h-px bg-slate-200"></div>

              {/* Tab content */}
              <div className="px-6 py-4">
                <TabContent
                  activeTab={activeTab}
                  descriptionObj={obj}
                  attributes={setattributes}
                />
              </div>

            </div>
          </div>
          {/* ================= RIGHT - 25% ================= */}
          <div className="hidden lg:block w-[22%] h-[250px] shrink-0">

            <div className="w-full h-full rounded-xl border border-slate-200 bg-white overflow-hidden">

              {/* Heading */}
              <div className="w-full h-[45px] px-4 flex items-center border-b-2 border-slate-300 ">
                <h3 className="text-[14px] items-center font-semibold text-slate-900">
                  Related Information
                </h3>
              </div>
              <div className="w-full h-px bg-slate-200"></div>
              {/* Content */}
              <div className="w-full px-4 py-4">
                <p className="text-[12px] font-medium text-slate-800">
                  Related Content
                </p>
              </div>

            </div>

          </div>
        </div>


        <div className="w-full ml-0 mt-0 pb-20 lg:pb-0">
          <div className="mt-2 w-full ml-0 pl-0">
            <RelatedProducts
              categoryId={product?.category?.id}
              excludeProductId={notMatchRecently}
            />
            <RecentlyViewed excludeProductId={notMatchRecently} />
          </div>
        </div>
        <Footer hideMobileNavbar={true} />
        {/* ── Mobile Sticky Bottom Footer (Thumbnail + Name + Brand + Add Button) ── */}

        {product?.id && !product?.productType?.hasVariants && (
          <div className="lg:hidden fixed inset-x-0 bottom-0 z-40 flex items-center justify-between bg-white border-t border-slate-200 px-4 py-3.5 shadow-[0_-4px_16px_rgba(0,0,0,0.08)]">

            {/* Product Price */}
            <div className="flex flex-col justify-center min-w-0 flex-1 mr-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[27px] font-bold text-slate-900">
                  ₹{product?.pricing?.priceRange?.start?.net?.amount}
                </span>

                {Number(product?.variants?.[0]?.originalPrice) >
                  Number(product?.pricing?.priceRange?.start?.net?.amount) && (
                    <>
                      <span className="text-[12px] text-slate-400 line-through font-medium">
                        ₹{product.variants[0].originalPrice}
                      </span>

                      <span className="text-[11px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-md border border-green-100">
                        {Math.round(
                          ((Number(product.variants[0].originalPrice) -
                            Number(product.pricing.priceRange.start.net.amount)) /
                            Number(product.variants[0].originalPrice)) *
                          100
                        )}% OFF
                      </span>
                    </>
                  )}
              </div>
            </div>

            {/* Quantity Control */}
            {!isAdded ? (
              <button
                type="button"
                onClick={() => {
                  const activeVariantId = variantId || product?.variants?.[0]?.id;
                  setProductQuantity(1);
                  customAddToCart(activeVariantId, 1);
                  setIsAdded(true);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-[15px] px-8 py-2.5 rounded-lg shadow-md active:scale-95 transition-all shrink-0"
              >
                Add
              </button>
            ) : (
              <div className="variant-quantity shrink-0">


                {/* Minus */}
                <button
                  type="button"
                  onClick={() => {
                    const next = Math.max(1, Number(productQuantity || 1) - 1);
                    handleMobileQuantityChange(next);
                  }}
                  className="variant-quantity-button"
                >
                  −
                </button>


                {/* Quantity */}
                <input
                  type="text"
                  inputMode="numeric"
                  value={productQuantity}
                  onChange={(e) => {
                    let value = e.target.value.replace(/\D/g, "");


                    if (value === "") {
                      setProductQuantity("");
                      return;
                    }


                    setProductQuantity(
                      Math.min(99, parseInt(value, 10))
                    );
                  }}
                  onBlur={() => {
                    const validQty = !productQuantity || Number(productQuantity) < 1 ? 1 : Number(productQuantity);
                    handleMobileQuantityChange(validQty);
                  }}
                  className="variant-quantity-input"
                />


                {/* Plus */}
                <button
                  type="button"
                  onClick={() => {
                    const next = Math.min(99, Number(productQuantity || 0) + 1);
                    handleMobileQuantityChange(next);
                  }}
                  className="variant-quantity-button"
                >
                  +
                </button>


              </div>
            )}


          </div>
        )}
      </main >

    

      {showBulkEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-0">


          <div className="w-full max-w-6xl max-h-[80vh] overflow-y-auto rounded-2xl bg-white shadow-2xl">
            {/* Header */}
            <div className="flex items-start justify-between gap-4 px-5 pt-5 pb-2 border-b border-slate-200">


              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">
                  Bulk Quantity Request
                </h2>


                <p className="mt-1 text-lg sm:text-md text-slate-500">
                  Let us know the details of Bulk Quantity required for{" "}
                  <span className="font-semibold text-slate-700">
                    {product.name}
                  </span>
                </p>


                {bulkErrorMsg && (
                  <p className="mt-2 text-sm font-medium text-red-500">
                    {bulkErrorMsg}
                  </p>
                )}
              </div>


              {/* Close */}
              <button
                type="button"
                onClick={() => {
                  setShowBulkEnquiry(false);
                  setModals("");
                }}
                className="flex-shrink-0 w-15 h-15 rounded-full flex items-center justify-center border-0 outline-none ring-0 shadow-none bg-transparent text-slate-800 focus:outline-none focus:ring-0 focus-visible:outline-none"
                style={{
                  border: "none",
                  outline: "none",
                  boxShadow: "none",
                }}
              >
                <span className="text-4xl leading-none">&times;</span>
              </button>


            </div>


            {/* Form */}
            <form className="px-5 pt-2 pb-0">


              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">


                {/* Name */}
                <div className="mb-2">
                  <label className="block mb-1 text-md font-semibold text-slate-700">
                    Name
                  </label>


                  <input
                    type="text"
                    placeholder="Enter your name"
                    name="name"
                    onChange={(event) => {
                      setName(event.target.value);
                    }}
                    required
                    className="w-full h-12 px-4 rounded-xl border border-slate-200
                         bg-slate-50 text-slate-800
                         placeholder:text-slate-400
                         outline-none
                         focus:bg-white
                         focus:border-blue-500
                         focus:ring-2 focus:ring-blue-100
                         transition"
                  />
                </div>


                {/* Phone */}
                <div>
                  <label className="block mb-1 text-md font-semibold text-slate-700">
                    Phone
                  </label>


                  <input
                    type="text"
                    placeholder="Enter your phone number"
                    name="phone"
                    onChange={(event) => {
                      setPhone(event.target.value);
                    }}
                    required
                    className="w-full h-12 px-4 rounded-xl border border-slate-200
                         bg-slate-50 text-slate-800
                         placeholder:text-slate-400
                         outline-none
                         focus:bg-white
                         focus:border-blue-500
                         focus:ring-2 focus:ring-blue-100
                         transition"
                  />
                </div>


                {/* Email */}
                <div>
                  <label className="block mb-1 text-md font-semibold text-slate-700">
                    Email
                  </label>


                  <input
                    type="email"
                    placeholder="Enter your email"
                    name="email"
                    onChange={(event) => {
                      setEmail(event.target.value);
                    }}
                    required
                    className="w-full h-12 px-4 rounded-xl border border-slate-200
                         bg-slate-50 text-slate-800
                         placeholder:text-slate-400
                         outline-none
                         focus:bg-white
                         focus:border-blue-500
                         focus:ring-2 focus:ring-blue-100
                         transition"
                  />
                </div>


                {/* Pin Code */}
                <div className="mb-2">
                  <label className="block mb-1 text-md font-semibold text-slate-700">
                    Pin Code
                  </label>


                  <input
                    type="text"
                    placeholder="Enter your pin code"
                    name="pin"
                    onChange={(event) => {
                      setPincode(event.target.value);
                    }}
                    required
                    className="w-full h-12 px-4 rounded-xl border border-slate-200
                         bg-slate-50 text-slate-800
                         placeholder:text-slate-400
                         outline-none
                         focus:bg-white
                         focus:border-blue-500
                         focus:ring-2 focus:ring-blue-100
                         transition"
                  />
                </div>


                {/* Price */}
                {/* Expected Price */}
                <div>
                  <label className="block mb-1 text-md font-semibold text-slate-700">
                    Expected Price Per Piece
                  </label>


                  <input
                    type="text"
                    name="price"
                    value={price !== undefined ? price : (product?.pricing?.priceRange?.start?.net?.amount ?? product?.variants?.[0]?.pricing?.price?.net?.amount ?? "")}
                    onChange={(event) => setPrice(event.target.value)}
                    required
                    className="w-full h-12 px-4 rounded-xl border border-slate-200
                                bg-slate-50 text-slate-800
                                placeholder:text-slate-400
                                outline-none
                                focus:bg-white
                                focus:border-blue-500
                                focus:ring-2 focus:ring-blue-100
                                transition"
                  />
                </div>


                {/* Quantity */}
                <div>
                  <label className="block mb-1 text-md font-semibold text-slate-700">
                    Quantity
                  </label>


                  <input
                    type="number"
                    placeholder="Enter quantity"
                    name="quantity"
                    onChange={(event) => {
                      setQuantity(event.target.value);
                    }}
                    required
                    className="w-full h-12 px-4 rounded-xl border border-slate-200
                         bg-slate-50 text-slate-800
                         placeholder:text-slate-400
                         outline-none
                         focus:bg-white
                         focus:border-blue-500
                         focus:ring-2 focus:ring-blue-100
                         transition"
                  />
                </div>


              </div>


              {/* Footer / Submit */}
              <div className="flex justify-end gap-3 mt-3 pt-3 border-t border-slate-100 -mb-8 pb-0">


                <button
                  type="button"
                  onClick={() => {
                    setShowBulkEnquiry(false);
                    setModals("");
                  }}
                  className="h-12 px-6 rounded-xl border border-blue-600
             bg-blue-600 text-white font-semibold
             hover:bg-blue-700 hover:border-blue-700 transition"
                >
                  Cancel
                </button>


                <button
                  style={{ position: "relative" }}
                  type="submit"
                  className="h-12 min-w-[100px] px-6 rounded-xl
                       bg-blue-600 text-white font-semibold
                       hover:bg-blue-700 border border-blue-600
                       active:scale-[0.98]
                       shadow-sm transition-all"
                  onClick={sendEmail}
                >
                  {bulkEnquiryLoader}
                </button>


              </div>


            </form>
          </div >
        </div >
      )
      }
    </>
  );
}

export default ProductScreen;