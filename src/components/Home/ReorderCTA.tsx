import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@apollo/client/react";
import {
  Activity,
  Camera,
  Cog,
  Lightbulb,
  Syringe,
  Wrench,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import { GET_TOP_CATEGORIES } from "../../GraphQL/Queries";

interface CategoryNode {
  id: string;
  name: string;
  slug: string;
  backgroundImage?: {
    url?: string;
    alt?: string;
  } | null;
  metadata?: Array<{ key: string; value: string }>;
}

interface CategoryEdge {
  node: CategoryNode;
}

interface ReorderCTAProps {
  className?: string;
}

const getCategoryIcon = (name: string): LucideIcon => {
  const normalizedName = name.toLowerCase();

  if (normalizedName.includes("implant")) return Syringe;
  if (normalizedName.includes("handpiece") || normalizedName.includes("instrument")) return Wrench;
  if (normalizedName.includes("composite") || normalizedName.includes("restorative")) return Activity;
  if (normalizedName.includes("camera") || normalizedName.includes("imaging")) return Camera;
  if (normalizedName.includes("endo") || normalizedName.includes("motor")) return Cog;
  return Lightbulb;
};

const getFallbackImage = (name: string): string => {
  const normalizedName = name.toLowerCase();
  if (normalizedName.includes("endo") || normalizedName.includes("motor")) {
    return `${process.env.PUBLIC_URL || ""}/assets/images/categories/Endomotors.png`;
  }
  if (normalizedName.includes("implant") || normalizedName.includes("prosthet")) {
    return `${process.env.PUBLIC_URL || ""}/assets/images/categories/Implant Prosthetics.png`;
  }
  return `${process.env.PUBLIC_URL || ""}/assets/images/categories/Instruments.jpg`;
};

export const ReorderCTA: React.FC<ReorderCTAProps> = ({ className = "" }) => {
  const { data, loading, error } = useQuery<{ categories: { edges: CategoryEdge[] } }>(
    GET_TOP_CATEGORIES,
    {
      variables: { first: 30 },
      fetchPolicy: "cache-and-network",
    }
  );

  const categories = (data?.categories?.edges || [])
    .map(({ node }) => node)
    .filter((category) => {
      const inactive = category.metadata?.some(
        ({ key, value }) =>
          key.toLowerCase() === "is_active" &&
          ["false", "0", "no"].includes(value.toLowerCase())
      );
      return !inactive;
    })
    .slice(0, 10);

  if (error) {
    console.error("[ReorderCTA] Failed to load featured categories:", error);
    return null;
  }

  if (!loading && categories.length === 0) {
    return null;
  }

  if (loading && categories.length === 0) {
    return (
      <section
        className={`relative w-full max-w-[95%] mx-auto my-5 overflow-hidden ${className}`}
        aria-label="Loading featured categories"
      >
        <div className="mb-5 flex items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="h-8 w-64 animate-pulse rounded bg-slate-100" />
            <div className="h-5 w-80 max-w-full animate-pulse rounded bg-slate-100" />
          </div>
          <div className="hidden h-5 w-24 animate-pulse rounded bg-slate-100 sm:block" />
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {Array.from({ length: 10 }, (_, index) => (
            <div
              key={`loading-${index}`}
              className="h-[220px] animate-pulse rounded-2xl border border-slate-100 bg-slate-100 sm:h-[250px]"
              aria-hidden="true"
            />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section
      className={`relative w-full max-w-[95%] mx-auto my-5 overflow-hidden ${className}`}
      aria-label="Featured categories"
    >
      {/* <div className="mb-2 flex items-end justify-between gap-4 sm:mb-6">
        <div className="min-w-0">
          <h2
            className="m-0 text-[26px] font-extrabold leading-tight tracking-tight text-black sm:text-4xl"
          >
            Shop Dental Essentials
          </h2>
          <p className="mb-0 mt-1 text-sm font-medium text-slate-500 sm:mt-2 sm:text-lg">
            Everything your clinic needs, in one place
          </p>
        </div>
        <Link
          to="/category"
          className="mb-1 inline-flex shrink-0 items-center gap-1 border-b border-[#102f61] pb-1 text-xs font-bold text-[#102f61] no-underline transition-colors hover:text-teal-700 sm:text-sm"
        >
          Explore all
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
        {categories.map((category) => {
          const imageUrl = category.backgroundImage?.url || getFallbackImage(category.name);
          const CategoryIcon = getCategoryIcon(category.name);

          return (
            <Link
              key={category.id}
              to={`/category/${category.slug}`}
              className="group flex h-[120px] min-w-0 flex-col overflow-hidden rounded-2xl border border-white bg-white p-1.5 no-underline shadow-[0_3px_14px_rgba(15,23,42,0.06)] transition-all hover:-translate-y-0.5 hover:border-blue-100 hover:shadow-md sm:h-[150px]"
            >
              <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-t-xl bg-gradient-to-br from-[#f5faff] via-[#edf7ff] to-white">
                <span
                  aria-hidden="true"
                  className="absolute -right-2 top-3 h-24 w-24 rounded-full bg-cyan-100/70"
                />
                <span
                  aria-hidden="true"
                  className="absolute -bottom-8 left-4 h-20 w-20 rounded-full bg-sky-100/70"
                />
                <img
  src={imageUrl}
  alt={category.backgroundImage?.alt || category.name}
  className="relative z-10 h-[200px] w-[200px] object-contain p-2 transition-transform duration-300 group-hover:scale-105 sm:p-3"
  loading="lazy"
/>
              </div>

              <div className="flex h-[30px] shrink-0 -translate-y-1 items-center gap-2 px-1.5 sm:h-[50px] sm:-translate-y-2 sm:gap-3 sm:px-2">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e8f5ff] text-[#102f61] sm:h-12 sm:w-12 mt-2">
                  <CategoryIcon className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
                </span>
                <span className="min-w-0 mt-2">
                  <span className="mb-1 block h-0.5 w-6 bg-teal-500" aria-hidden="true" />
                  <span
                    className="line-clamp-2 text-xs font-bold leading-tight text-[#102f61] group-hover:text-blue-700 sm:text-sm"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {category.name}
                  </span>
                </span>
              </div>
            </Link>
          );
        })}
      </div> */}
    </section>
  );
};

export default ReorderCTA;
