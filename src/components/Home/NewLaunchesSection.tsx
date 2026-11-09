import { Link } from "react-router-dom";
import { Sparkles, ChevronRight, ArrowUpRight, Flame } from "lucide-react";
import ProductCard, { ProductCardNode } from "../Catalog/ProductCard";
import React, { useState, useEffect } from "react";



interface ProductEdge {
  node: ProductCardNode;
}

interface NewLaunchesSectionProps {
  products?: ProductEdge[];
  collectionSlug?: string;
  onQuickView?: (product: any) => void;
  wishlist?: string[];
  onToggleWishlist?: (id: string, e: React.MouseEvent) => void;
}
const promotionalBanners = [
  {
    id: 1,
    title: "Next-Gen 3D RVG Sensor Pro",
    subtitle: "Ultra-high digital resolution with IP68 waterproof sensor casing",
    tag: "Just Launched",
    bgGradient: "from-blue-900 via-indigo-900 to-slate-900",
    image: "https://hegmadental.s3.amazonaws.com/products/16_c4fe1b73.jpg",
    link: "/search/RVG",
  },
  {
    id: 2,
    title: "Ergo-Pulse Portable DC X-Ray",
    subtitle: "Zero-scatter lead shielding with lightweight handheld mobility",
    tag: "Clinical Innovation",
    bgGradient: "from-slate-900 via-purple-950 to-indigo-950",
    image: "https://hegmadental.s3.amazonaws.com/products/19_01f76d44.jpg",
    link: "/search/X-Ray",
  },
  {
    id: 3,
    title: "Apex-Pro Ultra Rotary Engine",
    subtitle: "Brushless silent torque control with continuous reciprocating modes",
    tag: "Trending",
    bgGradient: "from-emerald-950 via-slate-900 to-blue-950",
    image: "https://hegmadental.s3.amazonaws.com/products/18_922dd5c6.jpg",
    link: "/search/Rotary",
  },
];

