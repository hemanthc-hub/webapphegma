import React, { useState, useEffect } from "react";
import axios from "axios";
import { totalValue } from "./decimalFunction";
import Footer from "../components/Footer/Footer";
import { Link } from "react-router-dom";
import RecentlyViewed from "../components/RecentlyViewed/RecentlyViewed";
import { GET_COLLECTION_LIST, GET_CHECKOUT_BY_TOKEN, GET_HOME_COLLECTIONS_WITH_PRODUCTS } from "../GraphQL/Queries";
import { useQuery, useMutation } from "@apollo/client/react";
import {
  CHECKOUT_ADD_PRODUCT_LINE_MUTATION,
  CREATE_CHECKOUT_MUTATION, CHECKOUT_LINE_UPDATE, UPDATE_WISHLIST_MUTATION
} from "../GraphQL/Mutation";
import "./HomeScreen.css";
import HomeQuickview from "./HomeQuickview";
import { AiFillStar } from "react-icons/ai";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Autoplay, Pagination, Thumbs } from "swiper";
import Header from "../components/Header/Header";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { testimonialApi } from "../components/FakeApi.js/FAkeApi";
import InfiniteScroll from 'react-infinite-scroll-component';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import TopBrands from "../components/Home/TopBrands";
import TrustSection from "../components/Home/TrustSection";
import ReorderCTA from "../components/Home/ReorderCTA";
import NewLaunchesSection from "../components/Home/NewLaunchesSection";
import TopCategories from "../components/Home/TopCategories";
import FeaturedCategories from "../components/Home/FeaturedCategories";
import ProductCarousel from "../components/Home/ProductCarousel";
import BannerMarquee from "../components/Home/BannerMarquee";
import ProductCard from "../components/Catalog/ProductCard";
import SEO from "../components/SEO";

