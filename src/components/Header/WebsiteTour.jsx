import React, { useEffect, useCallback } from "react";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

const tourStyles = `
.hegma-tour-popover {
  border-radius: 16px !important;
  padding: 16px 18px !important;
  font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.15) !important;
  max-width: min(340px, calc(100vw - 32px)) !important;
  z-index: 100000 !important;
}
.hegma-tour-popover .driver-popover-title {
  font-size: 16px !important;
  font-weight: 700 !important;
  color: #0f172a !important;
  margin-bottom: 6px !important;
  line-height: 1.3 !important;
}
.hegma-tour-popover .driver-popover-description {
  font-size: 13.5px !important;
  color: #475569 !important;
  line-height: 1.5 !important;
  margin-bottom: 12px !important;
}
.hegma-tour-popover .driver-popover-progress-text {
  font-size: 11px !important;
  font-weight: 600 !important;
  color: #94a3b8 !important;
}
.hegma-tour-popover .driver-popover-footer button {
  border-radius: 10px !important;
  font-size: 12.5px !important;
  font-weight: 600 !important;
  padding: 7px 16px !important;
  cursor: pointer !important;
  transition: all 0.2s ease !important;
}
.hegma-tour-popover .driver-popover-next-btn {
  background-color: #2563eb !important;
  color: #ffffff !important;
  border: none !important;
}
.hegma-tour-popover .driver-popover-next-btn:hover {
  background-color: #1d4ed8 !important;
}
.hegma-tour-popover .driver-popover-prev-btn {
  color: #475569 !important;
  background-color: #f1f5f9 !important;
  border: 1px solid #e2e8f0 !important;
}
.hegma-tour-popover .driver-popover-prev-btn:hover {
  background-color: #e2e8f0 !important;
}
.hegma-tour-popover .driver-popover-close-btn {
  color: #64748b !important;
  font-size: 20px !important;
  font-weight: 700 !important;
  cursor: pointer !important;
  padding: 2px 6px !important;
  border-radius: 6px !important;
  transition: all 0.15s ease !important;
  pointer-events: auto !important;
}
.hegma-tour-popover .driver-popover-close-btn:hover {
  color: #0f172a !important;
  background-color: #f1f5f9 !important;
}

/* Mobile: ensure the clinical banner popover is docked at the bottom of the screen so it never covers the section title/banners */
@media (max-width: 767px) {
  .hegma-tour-popover.tour-clinical-popover-mobile {
    position: fixed !important;
    top: auto !important;
    bottom: 24px !important;
    left: 12px !important;
    right: 12px !important;
    width: calc(100vw - 24px) !important;
    max-width: calc(100vw - 24px) !important;
    transform: none !important;
    margin: 0 auto !important;
    z-index: 100002 !important;
  }
  .hegma-tour-popover.tour-clinical-popover-mobile .driver-popover-arrow {
    display: none !important;
  }
}
`;

/**
 * Helper to find the first actually visible element matching one of the given selectors.
 * Accounts for responsive designs where desktop and mobile elements both exist in the DOM
 * but only one is displayed (via display: none / hidden / md:hidden).
 */
export const getVisibleElement = (selectors) => {
  const selectorList = Array.isArray(selectors) ? selectors : [selectors];
  for (const selector of selectorList) {
    const elements = document.querySelectorAll(selector);
    for (const el of elements) {
      if (!el) continue;
      const style = window.getComputedStyle(el);
      if (
        style.display === "none" ||
        style.visibility === "hidden" ||
        style.opacity === "0"
      ) {
        continue;
      }
      const rect = el.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        console.log(`[WebsiteTour Debug] Resolved visible element for "${selector}":`, {
          element: el,
          rect: { width: rect.width, height: rect.height, top: rect.top, left: rect.left },
          viewportWidth: window.innerWidth,
          isMobile: window.innerWidth < 768
        });
        return el;
      }
      if (el.offsetParent !== null) {
        console.log(`[WebsiteTour Debug] Resolved visible offsetParent element for "${selector}":`, el);
        return el;
      }
    }
  }
  console.warn(`[WebsiteTour Debug] Could not locate visible element for selectors:`, selectorList, {
    viewportWidth: window.innerWidth,
    isMobile: window.innerWidth < 768
  });
  return null;
};

