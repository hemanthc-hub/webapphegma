import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard, { ProductCardNode } from "../Catalog/ProductCard";

export interface ProductEdge {
  node: ProductCardNode;
}

interface ProductCarouselProps {
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  products?: ProductEdge[];
  viewAllLink?: string;
  wishlist?: string[];
  onToggleWishlist?: (id: string, e: React.MouseEvent) => void;
  defaultDiscountBadge?: string;
}

const ProductCarousel: React.FC<ProductCarouselProps> = ({
  title = "Top Deals & Featured Products",
  subtitle,
  icon = "🔥",
  products = [],
  viewAllLink = "/top-deals-and-featured-products",
  wishlist = [],
  onToggleWishlist,
  defaultDiscountBadge = "-15%",
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const displayProducts = products.filter((item) => item?.node?.id);

  if (displayProducts.length === 0) {
    return null;
  }

  const scroll = (direction: "left" | "right") => {
    scrollRef.current?.scrollBy({
      left: direction === "right" ? 340 : -340,
      behavior: "smooth",
    });
  };

  return (
    <section className="w-full max-w-[98%] ml-0 mr-auto mt-4 mb-0" aria-label={title}>
      <>
        <div className="hidden md:block">
          <div className="flex items-center justify-between w-full border-b border-slate-200/80 pb-1 mb-1 px-4">
            <div className="flex-1">
              <h2
                className="text-[13.5px] font-black text-slate-900 flex items-center gap-2"
                style={{ fontFamily: "Outfit, sans-serif" }}
              >
                {icon && <span className="text-2xl">{icon}</span>}
                <span>{title}</span>
              </h2>

              {subtitle && (
                <p className="text-xs text-slate-500 mt-1 m-0">
                  {subtitle}
                </p>
              )}
            </div>

            <Link
  to={viewAllLink}
  className="inline-flex items-center gap-1 text-blue-600 text-base font-medium no-underline -mr-6 "
>
  View All
  <ChevronRight className="w-3 h-3" />
</Link>
          </div>
          <div ref={scrollRef} className="flex gap-0 overflow-x-auto overflow-y-visible px-6 pb-3 ml-2 mr-2 xl:grid xl:grid-cols-7 xl:gap-3 xl:overflow-x-visible" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
            {displayProducts.slice(0, 7).map((item, index) => {
              const product = item?.node;
              if (!product?.id) return null;
              return (
                <div key={product.id || `featured-${index}`} className="shrink-0 mr-2 xl:mr-0">
                  <ProductCard
                    product={product}
                    isInWishlist={wishlist.includes(product.id)}
                    onToggleWishlist={onToggleWishlist}
                    defaultDiscountBadge={defaultDiscountBadge}
                    className="carousel-grid-card"
                  />
                </div>
              );
            })}
          </div>
        </div>
        <div className="block md:hidden">
          {/* Header */}
          <div className="flex items-center justify-between w-full border-b border-slate-200/80 pb-1 mb-0 px-0 -mt-3">
            <div className="flex-1 min-w-0 mt-2">
              <h2
                className="text-[13.5px] font-black text-slate-900 flex items-center gap-1 leading-tight "
                style={{ fontFamily: "Outfit, sans-serif" }}
              >
                {icon && <span className="shrink-0">{icon}</span>}
                <span>{title}</span>
              </h2>

              {subtitle && (
                <p className="text-[10px] text-slate-500 mt-1 mb-1">
                  {subtitle}
                </p>
              )}
            </div>

            <Link
  to={viewAllLink}
  className="-mt-2 -mr-0 text-blue-600 font-bold text-[10px] no-underline flex items-center gap-1"
>
  View All
  <ChevronRight className="w-5 h-5" />
</Link>
          </div>

          {/* Products Slider */}
          <div
            ref={scrollRef}
            className="flex gap-2 overflow-x-auto overflow-y-visible ml-3 px-2 pb-2 no-scrollbar"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {displayProducts.map((item, index) => {
              const product = item?.node;
              if (!product?.id) return null;

              return (
                <div key={product.id || `featured-${index}`} className="shrink-0 ">
                  <ProductCard
                    product={product}
                    isInWishlist={wishlist.includes(product.id)}
                    onToggleWishlist={onToggleWishlist}
                    defaultDiscountBadge={defaultDiscountBadge}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </>
    </section>
  );
};

export default ProductCarousel;
