import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@apollo/client/react";
import { GET_TOP_CATEGORIES } from "../../GraphQL/Queries";
import { ChevronRight, ChevronLeft } from "lucide-react";

interface MetadataItem {
  key: string;
  value: string;
}

interface CategoryNode {
  id: string;
  name: string;
  slug: string;
  description?: string;
  products?: {
    totalCount: number;
  };
  backgroundImage?: {
    url: string;
    alt?: string;
  };
  metadata?: MetadataItem[];
}

interface CategoryEdge {
  node: CategoryNode;
}

interface TopCategoriesProps {
  className?: string;
}

// Local category artwork used when a category has no uploaded background image.
const fallbackImages = [
  "/assets/images/categories/Instruments.jpg",
  "/assets/images/categories/Endomotors.png",
  "/assets/images/categories/Implant Prosthetics.png",
];

const getCategoryImage = (category: CategoryNode, index: number): string => {
  const lower = (category.name || "").toLowerCase();
  const slug = (category.slug || "").toLowerCase();

  if (category.backgroundImage?.url?.startsWith("http")) {
    return category.backgroundImage.url;
  }

  const fallbackIndex =
    lower.includes("endo") || slug.includes("endo") || lower.includes("motor") || slug.includes("motor")
      ? 1
      : lower.includes("implant") || slug.includes("implant") || lower.includes("prosthet") || slug.includes("prosthet")
        ? 2
        : lower.includes("instrument") || slug.includes("instrument")
          ? 0
          : index % fallbackImages.length;

  return `${process.env.PUBLIC_URL || ""}${fallbackImages[fallbackIndex]}`;
};

export const TopCategories: React.FC<TopCategoriesProps> = ({ className = "" }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollRefMobile = useRef<HTMLDivElement>(null);

  const { data, loading, error } = useQuery<{ categories: { edges: CategoryEdge[] } }>(GET_TOP_CATEGORIES, {
    variables: { first: 30 },
    fetchPolicy: "cache-and-network"
  });

  const categories: CategoryNode[] = data?.categories?.edges?.map(edge => edge.node) || [];

  const scroll = (dir: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: dir === "right" ? 320 : -320,
        behavior: "smooth",
      });
    }
  };

  const getMetaValue = (cat: CategoryNode, key: string): string | null => {
    if (!cat.metadata || !Array.isArray(cat.metadata)) return null;
    const found = cat.metadata.find(m => m.key.toLowerCase() === key.toLowerCase());
    return found ? found.value : null;
  };

  // 1. Filter out inactive categories
  const activeCategories = categories.filter(cat => {
    const isActive = getMetaValue(cat, "is_active");
    if (isActive === "false" || isActive === "0" || isActive === "no") return false;
    return true;
  });

  // 2. Sort by custom database table metadata ('sort_order' or 'order') or product count
  const hasCustomMetadata = activeCategories.some(cat => {
    const isTop = getMetaValue(cat, "is_top_category");
    const sortOrder = getMetaValue(cat, "sort_order") || getMetaValue(cat, "order") || getMetaValue(cat, "top_order");
    return isTop === "true" || sortOrder !== null;
  });

  let displayCategories: CategoryNode[] = [];

  if (hasCustomMetadata) {
    const promoted = activeCategories.filter(cat => {
      const isTop = getMetaValue(cat, "is_top_category");
      const sortOrder = getMetaValue(cat, "sort_order") || getMetaValue(cat, "order") || getMetaValue(cat, "top_order");
      return isTop === "true" || sortOrder !== null;
    });

    displayCategories = promoted.sort((a, b) => {
      const orderValA = getMetaValue(a, "sort_order") || getMetaValue(a, "order") || getMetaValue(a, "top_order");
      const orderValB = getMetaValue(b, "sort_order") || getMetaValue(b, "order") || getMetaValue(b, "top_order");
      const numA = orderValA !== null && !isNaN(Number(orderValA)) ? Number(orderValA) : 999;
      const numB = orderValB !== null && !isNaN(Number(orderValB)) ? Number(orderValB) : 999;
      return numA - numB;
    });
  } else {
    // Graceful fallback before DB metadata is added
    displayCategories = [...activeCategories]
      .filter(cat => (cat.products?.totalCount || 0) > 0)
      .sort((a, b) => (b.products?.totalCount || 0) - (a.products?.totalCount || 0));

    if (displayCategories.length === 0) {
      displayCategories = activeCategories.slice(0, 15);
    }
  }

  // Display top items in scrolling row
  displayCategories = displayCategories.slice(0, 15);

  if (loading && displayCategories.length === 0) {
    return (
      <section className={`w-full max-w-[95%] mx-auto mb-0 mt-4 ${className}`}>
        <div className="h-7 w-48 bg-slate-200 rounded animate-pulse mb-4"></div>
        <div className="flex gap-4 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="w-[140px] h-[175px] bg-slate-100 rounded-2xl animate-pulse shrink-0"></div>
          ))}
        </div>
      </section>
    );
  }

  if (error || displayCategories.length === 0) {
    return null;
  }

  return (
    <section className={`w-full max-w-[95%] mx-auto mb-0 mt-4 ${className}`} aria-label="Top Categories">
      {/* Desktop & Tablet View */}
      <div className="hidden md:block mb-4">
        <div className="flex items-center justify-between mb-2 px-1 ">
          <h2
            className="text-[13.5px] font-bold text-slate-900 flex items-center gap-2 m-0 tracking-tight mb-20"
            style={{ fontFamily: "Outfit, sans-serif" }}
          >
            Top Categories
          </h2>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
            </div>
            <Link
              to="/category/dental-equipments"
              className="flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors no-underline ml-2"
            >
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Categories Horizontal Scroll */}
      <div
  ref={scrollRef}
  className="flex gap-3 overflow-x-auto overflow-y-visible pt-2 pb-1 pl-4 px-1 max-w-[1280px]"
  style={{
    scrollbarWidth: "none",
    msOverflowStyle: "none",
  }}
