import React from 'react';

export default function FeaturedCategories() {
  /* ─── 1. Desktop Categories ───────────────────────────────── */
  const desktopCategories = [
    {
      image:
        "https://hegmadental.s3.amazonaws.com/products/12_24ffa0d6.jpg",
      className: "col-span-6 h-[240px]",
    },
    {
      image:
        "https://r2dkmedia.dentalkart.com/backend-media-uploads/HomepageImages/articulating%20paper%20mobile%20new.jpg",
      className: "col-span-6 h-[240px]",
    },
    {
      image:
        "https://r2dkmedia.dentalkart.com/backend-media-uploads/HomepageImages/dental%20gift%20Ipad.jpg",
      className: "col-span-3 h-[240px]",
    },
    {
      image:
        "https://r2dkmedia.dentalkart.com/backend-media-uploads/HomepageImages/prophy%20Ipad.jpg",
      className: "col-span-3 h-[240px]",
    },
    {
      image:
        "https://r2dkmedia.dentalkart.com/backend-media-uploads/HomepageImages/Micropex-DT,.jpg",
      className: "col-span-3 h-[240px]",
    },
    {
      image:
        "https://r2dkmedia.dentalkart.com/backend-media-uploads/HomepageImages/Express-XT-DT.jpg",
      className: "col-span-3 h-[240px]",
    },
  ];
  /* ─── 2. Mobile Categories (Add your mobile image URLs here) ── */
  const mobileHeroBanner = {
    image:
      "https://hegmadental.s3.amazonaws.com/products/12_24ffa0d6.jpg", // Mobile banner image
  };
  const mobileGridCards = [
    {
      image:
        "https://r2dkmedia.dentalkart.com/backend-media-uploads/HomepageImages/dental%20gift%20Ipad.jpg",
    },
    {
      image:
        "https://r2dkmedia.dentalkart.com/backend-media-uploads/HomepageImages/prophy%20Ipad.jpg",
    },
    {
      image:
        "https://r2dkmedia.dentalkart.com/backend-media-uploads/HomepageImages/Micropex-DT,.jpg",
    },
    {
      image:
        "https://r2dkmedia.dentalkart.com/backend-media-uploads/HomepageImages/Express-XT-DT.jpg",
    },
  ];

  return (
    <section className="w-full px-1 py-2 -mt-3">
      {/* ─── Heading ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-2 mt-2 px-0 ">
        <h2
          className="text-[13.5px] font-black text-slate-900 flex items-center gap-2 m-0 tracking-tight -ml-10"
          style={{ fontFamily: "Outfit, sans-serif" }}
        >
          <span className="text-2xl">🔥</span>
          Featured Categories
        </h2>
      </div>
      {/* ══════════════════════════════════════════════════════════
          MOBILE VIEW (Visible on mobile & tablets: < lg)
         ══════════════════════════════════════════════════════════ */}
      <div className="block lg:hidden space-y-2 mb-2">
        {/* Mobile Top Featured Banner */}
        <div className="group relative h-38 sm:h-56 w-full overflow-hidden rounded-2xl bg-slate-950">
          <img
            src={mobileHeroBanner.image}
            alt=""
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute bottom-3.5 left-3.5 z-10">
            <button
              type="button"
              className="cursor-pointer rounded-full bg-white px-4 py-2 text-[11px] font-bold text-slate-800 shadow-md transition-all duration-300 hover:bg-slate-100 active:scale-95 border-0"
            >
              SHOP NOW
            </button>
          </div>
        </div>
        {/* Mobile 2x2 Grid */}
        <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
          {mobileGridCards.map((category, index) => (
            <div
              key={index}
              className="group relative h-36 sm:h-40 w-full overflow-hidden rounded-xl bg-slate-950"
            >
              <img
                src={category.image}
                alt=""
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute bottom-2.5 left-2.5 z-10">
                <button
                  type="button"
                  className="cursor-pointer rounded-full bg-white px-3 py-1.5 text-[10px] font-bold text-slate-800 shadow-sm transition-all duration-300 hover:bg-slate-100 active:scale-95 border-0"
                >
                  SHOP NOW
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* ══════════════════════════════════════════════════════════
          DESKTOP VIEW (Visible on desktop: >= lg)
         ══════════════════════════════════════════════════════════ */}
      <div className="hidden lg:grid grid-cols-12 gap-1 w-full mb-0 ml-0">
        {desktopCategories.map((category, index) => (
          <div
            key={index}
            className={`
              ${category.className}
              group
              relative
              overflow-hidden   
              rounded-2xl
              bg-slate-950
            `}
          >
            {/* Image */}
            <img
              src={category.image}
              alt=""
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* Shop Button */}
            <div className="absolute bottom-5 left-5 z-10">
              <button
                type="button"
                className="cursor-pointer rounded-full bg-white px-5 py-2.5 text-xs font-bold text-slate-800 shadow-lg transition-all duration-300 hover:bg-slate-100 border-0"
              >
                SHOP NOW
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