const WebsiteTour = () => {
  const startTour = useCallback(() => {
    const isMobile = window.innerWidth < 768;
    console.log("[WebsiteTour Debug] Starting tour...", {
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
      isMobile,
      userAgent: navigator.userAgent
    });

    const steps = [
      // 1. hegmakrt logo
      {
        element: () => getVisibleElement([".tour-logo", ".logo"]),
        popover: {
          title: "HegmaKart Logo",
          description: "Welcome to HegmaKart! Click the logo anytime to navigate directly back to the homepage.",
          side: "bottom",
          align: "start"
        }
      },
      // 2. location
      {
        element: () => getVisibleElement([".tour-location", "#desktop-location-container", ".location"]),
        popover: {
          title: "Select Location",
          description: "Set your delivery location or pincode to check product availability and delivery timelines.",
          side: "bottom",
          align: "start"
        }
      },
      // 3. login/account
      {
        element: () => getVisibleElement([".tour-account", ".account", "a[href='/login']"]),
        popover: {
          title: "Login / Account",
          description: "Sign in, track your orders, manage saved clinic addresses, and access your profile.",
          side: "bottom",
          align: isMobile ? "center" : "end"
        }
      },
      // 4. cart
      {
        element: () => getVisibleElement([".tour-cart", ".cart", "button[aria-label='Cart']"]),
        popover: {
          title: "Shopping Cart",
          description: "View and review items you've added to your cart before proceeding to checkout.",
          side: "bottom",
          align: isMobile ? "center" : "end"
        }
      },
      // 5. wishlist
      {
        element: () => getVisibleElement([".tour-wishlist", ".wishlist", "a[href='/wishlist']"]),
        popover: {
          title: "Wishlist",
          description: "Save your favorite dental and clinical supplies to easily order them whenever you need.",
          side: "bottom",
          align: isMobile ? "center" : "end"
        }
      },
      // 6. category
      {
        element: () => getVisibleElement([".tour-category", "button[data-menu-toggle='true']"]),
        popover: {
          title: "Categories",
          description: "Browse our complete catalog of dental equipment, instruments, consumables, and specialties.",
          side: "bottom",
          align: "start"
        }
      },
      // 7. New Clinical Launches & Advanced Tech (ONLY the Clinical Banner section: Header + 3 Hero Cards)
      {
        element: () => getVisibleElement([".tour-clinical-banner-section", ".tour-new-launches"]),
        popover: {
          title: "New Clinical Launches & Advanced Tech",
          description: "Discover the latest cutting-edge dental technologies, clinical launches, and innovation showcases.",
          side: "bottom",
          align: "center",
          popoverClass: "hegma-tour-popover tour-clinical-popover-mobile"
        }
      }
    ];

    let driverInstance = null;

    driverInstance = driver({
      showProgress: true,
      animate: true,
      smoothScroll: true,
      allowClose: true,
      overlayClickBehavior: "close",
      overlayOpacity: 0.65,
      stagePadding: isMobile ? 4 : 8,
      stageRadius: 16,
      popoverClass: "hegma-tour-popover",
      nextBtnText: "Next →",
      prevBtnText: "← Back",
      doneBtnText: "Finish",
      onCloseClick: () => {
        console.log("[WebsiteTour Debug] Close (X) clicked by user, destroying tour");
        if (driverInstance) {
          driverInstance.destroy();
        }
      },
      onDoneClick: () => {
        console.log("[WebsiteTour Debug] Finish/Done button clicked by user, ending tour");
        if (driverInstance) {
          driverInstance.destroy();
        }
      },
      onHighlightStarted: (element, step, { index }) => {
        console.log(`[WebsiteTour Debug] Step ${index + 1}/${steps.length} highlight started:`, {
          title: step.popover?.title,
          element,
          index
        });
        if (element) {
          const isMobile = window.innerWidth < 768;
          const headerEl = document.querySelector("header");
          const headerHeight = headerEl ? headerEl.offsetHeight : (isMobile ? 110 : 80);
          const rect = element.getBoundingClientRect();
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          const targetY = rect.top + scrollTop - headerHeight - (isMobile ? 8 : 16);
          window.scrollTo({
            top: Math.max(0, targetY),
            behavior: "smooth"
          });
        }
      },
      onHighlighted: (element, step, { index }) => {
        console.log(`[WebsiteTour Debug] Step ${index + 1}/${steps.length} highlighted successfully:`, {
          title: step.popover?.title,
          element
        });
      },
      onDestroyed: (element, step, { reason }) => {
        console.log("[WebsiteTour Debug] Tour fully destroyed & closed. Reason:", reason);
      },
      steps
    });

    driverInstance.drive();
  }, []);

  // Expose global trigger for manual testing or external component triggers
  useEffect(() => {
    window.startWebsiteTour = startTour;
    return () => {
      delete window.startWebsiteTour;
    };
  }, [startTour]);

  return (
    <>
      <style>{tourStyles}</style>
      <button
        type="button"
        onClick={startTour}
        className="rounded-full bg-blue-600 px-5 py-2 text-white hover:bg-blue-700 transition-colors shadow-sm font-medium text-sm cursor-pointer"
      >
        Tour
      </button>
    </>
  );
};

export default WebsiteTour;