>
          {displayCategories.map((category, idx) => {
            const imageUrl = getCategoryImage(category, idx);

            return (
              <Link
                key={category.id || idx}
                to={`/category/${category.slug}`}
                className="group no-underline shrink-0"
              >
              <div className="brand-card w-[119px] h-[145px] bg-white rounded-2xl border border-slate-200 shadow-[0_4px_20px_rgba(0,0,0,0.04)] flex flex-col items-center justify-center p-1 cursor-pointer">
                  <div className="w-[90px] h-[90px] rounded-2xl bg-white flex items-center justify-center transition-transform duration-300 group-hover:scale-110 overflow-hidden">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={category.name}
                        className="w-full h-full object-contain max-h-[80px]"
                      />
                    ) : (
                      <div className="w-full h-full rounded-2xl"></div>
                    )}
                  </div>
                  <span className="text-lg font-bold text-slate-700 text-center line-clamp-2 w-full px-1 group-hover:text-blue-600 transition-colors  leading-tight" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    {category.name}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
      {/* Mobile View */}
      <div className="block md:hidden w-full">
        <div className="flex items-center justify-between mb-2">
          <h2
            className="text-[13.5px] font-bold text-slate-900 m-0 tracking-tight "
            style={{ fontFamily: "Outfit, sans-serif" }}
          >
            Top Categories
          </h2>

          <Link
            to="/category/dental-equipments"
            className="inline-flex items-center gap-1 text-blue-600 text-[11px] font-bold no-underline transition-all duration-300 hover:text-blue-700"
          >
            View All
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>

        <div
          ref={scrollRefMobile}
          className="flex gap-2 overflow-x-auto overflow-y-visible pt-1 pb-2"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {displayCategories.map((category, idx) => {
            const imageUrl = getCategoryImage(category, idx);

            return (
              <Link
                key={category.id || idx}
                to={`/category/${category.slug}`}
                className="no-underline shrink-0"
              >
                <div className="brand-card w-[90px] h-[105px] bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center p-2 cursor-pointer group hover:border-2 hover:!border-blue-600">
                  <div className="w-[55px] h-[55px] flex items-center justify-center bg-white overflow-hidden transition-transform duration-300 group-hover:scale-105">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={category.name}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="w-full h-full"></div>
                    )}
                  </div>

                  <div className="mt-1 h-8 flex items-center justify-center">
                    <span
                      className="text-[10px] font-medium text-center text-slate-700 leading-tight line-clamp-2"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {category.name}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TopCategories;
