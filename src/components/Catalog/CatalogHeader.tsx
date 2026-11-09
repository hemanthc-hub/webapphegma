import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home, Sparkles, Filter } from "lucide-react";

export interface CategoryNode {
  id: string;
  name: string;
  slug: string;
  products?: {
    totalCount?: number;
  };
}

export interface CatalogHeaderProps {
  title?: string;
  subtitle?: string;
  productCount?: number;
  activeCategoryId?: string;
  onSelectCategory?: (id: string, slug: string) => void;
  categories?: Array<{ node: CategoryNode }>;
  onOpenMobileSidebar?: () => void;
  parentCategory?: { name: string; slug: string } | null;
}

export const CatalogHeader: React.FC<CatalogHeaderProps> = ({
  title = "Clinical Products & Specialties",
  subtitle = "Explore our verified clinical supplies, dental equipment, and specialty materials.",
  productCount = 0,
  activeCategoryId,
  onSelectCategory,
  categories = [],
  onOpenMobileSidebar,
  parentCategory = null,
}) => {
  const location = useLocation();
  const isTopDealsPage = location.pathname.replace(/\/+$/, "") === "/top-deals-and-featured-products";

  return (
    <section className="w-full mb-2">
      {/* Dark Gradient Hero Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 text-white py-3 px-4 md:px-8 border-b border-slate-700/50 relative overflow-hidden shadow-md">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-[95%] mx-auto relative z-10">
          {/* Breadcrumb Navigation */}
          <nav aria-label="breadcrumb" className="flex items-center gap-2 text-slate-300 text-xs md:text-sm mb-1 font-medium">
            <Link
              to="/"
              className="flex items-center gap-1 text-slate-300 hover:text-white no-underline transition-colors"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            {isTopDealsPage ? (
              <span className="text-white font-semibold truncate max-w-[100px] sm:max-w-none">
                Top Deals &amp; Featured Products
              </span>
            ) : parentCategory ? (
              <>
                <Link
                  to={`/category/${parentCategory.slug}`}
                  className="text-slate-300 hover:text-white no-underline transition-colors"
                >
                  {parentCategory.name}
                </Link>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-white font-semibold truncate max-w-[100px] sm:max-w-none">{title}</span>
              </>
            ) : title ? (
              <span className="text-white font-semibold truncate max-w-[100px] sm:max-w-none">{title}</span>
            ) : (
              <span className="text-white font-semibold">Catalog</span>
            )}
          </nav>

          {/* Title & Product Count */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mt-0">
            <div>

              <h1
                className="text-1xl md:text-2xl font-extrabold text-white tracking-tight m-0"
                style={{ fontFamily: "Outfit, sans-serif" }}
              >
                {title}
              </h1>
              {subtitle && (
                <p className="text-slate-300 text-xs md:text-sm mt-1.5 m-0 max-w-3xl leading-relaxed font-normal">
                  {subtitle}
                </p>
              )}
            </div>

            <div className="flex items-center gap-3 shrink-0">
              {/* Product counter badge */}
              <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/15 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-orange-400" />
                <span className="text-sm font-extrabold text-white">
                  {productCount} {productCount === 1 ? "Product" : "Products"} Found
                </span>
              </div>

              {/* Mobile Sidebar Trigger Button */}
              {onOpenMobileSidebar && (
                <button
                  type="button"
                  onClick={onOpenMobileSidebar}
                  className="lg:hidden inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm px-4 py-2 rounded-2xl shadow-md transition-colors cursor-pointer"
                >
                  <Filter className="w-4 h-4" />
                  <span>Filters</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

    </section>
  );
};

export default CatalogHeader;
