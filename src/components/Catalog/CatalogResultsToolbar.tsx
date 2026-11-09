import React from "react";
import { LayoutGrid, List, SlidersHorizontal } from "lucide-react";

interface CatalogResultsToolbarProps {
  title: string;
  visibleCount: number;
  totalCount: number;
  sortBy: string;
  viewMode: "grid" | "list";
  onSortChange?: (value: string) => void;
  onOpenFilters?: () => void;
  onViewModeChange: (value: "grid" | "list") => void;
}

const CatalogResultsToolbar: React.FC<CatalogResultsToolbarProps> = ({
  title,
  visibleCount,
  totalCount,
  sortBy,
  viewMode,
  onSortChange,
  onOpenFilters,
  onViewModeChange,
}) => (
  //css available in product searchscreen .css
  <div className="catalog-results-toolbar">
    <div className="catalog-results-toolbar__details">
      <button
        type="button"
        onClick={onOpenFilters}
        className="catalog-results-toolbar__filter"
        aria-label="Open product filters"
      >
        {/* <span className="catalog-results-toolbar__filter-icon">
          <SlidersHorizontal aria-hidden="true" />
        </span> */}
       {/* <span style={{ fontSize: "20px", color: "#000000" }}>Filters</span> */}
      </button>
      <div className="catalog-results-toolbar__copy">
        <h2 className="catalog-results-toolbar__title" style={{ fontFamily: "Outfit, sans-serif" }}>
          {title}
        </h2>
        <p className="catalog-results-toolbar__count">
          Showing <strong>{visibleCount > 0 ? 1 : 0}–{visibleCount}</strong> of{" "}
          <strong>{totalCount}</strong> results
        </p>
      </div>
    </div>
    <div className="catalog-results-toolbar__controls">
      <div className="catalog-results-toolbar__sort">
        <select
          value={sortBy || ""}
          onChange={(event) => onSortChange && onSortChange(event.target.value)}
          aria-label="Sort products by"
          className="catalog-results-toolbar__select"
        >
          <option value="" className="px-1 py-0">
            Featured / Priority
          </option>
          <option value="PL">Price: Low to High</option>
          <option value="PH">Price: High to Low</option>
          <option value="R">Top Rated</option>
          <option value="D">Newest Arrivals</option>
        </select>
      </div>
      {visibleCount > 0 && (
        <div className="catalog-results-toolbar__view-toggle" aria-label="Product view">
          <button
            type="button"
            onClick={() => onViewModeChange("grid")}
            className={`cursor-pointer rounded-lg p-1.5 transition-all ${
              viewMode === "grid"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-slate-400 hover:text-slate-600"
            }`}
            title="Grid View"
            aria-label="Grid view"
            aria-pressed={viewMode === "grid"}
          >
            <LayoutGrid className="h-8 w-8" />
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange("list")}
            className={`cursor-pointer rounded-lg p-1.5 transition-all ${
              viewMode === "list"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-slate-400 hover:text-slate-600"
            }`}
            title="List View"
            aria-label="List view"
            aria-pressed={viewMode === "list"}
          >
            <List className="h-8 w-8" />
          </button>
        </div>
      )}
    </div>
  </div>
);

export default CatalogResultsToolbar;
