import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client/react";
import { Heart, ShoppingCart, Check, Loader2, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { totalValue } from "../../screens/decimalFunction";
import {
  CREATE_CHECKOUT_MUTATION,
  CHECKOUT_ADD_PRODUCT_LINE_MUTATION,
  CHECKOUT_LINE_UPDATE,
} from "../../GraphQL/Mutation";

export interface ProductCardNode {
  id: string;
  name: string;
  slug: string;
  description?: string;
  rating?: number | null;
  media?: Array<{ url: string }>;
  category?: { name?: string };
  productType?: { hasVariants?: boolean };
  metadata?: Array<{ key: string; value: string }>;
  weightedShipping?: number | string | null;
  pricing?: {
    priceRange?: {
      start?: {
        net?: { amount: number };
        gross?: { amount: number };
      };
    };
    priceRangeUndiscounted?: {
      start?: {
        net?: { amount: number };
        gross?: { amount: number };
      };
    };
  };
  variants?: Array<{
    id?: string;
    name?: string;
    quantityAvailable?: number;
    originalPrice?: number | string;
    weightedShipping?: number | string | null;
    pricing?: {
      price?: {
        net?: { amount: number };
      };
      priceUndiscounted?: {
        net?: { amount: number };
      };
      discount?: {
        net?: { amount: number };
      };
    };
  }>;
}

export interface ProductCardProps {
  product: ProductCardNode;
  isInWishlist?: boolean;
  onToggleWishlist?: (id: string, e: React.MouseEvent) => void;
  defaultDiscountBadge?: string;
  className?: string;
  compact?: boolean;
}

const safeFormatPrice = (val: any): string => {
  if (val === undefined || val === null || Number.isNaN(Number(val))) {
    return "0";
  }
  try {
    return totalValue(val);
  } catch {
    return Number(val).toFixed(0);
  }
};

const getDescriptionText = (description?: string): string => {
  if (!description) return "";

  let text = description;

  try {
    const parsed = JSON.parse(description);
    const firstBlock = parsed?.blocks?.find(
      (block: any) => typeof block?.data?.text === "string"
    );
    if (firstBlock?.data?.text) text = firstBlock.data.text;
  } catch {
    // Plain text and HTML descriptions do not need JSON parsing.
  }

  return text
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&quot;/gi, '"')
    .replace(/\s+/g, " ")
    .trim();
};

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isInWishlist = false,
  onToggleWishlist,
  defaultDiscountBadge,
  className = "",
  compact = false,
}) => {
  const navigate = useNavigate();
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isVariantSheetOpen, setIsVariantSheetOpen] = useState(false);
  const [variantFilter, setVariantFilter] = useState("All");

  const [createCheckout] = useMutation<any>(CREATE_CHECKOUT_MUTATION);
  const [addLineCheckout] = useMutation<any>(CHECKOUT_ADD_PRODUCT_LINE_MUTATION);
  const [updateLineCheckout] = useMutation<any>(CHECKOUT_LINE_UPDATE);
  const isCarouselGridCard = className.includes("carousel-grid-card");
  const [showQuantity, setShowQuantity] = useState<Record<string, boolean>>({});
  const [productQuantity, setProductQuantity] = useState<Record<string, number | string>>({});

  useEffect(() => {
    if (!isVariantSheetOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsVariantSheetOpen(false);
    };
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isVariantSheetOpen]);

  let imageUrl =
    product.media && product.media.length > 0
      ? product.media[currentImageIndex]?.url || product.media[0]?.url
      : "";

  // If it's not an S3/absolute URL coming from GraphQL, make it blank
  if (imageUrl && !imageUrl.startsWith("http")) {
    imageUrl = "";
  }

  // Extract manufacturer or brand from attributes
  const brandAttr = (product as any).attributes?.find(
    (a: any) =>
      a.attribute?.slug?.toLowerCase() === "manufacturer" ||
      a.attribute?.name?.toLowerCase() === "brand"
  );
  const brandName = brandAttr?.values?.[0]?.name;

  // Extract Country of Origin
  const originAttr = (product as any).attributes?.find(
    (a: any) =>
      a.attribute?.name?.toLowerCase() === "country of origin" ||
      a.attribute?.slug?.toLowerCase() === "country-of-origin" ||
      a.attribute?.name?.toLowerCase() === "origin"
  );
  const originName = originAttr?.values?.[0]?.name?.toUpperCase();
  let ribbonText = "";
  if (originName?.includes("INDIA")) ribbonText = "Made in India 🇮🇳";
  else if (originName?.includes("KOREA") || originName?.includes("KORIA")) ribbonText = "Made in Korea 🇰🇷";

  const categoryName = product.category?.name || "CLINICAL PRODUCT";
  const descriptionText = getDescriptionText(product.description);

  // Calculate pricing & discount
  const availableVariants = product.variants?.filter(
    (item) => Boolean(item.id) && (item.quantityAvailable ?? 1) > 0
  ) || [];
  let variant = availableVariants[0] || product.variants?.[0];
  if (availableVariants.length > 1) {
    variant = availableVariants.reduce((cheapest, current) => {
      const cheapestPrice = cheapest.pricing?.price?.net?.amount || Number(cheapest.originalPrice) || Infinity;
      const currentPrice = current.pricing?.price?.net?.amount || Number(current.originalPrice) || Infinity;
      return currentPrice < cheapestPrice ? current : cheapest;
    });
  }

  const basePrice = variant?.pricing?.price?.net?.amount || product.pricing?.priceRange?.start?.net?.amount || 0;
  const shipping =
    Number(product.weightedShipping) || Number(variant?.weightedShipping) || 0;
  const finalSellingPrice =
    shipping > 0 && basePrice > shipping ? basePrice - shipping : basePrice;

  const rawOriginalPrice =
    variant?.originalPrice !== undefined && variant.originalPrice !== "0.00"
      ? Number(variant.originalPrice)
      : 0;
  const finalOriginalPrice =
    rawOriginalPrice > finalSellingPrice ? rawOriginalPrice : 0;

  // Compute discount tag
  let discountTag = "";
  if (finalOriginalPrice > finalSellingPrice && finalSellingPrice > 0) {
    const pct = Math.round(
      ((finalOriginalPrice - finalSellingPrice) / finalOriginalPrice) * 100
    );
    if (pct > 0) discountTag = `-${pct}%`;
  } else if (defaultDiscountBadge) {
    discountTag = defaultDiscountBadge;
  }

  const getVariantPricing = (item: NonNullable<ProductCardNode["variants"]>[number]) => {
    const undiscountedPrice =
      Number(item.pricing?.priceUndiscounted?.net?.amount) || 0;
    const productUndiscountedPrice =
      Number(product.pricing?.priceRangeUndiscounted?.start?.net?.amount) || 0;
    const discountAmount =
      Number(item.pricing?.discount?.net?.amount) || 0;

    // Selling price: prefer direct variant price, then undiscounted - discount, then product start price, then item originalPrice
    const basePrice =
      Number(item.pricing?.price?.net?.amount) ||
      (undiscountedPrice > 0 && discountAmount > 0 ? undiscountedPrice - discountAmount : 0) ||
      Number(product.pricing?.priceRange?.start?.net?.amount) ||
      Number(item.originalPrice) ||
      0;

    const variantShipping =
      Number(item.weightedShipping) || Number(product.weightedShipping) || 0;
    const sellingPrice =
      variantShipping > 0 && basePrice > variantShipping
        ? basePrice - variantShipping
        : basePrice;

    // Original MRP price: prefer variant undiscounted, then product undiscounted, then item originalPrice, then product variant originalPrice, then sellingPrice + discountAmount
    const itemOriginal = Number(item.originalPrice) || 0;
    const productVariantOriginal = Number(product.variants?.[0]?.originalPrice) || 0;
    const rawOriginalPrice = Math.max(
      undiscountedPrice,
      productUndiscountedPrice,
      itemOriginal,
      productVariantOriginal,
      sellingPrice > 0 && discountAmount > 0
        ? sellingPrice + discountAmount
        : 0
    );

    const originalPrice =
      rawOriginalPrice > sellingPrice ? rawOriginalPrice : 0;
    const discount =
      originalPrice > sellingPrice && sellingPrice > 0
        ? Math.round(((originalPrice - sellingPrice) / originalPrice) * 100)
        : 0;

    return { itemPrice: sellingPrice, originalPrice, discount };
  };

  const ratingVal =
    product.rating && Number(product.rating) > 0
      ? Number(product.rating).toFixed(1)
      : "4.8";

  const handleAddToCart = (
    e: React.MouseEvent,
    selectedVariantId?: string,
    quantity: number = 1
  ) => {
    e.preventDefault();
    e.stopPropagation();

    const variantId = selectedVariantId || variant?.id;
    if (!variantId) {
      navigate(`/product/${encodeURIComponent(product.slug)}`);
      return;
    }
    console.log("[ProductCard:handleAddToCart]", { productId: product?.id, variantId, quantity });

    setIsAdding(true);
    const existingToken = localStorage.getItem("cartToken");
    const addQuantity = Math.max(1, Math.min(99, Number(quantity) || 1));

    if (!existingToken) {
      const userEmail =
        localStorage.getItem("user") !== null
          ? localStorage.getItem("email") || "hegmakart@gmail.com"
          : "hegmakart@gmail.com";

      createCheckout({
        variables: {
          channel: "default-channel",
          email: userEmail,
          lines: [{ quantity: addQuantity, variantId }],
        },
        onCompleted: (data) => {
          setIsAdding(false);
          if (data?.checkoutCreate?.checkout?.token) {
            localStorage.setItem("cartToken", data.checkoutCreate.checkout.token);
            setJustAdded(true);
            window.dispatchEvent(new CustomEvent("cart-updated"));
            toast.success("Added to Cart", { className: "hk-toast cart-toast" });
            setTimeout(() => setJustAdded(false), 2200);
          } else {
            const message =
              data?.checkoutCreate?.errors?.[0]?.message ||
              "Unable to add this product to the cart";
            toast.error(message, { className: "hk-toast cart-toast" });
          }
        },
        onError: (err) => {
          console.error("Cart creation failed:", err);
          setIsAdding(false);
          toast.error("Unable to add this product to the cart", { className: "hk-toast cart-toast" });
        },
      });
    } else {
      addLineCheckout({
        variables: {
          token: existingToken,
          lines: [{ quantity: addQuantity, variantId }],
        },
        onCompleted: (data) => {
          setIsAdding(false);
          if (data?.checkoutLinesAdd?.errors?.length > 0) {
            localStorage.removeItem("cartToken");
            toast.error(
              data.checkoutLinesAdd.errors[0]?.message || "Unable to add this product to the cart",
              { className: "hk-toast cart-toast" }
            );
          } else {
            setJustAdded(true);
            window.dispatchEvent(new CustomEvent("cart-updated"));
            toast.success("Added to Cart", { className: "hk-toast cart-toast" });
            setTimeout(() => setJustAdded(false), 2200);
          }
        },
        onError: (err) => {
          console.error("Add line failed:", err);
          setIsAdding(false);
          localStorage.removeItem("cartToken");
          toast.error("Unable to add this product to the cart", { className: "hk-toast cart-toast" });
        },
      });
    }
  };

  const handleQuantityChange = (
    variantId: string,
    quantity: number | string
  ) => {
    const nextQuantity = Math.max(1, Math.min(99, Number(quantity) || 1));
    console.log("[ProductCard:handleQuantityChange]", { productId: product?.id, variantId, quantity: nextQuantity });
    const token = localStorage.getItem("cartToken");

    setProductQuantity((prev) => ({
      ...prev,
      [variantId]: nextQuantity,
    }));

    if (!token) return;

    updateLineCheckout({
      variables: {
        token,
        lines: [{ quantity: nextQuantity, variantId }],
      },
      onCompleted: (data) => {
        if (data?.checkoutLinesUpdate?.errors?.length > 0) {
          toast.error(
            data.checkoutLinesUpdate.errors[0]?.message ||
            "Unable to update product quantity",
            { className: "hk-toast cart-toast" }
          );
          return;
        }
        window.dispatchEvent(new CustomEvent("cart-updated"));
      },
      onError: (err) => {
        console.error("Update line failed:", err);
        toast.error("Unable to update product quantity", {
          className: "hk-toast cart-toast",
        });
      },
    });
  };

  return (
    <>
      <style>{`
        .figma-card-wrapper * {
          box-sizing: border-box;
          font-family: 'Outfit', sans-serif;
          border-width: 0;
          border-style: solid;
          border-color: #e5e7eb;
        }
        .figma-card-wrapper :where(p, h3, h1, h2, h4, h5, h6, ul, ol, dl, pre, blockquote, figure, hr) {
          margin: 0;
        }
        .figma-card-wrapper :where(button, input, select, textarea) {
          margin: 0;
          padding: 0;
          background-color: transparent;
          font-family: inherit;
          line-height: inherit;
        }
        .figma-card-wrapper :where(svg) {
          display: block;
          vertical-align: middle;
        }
        .figma-card-wrapper .border-2 {
          border-width: 2px !important;
        }
        .figma-card-wrapper .border-\\[\\#315cfd\\] {
          border-color: #315cfd !important;
        }
        .figma-card-wrapper .text-\\[\\#315cfd\\] {
          color: #315cfd !important;
        }
      `}</style>
      <Link
        to={{ pathname: `/product/${encodeURIComponent(product.slug)}` }}
        className={`no-underline group block figma-card-wrapper ${isCarouselGridCard ? "w-full min-w-0 mr-0" : "w-[175px] min-w-[175px] mr-2 "} transition-all duration-300 hover:-translate-y-2 ${className}`}
        style={{
          textDecoration: "none",
          width: isCarouselGridCard ? "100%" : "175px",
          minWidth: isCarouselGridCard ? "0" : "175px",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative flex h-[300px] min-h-[300px] flex-col rounded-[16px] border border-slate-200 shadow-sm transition-all duration-300 group-hover:border-blue-500 group-hover:shadow-2xl overflow-hidden ml-0 mr-0 gap-0">
          {/* Product Image */}
          <div className="relative w-full h-[130px] flex items-center justify-center bg-white overflow-hidden shrink-0" style={{ padding: '7.5px' }}>
            <img
              src={imageUrl || "/placeholder.jpg"}
              alt={product.name}
              className="w-full h-full object-contain transition-opacity duration-300"
              loading="lazy"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />

            {/* Image Slider Arrows */}
            {isHovered && product.media && product.media.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setCurrentImageIndex((prev) => prev === 0 ? product.media!.length - 1 : prev - 1);
                  }}
                  className="absolute left-1 top-1/2 -translate-y-1/2 bg-white/80 rounded-full w-5 h-5 flex items-center justify-center shadow-sm hover:bg-white text-slate-700 transition-colors z-10"
                >
                  <ChevronLeft size={12} />
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setCurrentImageIndex((prev) => (prev + 1) % product.media!.length);
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full w-5 h-5 flex items-center justify-center shadow-sm hover:bg-white text-slate-700 transition-colors z-10"
                >
                  <ChevronRight size={12} />
                </button>

                {/* Dots */}
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex items-center gap-1 z-10 bg-white/50 px-1.5 py-0.5 rounded-full">
                  {product.media.map((_, i) => (
                    <div key={i} className={`w-1 h-1 rounded-full transition-colors ${i === currentImageIndex ? 'bg-blue-600' : 'bg-slate-400'}`} />
                  ))}
                </div>
              </>
            )}

            {/* Origin Ribbon */}
            {ribbonText && (
              <div className="absolute bottom-0 left-0 bg-blue-50 text-blue-700 border border-blue-200 border-l-0 text-[8px] font-extrabold uppercase tracking-wider px-2 py-[2px] rounded-r-md z-10 shadow-sm flex items-center gap-1">
                {ribbonText}
              </div>
            )}

            {/* Wishlist */}
            {onToggleWishlist && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onToggleWishlist(product.id, e);
                  if (!isInWishlist) {
                    toast.success("Added to Wishlist", {
                      className: "hk-toast wishlist-toast",
                      icon: <Heart size={25} fill="currentColor" strokeWidth={2.5} />,
                    });
                  } else toast.info("Removed from Wishlist", { className: "hk-toast wishlist-toast" });
                }}
                className="absolute top-2 right-2 w-[26.25px] h-[26.25px] bg-white rounded-full shadow flex items-center justify-center hover:scale-110 transition border-none outline-none"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={
                    isInWishlist
                      ? "fill-red-500 text-red-500"
                      : "text-slate-400"
                  }
                >
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
                </svg>
              </button>
            )}
          </div>

          <div className="flex h-[205px] flex-col px-2 pt-2">
            {/* Brand */}
            <p className="text-[11px] font-semibold uppercase text-slate-400 truncate w-[133px] h-[11.25px]">
              {brandName || categoryName || "\u00A0"}
            </p>

            {/* Product Name */}
            <div className="w-full overflow-hidden whitespace-nowrap mt-1" title={product.name}>
              {product.name.length > 20 ? (
                <>
                  {/* Default state: Truncated with ellipsis */}
                  <div className="block group-hover:hidden truncate text-[14px] font-poppins font-medium tracking-wide text-slate-800 leading-tight">
                    {product.name}
                  </div>


                  {/* Card Hover state: Smooth scrolling marquee */}
                  <div className="hidden group-hover:flex w-max animate-[marquee_7s_linear_infinite] leading-tight">
                    <span className="text-[13px] font-poppins font-bold text-slate-1000 pr-8">
                      {product.name}
                    </span>
                    <span
                      className="text-[13px] font-poppins font-medium text-slate-800 pr-8"
                      aria-hidden="true"
                    >
                      {product.name}
                    </span>
                  </div>
                </>
              ) : (
                <div className="truncate text-[14px] font-poppins font-medium text-slate-800 leading-tight">
                  {product.name}
                </div>
              )}


              <style>
                {`
                      @keyframes marquee {
                        from {
                          transform: translateX(0);
                        }
                        to {
                          transform: translateX(-50%);
                        }
                      }
                    `}
              </style>
            </div>
            <span
              className="mt-0.5 h-[28px] w-full overflow-hidden text-[11px] font-normal leading-[14px] text-slate-700 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]"
              title={descriptionText}
            >
              {descriptionText || "\u00A0"}
            </span>
            {/* Price */}
            <div className="flex min-h-[52px] flex-col mt-0.5 shrink-0">
              {finalSellingPrice > 0 ? (
                <>
                  {/* Price Section */}
                  <div className="flex items-baseline gap-2">
                    {/* Selling Price */}
                    <span className="font-['Roboto'] text-[17px] font-semibold tracking-tight text-[#111827]">
                      ₹{safeFormatPrice(finalSellingPrice)}
                    </span>
                    {/* Original Price */}
                    {finalOriginalPrice > finalSellingPrice && (
                      <span className="font-['Outfit'] text-[11px] font-normal leading-none text-[#94A3B8] line-through">
                        ₹{safeFormatPrice(finalOriginalPrice)}
                      </span>
                    )}
                  </div>
                  {/* Savings Badge */}
                  {finalOriginalPrice > finalSellingPrice && (
                    <div className="flex items-center mt-0.5">
                      <span className="inline-flex items-center gap-1 rounded-md bg-[#DCFCE7] px-2 py-1">
                        <span className="font-['Outfit'] text-[10px] font-semibold tracking-tight text-[#15803D]">
                          Save ₹{safeFormatPrice(finalOriginalPrice - finalSellingPrice)}
                        </span>
                        <span className="font-['Outfit'] text-[10px] font-semibold text-[#15803D]">
                          ({Math.round(
                            ((finalOriginalPrice - finalSellingPrice) /
                              finalOriginalPrice) * 100
                          )}% OFF)
                        </span>
                      </span>
                    </div>
                  )}
                </>
              ) : (
                /* Price on Request */
                <span className="font-['Outfit'] text-[14px] font-medium text-[#172554]">
                  Price on request
                </span>
              )}
            </div>

            {/* Rating */}
            {/* <div className="mt-1 h-[18px] flex items-center gap-[2px]">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={10}
                  className={
                    star <= Math.round(Number(ratingVal) || 0)
                      ? "fill-amber-400 text-amber-400 shrink-0"
                      : "text-slate-300 shrink-0"
                  }
                />
              ))}
              <span className="ml-1 text-[12px] text-slate-500 font-extrabold w-[16.91px] h-[18px] inline-flex items-center">
                {ratingVal}
              </span>
            </div> */}

            {/* Button */}
            <div className="mt-0 pt-1 pb-0 flex justify-center">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (availableVariants.length > 1) {
                    console.log("[ProductCard:openVariantSheet]", { productId: product?.id, variantsCount: availableVariants.length });
                    setVariantFilter("All");
                    setIsVariantSheetOpen(true);
                    return;
                  }
                  handleAddToCart(e);
                }}
                disabled={isAdding}
                className={`flex w-[148px] h-[26.25px] items-center justify-center gap-1 rounded-full border-2 text-[10px] font-semibold transition-all duration-300  ${justAdded
                  ? "border-[#315cfd] bg-[#315cfd] text-white shadow-md"
                  : "border-[#315cfd] bg-white text-[#315cfd] hover:bg-[#315cfd] hover:text-white hover:shadow-md active:scale-95"
                  } disabled:opacity-70 disabled:cursor-not-allowed`}
                style={{ margin: '7.5px 0' }}
              >
                {isAdding ? (
                  <>
                    <Loader2 size={11} className="animate-spin" />
                    Adding...
                  </>
                ) : justAdded ? (
                  <>
                    <Check size={11} strokeWidth={2.5} />
                    Added
                  </>
                ) : (
                  <>
                    <ShoppingCart size={11} />
                    <span>Add</span>
                    {availableVariants.length > 1 && (
                      <span className="text-[9px] font-normal opacity-90 tracking-tight whitespace-nowrap">
                        ({availableVariants.length} Variants)
                      </span>
                    )}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </Link>

{isVariantSheetOpen && (
  <div
    className="fixed inset-0 z-[10000] flex items-end bg-slate-950/45 p-0 lg:hidden"
    onClick={() => setIsVariantSheetOpen(false)}
  >
    <div
      className="max-h-[85vh] w-full overflow-y-auto rounded-t-[24px] bg-white px-3 sm:px-4 pb-5 pt-4 shadow-2xl"
      style={{ animation: "variantSheetUp 0.25s ease-out" }}
      onClick={(e) => e.stopPropagation()}
      role="dialog"
      aria-modal="true"
      aria-label={`Choose a variant for ${product.name}`}
    >
      <style>{`
        @keyframes variantSheetUp {
          from {
            transform: translateY(100%);
            opacity: 0.7;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>

      {/* Drag handle */}
      <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-slate-300" />

      {/* Header */}
      <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3">
        <div className="min-w-0">
          <p className="line-clamp-2 text-[18px] sm:text-[21px] font-bold leading-tight text-slate-900">
            {product.name}
          </p>

          <p className="mt-1 text-[11px] sm:text-[12px] text-slate-500">
            Select your preferred variant
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsVariantSheetOpen(false)}
          className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-700"
          style={{
            border: "none",
            outline: "none",
            boxShadow: "none",
          }}
          aria-label="Close variant selector"
        >
          <span className="text-[28px] leading-none">&times;</span>
        </button>
      </div>

      {/* Variant cards */}
      <div className="flex flex-col gap-2 pt-3">
        {availableVariants
          .filter((item) => {
            const name = item.name?.toLowerCase() || "";

            if (variantFilter === "Standard") {
              return name.includes("standard");
            }

            if (variantFilter === "Assorted") {
              return name.includes("assorted");
            }

            return true;
          })
          .map((item) => {
            const {
              itemPrice,
              originalPrice,
              discount,
            } = getVariantPricing(item);

            const sellingPrice = Number(itemPrice) || 0;
            const actualOriginalPrice = Number(originalPrice) || 0;

            const hasDiscount =
              actualOriginalPrice > sellingPrice &&
              actualOriginalPrice > 0;

            const savings = hasDiscount
              ? actualOriginalPrice - sellingPrice
              : 0;

            const discountPercentage = hasDiscount
              ? Math.round(
                  (savings / actualOriginalPrice) * 100
                )
              : 0;

            return (
              <div
                key={item.id}
                className="relative flex min-h-[120px] sm:min-h-[130px] w-full items-center rounded-lg border border-slate-200 bg-white text-left overflow-hidden"
              >
                {/* Product image */}
                <div className="flex h-[100px] w-[88px] sm:h-[110px] sm:w-[120px] shrink-0 items-center justify-center bg-slate-50">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={item.name || product.name}
                      className="h-full w-full object-contain p-1.5 sm:p-2"
                    />
                  ) : (
                    <ShoppingCart
                      size={24}
                      className="text-slate-300"
                    />
                  )}
                </div>

                {/* Product details */}
                <div className="flex min-w-0 flex-1 flex-col justify-center gap-0.5 sm:gap-1 px-2 py-1.5 sm:py-2">

                  {/* Variant name */}
                  <p className="line-clamp-2 text-[12px] sm:text-[14px] font-bold leading-[16px] sm:leading-[19px] text-slate-900">
                    {item.name || product.name}
                  </p>

                  {/* Price Section */}
                  <div className="flex min-h-[46px] sm:min-h-[52px] flex-col mt-0.5 shrink-0 justify-center">
                    {sellingPrice > 0 ? (
                      <>
                        {/* Selling Price and Original Price */}
                        <div className="flex items-baseline gap-1.5 sm:gap-2 flex-wrap">
                          <span className="font-['Roboto'] text-[15px] sm:text-[17px] font-semibold tracking-tight text-[#111827]">
                            ₹{safeFormatPrice(sellingPrice)}
                          </span>

                          {hasDiscount && (
                            <span className="font-['Outfit'] text-[11px] font-normal leading-none text-[#94A3B8] line-through">
                              ₹{safeFormatPrice(actualOriginalPrice)}
                            </span>
                          )}
                        </div>

                        {/* Savings Badge */}
                        {hasDiscount && (
                          <div className="flex items-center mt-0.5">
                            <span className="inline-flex items-center gap-1 rounded-md bg-[#DCFCE7] px-1.5 py-0.5 sm:px-2 sm:py-1 max-w-full">
                              <span className="font-['Outfit'] text-[9.5px] sm:text-[10px] font-semibold tracking-tight text-[#15803D] whitespace-nowrap">
                                Save ₹{safeFormatPrice(savings)}
                              </span>

                              <span className="font-['Outfit'] text-[9.5px] sm:text-[10px] font-semibold text-[#15803D] whitespace-nowrap">
                                ({discountPercentage}% OFF)
                              </span>
                            </span>
                          </div>
                        )}
                      </>
                    ) : (
                      /* Price on Request */
                      <span className="font-['Outfit'] text-[14px] font-medium text-[#172554]">
                        Price on request
                      </span>
                    )}
                  </div>
                </div>

                {/* ADD button / Quantity */}
                <div className="flex w-[70px] sm:w-[100px] shrink-0 items-center justify-center px-1 mt-8">
                  {!showQuantity[item.id] ? (
                    <button
                      type="button"
                      onClick={(event) => {
                        handleAddToCart(event, item.id, 1);

                        setProductQuantity((prev) => ({
                          ...prev,
                          [item.id]: 1,
                        }));

                        setShowQuantity((prev) => ({
                          ...prev,
                          [item.id]: true,
                        }));
                      }}
                     className="flex h-[32px] w-[84px] shrink-0 items-center justify-center gap-1 rounded-[10px] border-0 bg-[#315cfd] text-[11px] font-bold text-white transition-all hover:bg-blue-700 active:scale-95 outline-none mr-5"
                    >
                      <ShoppingCart size={13} />
                      ADD
                    </button>
                  ) : (
                    <div className="flex w-[84px] h-[32px] shrink-0 items-center overflow-hidden rounded-[10px] border border-[#315cfd] bg-white mr-5">

  {/* Minus */}
  <button
    type="button"
    onClick={() => {
      const current = Number(productQuantity[item.id] || 1);
      handleQuantityChange(item.id, Math.max(1, current - 1));
    }}
    className="flex h-full w-[28px] shrink-0 items-center justify-center border-0 bg-white p-0 text-[#01040f] cursor-pointer transition-colors duration-300"
  >
    −
  </button>

  {/* Quantity */}
  <input
    type="text"
    inputMode="numeric"
    value={productQuantity[item.id] ?? 1}
    onChange={(e) => {
      const value = e.target.value.replace(/\D/g, "");

      setProductQuantity((prev) => ({
        ...prev,
        [item.id]: value === "" ? "" : Math.min(99, Number(value)),
      }));
    }}
    onBlur={(e) => {
      handleQuantityChange(item.id, e.target.value);
    }}
    className="h-full min-w-0 flex-1 border-0 bg-white p-0 m-0 text-center text-[14px] font-semibold text-[#111827] outline-none shadow-none focus:border-0 focus:outline-none focus:ring-0"
  />

  {/* Plus */}
  <button
    type="button"
    onClick={() => {
      const current = Number(productQuantity[item.id] || 1);
      handleQuantityChange(item.id, Math.min(99, current + 1));
    }}
    className="flex h-full w-[28px] shrink-0 items-center justify-center border-0 bg-white p-0 text-[#01040f] cursor-pointer transition-colors duration-300 hover:bg-[#315cfd]"
  >
    +
  </button>

</div>
                  )}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  </div>
)}


      {/* Desktop variant sheet */}
      {isVariantSheetOpen && (
        <div
          className="fixed inset-0 z-[10000] hidden items-center justify-center bg-slate-950/45 p-3 lg:flex"
          onClick={() => setIsVariantSheetOpen(false)}
        >
          <div
            className="max-h-[70vh] w-full max-w-[550px] overflow-y-auto rounded-lg bg-white px-3 pb-4 pt-2 xl:px-6"
            style={{ animation: "variantSheetDesktop 0.25s ease-out" }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={`Choose a variant for ${product.name}`}
          >
            <style>{`
        @keyframes variantSheetDesktop {
          from {
            transform: scale(0.96) translateY(12px);
            opacity: 0;
          }
          to {
            transform: scale(1) translateY(0);
            opacity: 1;
          }
        }
      `}</style>

            {/* Header */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-0">
              <div className="min-w-0">
                <p className="line-clamp-2 text-[20px] font-bold leading-tight text-slate-900 xl:text-[28px] ">
                  {product.name}
                </p>
                <p className="mt-1 text-[14px] text-slate-900">
                  Select your preferred variant
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsVariantSheetOpen(false)}
                className="flex h-18 w-18 shrink-0 items-center justify-center bg-transparent border-0 shadow-none outline-none hover:bg-transparent focus:bg-transparent active:bg-transparent -mb-3"
                style={{
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  boxShadow: "none",
                }}
                aria-label="Close variant selector"
              >
                <span className="text-[25px] leading-none text-slate-900">&times;</span>
              </button>
            </div>

            {/* Variant cards */}
            <div className="flex flex-col gap-2 pt-2">
              {availableVariants
                .filter((item) => {
                  const name = item.name?.toLowerCase() || "";

                  if (variantFilter === "Standard") {
                    return name.includes("standard");
                  }

                  if (variantFilter === "Assorted") {
                    return name.includes("assorted");
                  }

                  return true;
                })
                .map((item) => {
                  const { itemPrice, originalPrice, discount } = getVariantPricing(item);
                  const sellingPrice = Number(itemPrice) || 0;
                  const actualOriginalPrice = Number(originalPrice) || 0;
                  const hasDiscount = actualOriginalPrice > sellingPrice && actualOriginalPrice > 0;
                  const savings = hasDiscount ? actualOriginalPrice - sellingPrice : 0;
                  const discountPercentage = hasDiscount
                    ? Math.round((savings / actualOriginalPrice) * 100)
                    : 0;

                  console.log("[ProductCard:desktopVariantPricing]", {
                    productId: product?.id,
                    variantId: item.id,
                    sellingPrice,
                    actualOriginalPrice,
                    hasDiscount,
                    savings,
                    discountPercentage,
                  });

                  return (
                    <div
                      key={item.id}
                      className="relative flex min-h-[110px] w-full shrink-0 items-center overflow-hidden rounded-lg border border-slate-200 bg-white text-left transition-all hover:border-blue-300 hover:shadow-md"
                    >
                      {/* Product image */}
                      <div className="flex h-[110px] w-[120px] shrink-0 items-center justify-center border-r border-slate-100 bg-slate-50 xl:w-[150px]">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={item.name || product.name}
                            className="h-full w-full object-contain p-2"
                          />
                        ) : (
                          <ShoppingCart size={36} className="text-slate-300" />
                        )}
                      </div>

                      <div className="flex min-w-0 flex-1 flex-col justify-center gap-1 px-3 py-2">
                        {/* Variant name */}
                        <p className="line-clamp-2 text-[14px] font-bold text-slate-900 leading-snug">
                          {item.name || product.name}
                        </p>

                        {/* Price Section */}
                        <div className="flex min-h-[46px] sm:min-h-[50px] flex-col justify-center">
                          {sellingPrice > 0 ? (
                            <>
                              {/* Selling Price and Original Price */}
                              <div className="flex items-baseline gap-2 flex-wrap">
                                <span className="font-['Roboto'] text-[17px] font-semibold tracking-tight text-[#111827]">
                                  ₹{safeFormatPrice(sellingPrice)}
                                </span>

                                {hasDiscount && (
                                  <span className="font-['Outfit'] text-[12px] font-normal leading-none text-[#94A3B8] line-through">
                                    ₹{safeFormatPrice(actualOriginalPrice)}
                                  </span>
                                )}
                              </div>

                              {/* Savings Badge */}
                              {hasDiscount && (
                                <div className="flex items-center mt-1">
                                  <span className="inline-flex items-center gap-1.5 rounded-md bg-[#DCFCE7] px-2 py-0.5 max-w-full">
                                    <span className="font-['Outfit'] text-[10px] font-semibold tracking-tight text-[#15803D] whitespace-nowrap">
                                      Save ₹{safeFormatPrice(savings)}
                                    </span>

                                    <span className="font-['Outfit'] text-[10px] font-semibold text-[#15803D] whitespace-nowrap">
                                      ({discountPercentage}% OFF)
                                    </span>
                                  </span>
                                </div>
                              )}
                            </>
                          ) : (
                            <span className="font-['Outfit'] text-[14px] font-medium text-[#172554]">
                              Price on request
                            </span>
                          )}
                        </div>
                      </div>

                      {/* ADD Button / Quantity Control */}
                      <div className="flex shrink-0 items-center justify-center px-4">
                        {!showQuantity[item.id] ? (
                          /* ADD Button */
                          <button
                            type="button"
                            onClick={(event) => {
                              handleAddToCart(event, item.id, 1);
                              setProductQuantity((prev) => ({ ...prev, [item.id]: 1 }));

                              setShowQuantity((prev) => ({
                                ...prev,
                                [item.id]: true,
                              }));
                            }}
                            className="flex h-[38px] min-w-[100px] items-center justify-center gap-2 rounded-lg border-0 bg-[#315cfd] px-4 text-[13px] font-bold text-white transition-all hover:bg-blue-700 active:scale-95 outline-none mt-6"
                          >
                            <ShoppingCart size={15} />
                            ADD
                          </button>
                        ) : (
                          /* Quantity Control */
                          <div className="flex w-[84px] h-[32px] shrink-0 items-center overflow-hidden rounded-[10px] border border-[#315cfd] bg-white">
                            {/* Minus */}
                            <button
                              type="button"
                              onClick={() => {
                                const current = Number(productQuantity[item.id] || 1);
                                handleQuantityChange(item.id, Math.max(1, current - 1));
                              }}
                              className="flex h-full w-[28px] shrink-0 items-center justify-center border-0 bg-white p-0 text-[#01040f] cursor-pointer transition-colors duration-300"
                            >
                              −
                            </button>

                            {/* Quantity */}
                            <input
                              type="text"
                              inputMode="numeric"
                              value={productQuantity[item.id] ?? 1}
                              onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, "");

                                setProductQuantity((prev) => ({
                                  ...prev,
                                  [item.id]: value === "" ? "" : Math.min(99, Number(value)),
                                }));
                              }}
                              onBlur={(e) => {
                                handleQuantityChange(item.id, e.target.value);
                              }}
                              className="h-full min-w-0 flex-1 border-0 bg-white p-0 m-0 text-center text-[14px] font-semibold text-[#111827] outline-none shadow-none focus:border-0 focus:outline-none focus:ring-0"
                            />

                            {/* Plus */}
                            <button
                              type="button"
                              onClick={() => {
                                const current = Number(productQuantity[item.id] || 1);
                                handleQuantityChange(item.id, Math.min(99, current + 1));
                              }}
                              className="flex h-full w-[28px] shrink-0 items-center justify-center border-0 bg-white p-0 text-[#01040f] cursor-pointer transition-colors duration-300 hover:bg-[#315cfd]"
                            >
                              +
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}

    </>
  );
};

export default ProductCard;
