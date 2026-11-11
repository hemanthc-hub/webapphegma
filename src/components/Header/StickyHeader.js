import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client/react";
import { createWorker } from "tesseract.js";
import axios from "axios";
import {
  Search,
  Menu,
  ChevronDown,
  ChevronRight,
  X,
  Gift,
  LogOut,
  LayoutDashboard,
  ShoppingBag,
  ArrowRight,
  Clock,
  MapPin,
  Grid3X3,
  Hospital,
  Tag,
  ScanLine,
  Scan,
  Armchair,
  Camera,
  ScanSearch,
  FileText,
} from "lucide-react";
import { TOKEN_VERIFY_MUTATION, TOKEN_REFRESH_MUTATION, CREATE_CHECKOUT_MUTATION, CHECKOUT_CUSTOMER_ATTACH } from "../../GraphQL/Mutation";
import { GET_CATEGORIES_SUBLIST, GET_CHECKOUT_BY_TOKEN, GET_PRODUCT_LIST, GET_PRODUCT_Types, GET_TOP_BRANDS } from "../../GraphQL/Queries";
import "./header.css";
import "../../styles/globals.css";
import "../../styles/ui2.css";
import LocationModal from "./LocationModal";
import { getSavedLocation } from "../../services/postOfficeService";

const StickyHeader = () => {
  const [searchName, setSearchName] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(() => Boolean(localStorage.getItem("user") || localStorage.getItem("token")));
  const [currentUser, setCurrentUser] = useState(() => localStorage.getItem("userName") || localStorage.getItem("user") || "");
  const [quantity, setQuantity] = useState(0);
  const [wishlistQuantity, setWishlistQuantity] = useState(0);
  const [categoriess, setCategoriess] = useState([]);
  const [showMegaMenu, setShowMegaMenu] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [categorySearchTerm, setCategorySearchTerm] = useState("");
  const [brandLetterFilter, setBrandLetterFilter] = useState(null);
  const { pathname } = useLocation();

  // Route-based search sync: sync input with current search term, clear on non-search pages
  useEffect(() => {
    if (pathname.startsWith("/search/")) {
      const term = pathname.replace("/search/", "");
      if (term && term !== "all") {
        try {
          setSearchName(decodeURIComponent(term));
        } catch {
          setSearchName(term);
        }
      } else {
        setSearchName("");
      }
    } else {
      // Clear previous search term when navigating away (e.g. Home, Category, Cart, Product pages)
      setSearchName("");
    }
  }, [pathname]);

  // Delivery Location Modal state
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(() => getSavedLocation());

  useEffect(() => {
    const handleLocationUpdate = (e) => {
      console.log("[StickyHeader] locationUpdated event received:", e?.detail);
      setCurrentLocation(getSavedLocation());
    };
    window.addEventListener("locationUpdated", handleLocationUpdate);
    return () => window.removeEventListener("locationUpdated", handleLocationUpdate);
  }, []);

  // Sync auth state immediately when login or logout happens anywhere in the app
  useEffect(() => {
    const handleAuthChange = () => {
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("user");
      const userName = localStorage.getItem("userName");
      const hasAuth = Boolean(user || token);
      console.log("[StickyHeader] loginStatusChanged / storage event. User authenticated:", hasAuth, user);
      setIsLoggedIn(hasAuth);
      setCurrentUser(userName || user || "");
    };
    window.addEventListener("loginStatusChanged", handleAuthChange);
    window.addEventListener("storage", handleAuthChange);
    return () => {
      window.removeEventListener("loginStatusChanged", handleAuthChange);
      window.removeEventListener("storage", handleAuthChange);
    };
  }, []);

  // Search Autocomplete states
  const [showRecentList, setShowRecentList] = useState([]);
  const [suggestionProduct, setSuggestionProduct] = useState([]);
  const [suggestionProductType, setSuggestionProductType] = useState([]);
  const [suggestionBrand, setSuggestionBrand] = useState([]);
  const [isImageSearching, setIsImageSearching] = useState(false);
  const [imageSearchMessage, setImageSearchMessage] = useState("");

  const sugOutClickHide = useRef(null);
  const imageInputRef = useRef(null);
  const megaMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const userMenuRef = useRef(null);
  const mobileUserMenuRef = useRef(null);
  const navigate = useNavigate();
  const username = localStorage.getItem("userName");

  // GraphQL Mutations
  const [tokenverify] = useMutation(TOKEN_VERIFY_MUTATION);
  const [tokenrefresh] = useMutation(TOKEN_REFRESH_MUTATION);
  const [CreateCheckout] = useMutation(CREATE_CHECKOUT_MUTATION);
  const [customerAttach] = useMutation(CHECKOUT_CUSTOMER_ATTACH, {
    context: {
      headers: { Authorization: "JWT " + localStorage.getItem("token") },
    },
  });

  const [cartTokenState, setCartTokenState] = useState(localStorage.getItem("cartToken"));

  // Token Verification & Cart Initialization
  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    try {
      let tokenStr = localStorage.getItem("wishlistToken");
      if (tokenStr) {
        let arr = JSON.parse(tokenStr);
        if (Array.isArray(arr)) {
          arr = arr.filter(id => id && typeof id === 'string' && id !== '[]' && id.trim() !== '');
          setWishlistQuantity(arr.length);
        }
      }
    } catch (e) {
      setWishlistQuantity(0);
    }

    let cemail = "guest@hegmakart.com";
    if (loggedInUser) {
      setIsLoggedIn(true);
      console.log("[StickyHeader] Verifying token for user:", loggedInUser);
      tokenverify({
        variables: { token: localStorage.getItem("token") },
        onCompleted: (data) => {
          console.log("[StickyHeader] tokenVerify response:", data?.tokenVerify);
          if (!data?.tokenVerify?.isValid) {
            const refreshToken = localStorage.getItem("refreshToken");
            if (refreshToken) {
              tokenrefresh({
                variables: { refreshToken },
                onCompleted: (rData) => {
                  console.log("[StickyHeader] tokenRefresh response:", rData?.tokenRefresh);
                  if (rData?.tokenRefresh?.token) {
                    localStorage.setItem("token", rData.tokenRefresh.token);
                  } else {
                    console.warn("[StickyHeader] tokenRefresh failed — resetting auth state");
                    localStorage.removeItem("token");
                    localStorage.removeItem("refreshToken");
                    localStorage.removeItem("user");
                    localStorage.removeItem("isLoggedIn");
                    setIsLoggedIn(false);
                    window.dispatchEvent(new Event("loginStatusChanged"));
                  }
                },
                onError: (err) => {
                  console.error("[StickyHeader] tokenRefresh error:", err);
                  localStorage.removeItem("token");
                  localStorage.removeItem("refreshToken");
                  localStorage.removeItem("user");
                  localStorage.removeItem("isLoggedIn");
                  setIsLoggedIn(false);
                  window.dispatchEvent(new Event("loginStatusChanged"));
                }
              });
            } else {
              console.warn("[StickyHeader] No refreshToken found, resetting auth state");
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              localStorage.removeItem("isLoggedIn");
              setIsLoggedIn(false);
              window.dispatchEvent(new Event("loginStatusChanged"));
            }
          }
        },
        onError: (err) => {
          console.error("[StickyHeader] tokenVerify error:", err);
        }
      });
      cemail = localStorage.getItem("email") || cemail;
    }

    if (!localStorage.getItem("cartToken")) {
      CreateCheckout({
        variables: { channel: "default-channel", email: cemail, lines: [] },
        onCompleted: (data) => {
          if (data?.checkoutCreate?.checkout) {
            localStorage.setItem("cartToken", data.checkoutCreate.checkout.token);
            localStorage.setItem("dummyemail", "1");
            setCartTokenState(data.checkoutCreate.checkout.token);
            if (localStorage.getItem("user") && localStorage.getItem("cartToken")) {
              customerAttach({
                variables: { token: localStorage.getItem("cartToken") },
              });
            }
          }
        }
      });
    }
  }, [tokenverify, tokenrefresh, CreateCheckout, customerAttach]);

  // Wishlist event listeners
  useEffect(() => {
    const checkWishlist = () => {
      try {
        let tokenStr = localStorage.getItem("wishlistToken");
        if (tokenStr) {
          let arr = JSON.parse(tokenStr);
          if (Array.isArray(arr)) {
            arr = arr.filter(id => id && typeof id === "string" && id !== "[]" && id.trim() !== "");
            setWishlistQuantity(arr.length);
            return;
          }
        }
        setWishlistQuantity(0);
      } catch (e) {
        setWishlistQuantity(0);
      }
    };
    checkWishlist();
    window.addEventListener("wishlistUpdated", checkWishlist);
    return () => window.removeEventListener("wishlistUpdated", checkWishlist);
  }, []);

  // Live Saleor Categories Query
  const { data: categoriesData, error: categoriesError } = useQuery(GET_CATEGORIES_SUBLIST, {
    fetchPolicy: "cache-first",
    variables: { first: 15, level: 0 },
  });

  useEffect(() => {
    if (categoriesError) {
      console.error("[StickyHeader] categoriesError (GET_CATEGORIES_SUBLIST):", categoriesError);
    }
    if (categoriesData?.categories?.edges) {
      // Clean up empty subcategories and parent categories with 0 products directly at ingestion
      const cleanedEdges = categoriesData.categories.edges
        .map((edge) => {
          const cat = edge.node;
          const cleanedSubs = cat.children?.edges?.filter(
            ({ node: sub }) => (sub.products?.totalCount ?? 0) > 0
          ) || [];
          return {
            ...edge,
            node: {
              ...cat,
              children: {
                ...cat.children,
                edges: cleanedSubs,
              },
            },
          };
        })
        .filter((edge) => {
          const totalCatProducts = edge.node.products?.totalCount ?? 0;
          const hasSubsWithProducts = edge.node.children.edges.length > 0;
          return totalCatProducts > 0 || hasSubsWithProducts;
        });

      setCategoriess((prev) => {
        const brandsNode = prev.find(edge => edge.node.id === 'custom-brands-node');
        if (brandsNode) {
          return [...cleanedEdges, brandsNode];
        }
        return cleanedEdges;
      });
      if (cleanedEdges.length > 0) {
        setActiveCategory(cleanedEdges[0].node);
      }
    }
  }, [categoriesData, categoriesError]);

  // Fetch top brands
  const { data: topBrandsData } = useQuery(GET_TOP_BRANDS, {
    fetchPolicy: "cache-first",
    variables: { first: 30 },
  });

  useEffect(() => {
    if (topBrandsData?.attributes?.edges) {
      const brandAttr = topBrandsData.attributes.edges.find((e) =>
        e.node.slug?.toLowerCase() === "manufacturer" ||
        e.node.name?.toLowerCase() === "manufacturer" ||
        e.node.slug?.toLowerCase() === "brand"
      );

      const choices = brandAttr?.node?.choices?.edges;
      if (choices && Array.isArray(choices) && choices.length > 0) {
        const uniqueBrands = new Map();
        choices.forEach((c, i) => {
          const node = c.node;
          const rawName = node.name || node.slug || "";
          const normalized = rawName.toUpperCase().replace(/\s+/g, '-');
          if (!uniqueBrands.has(normalized)) {
            uniqueBrands.set(normalized, {
              id: node.id || `brand-${i}`,
              name: rawName,
              slug: normalized,
              isBrand: true,
            });
          }
        });

        const sortedBrands = Array.from(uniqueBrands.values()).sort((a, b) => a.name.localeCompare(b.name));

        setCategoriess((prev) => {
          // Remove existing 'Brands' node if any to avoid duplication
          const filtered = prev.filter(edge => edge.node.id !== 'custom-brands-node');
          const brandsNode = {
            node: {
              id: 'custom-brands-node',
              name: 'Brands',
              slug: 'brands',
              isBrandsCategory: true,
              children: {
                edges: sortedBrands.map(b => ({ node: b }))
              },
              products: { totalCount: sortedBrands.length }
            }
          };
          return [...filtered, brandsNode];
        });
      }
    }
  }, [topBrandsData]);

  // Live Cart Query & Sync
  const { error: cartError, refetch: refetchCart, data: checkoutData } = useQuery(GET_CHECKOUT_BY_TOKEN, {
    fetchPolicy: "cache-first",
    skip: !cartTokenState,
    context: {
      headers: {
        Authorization: localStorage.getItem("user") ? "JWT " + localStorage.getItem("token") : "",
      },
    },
    variables: { token: cartTokenState },
  });

  useEffect(() => {
    if (cartError) {
      localStorage.removeItem("cartToken");
      setCartTokenState(null);
      return;
    }
    if (checkoutData && !checkoutData.checkout) {
      localStorage.removeItem("cartToken");
      setCartTokenState(null);
      return;
    }
    if (!checkoutData?.checkout) return;
    try {
      setQuantity(checkoutData.checkout.lines?.length || 0);
      if (checkoutData.checkout.discount?.amount === 0) {
        localStorage.removeItem("dummycoupon");
      }
    } catch (error) { }
  }, [cartError, checkoutData]);

  useEffect(() => {
    const onCartUpdated = () => {
      setCartTokenState(localStorage.getItem("cartToken"));
      if (refetchCart) refetchCart();
    };
    window.addEventListener("cart-updated", onCartUpdated);
    return () => window.removeEventListener("cart-updated", onCartUpdated);
  }, [refetchCart]);

  // Save search to recent search after debounce without forcing unwanted page redirects while typing
  useEffect(() => {
    const trimmed = searchName.trim();
    if (trimmed.length > 2) {
      const timer = setTimeout(() => {
        let sea = trimmed.replaceAll("%", " ").replaceAll("/", " ").replaceAll("\\", " ");
        const saved = JSON.parse(localStorage.getItem("recentSearch") || "[]");
        if (!saved.includes(sea)) {
          localStorage.setItem("recentSearch", JSON.stringify([sea, ...saved].slice(0, 10)));
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [searchName]);

  // Live Search Suggestions
  const { data: searchProductData } = useQuery(GET_PRODUCT_LIST, {
    fetchPolicy: "cache-first",
    skip: !searchName || searchName.trim().length < 2,
    variables: {
      first: 5,
      channel: "default-channel",
      sortBy: { direction: "ASC", field: "NAME" },
      filter: { search: searchName }
    },
  });

  useEffect(() => {
    if (searchProductData?.products?.edges) {
      setSuggestionProduct(searchProductData.products.edges);
    } else {
      setSuggestionProduct([]);
    }
  }, [searchProductData, searchName]);

  const { data: searchTypeData } = useQuery(GET_PRODUCT_Types, {
    fetchPolicy: "cache-first",
    skip: !searchName || searchName.trim().length < 2,
    variables: {
      first: 5,
      channel: "default-channel",
      filter: { search: searchName }
    },
  });

  useEffect(() => {
    if (searchTypeData?.productTypes?.edges) {
      setSuggestionProductType(
        searchTypeData.productTypes.edges.filter(d => !d.node.name.toLowerCase().includes("variant"))
      );
    } else {
      setSuggestionProductType([]);
    }
  }, [searchTypeData, searchName]);

  // Brand search suggestions
  useEffect(() => {
    if (!searchName || searchName.trim().length < 2) {
      setSuggestionBrand([]);
      return;
    }
    const options = {
      method: "post",
      url: (process.env.REACT_APP_REST_API_URL || window.location.origin) + "/api/v1/productBrandList",
      data: JSON.stringify({ brand_name: searchName.trim() }),
      headers: { "Accept": "application/json", "Content-Type": "application/json" },
    };
    axios(options)
      .then((res) => {
        if (Array.isArray(res.data)) {
          setSuggestionBrand(res.data.map(b => b.name).filter(Boolean).slice(0, 5));
        }
      })
      .catch(() => setSuggestionBrand([]));
  }, [searchName]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("recentSearch") || "[]");
    if (searchName.trim()) {
      setShowRecentList(saved.filter(i => i.toLowerCase().includes(searchName.toLowerCase())).slice(0, 5));
    } else {
      setShowRecentList([]);
    }
  }, [searchName]);

  // Outside click listeners
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sugOutClickHide.current && !sugOutClickHide.current.contains(e.target)) {
        setSuggestionProduct([]);
        setSuggestionProductType([]);
        setSuggestionBrand([]);
        setShowRecentList([]);
      }
      if (
        (!megaMenuRef.current || !megaMenuRef.current.contains(e.target)) &&
        (!mobileMenuRef.current || !mobileMenuRef.current.contains(e.target)) &&
        !e.target.closest('[data-menu-toggle="true"]')
      ) {
        setShowMegaMenu(false);
      }
      const isInsideUserMenu =
        (userMenuRef.current && userMenuRef.current.contains(e.target)) ||
        (mobileUserMenuRef.current && mobileUserMenuRef.current.contains(e.target)) ||
        Boolean(e.target?.closest && e.target.closest('[data-user-menu="true"]'));

      if (!isInsideUserMenu) {
        setUserMenuOpen(false);
      }
    };
    window.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("touchstart", handleClickOutside, { passive: true });
    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  const searchProduct = (e) => {
    e.preventDefault();
    const cleanTerm = searchName.trim().replaceAll("%", " ").replaceAll("/", " ").replaceAll("\\", " ");
    if (!cleanTerm) return;
    const saved = JSON.parse(localStorage.getItem("recentSearch") || "[]");
    if (!saved.includes(cleanTerm)) {
      localStorage.setItem("recentSearch", JSON.stringify([cleanTerm, ...saved].slice(0, 10)));
    }

    console.log("Dev Log - Header Search executed:", { searchName, cleanTerm });
    setSuggestionProduct([]);
    setSuggestionBrand([]);
    setSuggestionProductType([]);
    navigate("/search/" + encodeURIComponent(cleanTerm));
  };

  const handleImageSearch = async (e) => {
    const imageFile = e.target.files?.[0];
    if (!imageFile) return;

    setIsImageSearching(true);
    setImageSearchMessage("Reading product text...");

    let worker;
    try {
      worker = await createWorker("eng");
      const { data } = await worker.recognize(imageFile);
      const extractedText = data.text.replace(/\s+/g, " ").trim();

      if (!extractedText) {
        setImageSearchMessage("No readable product text found.");
        return;
      }

      const searchText = extractedText.split(" ").slice(0, 8).join(" ");
      setSearchName(searchText);
      setImageSearchMessage(`Searching for ${searchText}`);
    } catch (error) {
      console.error("[StickyHeader] Image search failed:", error);
      setImageSearchMessage("Could not read that image. Please try another photo.");
    } finally {
      if (worker) await worker.terminate();
      setIsImageSearching(false);
      e.target.value = "";
    }
  };

  const logoutHandler = () => {
    localStorage.removeItem("dummyemail");
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userName");
    localStorage.removeItem("user");
    localStorage.removeItem("email");
    localStorage.removeItem("userId");
    localStorage.removeItem("recentData");
    localStorage.removeItem("wishlistToken");
    localStorage.removeItem("tempEmail");
    localStorage.removeItem("cartToken");
    setTimeout(() => window.location.reload(false), 1);
  };

  const handleCategoryNav = (e, path) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    navigate(path);
    setTimeout(() => {
      setShowMegaMenu(false);
    }, 150);
  };

  const isActiveNavPath = (path) => pathname === path || pathname.startsWith(`${path}/`);

  return (
    <div className="w-[98%] mx-auto font-sans select-none bg-white">
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleImageSearch}
        className="hidden"
        aria-label="Search by photo"
      />
      {/* 1. Main Sticky Header (Tier 1) */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-100 shadow-xs transition-all">
        {/* DESKTOP HEADER LAYOUT (Hidden on mobile) */}
        <div className="hidden md:block d-none d-md-block w-full py-1 px-4 md:px-8 ">
          <div className="w-full flex items-center justify-between gap-4 lg:gap-8 min-h-[58px]">

            {/* Left Side: Brand Logo & Delivering To Location */}
            <div className="flex items-center gap-6 lg:gap-8 shrink-0 self-center">
              {/* Brand Logo */}
              <Link to="/" className="flex items-center gap-2.5 no-underline shrink-0">
                <img
                  src="https://hegmadental.s3.ap-south-1.amazonaws.com/static/logoHegma.png"
                  alt="HegmaKart Logo"
                  className="h-11 md:h-12 w-full object-contain hover:scale-105 transition-transform"
                  onClick={() => { if (window.location.pathname === "/") setTimeout(() => window.location.reload(false), 10); }}
                />
              </Link>

              {/* Delivering to / Location block (Figma Design) */}
              <div
                onClick={() => setIsLocationModalOpen(true)}
                className="hidden md:flex items-center gap-4 shrink-0 hover:bg-slate-50 p-1.5 rounded-xl transition-colors cursor-pointer ml-4 mr-10 "
                title={currentLocation ? `PIN code: ${currentLocation.pincode}` : "Choose delivery location"}
              >

                <div className="flex items-center justify-center w-8 h-8 shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-12 h-11 text-black"
                  >
                    <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <div className="text-left leading-tight max-w-[160px] lg:max-w-[170px]">
                  <div className="text-[10px] text-slate-800 font-medium uppercase tracking-wide">
                    Delivering to
                  </div>
                  <div className="flex items-center gap-1 font-bold text-xs lg:text-sm text-orange-500 truncate">
                    <span className="truncate">
                      {currentLocation ? currentLocation.pincode : "Location"}
                    </span>
                    <ChevronDown size={13} className="text-orange-500 shrink-0" />
                  </div>
                </div>
              </div>
            </div>

            {/* Center: Search Input Bar with Camera Icon & Live Autocomplete */}
            <div className="flex-1 px-0 lg:px-4 relative flex items-center self-center m-0 pb-2" ref={sugOutClickHide}>
              <form onSubmit={searchProduct} className="w-[700px] relative m-0 p-0 flex items-center justify-center -ml-8">
                <div className="w-full flex items-center h-[45px] px-3 bg-white rounded-[14px] border border-slate-200 hover:border-slate-300 focus-within:border-blue-500 focus-within:shadow-md shadow-sm transition-all duration-200 ">
                  <button type="submit" className="h-full px-2 bg-transparent border-0 text-slate-600 hover:text-blue-600 cursor-pointer transition-colors shrink-0 flex items-center justify-center m-0 p-0">
                    <Search size={20} className="text-slate-700" />
                  </button>
                  <input
                    type="search"
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                    onFocus={(e) => e.target.select()}
                    onClick={(e) => {
                      if (searchName && e.target.selectionStart === e.target.selectionEnd) {
                        e.target.select();
                      }
                    }}
                    placeholder="Search Products, Brands & Categories..."
                    className="flex-1 h-full px-2.5 bg-transparent text-slate-800 text-[15px] outline-none placeholder:text-slate-400 border-0 focus:ring-0 m-0 p-0 font-medium w-full leading-normal"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                    autoComplete="off"
                  />
                  {searchName ? (
                    <button
                      type="button"
                      onClick={() => setSearchName("")}
                      className="h-full px-2 text-slate-400 hover:text-slate-600 border-0 bg-transparent cursor-pointer flex items-center justify-center m-0 p-0"
                    >
                      <X size={17} />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => imageInputRef.current?.click()}
                      disabled={isImageSearching}
                      className="text-slate-500 hover:text-blue-600 transition-colors h-full px-2 cursor-pointer flex items-center justify-center m-0 p-0 border-0 bg-transparent disabled:opacity-50"
                      title="Search by photo"
                      aria-label="Search by photo"
                    >
                      <Camera size={21} />
                    </button>
                  )}
                </div>
                {imageSearchMessage && (
                  <div className="absolute left-12 top-full mt-1 z-50 text-[11px] font-medium text-slate-500 bg-white px-2 py-1 rounded shadow-sm border border-slate-100" aria-live="polite">
                    {imageSearchMessage}
                  </div>
                )}

                {/* Desktop Search Autocomplete Suggestions Dropdown */}
                {searchName.trim().length >= 2 && (suggestionProduct.length > 0 || suggestionBrand.length > 0) && (
                  <div className="absolute left-0 top-full  mt-1 w-full bg-white rounded-2xl shadow-2xl border border-slate-100 py-3 px-4 z-50 text-left max-h-[420px] overflow-y-auto animate-in fade-in duration-150">
                    {suggestionProduct.length > 0 && (
                      <div className="mb-3">
                        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                          Products
                        </div>
                        <div className="space-y-1.5">
                          {suggestionProduct.map(({ node }) => (
                            <div
                              key={node.id}
                              onClick={() => {
                                setSuggestionProduct([]);
                                setSuggestionBrand([]);
                                setSearchName("");
                                navigate(`/product/${encodeURIComponent(node.slug)}`);
                              }}
                              className="flex items-center gap-3  cursor-pointer transition-colors"
                            >
                              <img
                                src={node.media?.[0]?.url || "/assets/images/logo.svg"}
                                alt={node.name}
                                className="w-10 h-15 object-contain rounded-lg bg-slate-50 shrink-0"
                              />
                              <div className="flex-1 min-w-0">
                                <p className="text-[13px] font-bold text-slate-800 truncate m-0">
                                  {node.name}
                                </p>
                                {node.pricing?.priceRange?.start?.net?.amount && (
                                  <span className="text-[12px] font-semibold text-blue-600">
                                    ₹{node.pricing.priceRange.start.net.amount}
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {suggestionBrand.length > 0 && (
                      <div className="pt-2 border-t border-slate-100">
                        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                          Brands
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {suggestionBrand.map((brandName, bIdx) => (
                            <button
                              key={bIdx}
                              type="button"
                              onClick={() => {
                                setSuggestionProduct([]);
                                setSuggestionBrand([]);
                                setSearchName(brandName);
                                navigate(`/search/${encodeURIComponent(brandName)}`);
                              }}
                              className="px-3 py-1 bg-slate-50 hover:bg-blue-50 hover:text-blue-600 rounded-lg text-xs font-semibold text-slate-700 transition-colors border-0 cursor-pointer"
                            >
                              {brandName}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="pt-2.5 -mt-2 border-t border-slate-100 text-center">
                      <button
                        type="button"
                        onClick={searchProduct}
                        className="text-lg font-bold text-blue-600 hover:text-blue-700 bg-transparent border-0 cursor-pointer"
                      >
                        See all results for &quot;{searchName.trim()}&quot; &rarr;
                      </button>
                    </div>
                  </div>
                )}
              </form>
            </div>

            {/* Right Side: Refer & Earn button + Stacked Login, Watchlist & Cart Icons */}
            <div className="flex items-center gap-1 lg:gap-2 shrink-0 self-center -ml-[0px] ">
              {/* Refer & Earn Pill Button (Figma Aurora Style) */}
              {/* <Link
                to="/refer"
                className="aurora-btn hidden xl:flex items-center gap-2 px-4 py-2 rounded-[12px] font-bold text-sm no-underline shrink-0 text-slate-900 shadow-sm mr-4"
              >
                <Gift size={18} className="relative z-10 text-slate-900" />
                <span className="relative z-10 font-semibold tracking-wide text-[14px]">Refer &amp; Earn</span>
              </Link> */}

              {/* Stacked Icon Actions Row */}
              <div className="flex items-center gap-3 sm:gap-6 mr-6">

                {/* Login / Profile (Stacked Icon over Text - Always Displaying Profile SVG Image) */}
                <div className="relative" ref={userMenuRef} data-user-menu="true">
                  {!isLoggedIn ? (
                    <Link
                      to="/login"
                      className="flex flex-col items-center justify-center gap-1 text-slate-700 hover:text-blue-600 transition-colors no-underline px-3 py-1 "
                    >
                      <img
                        src="data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20fill%3D%22none%22%20class%3D%22text-inherit%22%3E%3Cpath%20d%3D%22M12.12%2012.78C12.05%2012.77%2011.96%2012.77%2011.88%2012.78C10.12%2012.72%208.71997%2011.28%208.71997%209.50998C8.71997%207.69998%2010.18%206.22998%2012%206.22998C13.81%206.22998%2015.28%207.69998%2015.28%209.50998C15.27%2011.28%2013.88%2012.72%2012.12%2012.78Z%22%20stroke%3D%22%23334155%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3C/path%3E%3Cpath%20d%3D%22M18.74%2019.3801C16.96%2021.0101%2014.6%2022.0001%2012%2022.0001C9.40001%2022.0001%207.04001%2021.0101%205.26001%2019.3801C5.36001%2018.4401%205.96001%2017.5201%207.03001%2016.8001C9.77001%2014.9801%2014.25%2014.9801%2016.97%2016.8001C18.04%2017.5201%2018.64%2018.4401%2018.74%2019.3801Z%22%20stroke%3D%22%23334155%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3C/path%3E%3Cpath%20d%3D%22M12%2022C17.5228%2022%2022%2017.5228%2022%2012C22%206.47715%2017.5228%202%2012%202C6.47715%202%202%206.47715%202%2012C2%2017.5228%206.47715%2022%2012%2022Z%22%20stroke%3D%22%23334155%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3C/path%3E%3C/svg%3E"
                        alt="Login Icon"
                        className="w-10 h-10 object-contain"
                      />
                      <span className="text-[10px] font-bold text-slate-900" style={{ fontFamily: "'DM Sans', sans-serif" }}>Login</span>
                    </Link>
                  ) : (
                    <>
                      <button
                        onClick={() => setUserMenuOpen(!userMenuOpen)}
                        className="flex flex-col items-center justify-center gap-1 text-slate-900 hover:text-blue-600 transition-colors bg-transparent border-0 cursor-pointer px-3 py-1 "
                      >
                        <img
                          src="data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20fill%3D%22none%22%20class%3D%22text-inherit%22%3E%3Cpath%20d%3D%22M12.12%2012.78C12.05%2012.77%2011.96%2012.77%2011.88%2012.78C10.12%2012.72%208.71997%2011.28%208.71997%209.50998C8.71997%207.69998%2010.18%206.22998%2012%206.22998C13.81%206.22998%2015.28%207.69998%2015.28%209.50998C15.27%2011.28%2013.88%2012.72%2012.12%2012.78Z%22%20stroke%3D%22%232563EB%22%20stroke-width%3D%221.75%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3C/path%3E%3Cpath%20d%3D%22M18.74%2019.3801C16.96%2021.0101%2014.6%2022.0001%2012%2022.0001C9.40001%2022.0001%207.04001%2021.0101%205.26001%2019.3801C5.36001%2018.4401%205.96001%2017.5201%207.03001%2016.8001C9.77001%2014.9801%2014.25%2014.9801%2016.97%2016.8001C18.04%2017.5201%2018.64%2018.4401%2018.74%2019.3801Z%22%20stroke%3D%22%232563EB%22%20stroke-width%3D%221.75%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3C/path%3E%3Cpath%20d%3D%22M12%2022C17.5228%2022%2022%2017.5228%2022%2012C22%206.47715%2017.5228%202%2012%202C6.47715%202%202%206.47715%202%2012C2%2017.5228%206.47715%2022%2012%2022Z%22%20stroke%3D%22%232563EB%22%20stroke-width%3D%221.75%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3C/path%3E%3C/svg%3E"
                          alt="Profile Icon"
                          className="w-10 h-10 object-contain"
                        />
                        <span className="text-[14px] font-semibold max-w-[80px] truncate text-slate-700" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                          {(currentUser && currentUser.trim()) ? currentUser.substring(0, 8) : ((username && username.trim()) ? username.substring(0, 8) : (localStorage.getItem("email") || "Profile").substring(0, 8))}
                        </span>
                      </button>

                      {userMenuOpen && (
                        <div className="absolute right-0 top-full mt-2 w-72 md:w-80 bg-white rounded-2xl shadow-xl border border-slate-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150 overflow-hidden">
                          <div className="px-5 py-3.5 border-b border-slate-100 text-xs text-slate-500 bg-slate-50/70">
                            <span className="text-slate-500 font-medium tracking-wide uppercase text-[11px]">Logged in as</span>
                            <div className="text-slate-800 font-extrabold text-sm sm:text-[15px] mt-1 break-words text-wrap leading-snug" style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}>
                              {currentUser || localStorage.getItem("email") || username}
                            </div>
                          </div>
                          <div className="py-1">
                            <Link
                              to="/Dashboard"
                              onClick={(e) => {
                                setUserMenuOpen(false);
                                if (window.location.pathname === "/Dashboard" && !window.location.search) {
                                  e.preventDefault();
                                  window.scrollTo({ top: 0, behavior: "smooth" });
                                }
                              }}
                              className="flex items-center gap-3 px-5 py-3 text-[14px] font-bold text-slate-700 hover:bg-slate-50 hover:text-blue-600 no-underline transition-all"
                            >
                              <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                                <LayoutDashboard size={18} />
                              </div>
                              <span>Dashboard</span>
                            </Link>
                            <Link
                              to="/Dashboard?tab=orders"
                              onClick={() => setUserMenuOpen(false)}
                              className="flex items-center gap-3 px-5 py-3 text-[14px] font-bold text-slate-700 hover:bg-slate-50 hover:text-blue-600 no-underline transition-all"
                            >
                              <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                                <ShoppingBag size={18} />
                              </div>
                              <span>Orders</span>
                            </Link>
                            <button
                              onClick={() => { setUserMenuOpen(false); logoutHandler(); }}
                              className="w-full flex items-center gap-3 px-5 py-3 text-[14px] font-bold text-red-600 hover:bg-red-50 border-0 bg-transparent cursor-pointer transition-all text-left"
                            >
                              <div className="w-8 h-8 rounded-xl bg-red-50 flex items-center justify-center text-red-600 shrink-0">
                                <LogOut size={18} />
                              </div>
                              <span>Secure Sign Out</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Watchlist / Wishlist (Stacked Icon over Text) */}
                <Link
                  to="/wishlist"
                  className="relative flex flex-col items-center justify-center gap-1 text-slate-700 hover:text-red-500 transition-colors no-underline px-1 py-1"
                >
                  <div className="relative">
                    <img
                      src="data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23334155%22%20stroke-width%3D%221.75%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20class%3D%22lucide%20lucide-heart%20w-5%20h-5%20text-primary%22%20aria-hidden%3D%22true%22%3E%3Cpath%20d%3D%22M2%209.5a5.5%205.5%200%200%201%209.591-3.676.56.56%200%200%200%20.818%200A5.49%205.49%200%200%201%2022%209.5c0%202.29-1.5%204-3%205.5l-5.492%205.313a2%202%200%200%201-3%20.019L5%2015c-1.5-1.5-3-3.2-3-5.5%22%3E%3C%2Fpath%3E%3C%2Fsvg%3E"
                      alt="Watchlist Icon"
                      className="w-10 h-10 object-contain"
                    />
                    {wishlistQuantity > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-600 text-white font-bold text-[10px] w-7 h-7 rounded-full flex items-center justify-center shadow-xs">
                        {wishlistQuantity}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-semibold text-slate-900" style={{ fontFamily: "'DM Sans', sans-serif" }}>Watchlist</span>
                </Link>

                {/* Cart (Stacked Icon over Text) */}
                <button
                  onClick={() => navigate("/cart")}
                  className="relative flex flex-col items-center justify-center gap-1 text-slate-700 hover:text-orange-500 transition-colors bg-transparent border-0 cursor-pointer px-3 py-1"
                >
                  <div className="relative">
                    <img
                      src="data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20fill%3D%22none%22%20class%3D%22!text-white%20!w-7%20!h-7%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20clip-rule%3D%22evenodd%22%20d%3D%22M1%202C1%201.44772%201.44772%201%202%201H2.88918C4.37252%201%205.63317%202.08406%205.85534%203.55066L5.92341%204H19.56C21.4533%204%2022.8733%205.73229%2022.5017%207.58879L21.5009%2012.5888C21.2203%2013.9909%2019.9891%2015%2018.5592%2015H7.74504L7.97025%2016.1865C8.05983%2016.6584%208.47234%2017%208.95271%2017H18C18.5523%2017%2019%2017.4477%2019%2018C19%2018.5523%2018.5523%2019%2018%2019H8.95271C7.51159%2019%206.27409%2017.9753%206.00534%2016.5595L5.55491%2014.1865L5.55255%2014.1741L5.55051%2014.1616L4.07664%205.16161L4.0747%205.14979L4.07477%205.14978L3.8779%203.85022C3.80384%203.36135%203.38363%203%202.88918%203H2C1.44772%203%201%202.55228%201%202ZM7.38692%2013L6.24058%206H19.56C20.1911%206%2020.6644%206.57743%2020.5406%207.19626L19.5398%2012.1963C19.4463%2012.6636%2019.0359%2013%2018.5592%2013H7.38692ZM10%2021C10%2021.5523%209.55229%2022%209%2022C8.44772%2022%208%2021.5523%208%2021C8%2020.4477%208.44772%2020%209%2020C9.55229%2020%2010%2020.4477%2010%2021ZM17%2022C17.5523%2022%2018%2021.5523%2018%2021C18%2020.4477%2017.5523%2020%2017%2020C16.4477%2020%2016%2020.4477%2016%2021C16%2021.5523%2016.4477%2022%2017%2022Z%22%20fill%3D%22%23334155%22%3E%3C%2Fpath%3E%3C%2Fsvg%3E"
                      alt="Cart Icon"
                      className="w-10 h-10 object-contain"
                    />
                    {quantity > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-600 text-white font-bold text-[10px] min-w-[17px]  w-7 h-7 px-1 rounded-full flex items-center justify-center shadow-xs">
                        {quantity}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-semibold text-slate-900" style={{ fontFamily: "'DM Sans', sans-serif" }}>Cart</span>
                </button>

              </div>

            </div>

          </div>
        </div>

        {/* MOBILE HEADER LAYOUT (Hidden on desktop) */}
        <div className="md:hidden d-block d-md-none w-full px-3 py-2.5">
          {/* Row 1: Logo, Location, Icons (without text labels for compactness) */}
          <div className="flex items-center justify-between min-h-[54px] w-full gap-1.5 sm:gap-2 py-1">
            {/* Left Side */}
            <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
              <Link to="/" className="flex items-center no-underline shrink-0 ml-2">
                <img
                  src="/assets/images/logo3.png"
                  alt="HegmaKart Logo"
                  className="h-10 w-auto object-contain"
                  onClick={() => { if (window.location.pathname === "/") setTimeout(() => window.location.reload(false), 10); }}
                />
              </Link>
              <div
                onClick={() => setIsLocationModalOpen(true)}
                className="flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 px-2.5 py-1.5 rounded-xl cursor-pointer transition-colors shadow-2xs max-w-[125px]"
                title={currentLocation ? `PIN code: ${currentLocation.pincode}` : "Choose delivery location"}
              >
                <div className="flex items-center justify-center w-8 h-8 shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-8 h-11 text-black"
                  >
                    <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <span className="text-[12px] font-bold text-slate-800 truncate">
                  {currentLocation ? currentLocation.pincode : "Location"}
                </span>
                <ChevronDown size={13} className="text-orange-500 shrink-0" />
              </div>
            </div>

            {/* Right Side: Cart, Watchlist & Profile Icons */}
            <div className="flex items-center gap-2 sm:gap-4 shrink-0">
              {/* Cart Icon */}
              <button
                type="button"
                onClick={() => navigate("/cart")}
                className="relative flex items-center justify-center p-1 bg-transparent border-0 cursor-pointer"
                aria-label="Cart"
              >
                <img
                  src="data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20fill%3D%22none%22%20class%3D%22!text-white%20!w-7%20!h-7%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20clip-rule%3D%22evenodd%22%20d%3D%22M1%202C1%201.44772%201.44772%201%202%201H2.88918C4.37252%201%205.63317%202.08406%205.85534%203.55066L5.92341%204H19.56C21.4533%204%2022.8733%205.73229%2022.5017%207.58879L21.5009%2012.5888C21.2203%2013.9909%2019.9891%2015%2018.5592%2015H7.74504L7.97025%2016.1865C8.05983%2016.6584%208.47234%2017%208.95271%2017H18C18.5523%2017%2019%2017.4477%2019%2018C19%2018.5523%2018.5523%2019%2018%2019H8.95271C7.51159%2019%206.27409%2017.9753%206.00534%2016.5595L5.55491%2014.1865L5.55255%2014.1741L5.55051%2014.1616L4.07664%205.16161L4.0747%205.14979L4.07477%205.14978L3.8779%203.85022C3.80384%203.36135%203.38363%203%202.88918%203H2C1.44772%203%201%202.55228%201%202ZM7.38692%2013L6.24058%206H19.56C20.1911%206%2020.6644%206.57743%2020.5406%207.19626L19.5398%2012.1963C19.4463%2012.6636%2019.0359%2013%2018.5592%2013H7.38692ZM10%2021C10%2021.5523%209.55229%2022%209%2022C8.44772%2022%208%2021.5523%208%2021C8%2020.4477%208.44772%2020%209%2020C9.55229%2020%2010%2020.4477%2010%2021ZM17%2022C17.5523%2022%2018%2021.5523%2018%2021C18%2020.4477%2017.5523%2020%2017%2020C16.4477%2020%2016%2020.4477%2016%2021C16%2021.5523%2016.4477%2022%2017%2022Z%22%20fill%3D%22%23334155%22%3E%3C%2Fpath%3E%3C%2Fsvg%3E"
                  alt="Cart"
                  className="w-10 h-10 object-contain"
                />
                {quantity > 0 && (
                  <span className="absolute -top-1 -right-2 bg-red-600 text-white font-bold text-[10px] min-w-[17px] h-[17px] px-1 rounded-full flex items-center justify-center shadow-xs">
                    {quantity}
                  </span>
                )}
              </button>

              {/* Watchlist Icon */}
              <Link
                to="/wishlist"
                className="relative flex items-center justify-center p-1 no-underline"
                aria-label="Watchlist"
              >
                <img
                  src="data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23334155%22%20stroke-width%3D%221.75%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20class%3D%22lucide%20lucide-heart%20w-5%20h-5%20text-primary%22%20aria-hidden%3D%22true%22%3E%3Cpath%20d%3D%22M2%209.5a5.5%205.5%200%200%201%209.591-3.676.56.56%200%200%200%20.818%200A5.49%205.49%200%200%201%2022%209.5c0%202.29-1.5%204-3%205.5l-5.492%205.313a2%202%200%200%201-3%20.019L5%2015c-1.5-1.5-3-3.2-3-5.5%22%3E%3C%2Fpath%3E%3C%2Fsvg%3E"
                  alt="Watchlist"
                  className="w-10 h-10 object-contain"
                />
                {wishlistQuantity > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white font-bold text-[10px] min-w-[17px] h-[17px] px-1 rounded-full flex items-center justify-center shadow-xs">
                    {wishlistQuantity}
                  </span>
                )}
              </Link>

              {/* Profile / Login Icon */}
              {!isLoggedIn ? (
                <Link to="/login" className="flex items-center justify-center p-1 no-underline" aria-label="Login">
                  <img
                    src="data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20fill%3D%22none%22%20class%3D%22text-inherit%22%3E%3Cpath%20d%3D%22M12.12%2012.78C12.05%2012.77%2011.96%2012.77%2011.88%2012.78C10.12%2012.72%208.71997%2011.28%208.71997%209.50998C8.71997%207.69998%2010.18%206.22998%2012%206.22998C13.81%206.22998%2015.28%207.69998%2015.28%209.50998C15.27%2011.28%2013.88%2012.72%2012.12%2012.78Z%22%20stroke%3D%22%23334155%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3C/path%3E%3Cpath%20d%3D%22M18.74%2019.3801C16.96%2021.0101%2014.6%2022.0001%2012%2022.0001C9.40001%2022.0001%207.04001%2021.0101%205.26001%2019.3801C5.36001%2018.4401%205.96001%2017.5201%207.03001%2016.8001C9.77001%2014.9801%2014.25%2014.9801%2016.97%2016.8001C18.04%2017.5201%2018.64%2018.4401%2018.74%2019.3801Z%22%20stroke%3D%22%23334155%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3C/path%3E%3Cpath%20d%3D%22M12%2022C17.5228%2022%2022%2017.5228%2022%2012C22%206.47715%2017.5228%202%2012%202C6.47715%202%202%206.47715%202%2012C2%2017.5228%206.47715%2022%2012%2022Z%22%20stroke%3D%22%23334155%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3C/path%3E%3C/svg%3E"
                    alt="Login"
                    className="w-10 h-10 object-contain"
                  />
                </Link>
              ) : (
                <div className="relative" ref={mobileUserMenuRef} data-user-menu="true">
                  <button
                    type="button"
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center justify-center p-1 bg-transparent border-0 cursor-pointer"
                    aria-label="Account Menu"
                  >
                    <img
                      src="data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20fill%3D%22none%22%20class%3D%22text-inherit%22%3E%3Cpath%20d%3D%22M12.12%2012.78C12.05%2012.77%2011.96%2012.77%2011.88%2012.78C10.12%2012.72%208.71997%2011.28%208.71997%209.50998C8.71997%207.69998%2010.18%206.22998%2012%206.22998C13.81%206.22998%2015.28%207.69998%2015.28%209.50998C15.27%2011.28%2013.88%2012.72%2012.12%2012.78Z%22%20stroke%3D%22%232563EB%22%20stroke-width%3D%221.75%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3C/path%3E%3Cpath%20d%3D%22M18.74%2019.3801C16.96%2021.0101%2014.6%2022.0001%2012%2022.0001C9.40001%2022.0001%207.04001%2021.0101%205.26001%2019.3801C5.36001%2018.4401%205.96001%2017.5201%207.03001%2016.8001C9.77001%2014.9801%2014.25%2014.9801%2016.97%2016.8001C18.04%2017.5201%2018.64%2018.4401%2018.74%2019.3801Z%22%20stroke%3D%22%232563EB%22%20stroke-width%3D%221.75%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3C/path%3E%3Cpath%20d%3D%22M12%2022C17.5228%2022%2022%2017.5228%2022%2012C22%206.47715%2017.5228%202%2012%202C6.47715%202%202%206.47715%202%2012C2%2017.5228%206.47715%2022%2012%2022Z%22%20stroke%3D%22%232563EB%22%20stroke-width%3D%221.75%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3C/path%3E%3C/svg%3E"
                      alt="Profile"
                      className="w-8 h-8 object-contain"
                    />
                  </button>
                  {userMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-72 max-w-[calc(100vw-24px)] bg-white rounded-2xl shadow-xl border border-slate-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150 overflow-hidden">
                      <div className="px-5 py-3.5 border-b border-slate-100 text-xs text-slate-500 bg-slate-50/70">
                        <span className="text-slate-500 font-medium tracking-wide uppercase text-[11px]">Logged in as</span>
                        <div className="text-slate-800 font-extrabold text-sm mt-1 break-words text-wrap leading-snug" style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}>
                          {currentUser || localStorage.getItem("email") || username}
                        </div>
                      </div>
                      <div className="py-1">
                        <Link
                          to="/Dashboard"
                          onClick={(e) => {
                            setUserMenuOpen(false);
                            if (window.location.pathname === "/Dashboard" && !window.location.search) {
                              e.preventDefault();
                              window.scrollTo({ top: 0, behavior: "smooth" });
                            }
                          }}
                          className="flex items-center gap-3 px-5 py-3 text-[14px] font-bold text-slate-700 hover:bg-slate-50 hover:text-blue-600 no-underline transition-all w-full bg-transparent border-0 cursor-pointer text-left"
                        >
                          <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                            <LayoutDashboard size={18} />
                          </div>
                          <span>Dashboard</span>
                        </Link>
                        <button
                          type="button"
                          onClick={() => { setUserMenuOpen(false); logoutHandler(); }}
                          className="w-full flex items-center gap-3 px-5 py-3 text-[14px] font-bold text-red-600 hover:bg-red-50 border-0 bg-transparent cursor-pointer transition-all text-left"
                        >
                          <div className="w-8 h-8 rounded-xl bg-red-50 flex items-center justify-center text-red-600 shrink-0">
                            <LogOut size={18} />
                          </div>
                          <span>Secure Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Row 2: Menu Button + Search Bar */}
          <div className="flex items-center w-full gap-2.5 pt-1 pb-2">
            <button
              type="button"
              data-menu-toggle="true"
              onClick={() => setShowMegaMenu(!showMegaMenu)}
              className="p-2 hover:bg-slate-50 active:bg-slate-100 rounded-xl transition-colors text-slate-700 bg-transparent border-0 shrink-0 cursor-pointer flex items-center justify-center"
              aria-label="Toggle Menu"
            >
              {showMegaMenu ? <X size={23} /> : <Menu size={23} />}
            </button>
            <div className="flex-1 m-0 p-0 relative">
              <form onSubmit={searchProduct} className="w-full relative m-0 p-0">
                <div className="flex items-center w-full h-[42px] px-3 bg-slate-50 rounded-[14px] border border-slate-200 focus-within:border-blue-500 focus-within:bg-white transition-all m-0">
                  <button type="submit" className="bg-transparent border-0 p-0 mr-2 flex items-center justify-center cursor-pointer text-slate-500 hover:text-blue-600">
                    <Search size={18} />
                  </button>
                  <input
                    type="search"
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                    onFocus={(e) => e.target.select()}
                    onClick={(e) => {
                      if (searchName && e.target.selectionStart === e.target.selectionEnd) {
                        e.target.select();
                      }
                    }}
                    placeholder="Search products, brands & categories..."
                    className="flex-1 h-full bg-transparent text-slate-800 text-[14px] outline-none placeholder:text-slate-400 border-0 focus:ring-0 m-0 p-0 w-full"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                    autoComplete="off"
                  />
                  {searchName ? (
                    <button type="button" onClick={() => setSearchName("")} className="p-1 text-slate-400 bg-transparent border-0 flex items-center justify-center cursor-pointer">
                      <X size={16} />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => imageInputRef.current?.click()}
                      disabled={isImageSearching}
                      className="text-slate-500 p-1 flex items-center justify-center cursor-pointer hover:text-blue-600 border-0 bg-transparent disabled:opacity-50"
                      title="Search by photo"
                      aria-label="Search by photo"
                    >
                      <Camera size={19} />
                    </button>
                  )}
                </div>

                {/* Mobile Search Autocomplete Suggestions Dropdown */}
                {searchName.trim().length >= 2 && (suggestionProduct.length > 0 || suggestionBrand.length > 0) && (
                  <div className="absolute left-0 top-full mt-1 w-full bg-white rounded-2xl shadow-2xl border border-slate-100 py-2.5 px-3 z-50 text-left max-h-[350px] overflow-y-auto animate-in fade-in duration-150">
                    {suggestionProduct.length > 0 && (
                      <div className="mb-2">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                          Products
                        </div>
                        <div className="space-y-1">
                          {suggestionProduct.map(({ node }) => (
                            <div
                              key={node.id}
                              onClick={() => {
                                setSuggestionProduct([]);
                                setSuggestionBrand([]);
                                setSearchName("");
                                navigate(`/product/${encodeURIComponent(node.slug)}`);
                              }}
                              className="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors"
                            >
                              <img
                                src={node.media?.[0]?.url || "/assets/images/logo.svg"}
                                alt={node.name}
                                className="w-8 h-8 object-contain rounded-md bg-slate-50 p-1 shrink-0"
                              />
                              <div className="flex-1 min-w-0">
                                <p className="text-[12px] font-bold text-slate-800 truncate m-0">
                                  {node.name}
                                </p>
                                {node.pricing?.priceRange?.start?.net?.amount && (
                                  <span className="text-[11px] font-semibold text-blue-600">
                                    ₹{node.pricing.priceRange.start.net.amount}
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {suggestionBrand.length > 0 && (
                      <div className="pt-2 border-t border-slate-100">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                          Brands
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {suggestionBrand.map((brandName, bIdx) => (
                            <button
                              key={bIdx}
                              type="button"
                              onClick={() => {
                                setSuggestionProduct([]);
                                setSuggestionBrand([]);
                                setSearchName(brandName);
                                navigate(`/search/${encodeURIComponent(brandName)}`);
                              }}
                              className="px-2.5 py-0.5 bg-slate-50 hover:bg-blue-50 hover:text-blue-600 rounded-md text-[11px] font-semibold text-slate-700 transition-colors border-0 cursor-pointer"
                            >
                              {brandName}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="pt-2 mt-1.5 border-t border-slate-100 text-center">
                      <button
                        type="button"
                        onClick={searchProduct}
                        className="text-[11px] font-bold text-blue-600 hover:text-blue-700 bg-transparent border-0 cursor-pointer"
                      >
                        See all results &rarr;
                      </button>
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* Mobile All Categories & Navigation Drawer (Figma Design) */}
          {showMegaMenu && (
            <div ref={mobileMenuRef} className="absolute left-0 right-0 top-full w-full bg-white border-b border-slate-200 shadow-2xl py-4 px-4 max-h-[82vh] overflow-y-auto z-50 text-left animate-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between px-1 mb-3">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  CATEGORIES
                </span>
                <button
                  type="button"
                  onClick={() => setShowMegaMenu(false)}
                  className="p-1 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors border-0 bg-transparent cursor-pointer flex items-center justify-center"
                  aria-label="Close categories"
                >
                  <X size={20} />
                </button>
              </div>

              <Link
                to="/category"
                onClick={(e) => handleCategoryNav(e, "/category")}
                className="flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-blue-50 text-blue-600 no-underline font-semibold text-[15px] transition-colors mb-5 shadow-xs"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                <span className="text-lg">🏥</span>
                <span>All Products</span>
              </Link>

              <div className="space-y-2 pb-2">
                {categoriess && categoriess.length > 0 ? (
                  categoriess.map(({ node: cat }) => {
                    const getEmoji = (name = "") => {
                      const l = name.toLowerCase();
                      if (l.includes("brand")) return "🏷️";
                      if (l.includes("diag") || l.includes("lab") || l.includes("test")) return "🔬";
                      if (l.includes("dermat") || l.includes("serum") || l.includes("skin") || l.includes("med") || l.includes("pharm")) return "💊";
                      if (l.includes("surg") || l.includes("sutur") || l.includes("operat")) return "🪡";
                      if (l.includes("dent") || l.includes("tooth") || l.includes("ortho") || l.includes("oral")) return "🦷";
                      if (l.includes("equip") || l.includes("chair") || l.includes("x-ray") || l.includes("rvg") || l.includes("port")) return "⚙️";
                      if (l.includes("consum") || l.includes("disp") || l.includes("glov")) return "🩺";
                      if (l.includes("implant")) return "🔩";
                      return "🏥";
                    };
                    return (
                      <div key={cat.id} className="bg-slate-50 rounded-[24px] p-5 border border-slate-100/80 shadow-xs">
                        <Link
                          to={`/category/${cat.slug}`}
                          onClick={(e) => handleCategoryNav(e, `/category/${cat.slug}`)}
                          className="flex items-center gap-3.5 mb-4 no-underline text-slate-900 font-bold text-[16px] hover:text-blue-600 transition-colors"
                          style={{ fontFamily: "Outfit, sans-serif" }}
                        >
                          <span className="text-xl shrink-0 leading-none">{getEmoji(cat.name)}</span>
                          <span className="truncate">{cat.name}</span>
                        </Link>
                        <div className="space-y-3.5 pl-3 pr-1 pt-1">
                          {cat.children?.edges && cat.children.edges.filter(({ node: sub }) => sub.isBrand || (sub.products?.totalCount ?? 0) > 0).length > 0 ? (
                            cat.children.edges
                              .filter(({ node: sub }) => sub.isBrand || (sub.products?.totalCount ?? 0) > 0)
                              .map(({ node: sub }) => {
                                const count = sub.products?.totalCount ?? 0;
                                const isBrand = cat.isBrandsCategory;
                                const destPath = isBrand ? `/brand/${encodeURIComponent(sub.name)}` : `/category/${cat.slug}/${sub.slug}`;
                                return (
                                  <Link
                                    key={sub.id}
                                    to={destPath}
                                    onClick={(e) => handleCategoryNav(e, destPath)}
                                    className="flex items-center justify-between no-underline text-slate-600 hover:text-blue-600 text-[14px] font-medium transition-colors m-0 p-0 border-0 bg-transparent shadow-none"
                                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                                  >
                                    <span className="truncate pr-4">{sub.name}</span>
                                    {!isBrand && (
                                      <span className="text-[13px] font-normal text-slate-400 shrink-0">({count})</span>
                                    )}
                                  </Link>
                                );
                              })
                          ) : (
                            <span className="text-[13px] text-slate-400 italic block py-1">Browse category products &rarr;</span>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-6 text-slate-500 text-sm font-semibold italic text-center">Loading Categories...</div>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* 2. Sub-Navigation Category Bar (Tier 2 - Figma Design, Center Aligned Line) */}
      <div className="desktop-category-nav w-full bg-white  py-2.5 px-1 d-none d-md-block relative -pt-10">
        <div className="desktop-category-nav__scroll w-full flex items-center justify-center px-1 ml-4">



          {/* All Categories Trigger */}
          <button
            type="button"
            data-menu-toggle="true"
            onClick={() => setShowMegaMenu(!showMegaMenu)}
            className={`desktop-category-nav__item group ${showMegaMenu ? "is-active" : ""}`}
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            <Grid3X3 className="desktop-category-nav__icon" />
            <span>All Categories</span>
            <ChevronDown className={`desktop-category-nav__chevron ${showMegaMenu ? "is-open" : ""}`} />
          </button>

          {/* Figma Specified Items & Category Links */}
          <div className="desktop-category-nav__items flex items-center shrink-0 overflow-x-auto no-scrollbar gap-2">
            {/* 1. New Clinic Setup */}
            <Link
              to="/offline-order"
              className={`desktop-category-nav__item group ${isActiveNavPath("/offline-order") ? "is-active" : ""}`}
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              <Hospital className="desktop-category-nav__icon" />
              <span>New Clinic Setup</span>
            </Link>

            {/* 2. Offers */}
            <Link
              to="/collection/special-offers"
              className={`desktop-category-nav__item group ${isActiveNavPath("/collection/special-offers") ? "is-active" : ""}`}
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              <Tag className="desktop-category-nav__icon" />
              <span>Offers</span>
            </Link>

            {/* 3. Figma Categories with Dynamic API matching */}
            {[
              { name: "RVG Sensors", icon: ScanLine, keywords: ["rvg", "sensor"] },
              { name: "Portable X-Ray", icon: Scan, keywords: ["x-ray", "portable", "ray"] },
              { name: "Dental Chair", icon: Armchair, keywords: ["chair", "dental chair"] },
              {
                name: "Spin Endo Files",
                icon: FileText,
                searchTerm: "spindo",
                keywords: ["spin endo", "endo files", "files","Spin Endo", "Endo Files"]
              },
              {
                name: "Intraoral Scanner",
                icon: ScanSearch,
                keywords: ["intraoral", "scanner", "intraoral scanner"]
              },
            ].map((item, idx) => {
              const Icon = item.icon;
              // Try matching against live GraphQL categories by name keywords
              const matchedCat = categoriess?.find(({ node }) => {
                const nodeName = node.name.toLowerCase();
                return item.keywords.some((kw) => nodeName.includes(kw));
              })?.node;

              const toPath = item.searchTerm
                ? `/search/${encodeURIComponent(item.searchTerm)}`
                : matchedCat
                  ? `/category/${matchedCat.slug}`
                  : `/search/${encodeURIComponent(item.name)}`;
              const count = matchedCat ? (matchedCat.products?.totalCount ?? 0) : null;

              return (
                <Link
                  key={idx}
                  to={toPath}
                  className={`desktop-category-nav__item group ${isActiveNavPath(toPath) ? "is-active" : ""}`}
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  <Icon className="desktop-category-nav__icon" />
                  <span>{item.name}</span>
                  {count !== null && <span className="text-xs font-normal text-slate-400">({count})</span>}
                </Link>
              );
            })}
          </div>

        </div>
      </div>

      {/* Desktop Mega Menu Dropdown Panel */}
      {showMegaMenu && (
        <div
          className="hidden md:block fixed inset-0 bg-black/20 z-[9999]"
          onClick={() => setShowMegaMenu(false)}
        >
          <div
            ref={megaMenuRef}
className="absolute left-1/2 top-[100px] -translate-x-1/2 w-[950px] h-[calc(100vh-120px)] max-h-[900px] min-h-[500px] bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col text-left animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Bar & Close Trigger (Top Header) */}
            <div className="p-4 border-b border-slate-200 bg-white shrink-0 flex items-center justify-between gap-1">
              <div className="relative w-full flex items-center">
                <Search className="absolute left-4 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={categorySearchTerm}
                  onChange={(e) => setCategorySearchTerm(e.target.value)}
                  placeholder="Search Category..."
                  className="w-full h-12 rounded-xl border border-slate-300 pl-11 pr-4 text-[15px] font-medium text-slate-700 placeholder:text-slate-400 outline-none focus:border-blue-500 m-0"
                />
              </div>
              <button
                type="button"
                onClick={() => setShowMegaMenu(false)}
                className="p-2.5 hover:bg-slate-100 active:bg-slate-200 text-slate-500 hover:text-blue-600 rounded-xl transition-colors border-0 bg-transparent cursor-pointer shrink-0 flex items-center justify-center"
                aria-label="Close modal"
              >
                <X size={22} />
              </button>
            </div>

            {/* Body Container */}
            <div className="flex flex-1 overflow-hidden">
              {/* Category Sidebar */}
              <div className="w-[220px] bg-[#F5F9FF] border-r border-slate-200 flex flex-col justify-between h-full">
                <div className="overflow-y-auto flex-1">
                  {categoriess && categoriess.length > 0 ? (
                    categoriess
                      .filter(({ node }) => {
                        if (!categorySearchTerm) return true;
                        const term = categorySearchTerm.toLowerCase();
                        return node.name?.toLowerCase().includes(term) || node.children?.edges?.some(({ node: sub }) => sub.name?.toLowerCase().includes(term));
                      })
                      .map(({ node }) => {
                        const isSelected = activeCategory?.id === node.id;
                        return (
                          <button
                            key={node.id}
                            type="button"
                            onMouseEnter={() => { setActiveCategory(node); setBrandLetterFilter(null); }}
                            onClick={(e) => {
                              setActiveCategory(node);
                              setBrandLetterFilter(null);
                              if (window.matchMedia("(min-width: 768px)").matches) {
                                handleCategoryNav(e, `/category/${node.slug}`);
                              }
                            }}
                            className={`relative w-full flex items-center justify-between px-4 py-3.5 transition-all duration-200 border-0 bg-transparent cursor-pointer text-left ${isSelected
                              ? "bg-white text-blue-600 font-bold shadow-sm"
                              : "text-slate-700 hover:bg-blue-100/60"
                              }`}
                            style={{ fontFamily: "'DM Sans', sans-serif" }}
                          >
                            {isSelected && (
                              <div className="absolute left-0 top-2 bottom-2 w-1.5 rounded-r-full " />
                            )}
                            <div className="flex items-center justify-between flex-1 truncate pr-2">
                              <span className="text-[15px] truncate font-bold">{node.name}</span>
                              {/* <span className={`text-xs shrink-0 pl-2 ${isSelected ? "text-blue-600 font-bold" : "text-slate-500 font-semibold"}`}>({node.products?.totalCount ?? 0})</span> */}
                            </div>
                            <ChevronRight className={`w-4 h-4 shrink-0 ${isSelected ? "text-blue-600" : "text-slate-400"}`} />
                          </button>
                        );
                      })
                  ) : (
                    <div className="p-4 text-slate-500 text-xs font-semibold italic text-center">Loading Categories...</div>
                  )}
                </div>

                <div className="p-4 border-t border-slate-200 bg-white shrink-0">
                  <Link
                    to="/category"
                    onClick={(e) => handleCategoryNav(e, "/category")}
                    className="block text-center w-full rounded-lg bg-blue-600 py-2.5 text-white font-semibold text-lg hover:bg-blue-700 transition no-underline shadow-sm"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    View All Categories
                  </Link>
                </div>
              </div>

              {/* Center Detail Panel */}
              <div className="flex-1 overflow-y-auto p-8 bg-white text-left h-full relative">
                <div className={activeCategory?.isBrandsCategory ? "pr-8" : ""}>
                  <div className="flex items-baseline gap-3 mb-1">
                    <h2 className="text-2xl font-bold text-slate-900 m-0" style={{ fontFamily: "Outfit, sans-serif" }}>
                      {activeCategory?.name || "Select Category"}
                    </h2>
                    {activeCategory?.products && (
                      <span className="text-base font-medium text-slate-400">({activeCategory.products.totalCount ?? 0} items)</span>
                    )}
                  </div>

                  <div className="h-px bg-slate-100 w-full mt-0 mb-2 shadow-[0_1px_2px_rgba(0,0,0,0.03)]" />

                  {activeCategory?.children?.edges && activeCategory.children.edges.filter(({ node: sub }) => (sub.isBrand || (sub.products?.totalCount ?? 0) > 0) && (!categorySearchTerm || sub.name?.toLowerCase().includes(categorySearchTerm.toLowerCase())) && (!brandLetterFilter || sub.name?.toUpperCase().startsWith(brandLetterFilter))).length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-4">
                      {activeCategory.children.edges
                        .filter(({ node: sub }) => (sub.isBrand || (sub.products?.totalCount ?? 0) > 0) && (!categorySearchTerm || sub.name?.toLowerCase().includes(categorySearchTerm.toLowerCase())) && (!brandLetterFilter || sub.name?.toUpperCase().startsWith(brandLetterFilter)))
                        .map(({ node: sub }) => {
                          const isBrand = activeCategory.isBrandsCategory;
                          const destPath = isBrand ? `/brand/${encodeURIComponent(sub.name)}` : `/category/${activeCategory.slug}/${sub.slug}`;
                          return (
                            <Link
                              key={sub.id}
                              to={destPath}
                              onClick={(e) => handleCategoryNav(e, destPath)}
                              className="flex items-center justify-between text-slate-600 hover:text-blue-600 no-underline cursor-pointer text-[14px] font-extrabold transition-colors m-0 p-0 border-0 bg-transparent shadow-none pr-3"
                              style={{ fontFamily: "'DM Sans', sans-serif" }}
                            >
                              <div className="flex items-center gap-2.5 truncate pr-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></span>
                                <span className="truncate">{sub.name}</span>
                              </div>
                              {!isBrand && (
                                <span className="text-[13px] text-slate-400 font-normal shrink-0">({sub.products?.totalCount ?? 0})</span>
                              )}
                            </Link>
                          );
                        })}
                    </div>
                  ) : (
                    <p className="text-slate-400 text-xs italic py-4">Direct category catalog — click View All Categories to browse items.</p>
                  )}
                </div>

                {/* A-Z Vertical Brand Filter Bar */}
                {activeCategory?.isBrandsCategory && (() => {
                  const availableLetters = new Set();
                  activeCategory.children?.edges?.forEach(({ node: sub }) => {
                    if (sub.name) {
                      availableLetters.add(sub.name.charAt(0).toUpperCase());
                    }
                  });

                  return (
                    <div className="absolute right-4 top-8 bottom-8 flex flex-col justify-between items-center text-[11px] font-black text-slate-600">
                      <button
                        onClick={() => setBrandLetterFilter(null)}
                        className={`border-0 bg-transparent cursor-pointer p-0 m-0 hover:text-blue-600 transition-colors ${!brandLetterFilter ? 'text-blue-600' : 'text-slate-600'}`}
                      >
                        ALL
                      </button>
                      {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map(letter => {
                        const isAvailable = availableLetters.has(letter);
                        return (
                          <button
                            key={letter}
                            disabled={!isAvailable}
                            onClick={() => setBrandLetterFilter(letter)}
                            className={`border-0 bg-transparent p-0 m-0 transition-all ${!isAvailable
                              ? 'text-slate-200 cursor-not-allowed font-medium'
                              : `cursor-pointer hover:text-blue-600 hover:scale-125 ${brandLetterFilter === letter ? 'text-blue-600 scale-125' : 'text-slate-600'}`
                              }`}
                          >
                            {letter}
                          </button>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Location Selection Modal */}
      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
      />

    </div>
  );
};

export default StickyHeader;
