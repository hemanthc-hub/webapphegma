import React, { useState } from "react";
import { SlidersHorizontal, ChevronDown, ChevronUp, X, RefreshCw, DollarSign, Tag, FolderTree } from "lucide-react";

export interface SubCategoryNode {
  id: string;
  name: string;
  slug: string;
  products?: {
    totalCount?: number;
  };
}

export interface CategoryEdge {
  node: {
    id: string;
    name: string;
    slug: string;
    products?: {
      totalCount?: number;
    };
    children?: {
      edges: Array<{ node: SubCategoryNode }>;
    };
  };
}

export interface AttributeChoiceNode {
  id: string;
  name: string;
  slug?: string;
}

export interface AttributeEdge {
  node: {
    id: string;
    name: string;
    slug: string;
    choices?: {
      totalCount?: number;
      edges: Array<{ node: AttributeChoiceNode }>;
    };
  };
}

export interface FilterSidebarProps {
  categories?: CategoryEdge[];
  attributes?: AttributeEdge[];
  selectedCategoryIds?: string[];
  selectedAttributeIds?: string[];
  onToggleCategory?: (id: string, slug: string) => void;
  onToggleAttribute?: (id: string, attributeSlug: string, choiceName: string) => void;
  minPrice?: number;
  maxPrice?: number;
  currentMinPrice?: number;
  currentMaxPrice?: number;
  onPriceChange?: (min: number, max: number) => void;
  onClearAllFilters?: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
  productCount?: number;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  categories = [],
  attributes = [],
  selectedCategoryIds = [],
  selectedAttributeIds = [],
  onToggleCategory,
  onToggleAttribute,
  minPrice = 0,
  maxPrice = 100000,
  currentMinPrice,
  currentMaxPrice,
  onPriceChange,
  onClearAllFilters,
  isMobileOpen = false,
  onCloseMobile,
  productCount = 0,
}) => {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    categories: true,
    price: true,
    attributes: true,
  });

  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  const [minInput, setMinInput] = useState<string>(currentMinPrice?.toString() || minPrice.toString());
  const [maxInput, setMaxInput] = useState<string>(currentMaxPrice?.toString() || maxPrice.toString());

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: prev[key] === undefined ? false : !prev[key] }));
  };

  const toggleCategoryAccordion = (e: React.MouseEvent, categoryId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setExpandedCategories(prev => ({ ...prev, [categoryId]: !prev[categoryId] }));
  };

  const handleApplyPrice = (e: React.FormEvent) => {
    e.preventDefault();
    if (onPriceChange) {
      const min = parseInt(minInput, 10) || minPrice;
      const max = parseInt(maxInput, 10) || maxPrice;
      onPriceChange(min, max);
    }
  };

  const hasActiveFilters = selectedCategoryIds.length > 0 || selectedAttributeIds.length > 0 || (currentMinPrice !== undefined && currentMinPrice > minPrice) || (currentMaxPrice !== undefined && currentMaxPrice < maxPrice);

  const renderSidebarContent = () => {
    // Collect active filter details for display
    const activePills: Array<{ label: string, onRemove: () => void }> = [];

    // Map Category IDs to Names
    selectedCategoryIds.forEach(idOrSlug => {
      let found = false;
      categories.forEach(cat => {
        if (found) return;
        if (cat.node.id === idOrSlug || cat.node.slug === idOrSlug) {
          if (!activePills.some(p => p.label === cat.node.name)) {
            activePills.push({ label: cat.node.name, onRemove: () => onToggleCategory && onToggleCategory(cat.node.id, cat.node.slug) });
          }
          found = true;
        }
        if (!found && cat.node.children?.edges) {
          cat.node.children.edges.forEach(sub => {
            if (sub.node.id === idOrSlug || sub.node.slug === idOrSlug) {
              if (!activePills.some(p => p.label === sub.node.name)) {
                activePills.push({ label: sub.node.name, onRemove: () => onToggleCategory && onToggleCategory(sub.node.id, sub.node.slug) });
              }
              found = true;
            }
          });
        }
      });
    });

    // Map Attribute choices
    selectedAttributeIds.forEach(val => {
      let found = false;
      attributes.forEach(attr => {
        if (found) return;
        attr.node.choices?.edges.forEach(choice => {
          if (choice.node.name === val || choice.node.slug === val) {
            if (!activePills.some(p => p.label === choice.node.name)) {
              activePills.push({ 
                label: choice.node.name, 
                onRemove: () => onToggleAttribute && onToggleAttribute(attr.node.id, attr.node.slug, choice.node.name)
              });
            }
            found = true;
          }
        });
      });
      // Fallback for pre-existing filters from URL (e.g., brand from /brand/3M) before attributes finish loading
      if (!found) {
        const cleanVal = val.replace(/-/g, ' ');
        if (!activePills.some(p => p.label === cleanVal)) {
          activePills.push({
            label: cleanVal, // Clean up hyphenated URL slugs for display
            onRemove: () => onToggleAttribute && onToggleAttribute('', '', val)
          });
        }
      }
    });

    return (
      <div className="catalog-filter-content flex flex-col">
        {/* Header / Clear All Button */}
        <div className="catalog-filter-header flex flex-col">
          <div className="flex items-center justify-between">
            <div className="catalog-filter-title flex flex-1 items-center justify-start gap-2 text-slate-900 font-extrabold text-[18px]">
              <span className="catalog-filter-title-icon">
                <SlidersHorizontal aria-hidden="true" />
              </span>
              <span style={{ fontFamily: "Outfit, sans-serif" }}>Filters</span>
            </div>
            {hasActiveFilters && onClearAllFilters && (
              <button
                type="button"
                onClick={onClearAllFilters}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 text-[12px] font-bold transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span style={{ fontFamily: "'DM Sans', sans-serif" }}>Reset All</span>
              </button>
            )}
          </div>

          {/* Active Filter Pills Display */}
          {activePills.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {activePills.map((pill, idx) => (
                <div key={idx} className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 border border-blue-100 rounded-md text-[11px] font-bold text-blue-700 uppercase tracking-wide">
                  <span>{pill.label}</span>
                  <div onClick={pill.onRemove} className="cursor-pointer flex items-center justify-center">
                    <X className="w-3 h-3" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      {/* Categories Accordion */}
      {categories && categories.length > 0 && (
        <div className="catalog-filter-section">
          <div
            onClick={() => toggleSection("categories")}
            className="catalog-filter-section-heading w-full flex items-center justify-between text-left font-bold text-slate-800 py-1 cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <FolderTree className="w-4 h-4 text-slate-400" />
              <span>Categories</span>
            </div>
            {openSections["categories"] ? <ChevronUp className="w-5 h-5 text-slate-400" strokeWidth={3} /> : <ChevronDown className="w-5 h-5 text-slate-400" strokeWidth={3} />}
          </div>

          {openSections["categories"] && (
            <ul className="catalog-filter-category-list mt-3.5 space-y-2 list-none p-0 m-0 max-h-[320px] overflow-y-auto pr-1">
              {categories.map((cat) => {
                const parentCount = cat.node.products?.totalCount || 0;
                const childrenCount = cat.node.children?.edges?.reduce((acc: number, sub: any) => acc + (sub.node.products?.totalCount || 0), 0) || 0;
                const categoryCount = parentCount || childrenCount;
                if (parentCount + childrenCount === 0) return null;

                const isChecked = selectedCategoryIds.includes(cat.node.id) || selectedCategoryIds.includes(cat.node.slug);

                return (
                  <li key={cat.node.id} className="m-0 p-0">
                    <div className="catalog-filter-category-row flex items-center justify-between py-1 px-2 rounded-xl hover:bg-slate-50 transition-colors">
                      <label className="catalog-filter-category-label flex items-center gap-2.5 truncate cursor-pointer text-[13px] font-semibold text-slate-700 select-none flex-1">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => onToggleCategory && onToggleCategory(cat.node.id, cat.node.slug)}
                          className="catalog-filter-checkbox rounded border-slate-300 text-blue-600 focus:ring-blue-500 transition-colors cursor-pointer"
                        />
                        <span className={`truncate ${isChecked ? "text-blue-600 font-extrabold" : "text-slate-800 font-bold"}`}>
                          {cat.node.name}
                        </span>
                      </label>
                      <div className="flex items-center gap-1.5 shrink-0 ml-2">
                        <span className="catalog-filter-category-count">({categoryCount})</span>
                        {cat.node.children && cat.node.children.edges.length > 0 && (
                          <div
                            onClick={(e) => toggleCategoryAccordion(e, cat.node.id)}
                            className="cursor-pointer flex items-center justify-center"
                          >
                            {expandedCategories[cat.node.id] ? <ChevronUp className="w-4 h-4 text-slate-400" strokeWidth={3} /> : <ChevronDown className="w-4 h-4 text-slate-400" strokeWidth={3} />}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Subcategories */}
                    {expandedCategories[cat.node.id] && cat.node.children && cat.node.children.edges.length > 0 && (
                      <ul className="mt-1 ml-5 space-y-1 list-none p-0 border-l-2 border-slate-100 pl-2">
                        {cat.node.children.edges.map((sub) => {
                          if (sub.node.products?.totalCount === 0) return null;
                          const isSubChecked = selectedCategoryIds.includes(sub.node.id) || selectedCategoryIds.includes(sub.node.slug);

                          return (
                            <li key={sub.node.id} className="m-0 p-0">
                              <label className="flex items-center justify-between py-1 px-2 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer text-[13px] text-slate-600 select-none">
                                <div className="flex items-center gap-2 truncate">
                                  <input
                                    type="checkbox"
                                    checked={isSubChecked}
                                    onChange={() => onToggleCategory && onToggleCategory(sub.node.id, sub.node.slug)}
                                    className="w-3.5 h-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 transition-colors cursor-pointer"
                                  />
                                  <span className={`truncate ${isSubChecked ? "text-blue-600 font-bold" : "text-slate-700 font-semibold"}`}>
                                    {sub.node.name}
                                  </span>
                                </div>
                                {/* {sub.node.products?.totalCount !== undefined && (
                                  <span className="text-[10px] text-slate-400">
                                    ({sub.node.products.totalCount})
                                  </span>
                                )} */}
                              </label>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}

      {/* Clinical Attributes & Specifications Accordion */}
      {attributes && attributes.length > 0 && (
        <div className="pb-2">
          <div
            onClick={() => toggleSection("attributes")}
            className="w-full flex items-center justify-between text-left font-bold text-[16px] text-slate-800 py-1 cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-purple-500" />
              <span>Specifications & Brands</span>
            </div>
            {openSections["attributes"] ? <ChevronUp className="w-5 h-5 text-slate-400" strokeWidth={3} /> : <ChevronDown className="w-5 h-5 text-slate-400" strokeWidth={3} />}
          </div>

          {openSections["attributes"] && (
            <div className="mt-1 space-y-3">
              {[...attributes].sort((a, b) => {
                if (a.node.name === "Manufacturer") return -1;
                if (b.node.name === "Manufacturer") return 1;
                return 0;
              }).map((attr) => {
                if (!attr.node.choices || attr.node.choices.edges.length === 0) return null;

                return (
                  <div key={attr.node.id} className="space-y-2">
                    <div 
                      onClick={() => toggleSection(`attr_${attr.node.id}`)}
                      className="flex items-center justify-between cursor-pointer group px-1"
                    >
                      <h4 className="text-[14px] font-extrabold text-slate-600 group-hover:text-slate-800 transition-colors tracking-wide m-0">
                        {attr.node.name === "Manufacturer" ? "Brand" : attr.node.name}
                      </h4>
                      {openSections[`attr_${attr.node.id}`] !== false ? (
                        <ChevronUp className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" strokeWidth={2.5} />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" strokeWidth={2.5} />
                      )}
                    </div>
                    {openSections[`attr_${attr.node.id}`] !== false && (
                      <ul className="space-y-1 list-none p-0 m-0 max-h-40 overflow-y-auto pr-1">
                      {attr.node.choices.edges.map((choice) => {
                        const isSelected = selectedAttributeIds.includes(choice.node.id) || selectedAttributeIds.includes(choice.node.name);

                        return (
                          <li key={choice.node.id} className="m-0 p-0">
                            <label className="flex items-center gap-2.5 py-1 px-2 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer text-[14px] font-normal text-slate-700 select-none">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => onToggleAttribute && onToggleAttribute(choice.node.id, attr.node.slug, choice.node.name)}
                                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 transition-colors cursor-pointer"
                              />
                              <span className={`truncate ${isSelected ? "text-blue-600" : "text-slate-700"}`}>
                                {choice.node.name}
                              </span>
                            </label>
                          </li>
                        );
                      })}
                    </ul>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Price Range Filter */}
      <div>
        <div
          onClick={() => toggleSection("price")}
          className="w-full flex items-center justify-between text-left font-bold text-[16px] text-slate-800 py-1 cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-500" />
            <span>Price Range (₹)</span>
          </div>
          {openSections["price"] ? <ChevronUp className="w-5 h-5 text-slate-400" strokeWidth={3} /> : <ChevronDown className="w-5 h-5 text-slate-400" strokeWidth={3} />}
        </div>

        {openSections["price"] && (
          <form onSubmit={handleApplyPrice} className="mt-1 mb-0">
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <label htmlFor="min-price-input" className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                  Min Price
                </label>
                <div className="relative">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">₹</span>
                  <input
                    id="min-price-input"
                    type="number"
                    value={minInput}
                    onChange={(e) => setMinInput(e.target.value)}
                    placeholder="0"
                    className="w-full pl-6 pr-2 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[13px] font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              <span className="text-slate-300 font-bold mt-3">—</span>

              <div className="flex-1">
                <label htmlFor="max-price-input" className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                  Max Price
                </label>
                <div className="relative">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">₹</span>
                  <input
                    id="max-price-input"
                    type="number"
                    value={maxInput}
                    onChange={(e) => setMaxInput(e.target.value)}
                    placeholder="100000"
                    className="w-full pl-6 pr-2 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[13px] font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>
            </div>

           <button
  type="submit"
  className="w-full mt-1.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl transition-colors shadow-xs cursor-pointer border-0 outline-none ring-0 focus:outline-none focus:ring-0"
>
  Apply Price Boundary
</button>
          </form>
        )}
      </div>
    </div>
  );
  };

  return (
    <>
      {/* Desktop Sidebar (Sticky Container) */}
      <aside
  id="catalog-filter-sidebar"
  className="catalog-filter-sidebar catalog-filter-panel hidden lg:block shrink-0 sticky top-24 self-start"
>
  {renderSidebarContent()}
</aside>

      {/* Mobile Slide-Over Modal Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-fadeIn"
            onClick={onCloseMobile}
          />

          {/* Drawer Container */}
          <div className="relative z-10 w-[85%] max-w-[340px] bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-slate-200 bg-slate-900 text-white">
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-lg m-0" style={{ fontFamily: "Outfit, sans-serif" }}>
                  Filter Specialties
                </h3>
              </div>
              <button
                type="button"
                onClick={onCloseMobile}
                className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 flex-1 overflow-y-auto">
              {renderSidebarContent()}
            </div>

            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center gap-3">
              {hasActiveFilters && onClearAllFilters && (
                <button
                  type="button"
                  onClick={onClearAllFilters}
                  className="px-4 py-3 rounded-2xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-extrabold text-sm transition-colors cursor-pointer"
                >
                  Reset
                </button>
              )}
              <button
                type="button"
                onClick={onCloseMobile}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm rounded-2xl shadow-lg transition-all text-center cursor-pointer"
                style={{ fontFamily: "Outfit, sans-serif" }}
              >
                View {productCount} {productCount === 1 ? "Product" : "Products"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FilterSidebar;