const HomeScreen = () => {
  const [bannerproducts, setProductBannerList] = useState([]);
  const [quickviewOpen, setQuickviewOpen] = useState(false);
  const [CreateCheckout] = useMutation(CREATE_CHECKOUT_MUTATION);
  const [updateWishlist] = useMutation(UPDATE_WISHLIST_MUTATION, {
    context: {
      headers: {
        Authorization: "JWT " + localStorage.getItem("token"),
      },
    },
  });
  const [addLineCheckout] = useMutation(CHECKOUT_ADD_PRODUCT_LINE_MUTATION);
  const [ProductList, setProductList] = useState([]);
  const [BannerList, setBannerList] = useState([]);
  const [updateLineCheckout] = useMutation(CHECKOUT_LINE_UPDATE);
  const [removeRedHeart, setRemoveRedHeart] = useState(false)
  const [wishlist, setWishlist] = useState([])
  const [addwishlist, setAddWishlist] = useState([])
  const [change, setChange] = useState(1)
  const [checkWishlist, setCheckWishlist] = useState([])
  const [showLoginNudge, setShowLoginNudge] = useState(false);
  const [nudgeMobile, setNudgeMobile] = useState("");
  const [nudgeOtp, setNudgeOtp] = useState("");
  const [nudgeStep, setNudgeStep] = useState("mobile");
  const [nudgeError, setNudgeError] = useState("");
  const [nudgeLoading, setNudgeLoading] = useState(false);
  const [nudgeTimer, setNudgeTimer] = useState(600);

  useEffect(() => {
    const isUserLoggedIn = localStorage.getItem("user");
    const hasSeenNudge = sessionStorage.getItem("loginNudgeShown");
    if (!isUserLoggedIn && !hasSeenNudge) {
      const timer = setTimeout(() => {
        setShowLoginNudge(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    let interval = null;
    if (showLoginNudge && nudgeStep === "otp" && nudgeTimer > 0) {
      interval = setInterval(() => setNudgeTimer(prev => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [showLoginNudge, nudgeStep, nudgeTimer]);

  const dismissLoginNudge = () => {
    sessionStorage.setItem("loginNudgeShown", "true");
    setShowLoginNudge(false);
  };

  const handleSendNudgeOtp = (e) => {
    if (e) e.preventDefault();
    setNudgeError("");
    if (!nudgeMobile || nudgeMobile.length !== 10 || isNaN(nudgeMobile) || nudgeMobile.charAt(0) <= '5') {
      setNudgeError("Please enter a valid 10-digit mobile number.");
      return;
    }
    setNudgeLoading(true);
    var options = {
      method: 'post',
      url: (process.env.REACT_APP_OTP_API_URL || process.env.REACT_APP_REST_API_URL || window.location.origin) + "/api/v1/sendOTP",
      data: JSON.stringify({ 'mobile': nudgeMobile }),
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }
    };
    axios(options).then((res) => {
      setNudgeLoading(false);
      if (res.status === 200 && (res.data === 'sent' || res.data?.api_status === 'true' || res.data?.message)) {
        setNudgeStep("otp");
        setNudgeTimer(600);
      } else {
        setNudgeError("Could not send OTP. Please try again.");
      }
    }).catch((error) => {
      setNudgeLoading(false);
      setNudgeError(error.response?.data?.message || "Error sending OTP. Please check your network.");
    });
  };

 
const handleVerifyNudgeOtp = (e) => {
  if (e) e.preventDefault();
  setNudgeError("");

  // Validate OTP
  if (!nudgeOtp || nudgeOtp.length !== 6 || isNaN(nudgeOtp)) {
    setNudgeError("Please enter the valid 6-digit OTP.");
    return;
  }

  setNudgeLoading(true);

  const options = {
    method: "post",
    url:
      (process.env.REACT_APP_OTP_API_URL || process.env.REACT_APP_REST_API_URL || window.location.origin) +
      "/api/v1/verifyOTP",
    data: JSON.stringify({
      mobile: nudgeMobile,
      otp: nudgeOtp,
      channel: "default-channel"
    }),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  };

  axios(options)
    .then((res) => {
      if (res.data && res.data.api_status === "true") {
        // Save login details
        localStorage.setItem("token", res.data.token);

        if (res.data.refreshToken) {
          localStorage.setItem("refreshToken", res.data.refreshToken);
        }

        localStorage.setItem(
          "userName",
          res.data.user.firstName + " " + res.data.user.lastName
        );

        localStorage.setItem(
          "user",
          res.data.user.firstName + " " + res.data.user.lastName
        );

        localStorage.setItem("email", res.data.user.email);
        localStorage.setItem("loginByOtp", "yes");
        localStorage.setItem("userId", res.data.user.id);

        sessionStorage.setItem("loginNudgeShown", "true");

        // Get checkout cart token
        const cartOptions = {
          method: "post",
          url:
            (process.env.REACT_APP_REST_API_URL ||
              window.location.origin) +
            "/hegma/v1/hegma/getCheckoutToken",
          data: JSON.stringify({
            token: res.data.token,
            guestCartToken: localStorage.getItem("cartToken") || ""
          }),
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          }
        };

        axios(cartOptions)
          .then((cartRes) => {
            if (cartRes.data) {
              localStorage.setItem("cartToken", cartRes.data);
            }

            setNudgeLoading(false);
            window.location.reload();
          })
          .catch((error) => {
            console.error("Cart token error:", error);
            setNudgeLoading(false);
            window.location.reload();
          });

      } else {
        setNudgeLoading(false);
        setNudgeError(
          res.data?.message || "Invalid OTP entered. Please try again."
        );
      }
    })
    .catch((error) => {
      console.error("OTP verification error:", error);
      setNudgeLoading(false);
      setNudgeError("Error verifying OTP. Please try again.");
    });
};


  const pageTop = () => {
    window.scrollTo(0, 0);
  }
  useEffect(() => {
    if (!(localStorage.getItem("wishlistToken") === null || localStorage.getItem("wishlistToken") === undefined || localStorage.getItem("wishlistToken") === '')) {
      setAddWishlist([])
      let wishToken = localStorage.getItem("wishlistToken").replaceAll("[", "").replaceAll("]", "").replaceAll("'", "").replaceAll(" ", "")
      for (let index = 0; index < wishToken.split(",").length; index++) {
        setAddWishlist((addwishlist) => [...addwishlist, wishToken.split(",")[index]])
      }
    }
    pageTop()
  }, [])

  useEffect(() => {
    console.log("Dev Log - Wishlist:", wishlist, "Check:", checkWishlist);
  }, [wishlist, checkWishlist]);
  const removeWishlist = (e) => {
    const { id } = e.target;
    if (wishlist.includes(id)) {
      let unWishlist = wishlist.filter((item) => item !== id);
      setWishlist(unWishlist)
      setAddWishlist(unWishlist)
      localStorage.setItem("wishlistToken", JSON.stringify(unWishlist));
      console.log("REMOVE TO WISHLIST")


      // let getWishListToken = localStorage.getItem("wishlistToken").split(",")
      // let removeWishlistId = JSON.parse(localStorage.getItem('wishlistToken'))?.filter((item)=>item !== id)
      // // let convertString = removeWishlistId.toString()
      // console.log(localStorage.getItem("wishlistToken"),"convertString",getWishListToken,"removeWishlistId",removeWishlistId,"id",id)
      // localStorage.setItem("wishlistToken",   JSON.stringify(removeWishlistId));
    }

  }

  // Note: setProductBannerList handled inline below for banner channel
  const { data: homeBannerData } = useQuery(GET_COLLECTION_LIST, {
    fetchPolicy: "cache-and-network",
    variables: { first: 20, channel: "home-banner", sortBy: { field: "PRIORITY", direction: "ASC" } },
  });
  useEffect(() => {
    if (homeBannerData?.collections?.edges?.[0]?.node?.products?.edges) {
      setProductBannerList(homeBannerData.collections.edges[0].node.products.edges);
    }
  }, [homeBannerData]);

  const { refetch: refetch2, data: homeProductData } = useQuery(GET_HOME_COLLECTIONS_WITH_PRODUCTS, {
    fetchPolicy: "cache-and-network",
    variables: { first: 25, channel: "default-channel", sortBy: { field: "PRIORITY", direction: "ASC" } },
  });
  useEffect(() => {
    if (homeProductData?.collections?.edges) {
      const allEdges = homeProductData.collections.edges;
      // Build a unified pool of unique catalog products across all retrieved collections
      const allProductsPool = [];
      const seenIds = new Set();
      allEdges.forEach((col) => {
        col?.node?.products?.edges?.forEach((prodEdge) => {
          const id = prodEdge?.node?.id;
          if (id && !seenIds.has(id)) {
            seenIds.add(id);
            allProductsPool.push(prodEdge);
          }
        });
      });

      // Keep strictly the original 10 collections so no extra rows or banners appear,
      // but enrich each collection's product list up to 25 products from the catalog pool!
      const enrichedCollections = allEdges.slice(0, 10).map((colEdge) => {
        if (!colEdge?.node) return colEdge;
        const currentProducts = colEdge.node.products?.edges || [];

        const colName = colEdge.node.name?.toLowerCase() || "";
        const isDealsCollection = colName.includes("top deals") || colName.includes("offer") || colName.includes("deal");

        const currentIds = new Set(currentProducts.map((p) => p?.node?.id));
        const extraProducts = allProductsPool.filter((p) => !currentIds.has(p?.node?.id));

        let validProducts = [...currentProducts, ...extraProducts];

        if (isDealsCollection) {
          validProducts = validProducts.filter(p => {
            const node = p?.node;
            if (!node) return false;
            const basePrice = node.pricing?.priceRange?.start?.net?.amount || 0;
            const variant = node.variants && node.variants[0];
            const shipping = Number(node.weightedShipping) || Number(variant?.weightedShipping) || 0;
            const finalSellingPrice = shipping > 0 && basePrice > shipping ? basePrice - shipping : basePrice;

            const rawOriginalPrice = variant?.originalPrice !== undefined && variant.originalPrice !== "0.00"
              ? Number(variant.originalPrice)
              : 0;
            const undiscountedPrice = node.pricing?.priceRangeUndiscounted?.start?.net?.amount || 0;

            const finalOriginalPrice = rawOriginalPrice > finalSellingPrice
              ? rawOriginalPrice
              : (undiscountedPrice > finalSellingPrice ? undiscountedPrice : 0);

            return finalOriginalPrice > finalSellingPrice;
          });

          if (validProducts.length === 0) {
            validProducts = currentProducts;
          }
        }

        const mergedProducts = validProducts.slice(0, 25);

        return {
          ...colEdge,
          node: {
            ...colEdge.node,
            products: {
              ...colEdge.node.products,
              edges: mergedProducts,
            },
          },
        };
      });

      setProductList(enrichedCollections);
      console.log("Home Product Data Query Result (GET_HOME_COLLECTIONS_WITH_PRODUCTS):", enrichedCollections);
    }
  }, [homeProductData]);

  const { refetch: refetch1, data: homeBannerCollectionData } = useQuery(GET_COLLECTION_LIST, {
    fetchPolicy: "cache-and-network",
    variables: { first: 20, channel: "home-collection", sortBy: { field: "PRIORITY", direction: "ASC" } },
  });
  useEffect(() => {
    if (homeBannerCollectionData?.collections?.edges) {
      setBannerList(homeBannerCollectionData.collections.edges);
      console.log("Home Banner Collection Data Query Result (GET_COLLECTION_LIST):", homeBannerCollectionData.collections.edges);
    }
  }, [homeBannerCollectionData]);

  const onAddToWishlist = (e) => {
    const { id } = e.target;
    if (!wishlist.includes(id)) {
      setWishlist([...wishlist, id])
      setAddWishlist([...addwishlist, id])
      if (localStorage.getItem("wishlistToken") === null || localStorage.getItem("wishlistToken") === '') {
        localStorage.setItem("wishlistToken", JSON.stringify([id]));
        console.log("null local storage")
      } else {
        console.log("set JSON STRING")
        if (!localStorage.getItem("wishlistToken").includes(id)) {
          localStorage.setItem("wishlistToken", JSON.stringify([
            ...JSON.parse(localStorage.getItem("wishlistToken")),
            id,
          ]));
        }
      }
      updateWishlist({
        variables: {
          input: {
            wishlistToken: [...addwishlist, id],
          },
        },
        onCompleted: (data) => {
          console.log(data);
        },
      });
    }
  };
  const renderProductCard = (product) => (
    <div className="h-full">
      <ProductCard
        product={product.node}
        isInWishlist={wishlist.includes(product.node.id)}
        onToggleWishlist={(id, e) => {
          if (wishlist.includes(id)) {
            removeWishlist({ target: { id }, preventDefault: () => { } });
          } else {
            onAddToWishlist({ target: { id }, preventDefault: () => { } });
          }
        }}
        defaultDiscountBadge="-19%"
      />
    </div>
  );

  const homeCarouselProducts = Array.from(
    new Map(
      ProductList.flatMap((collection) => collection?.node?.products?.edges || [])
        .filter((product) => product?.node?.id)
        .map((product) => [product.node.id, product])
    ).values()
  );

  window.addEventListener('popstate', (event) => {
    setQuickviewOpen(false)
  });
  return (
    <>
      <SEO
        title="Hegmakart - Home"
        description="Welcome to Hegmakart, your one-stop shop for everything you need."
        keywords="ecommerce, shopping, hegmakart, products"
      />
      {quickviewOpen && (
        <HomeQuickview setQuickviewOpenModal={setQuickviewOpen} />
      )}
      {showLoginNudge && (
        <div className="ModalBackground" style={{ zIndex: 10000, position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0, 0, 0, 0.6)", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <div className="ModalContainer" style={{ background: "#fff", width: "90%", maxWidth: "420px", borderRadius: "12px", padding: "30px 25px", boxShadow: "0 10px 30px rgba(0,0,0,0.2)", position: "relative", textAlign: "center" }}>
            <button
              onClick={dismissLoginNudge}
              style={{ position: "absolute", top: "15px", right: "15px", background: "transparent", border: "none", fontSize: "20px", color: "#888", cursor: "pointer", fontWeight: "bold" }}
            >
              ✕
            </button>
            <div style={{ marginBottom: "20px" }}>
              <h3 style={{ fontSize: "24px", fontWeight: 700, color: "#222", marginBottom: "8px" }}>Welcome to Hegmakart! 🛍️</h3>
              <p style={{ fontSize: "14px", color: "#666", margin: 0 }}>
                {nudgeStep === "mobile" ? "Login or signup in seconds for personalized offers, faster checkout, and order tracking!" : `Enter the 6-digit verification code sent to +91 ${nudgeMobile}`}
              </p>
            </div>
            {nudgeError && (
              <div style={{ background: "#ffebee", color: "#d32f2f", padding: "8px 12px", borderRadius: "6px", fontSize: "13px", marginBottom: "15px" }}>
                {nudgeError}
              </div>
            )}
            {nudgeStep === "mobile" ? (
              <form onSubmit={handleSendNudgeOtp}>
                <div style={{ display: "flex", alignItems: "center", border: "1.5px solid #ddd", borderRadius: "8px", padding: "0 12px", marginBottom: "20px", background: "#f9f9f9" }}>
                  <span style={{ fontWeight: 600, color: "#555", marginRight: "10px", fontSize: "16px" }}>+91</span>
                  <input
                    type="text"
                    autoFocus
                    maxLength={10}
                    placeholder="Enter 10-digit mobile number"
                    value={nudgeMobile}
                    onChange={(e) => setNudgeMobile(e.target.value.replace(/\D/g, ""))}
                    style={{ border: "none", background: "transparent", width: "100%", padding: "12px 0", fontSize: "16px", outline: "none" }}
                  />
                </div>
                <button
                  type="submit"
                  disabled={nudgeLoading}
                  className="btn btn-dark w-100"
                  style={{ borderRadius: "8px", padding: "12px", fontSize: "16px", fontWeight: 600, letterSpacing: "0.5px" }}
                >
                  {nudgeLoading ? "Sending OTP..." : "Get OTP & Continue"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyNudgeOtp}>
                <div style={{ marginBottom: "15px" }}>
                  <input
                    type="text"
                    autoFocus
                    maxLength={6}
                    placeholder="• • • • • •"
                    value={nudgeOtp}
                    onChange={(e) => setNudgeOtp(e.target.value.replace(/\D/g, ""))}
                    style={{ border: "1.5px solid #333", borderRadius: "8px", width: "80%", padding: "12px", fontSize: "22px", textAlign: "center", letterSpacing: "8px", outline: "none", fontWeight: 700 }}
                  />
                </div>
                <div style={{ fontSize: "13px", color: "#666", marginBottom: "20px" }}>
                  {nudgeTimer > 0 ? (
                    <span>Resend OTP in <b>{Math.floor(nudgeTimer / 60)}:{('0' + (nudgeTimer % 60)).slice(-2)}</b></span>
                  ) : (
                    <span onClick={handleSendNudgeOtp} style={{ color: "#EF6A37", fontWeight: 600, cursor: "pointer", textDecoration: "underline" }}>Resend OTP now</span>
                  )}
                  <div style={{ marginTop: "8px" }}>
                    <span onClick={() => { setNudgeStep("mobile"); setNudgeOtp(""); setNudgeError(""); }} style={{ color: "#007bff", cursor: "pointer" }}>Change mobile number</span>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={nudgeLoading}
                  className="btn btn-dark w-100"
                  style={{ borderRadius: "8px", padding: "12px", fontSize: "16px", fontWeight: 600 }}
                >
                  {nudgeLoading ? "Verifying..." : "Verify & Login"}
                </button>
              </form>
            )}
            <div style={{ marginTop: "20px", borderTop: "1px solid #eee", paddingTop: "12px" }}>
              <span onClick={dismissLoginNudge} style={{ fontSize: "13px", color: "#888", cursor: "pointer", textDecoration: "underline" }}>
                Continue exploring as Guest →
              </span>
            </div>
          </div>
        </div>
      )}
      <Header />

      <main className="main">
        <div className="max-w-[1400px] mx-auto">
          <Swiper
            spaceBetween={30}
            centeredSlides={true}
            loop={true}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
            }}

            modules={[Autoplay, Pagination]}
            className="mySwiper w-full"
          >
            {bannerproducts.map((bProducts, index) => (
              <React.Fragment key={`banner-${bProducts.node.id || index}`}>
                {bProducts.node.metadata?.length > 0 ? (
                  <React.Fragment>
                    {bProducts.node.metadata.map((meta, metaIdx) => (
                      <React.Fragment key={metaIdx}>
                        {meta.key === "collection" ? (
                          <SwiperSlide key={`slide-${bProducts.node.id || index}-${metaIdx || "fallback"}`} className="slide ">
                            <Link to={{ pathname: `/collection/${meta.value}` }}>
                              <picture>
                                <source
                                  media="(max-width:768px)"
                                  srcSet={bProducts.node.media[1].url}
                                />
                                <img
                                  src={bProducts.node.media[0].url}
                                  alt=""
                                  className="responsive-slide-image"
                                />
                              </picture>
                            </Link>
                          </SwiperSlide>
                        ) : null}
                        {meta.key === "product" ? (
                          <SwiperSlide key={`slide-${bProducts.node.id || index}-${metaIdx || "fallback"}`} className="slide ">
                            <Link
                              to={{ pathname: `/product/${meta.value}` }}
                            >
                            
                              <picture>
                                <source
                                  media="(max-width:768px)"
                                  srcSet={bProducts.node.media[1].url}
                                />
                                <img
                                  src={bProducts.node.media[0].url}
                                  alt=""
                                  className="responsive-slide-image"
                                />
                              </picture>
                            </Link>
                          </SwiperSlide>
                        ) : null}
                      </React.Fragment>
                    ))}
                  </React.Fragment>
                ) : (
                  <SwiperSlide key={`slide-${bProducts.node.id || index}-fallback`} className="slide ">
                    <picture>
                      <source
                        media="(max-width:768px)"
                        srcSet={bProducts.node.media[1].url}
                      />
                      <img
                        src={bProducts.node.media[0].url}
                        alt=""
                        className="responsive-slide-image"
                      />
                    </picture>
                  </SwiperSlide>
                )}
              </React.Fragment>
            ))}
          </Swiper>
          {/* UI2 Top Clinical Categories, Brands & New Launches Showcase */}
          <TopBrands />
          <BannerMarquee bannerList={BannerList} />
          <TopCategories />
          {/* // Desktop Version */}
          <div className="hidden md:block mt-4 mb-6 mx-4">
            <ProductCarousel
              products={homeCarouselProducts}
              wishlist={wishlist}
              onToggleWishlist={(id) => {
                if (wishlist.includes(id)) {
                  removeWishlist({ target: { id }, preventDefault: () => { } });
                } else {
                  onAddToWishlist({ target: { id }, preventDefault: () => { } });
                }
              }}
              viewAllLink="/top-deals-and-featured-products"
            />
          </div>

          {/* // Mobile Version */}
          <div className="block md:hidden mt-2 mb-4 mx-1 ">
            <ProductCarousel
              products={homeCarouselProducts}
              wishlist={wishlist}
              onToggleWishlist={(id) => {
                if (wishlist.includes(id)) {
                  removeWishlist({ target: { id }, preventDefault: () => { } });
                } else {
                  onAddToWishlist({ target: { id }, preventDefault: () => { } });
                }
              }}
              viewAllLink="/top-deals-and-featured-products"
            />
          </div>
          <NewLaunchesSection
            products={ProductList[0] ? ProductList[0].node.products.edges : []}
            collectionSlug={ProductList[0]?.node?.slug}
            wishlist={wishlist}
            onToggleWishlist={(id, e) => {
              if (wishlist.includes(id)) {
                removeWishlist({ target: { id }, preventDefault: () => { } });
              } else {
                onAddToWishlist({ target: { id }, preventDefault: () => { } });
              }
            }}
          />
          {ProductList.map((prodCol, index) => (
            <React.Fragment key={`list-${prodCol?.node?.id || index}`}>
              {ProductList[index] ? (
                (ProductList[index].node.products?.edges?.length || 0) > 0 ? (
                  <div className={`collection-wrapper w-full max-w-[95%] mx-auto my-6 ${ProductList[index]?.node?.name?.toUpperCase().includes("TOP DEALS")
                    ? "top-deals-collection"
                    : ""
                    }`}>
                    <div className="collection-header flex items-center justify-between border-b border-slate-200/80 pb-1 mb-0 pt-2">
                      <h2
                        className="collection-title"
                        style={{ fontFamily: "Outfit, sans-serif" }}
                      >
                        <span className="collection-icon">🔥</span>
                        {ProductList[index].node.products.edges.length !== 0 &&
                          ProductList[index]
                          ? ProductList[index].node.name
                          : null}
                      </h2>

                      <Link
                        to={`/collection/${ProductList[index]?.node?.slug || "all"}`}
                        className="collection-view-all"
                      >
                        View All <span>&gt;</span>
                      </Link>
                    </div>
                    <div
                      className="collection-products flex gap-2 overflow-x-auto"
                      style={{
                        scrollbarWidth: "none",
                        msOverflowStyle: "none",
                      }}
                    >
                      {ProductList[index]
                        ? ProductList[index].node.products.edges.map(
                          (product) => (
                            <div
                              key={`prod-${product.node.id}`}
                              className="shrink-0"
                            >
                              {renderProductCard(product)}
                            </div>
                          )
                        )
                        : null}
                    </div>

                    {/* Inject Featured Categories after the TOP DEALS product cards */}
                    {ProductList[index]?.node?.name?.toUpperCase() === "TOP DEALS" && <FeaturedCategories />}
                  </div>
                ) : (
                  <React.Fragment>
                    {(ProductList[index].node.metadata || []).map((meta, metaIdx) => (
                      <React.Fragment key={metaIdx}>
                        <div className="collection-wrapper w-full max-w-full mx-auto my-4">
                          <div className="collection-header flex items-center justify-between border-b border-slate-200/80 pb-1 mb-0 pt-0">
                            <h2
                              className="collection-title"
                              style={{ fontFamily: "Outfit, sans-serif" }}
                            >
                              <span className="collection-icon">🔥</span>
                              {ProductList[index].node.products.edges.length !== 0 &&
                                ProductList[index]
                                ? ProductList[index].node.name
                                : null}
                            </h2>
                            <Link
                              to={`/collection/${ProductList[index]?.node?.slug || "all"}`}
                              className="text-blue-600 hover:text-blue-700 font-bold text-xs md:text-sm flex items-center gap-1 no-underline transition-colors ml-10"
                            >
                              View All <span>&gt;</span>
                            </Link>
                          </div>
                          {/* <div
                            className="collection-products flex gap-0 overflow-x-auto overflow-y-visible pt-2 pb-3 px-1"
                            style={{
                              scrollbarWidth: "none",
                              msOverflowStyle: "none",
                            }}
                          >
                            {ProductList[index]
                              ? ProductList[index].node.products.edges.map(
                                (product) => (
                                  <div
                                    key={`prod-${product.node.id}`}
                                    className="shrink-0 "
                                  >
                                    {renderProductCard(product)}
                                  </div>
                                )
                              )
                              : null}
                          </div> */}

                          {/* Inject Featured Categories after the TOP DEALS product cards */}
                          {ProductList[index]?.node?.name?.toUpperCase() === "TOP DEALS" && <FeaturedCategories />}
                        </div>
                      </React.Fragment>
                    ))}
                  </React.Fragment>
                )
              ) : null}
            </React.Fragment>
          ))}

          {/* UI2 Trust Stats & Reorder CTA */}
          {/* <FeaturedCategories /> */}
          <TrustSection />
          <ReorderCTA />

          <RecentlyViewed />

          
        </div>
      </main>
      <Footer />
    </>
  );
};

export default HomeScreen;
