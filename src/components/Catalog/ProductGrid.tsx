import React from "react";
import { Link } from "react-router-dom";
import { Star, Heart, Eye, ArrowRight, PackageOpen, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { totalValue } from "../../screens/decimalFunction";
import ProductCard from "./ProductCard";

export interface ProductVariant {
  originalPrice?: number | string;
  weightedShipping?: number | null;
}

export interface ProductNode {
  id: string;
  name: string;
  slug: string;
  rating?: number | null;
  media?: Array<{ url: string }>;
  category?: { name: string };
  productType?: { hasVariants: boolean };
  weightedShipping?: number | null;
  pricing?: {
    priceRange: {
      start: {
        net: { amount: number };
        gross?: { amount: number };
      };
    };
  };
  variants?: ProductVariant[];
}

export interface ProductEdge {
  node: ProductNode;
}

export interface ProductGridProps {
  products?: ProductEdge[];
  loading?: boolean;
  wishlistIds?: string[];
  onToggleWishlist?: (productId: string, isInWishlist: boolean, e: React.MouseEvent) => void;
  onOpenQuickView?: (slug: string) => void;
  totalCount?: number;
  itemsCount?: number | string;
  onCountChange?: (newCount: number | string) => void;
  onLoadMore?: () => void;
  isLoadingMore?: boolean;
  hasNextPage?: boolean;
  searchKeyword?: string;
  viewMode: "grid" | "list";
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

export const ProductGrid: React.FC<ProductGridProps> = ({
  products = [],
  loading = false,
  wishlistIds = [],
  onToggleWishlist,
  onOpenQuickView,
  totalCount,
  itemsCount = 20,
  onCountChange,
  onLoadMore,
  isLoadingMore,
  hasNextPage,
  searchKeyword,
  viewMode,
}) => {
  const getDiscount = (node: ProductNode) => {
    const basePrice = node.pricing?.priceRange?.start?.net?.amount || 0;
    const variant = node.variants?.[0];
    const shipping = Number(node.weightedShipping) || Number(variant?.weightedShipping) || 0;
    const finalSellingPrice = shipping > 0 && basePrice > shipping ? basePrice - shipping : basePrice;
    let originalPrice = Number(variant?.originalPrice) || 0;
    if (!originalPrice || originalPrice <= finalSellingPrice) originalPrice = 0;
    if (originalPrice > finalSellingPrice) {
      return Math.round(((originalPrice - finalSellingPrice) / originalPrice) * 100);
    }
    return 0;
  };

  let displayProducts = [...products];
  const isOffersPage = searchKeyword && (searchKeyword.toLowerCase().includes("top deals") || searchKeyword.toLowerCase().includes("offer") || searchKeyword.toLowerCase().includes("deal"));

  if (isOffersPage) {
    displayProducts.sort((a, b) => getDiscount(b.node) - getDiscount(a.node));
  }

  // Calculate pricing logic following existing business rules
  const renderPricing = (node: ProductNode) => {
    if (!node.pricing?.priceRange?.start?.net?.amount) {
      return <span className="text-slate-900 font-extrabold text-lg">Price on request</span>;
    }

    const basePrice = node.pricing.priceRange.start.net.amount;
    const hasVariants = node.productType?.hasVariants;
    const variant = node.variants && node.variants[0];

    if (!hasVariants || !variant) {
      const shipping = Number(node.weightedShipping) || Number(variant?.weightedShipping) || 0;
      const finalPrice = shipping > 0 ? basePrice - shipping : basePrice;
      const original = variant?.originalPrice !== undefined ? Number(variant.originalPrice) : basePrice;
      const showOld = original > finalPrice && original !== 0;

      return (
        <div className="flex items-baseline gap-2">
          <span className="text-slate-900 font-black text-lg sm:text-xl tracking-tight">
            ₹{safeFormatPrice(finalPrice)}
          </span>
          {showOld && (
            <span className="text-slate-400 text-xs sm:text-sm line-through font-medium">
              ₹{safeFormatPrice(original - (shipping > 0 ? shipping : 0))}
            </span>
          )}
        </div>
      );
    } else {
      // Variants range pricing
      return (
        <div className="flex flex-wrap items-baseline gap-1.5">
          <span className="text-xs font-extrabold text-blue-600 uppercase tracking-wide">From</span>
          <span className="text-slate-900 font-black text-lg sm:text-xl tracking-tight">
            ₹{safeFormatPrice(basePrice)}
          </span>
        </div>
      );
    }
  };

  return (
    <div className="catalog-product-grid flex-1 w-full min-w-0">
      {/* Loading Skeleton */}
      {loading && products.length === 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-4 max-sm:justify-items-center animate-pulse">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
            <div
              key={i}
              className="w-full bg-white rounded-2xl sm:rounded-3xl p-2.5 sm:p-4 border border-slate-200/60 h-64 sm:h-80 flex flex-col justify-between"
            >
              <div className="w-full h-40 bg-slate-200 rounded-2xl mb-4" />
              <div className="space-y-2">
                <div className="w-3/4 h-4 bg-slate-200 rounded-md" />
                <div className="w-1/2 h-4 bg-slate-200 rounded-md" />
              </div>
              <div className="w-full h-10 bg-slate-200 rounded-xl mt-4" />
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && products.length === 0 && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center my-8 shadow-xs max-w-2xl mx-auto">
          <div className="w-20 h-20 bg-slate-50 border border-slate-200/60 rounded-3xl flex items-center justify-center mx-auto mb-5 shadow-inner">
            <PackageOpen className="w-10 h-10 text-slate-400" />
          </div>
          <h3 className="text-xl font-extrabold text-slate-800 mb-2" style={{ fontFamily: "Outfit, sans-serif" }}>
            No matching dental products found
          </h3>
          <p className="text-slate-500 text-sm max-w-md mx-auto mb-6 leading-relaxed">
            We couldn&apos;t find products matching your exact clinical filters. Please check your search parameters or speak directly with our supply experts at <strong className="text-slate-800">+91 8553666877 / 977</strong> for tailored catalog assistance.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm px-6 py-3 rounded-2xl shadow-md transition-all no-underline"
          >
            <Sparkles className="w-4 h-4 text-orange-300" />
            <span>Return to Catalog Discovery</span>
          </Link>
        </div>
      )}

      {/* Product Grid View */}
      {viewMode === "grid" && displayProducts.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          {displayProducts.map(({ node }) => (
            <div key={node.id} className="h-full min-w-0">
              <ProductCard
                product={node as any}
                className="carousel-grid-card"
                isInWishlist={wishlistIds.includes(node.id)}
                onToggleWishlist={(id, e) => {
                  if (onToggleWishlist) {
                    onToggleWishlist(id, wishlistIds.includes(id), e);
                  }
                }}
                defaultDiscountBadge="-18%"
              />
            </div>
          ))}
        </div>
      )}

      {/* Product List View */}
      {viewMode === "list" && displayProducts.length > 0 && (
        <div className="flex flex-col gap-4">
          {displayProducts.map(({ node }) => {
            const isInWishlist = wishlistIds.includes(node.id);
            const imageUrl = node.media && node.media.length > 0 ? node.media[0].url : "/assets/images/logo.svg";

            return (
              <div
                key={node.id}
                className="group bg-white rounded-3xl border border-slate-200/70 hover:border-blue-500/30 p-4 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col sm:flex-row items-center gap-6"
              >
                {/* Image */}
                <Link
                  to={{ pathname: `/product/${encodeURIComponent(node.slug)}` }}
                  className="w-full sm:w-48 aspect-square rounded-2xl bg-slate-50 shrink-0 overflow-hidden relative block"
                >
                  <img
                    src={imageUrl}
                    alt={node.name}
                    className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500 ease-out"
                    loading="lazy"
                  />
                </Link>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  {node.category?.name && (
                    <span className="inline-block text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md mb-2 uppercase tracking-wider">
                      {node.category.name}
                    </span>
                  )}

                  <Link
                    to={{ pathname: `/product/${encodeURIComponent(node.slug)}` }}
                    className="block text-slate-800 hover:text-blue-600 font-extrabold text-base sm:text-lg no-underline transition-colors mb-2"
                  >
                    {node.name}
                  </Link>

                  {node.rating && node.rating > 0 && (
                    <div className="flex items-center gap-1 mb-3">
                      <span className="inline-flex items-center gap-1 bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded-md text-xs font-extrabold text-amber-700">
                        {Number(node.rating).toFixed(1)}
                        <Star className="w-3 h-3 text-amber-500 fill-current" />
                      </span>
                    </div>
                  )}

                  <div className="mt-2">{renderPricing(node)}</div>
                </div>

                {/* Action Buttons */}
                <div className="flex sm:flex-col items-center justify-end gap-3 w-full sm:w-48 shrink-0 border-t sm:border-t-0 pt-4 sm:pt-0 border-slate-100">
                  <Link
                    to={{ pathname: `/product/${encodeURIComponent(node.slug)}` }}
                    className="flex-1 sm:w-full inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 !text-white hover:!text-white font-extrabold text-xs sm:text-sm py-3 px-4 rounded-2xl no-underline text-center transition-colors"
                  >
                    <span className="!text-white hover:!text-white">
                      SELECT OPTIONS
                    </span>
                    <ArrowRight className="w-4 h-4 !text-white" />
                  </Link>

                  <div className="flex items-center gap-2 w-full justify-end sm:justify-center">
                    <button
                      type="button"
                      onClick={(e) => {
                        if (onToggleWishlist) {
                          onToggleWishlist(node.id, isInWishlist, e);
                          if (!isInWishlist) {
                            toast.success("Added to Wishlist", {
                              className: "hk-toast wishlist-toast",
                              icon: <Heart size={25} fill="currentColor" strokeWidth={2.5} />,
                            });
                          } else {
                            toast.info("Removed from Wishlist", { className: "hk-toast wishlist-toast" });
                          }
                        }
                      }}
                      className={`flex-1 sm:w-full py-2 px-3 rounded-xl border flex items-center justify-center gap-1.5 font-bold text-xs transition-colors cursor-pointer ${isInWishlist
                        ? "bg-rose-50 border-rose-200 text-rose-600"
                        : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600"
                        }`}
                    >
                      <Heart className={`w-5 h-5 stroke-[2.2] ${isInWishlist ? "fill-current" : ""}`} />
                      <span>{isInWishlist ? "Watchlisted" : "Watchlist"}</span>
                    </button>

                    {onOpenQuickView && (
                      <button
                        type="button"
                        onClick={() => onOpenQuickView(node.slug)}
                        className="py-2 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        title="Quick View"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Load More Button */}
      {products.length > 0 && hasNextPage && onLoadMore && (
        <div className="mt-10 pt-6 border-t border-slate-200 flex items-center justify-center">
          <button
            type="button"
            disabled={isLoadingMore}
            onClick={onLoadMore}
            className={`inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl font-extrabold text-sm sm:text-base transition-all shadow-sm cursor-pointer ${isLoadingMore
              ? "bg-blue-600/80 text-white cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white hover:shadow-md"
              }`}
          >
            {isLoadingMore ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Loading Products...</span>
              </>
            ) : (
              <span>Load More Products</span>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