export const NewLaunchesSection: React.FC<NewLaunchesSectionProps> = ({

  products = [],
  collectionSlug,
  wishlist = [],
  onToggleWishlist,

}) => {
  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % promotionalBanners.length);
    }, 5000); // 5 seconds

    return () => clearInterval(interval);
  }, []);
  return (
    <section className="w-full max-w-[98%] mx-auto mb-0 mt-3" aria-label="New Clinical Launches">
      {/* Header */}
      <div className="marquee" style={{ animationDirection: "reverse" }}>

        {/* Mobile Header */}
        <div className="block md:hidden">
          <div className="px-3 pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2 mb-1 ml-0">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-orange-500/10 text-orange-600">
                <Sparkles className="w-3 h-3 animate-pulse" />
              </span>

              <span className="text-[12px] font-black tracking-widest uppercase text-orange-600">
                Clinical Innovation Showcase
              </span>
            </div>

            <h2
              className="text-lg font-black text-slate-900 mb-1 ml-2"
              style={{ fontFamily: "Outfit, sans-serif" }}
            >
              New Clinical Launches <span className="text-blue-600">&</span> Advanced Tech
            </h2>

            {/* Left aligned */}
            <div className="flex justify-start ml-2">
              <Link to="/search/all" className="inline-flex items-center gap-1 text-lg font-bold text-blue-600 no-underline" >
                Explore All Launches
                <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
          <div className="mt-1 px-3 md:hidden">
            {promotionalBanners.length > 0 && (
              <Link
                key={promotionalBanners[currentBanner].id}
                to={promotionalBanners[currentBanner].link}
                className="relative block h-[170px] rounded-2xl overflow-hidden"
              >
                <img
                  src={promotionalBanners[currentBanner].image}
                  alt={promotionalBanners[currentBanner].title}
                  className="absolute inset-0 w-full h-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                  <span className="inline-block px-2 py-1 rounded-full bg-orange-500 text-white text-[10px] font-bold mb-2">
                    {promotionalBanners[currentBanner].tag}
                  </span>

                  <h3
                    className="text-white text-base font-black"
                    style={{ fontFamily: "Outfit, sans-serif" }}
                  >
                    {promotionalBanners[currentBanner].title}
                  </h3>
                </div>
              </Link>
            )}
          </div>
        </div>
        {/* Desktop Section */}
        <div className="hidden md:block">
          {/* Header */}
          <div className="flex items-end justify-between px-4 border-b border-slate-100 pb-1">
            <div>
              <div className="flex items-center gap-2 mb-1.5 ml-4">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-orange-500/10 text-orange-600">
                  <Sparkles className="w-4 h-4 animate-pulse" />
                </span>

                <span className="text-xs font-black tracking-widest uppercase text-orange-600">
                  Clinical Innovation Showcase
                </span>
              </div>

              <h2
                className="text-[13.5px] font-black text-slate-900 m-0 tracking-tight ml-3"
                style={{ fontFamily: "Outfit, sans-serif" }}
              >
                New Clinical Launches <span className="text-blue-600">&</span> Advanced Tech
              </h2>
            </div>

            <Link
              to="/search/all"
              className="inline-flex items-center gap-1.5 px-1 py-2 text-slate-700 hover:text-blue-600 text-sm font-bold no-underline transition-all duration-200"
            >
              <span>Explore All Launches</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Banner */}
          <div className="mt-3 px-4">
            {promotionalBanners.length > 0 && (
              <Link
                key={promotionalBanners[currentBanner].id}
                to={promotionalBanners[currentBanner].link}
                className="relative block h-[260px] lg:h-[320px] rounded-3xl overflow-hidden"
              >
                <img
                  src={promotionalBanners[currentBanner].image}
                  alt={promotionalBanners[currentBanner].title}
                  className="absolute inset-0 w-full h-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-8 z-10">
                  <span className="inline-block px-4 py-2 rounded-full bg-orange-500 text-white text-sm font-bold mb-4">
                    {promotionalBanners[currentBanner].tag}
                  </span>

                  <h3
                    className="text-white text-3xl lg:text-4xl font-black mb-2"
                    style={{ fontFamily: "Outfit, sans-serif" }}
                  >
                    {promotionalBanners[currentBanner].title}
                  </h3>
                </div>
              </Link>
            )}
          </div>
        </div>

      </div>

      {/* Live GraphQL Products in this Launch Section (if provided) */}
      {products && products.length > 0 && (
        <>
          {/* Mobile */}
          <div className="block lg:hidden mt-4 px-2 -mt-3">
            <div className="flex items-center gap-2 mb-2">
              {/* <Flame className="w-7 h-7 text-orange-500 " /> */}
              <span className="text-2xl">🔥</span>
              <h2 className="text-[13.5px] font-bold text-slate-800 m-0">
                Featured Clinical Arrivals (Live Feed)
              </h2>

              <Link
                to={collectionSlug ? `/collection/${encodeURIComponent(collectionSlug)}?view=featured-clinical-arrivals` : "/search/all"}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold no-underline ml-auto"
              >
                <span className="text-blue-600">View All</span>
                <ChevronRight className="w-4 h-4 text-blue-600" />
              </Link>
            </div>

            <div
              className="featured-clinical-products flex gap-2 px-0 overflow-x-auto pt-2 pb-12 overflow-y-visible -mr-0 ml-3"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              {products.slice(0, 7).map((item) => (
                <div key={item.node.id} className="shrink-0">
                  <ProductCard
                    product={item.node}
                    isInWishlist={wishlist.includes(item.node.id)}
                    onToggleWishlist={onToggleWishlist}
                    defaultDiscountBadge="-15%"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Desktop */}
          <div className="hidden lg:block mt-4 px-1 ml-0">
            <div className="flex items-center gap-2 mb-2 pl-3 px-2">
              <span className="text-4xl ">🔥</span>
              <h2 className="text-[13.5px] font-bold text-slate-800 m-0 -ml-10">
                Featured Clinical Arrivals (Live Feed)
              </h2>

              <Link
                to={collectionSlug ? `/collection/${encodeURIComponent(collectionSlug)}?view=featured-clinical-arrivals` : "/search/all"}
                className="flex items-center gap-1 text-[9px] font-semibold text-blue-600 ml-auto  px-2 py-1"
              >
                View All
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div
              className="flex gap-2 px-4 overflow-x-auto pt-2 pb-12 pr-2 overflow-y-visible ml-1"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              {products.slice(0, 7).map((item) => (
                <div key={item.node.id} className="shrink-0">
                  <ProductCard
                    product={item.node}
                    isInWishlist={wishlist.includes(item.node.id)}
                    onToggleWishlist={onToggleWishlist}
                    defaultDiscountBadge="-15%"
                  />
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </section>
  );
};

export default NewLaunchesSection;
