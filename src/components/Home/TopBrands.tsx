import React, { useRef, useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client/react";
import { GET_TOP_BRANDS } from "../../GraphQL/Queries";
import { ChevronRight, ChevronLeft, Search, X } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface BrandItem {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  badge?: string;
}

interface BrandModalItem {
  id: string;
  name: string;
  slug: string;
  badge?: string;
  logo?: string;
}

interface TopBrandsProps {
  className?: string;
}

interface AttributeChoiceNode {
  id: string;
  name: string;
  slug: string;
}

interface AttributeNode {
  id: string;
  name: string;
  slug: string;
  choices?: {
    edges?: Array<{
      node: AttributeChoiceNode;
    }>;
  };
}

interface AttributesData {
  attributes?: {
    edges?: Array<{
      node: AttributeNode;
    }>;
  };
}

// ─── Constants ────────────────────────────────────────────────────────────────

const ALPHABETS = ["ALL", ..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"];

const defaultTopBrands: BrandItem[] = [
  { id: "gdc", name: "GDC", slug: "GDC", logo: "/assets/images/company-logos/feature4.jpg" },
  { id: "oracraft", name: "ORACRAFT", slug: "Oracraft", logo: "/assets/images/company-logos/ORACRAFT.jpg" },
  { id: "mani", name: "MANI", slug: "14552_42", logo: "/assets/images/company-logos/MANI.jpg" },
  { id: "koden", name: "KODEN", slug: "16286_42", logo: "/assets/images/company-logos/feature7.jpg" },
  { id: "denmax", name: "DENMAX", slug: "13862_42", logo: "/assets/images/company-logos/feature1.jpg" },
  { id: "dentsply", name: "DENTSPLY", slug: "15313_42", logo: "/assets/images/company-logos/feature2.jpg" },
  { id: "waldent", name: "WALDENT", slug: "15613_42", logo: "/assets/images/company-logos/VENDTECH.jpg" },
  { id: "hegma", name: "HEGMA", slug: "14403_42", logo: "/assets/images/company-logos/feature5.jpg" },
  { id: "ivoclar", name: "IVOCLAR", slug: "14510_42", logo: "/assets/images/company-logos/feature5.jpg" },
  { id: "woodpecker", name: "WOODPECKER", slug: "15593_42", logo: "/assets/images/company-logos/WOODPECKER.jpg" },
  { id: "3m-espe", name: "3M-ESPE", slug: "3m-espe", logo: "/assets/images/company-logos/feature6.jpg" },
  { id: "dpi", name: "DPI", slug: "13903_42", logo: "/assets/images/company-logos/feature1.jpg" },
  { id: "neoendo", name: "NEOENDO", slug: "14652_42", logo: "/assets/images/company-logos/NEOENDO.jpg" },
  { id: "carestream", name: "CARESTREAM", slug: "carestream", logo: "/assets/images/company-logos/feature3.jpg" },
  { id: "zhermack", name: "ZHERMACK", slug: "14856_42", logo: "/assets/images/company-logos/ZHERMACK.jpg" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const matchBrandLogo = (name: string, slug?: string, index: number = 0): string => {
  const term = `${name} ${slug || ""}`.toLowerCase();
  if (term.includes("dentsply") || term.includes("sirona")) return "/assets/images/company-logos/feature2.jpg";
  if (term.includes("carestream") || term.includes("kodak")) return "/assets/images/company-logos/feature3.jpg";
  if (term.includes("diadent")) return "/assets/images/company-logos/feature1.jpg";
  if (term.includes("woodpecker")) return "/assets/images/company-logos/WOODPECKER.jpg";
  if (term.includes("gdc") || term.includes("implant")) return "/assets/images/company-logos/feature4.jpg";
  if (term.includes("ivoclar") || term.includes("vivadent")) return "/assets/images/company-logos/feature5.jpg";
  if (term.includes("3m") || term.includes("espe")) return "/assets/images/company-logos/feature6.jpg";
  if (term.includes("koden")) return "/assets/images/company-logos/feature7.jpg";
  if (term.includes("gc") || term.includes("fuji")) return "/assets/images/company-logos/GC.jpg";
  if (term.includes("mani")) return "/assets/images/company-logos/MANI.jpg";
  if (term.includes("neoendo") || term.includes("endo")) return "/assets/images/company-logos/NEOENDO.jpg";
  if (term.includes("oracraft")) return "/assets/images/company-logos/ORACRAFT.jpg";
  if (term.includes("vendtech") || term.includes("waldent")) return "/assets/images/company-logos/VENDTECH.jpg";
  if (term.includes("zhermack")) return "/assets/images/company-logos/ZHERMACK.jpg";
  if (term.includes("seil")) return "/assets/images/company-logos/feature6.jpg";
  if (term.includes("meta") || term.includes("biomed")) return "/assets/images/company-logos/meta.jpg";
  if (term.includes("denmax") || term.includes("dpi")) return "/assets/images/company-logos/feature1.jpg";
  if (term.includes("hegma")) return "/assets/images/company-logos/feature5.jpg";
  // Rotary fallback logo for newly created brands without specific artwork
  return defaultTopBrands[index % defaultTopBrands.length].logo || "";
};

const generateBadge = (name: string): string => {
  const clean = name.trim();
  if (clean.toUpperCase().startsWith("3M")) return "3M";
  const words = clean.split(/[\s-_]+/).filter(Boolean);
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  return clean.slice(0, 2).toUpperCase();
};

// ─── All Brands Modal (inlined) ───────────────────────────────────────────────

interface AllBrandsModalProps {
  isOpen: boolean;
  onClose: () => void;
  brands?: BrandModalItem[];
}

const AllBrandsModal: React.FC<AllBrandsModalProps> = ({ isOpen, onClose, brands = [] }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLetter, setSelectedLetter] = useState("ALL");

  // Lock scroll & ESC close
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Deduplicate and prepare dynamic modal brands
  const allBrands = useMemo(() => {
    const map = new Map<string, BrandModalItem>();
    brands.forEach((brand) => {
      const key = brand.name.trim().toLowerCase();
      if (!map.has(key)) {
        map.set(key, {
          ...brand,
          logo: brand.logo || matchBrandLogo(brand.name, brand.slug),
          badge: brand.badge || generateBadge(brand.name),
        });
      }
    });
    return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [brands]);

  const filteredBrands = useMemo(() => {
    let list = allBrands;
    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();
      list = list.filter(
        (brand) =>
          brand.name.toLowerCase().includes(query) ||
          brand.badge?.toLowerCase().includes(query)
      );
    } else if (selectedLetter !== "ALL") {
      list = list.filter(
        (brand) => brand.name.trim().toUpperCase()[0] === selectedLetter
      );
    }
    return list;
  }, [allBrands, searchQuery, selectedLetter]);

  useEffect(() => {
    if (isOpen) {
      console.log("[AllBrandsModal] Brands state:", { count: filteredBrands.length, searchQuery, selectedLetter });
    }
  }, [isOpen, filteredBrands.length, searchQuery, selectedLetter]);

  const handleBrandClick = (brand: BrandModalItem) => {
    onClose();
    navigate(`/brand/${encodeURIComponent(brand.name)}`);
  };

  const handleClose = () => {
    setSearchQuery("");
    setSelectedLetter("ALL");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/60 p-0 backdrop-blur-sm"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-label="All Brands"
    >
      <div
        className="flex h-[60vh] w-[96vw] max-w-[1400px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl sm:h-[82vh] sm:w-[85vw] sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div className="shrink-0 border-b border-slate-200 bg-white px-5 py-5 sm:px-7 sm:py-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="m-0 text-3xl sm:text-3xl font-bold tracking-tight text-slate-900">
                All Brands
              </h2>
              <p className="mt-1 text-xl text-slate-900 sm:text-xl">
                Explore dental products from trusted brands
              </p>
            </div>

            <button
              type="button"
              onClick={handleClose}
              className="flex h-12 w-12 shrink-0 items-center justify-center border-0 bg-transparent p-0 text-slate-600 outline-none ring-0 shadow-none"
              aria-label="Close"
            >
              <X className="h-10 w-10" />
            </button>
          </div>

          {/* Search — dark bar matching the reference design */}
          <div className=" flex h-[40px] items-center gap-3 rounded-xl bg-white border border-slate-200 px-2">
            <Search className="h-8 w-8 shrink-0 text-slate-900" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                const value = e.target.value;
                setSearchQuery(value);
                if (value.trim() && selectedLetter !== "ALL") setSelectedLetter("ALL");
              }}
              placeholder="Search brands..."
              className="w-full border-none bg-transparent p-0 text-md text-black outline-none placeholder:text-slate-500 focus:outline-none focus:ring-0"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="shrink-0 rounded-md text-slate-400 transition border border-slate-200 hover:text-black"
                aria-label="Clear search"
              >
                <X className="h-6 w-6" />
              </button>
            )}
          </div>
        </div>

        {/* ── Content ── */}
        <div className="flex min-h-0 flex-1 overflow-hidden">
          {/* Desktop alphabet sidebar */}
          {/* Desktop alphabet sidebar — matches reference image */}
          <div
            className="hidden w-[60px] shrink-0 flex-col items-center overflow-y-auto border-r border-slate-100 py-3 sm:flex"
            style={{ scrollbarWidth: "thin", scrollbarColor: "#cbd5e1 transparent" }}
          >
            {ALPHABETS.map((letter) => {
              const selected = selectedLetter === letter;
              return (
                <button
                  key={letter}
                  type="button"
                  onClick={() => { setSelectedLetter(letter); setSearchQuery(""); }}
                  className="w-full flex items-center justify-center py-[7px] text-[15px] font-semibold transition-colors bg-transparent border-none cursor-pointer"
                  style={{
                    color: selected ? "#2563eb" : "#94a3b8",
                    fontWeight: selected ? 700 : 500,
                  }}
                >
                  {letter}
                </button>
              );
            })}
          </div>

          {/* Brand list */}
          <div className="min-w-0 flex-1 overflow-y-auto px-5 py-0 sm:px-8 sm:py-7">
            {/* Mobile alphabet strip */}
            <div className="mb-5 flex gap-1 overflow-x-auto pb-1 sm:hidden scrollbar-hide">
              {ALPHABETS.map((letter) => {
                const selected = selectedLetter === letter;
                return (
                  <button
                    key={letter}
                    type="button"
                    onClick={() => {
                      setSelectedLetter(letter);
                      setSearchQuery("");
                    }}
                    className={`shrink-0 appearance-none rounded-full px-3 py-1.5 text-[11px] font-semibold transition border-0 outline-none ring-0 shadow-none focus:border-0 focus:outline-none focus:ring-0 focus-visible:border-0 focus-visible:outline-none focus-visible:ring-0 ${selected
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 text-slate-500 hover:bg-blue-50 hover:text-blue-600"
                      }`}
                    style={{ border: "none", outline: "none", boxShadow: "none" }}
                  >
                    {letter}
                  </button>
                );
              })}
            </div>

            {/* Result header */}
            <div className=" flex items-center justify-between">
              <div>
                <h3 className="m-0 text-[13px] font-bold text-slate-900 sm:text-[16px]">
                  {searchQuery
                    ? "Search Results"
                    : selectedLetter === "ALL"
                      ? "All Brands"
                      : `Brands Starting With "${selectedLetter}"`}
                </h3>
                <p className="mt-1 text-[12px] text-slate-500">{filteredBrands.length} brands</p>
              </div>
            </div>

            {/* Brand grid */}
            {filteredBrands.length > 0 ? (
              <div className="space-y-2">
                {Object.entries(
                  [...filteredBrands]
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .reduce<Record<string, BrandModalItem[]>>((groups, brand) => {
                      const letter = brand.name.charAt(0).toUpperCase();
                      if (!groups[letter]) groups[letter] = [];
                      groups[letter].push(brand);
                      return groups;
                    }, {})
                ).map(([letter, brands]) => (
                  <div key={letter} className="w-full">
                    {/* Letter heading */}
                    <div className="mb-1 flex items-center gap-4">
                      <h3 className="m-0 text-2xl font-medium text-slate-900">
                        {letter}
                      </h3>

                      <div className="h-px flex-1 bg-slate-300" />
                    </div>

                    {/* Brands in this letter */}

                    <div className="grid grid-cols-3 gap-2 sm:grid-cols-2 lg:grid-cols-6">
                      {brands.map((brand) => (
                        <button
                          key={brand.id}
                          type="button"
                          onClick={() => handleBrandClick(brand)}
                          className="group flex h-auto sm:h-[140px] min-w-0 flex-col items-center text-center cursor-pointer bg-transparent border-none"
                        >
                          {/* Logo box */}
                          <div className="flex h-[80px] sm:h-[110px] w-full  items-center justify-center rounded-xl sm:rounded-2xl border border-slate-200 bg-white transition-all duration-200 hover:border-blue-800 hover:scale-105 p-1 sm:p-2">
                            {brand.logo ? (
                              <img
                                src={
                                  brand.logo.startsWith("/assets/")
                                    ? `${process.env.PUBLIC_URL || ""}${brand.logo}`
                                    : brand.logo
                                }
                                alt={brand.name}
                                className="h-[65px] sm:h-[100px] w-[95%] object-contain"
                                onError={(e) => {
                                  console.error(`[AllBrandsModal] Image FAILED to load for brand "${brand.name}": ${(e.target as HTMLImageElement).src}`);
                                  (e.target as HTMLImageElement).style.display = "none";
                                }}
                              />
                            ) : (
                              <span className="text-xl sm:text-2xl font-bold tracking-wide text-slate-700">
                                {brand.badge || generateBadge(brand.name)}
                              </span>
                            )}
                          </div>

                          {/* Brand name */}
                          <span className="mt-1 sm:mt-1.5 text-[11px] font-medium text-[#004b87] transition-colors group-hover:text-blue-700 line-clamp-2 w-full">
                            {brand.name}
                          </span>
                        </button>
                      ))}
                    </div>


                  </div>
                ))}
              </div>
            ) : (
              <div className="flex min-h-[250px] flex-col items-center justify-center text-center">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                  <Search className="h-5 w-5 text-slate-400" />
                </div>
                <p className="m-0 text-sm font-semibold text-slate-600">No brands found</p>
                <p className="mt-1 text-xs text-slate-400">Try searching with a different brand name.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── TopBrands ────────────────────────────────────────────────────────────────

export const TopBrands: React.FC<TopBrandsProps> = ({ className = "" }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, loading, error } = useQuery<AttributesData>(GET_TOP_BRANDS, {
    variables: { first: 100 },
    fetchPolicy: "cache-and-network",
  });

  // Diagnostic logging according to Rule 0
  useEffect(() => {
    console.log("[TopBrands] GraphQL Query State:", {
      loading,
      error: error?.message,
      hasData: !!data,
    });
    if (data?.attributes?.edges) {
      console.log(
        "[TopBrands] Available Attributes in Backend:",
        data.attributes.edges.map((e) => ({
          id: e.node.id,
          name: e.node.name,
          slug: e.node.slug,
          choicesCount: e.node.choices?.edges?.length || 0,
        }))
      );
    }
  }, [data, loading, error]);

  const scroll = (dir: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir === "right" ? 300 : -300, behavior: "smooth" });
    }
  };

  // Dynamically extract brands from the GraphQL backend using brand ID and name
  const displayBrands = useMemo((): BrandItem[] => {
    if (!data?.attributes?.edges) return defaultTopBrands;

    const brandAttr = data.attributes.edges.find((e) => {
      const slug = e.node.slug?.toLowerCase() || "";
      const name = e.node.name?.toLowerCase() || "";
      return slug === "manufacturer" || name === "manufacturer" || slug === "brand" || name === "brand";
    });

    if (!brandAttr) {
      console.warn("[TopBrands] Could not find 'manufacturer' or 'brand' attribute in data.attributes.edges");
      return defaultTopBrands;
    }

    const choices = brandAttr.node.choices?.edges;
    if (!choices || !Array.isArray(choices) || choices.length === 0) {
      console.warn("[TopBrands] No choices found under brand attribute:", brandAttr.node.name);
      return defaultTopBrands;
    }

    const uniqueBrands = new Map<string, BrandItem>();
    choices.forEach((c, index) => {
      const node = c.node;
      const rawName = (node.name || node.slug || "").trim();
      if (!rawName) return;
      const key = rawName.toLowerCase();
      if (!uniqueBrands.has(key)) {
        uniqueBrands.set(key, {
          id: node.id,
          name: rawName,
          slug: node.slug || rawName,
          logo: matchBrandLogo(rawName, node.slug, index),
          badge: generateBadge(rawName),
        });
      }
    });

    const result = Array.from(uniqueBrands.values()).sort((a, b) => a.name.localeCompare(b.name));
    console.log("[TopBrands] Dynamically fetched brands count:", result.length, result);
    return result;
  }, [data]);

  // Convert scroll brands → modal brands for the popup
  const modalBrands: BrandModalItem[] = useMemo(() => {
    return displayBrands.map((b) => ({
      id: b.id,
      name: b.name,
      slug: b.slug,
      badge: b.badge || generateBadge(b.name),
      logo: b.logo,
    }));
  }, [displayBrands]);

  if (loading && displayBrands.length === 0) {
    return (
      <section className={`w-full max-w-[95%] mx-auto mb-0 ${className}`}>
        <div className="h-7 w-48 bg-slate-200 rounded animate-pulse mb-0"></div>
        <div className="flex gap-4 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="w-[120px] h-[125px] bg-slate-100 rounded-2xl animate-pulse shrink-0"></div>
          ))}
        </div>
      </section>
    );
  }

  if (!loading && displayBrands.length === 0) {
    return null;
  }

  return (
    <section className={`w-full max-w-[95%] mx-auto mb-0 ${className}`} aria-label="Top Clinical Brands">
      {/* ── Desktop & Tablet View ── */}
      <div className="hidden md:block">
        <div className="flex items-center justify-between mb-1 px-4 mt-3 -ml-7">
          <h2
            className="text-[13.5px] font-bold text-slate-900 flex items-center gap-2 m-0 tracking-tight"
            style={{ fontFamily: "Outfit, sans-serif" }}
          >
            Top Brands
            <span className="text-blue-500">✦</span>
          </h2>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors -mr-6 bg-transparent border-none p-0 cursor-pointer"
              style={{ fontFamily: "Outfit, sans-serif" }}
            >
              View All <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>


        {/* Brands horizontal scroll */}
        <div
          ref={scrollRef}
          className="flex gap-1.5 overflow-x-auto overflow-y-visible pt-4 pb-6 px-0"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {displayBrands.map((brand) => (
            <Link
              key={brand.id}
              to={`/brand/${encodeURIComponent(brand.name)}`}
              className="group no-underline shrink-0"
              title={brand.name}
            >
              <div className="w-[125px] h-[145px] bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] flex flex-col items-center justify-center p-2 cursor-pointer ui2-glow-card">
                <div className="w-[85px] h-[85px] rounded-full border border-slate-100 shadow-[0_4px_15px_rgba(0,0,0,0.06)] bg-white flex items-center justify-center transition-all duration-300 group-hover:scale-110 overflow-hidden p-2 ui2-glow-card">
                  {brand.logo ? (
                    <img
                      src={brand.logo.startsWith("/assets/") ? `${process.env.PUBLIC_URL || ""}${brand.logo}` : brand.logo}
                      alt={brand.name}
                      className="w-full h-full object-contain max-h-[70px]"
                      onError={(e) => {
                        console.error(`[TopBrands Desktop] Image FAILED to load for brand "${brand.name}": ${(e.target as HTMLImageElement).src}`);
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  ) : (
                    <span className="text-base font-bold tracking-wide text-slate-700 select-none">
                      {brand.badge || generateBadge(brand.name)}
                    </span>
                  )}
                </div>
                <span className="mt-2 text-[12px] font-semibold text-slate-700 truncate max-w-[110px] text-center group-hover:text-blue-600 transition-colors">
                  {brand.name}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Mobile View ── */}
      <div className="block md:hidden w-full px-2">
        <div className="flex items-center justify-between mb-2 mt-3">
          <h2
            className="text-[13.5px] font-bold text-slate-900 flex items-center gap-1.5 m-0 tracking-tight"
            style={{ fontFamily: "Outfit, sans-serif" }}
          >
            Top Brands
            <span className="text-blue-500 text-sm">✦</span>
          </h2>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1 -mr-auto text-blue-600 font-bold text-[11px] no-underline bg-transparent border-none p-0 cursor-pointer"
          >
            View All
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div
          className="flex gap-2.5 overflow-x-auto overflow-y-visible pt-2 pb-4 -mx-2 px-2"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {displayBrands.map((brand) => (
            <Link
              key={brand.id}
              to={`/brand/${encodeURIComponent(brand.name)}`}
              className="no-underline shrink-0"
              title={brand.name}
            >
              <div className="relative z-0 hover:z-50 w-[90px] h-[105px] bg-white rounded-xl border border-slate-200 hover:border-blue-500 shadow-sm flex flex-col items-center justify-center p-2 cursor-pointer ui2-glow-card transition-all duration-300 hover:-translate-y-2 hover:shadow-lg">
                <div className="w-[70px] h-[70px] rounded-full border border-slate-200 flex items-center justify-center bg-white overflow-hidden p-1.5">
                  {brand.logo ? (
                    <img
                      src={brand.logo.startsWith("/assets/") ? `${process.env.PUBLIC_URL || ""}${brand.logo}` : brand.logo}
                      alt={brand.name}
                      className="w-full h-full object-contain max-h-[42px]"
                      onError={(e) => {
                        console.error(`[TopBrands Mobile] Image FAILED to load for brand "${brand.name}": ${(e.target as HTMLImageElement).src}`);
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  ) : (
                    <span className="text-xs font-bold tracking-wide text-slate-900 select-none">
                      {brand.badge || generateBadge(brand.name)}
                    </span>
                  )}
                </div>
                <span className="mt-1 text-[10px] font-medium text-slate-700 truncate max-w-[80px] text-center">
                  {brand.name}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ── All Brands Modal Popup ── */}
      <AllBrandsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        brands={modalBrands}
      />
    </section>
  );
};

export default TopBrands;
