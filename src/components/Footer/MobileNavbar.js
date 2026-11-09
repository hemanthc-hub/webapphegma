import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client/react";
import {
  Home,
  Grid,
  Heart,
  User,
  ShoppingCart,
  X,
  ChevronDown,
  ChevronUp,
  FolderOpen,
  RotateCcw
} from "lucide-react";
import { GET_CATEGORIES_SUBLIST, GET_CHECKOUT_BY_TOKEN } from "../../GraphQL/Queries";
import "./Footer.css";

const MobileNavbar = () => {
  const [showCategories, setShowCategories] = useState(false);
  const [showSubIcon, setShowSubIcon] = useState("");
  const [categories, setCategories] = useState([]);
  const [quantity, setQuantity] = useState(0);
  const [wishlistQuantity, setWishlistQuantity] = useState(0);
  const [cartTokenState, setCartTokenState] = useState(localStorage.getItem("cartToken"));
  const location = useLocation();
  const navigate = useNavigate();
  const loggedInUser = localStorage.getItem("user");

  // Live Saleor category query
  const { data: catData } = useQuery(GET_CATEGORIES_SUBLIST, {
    variables: { first: 20, level: 0 },
    fetchPolicy: "cache-first"
  });

  useEffect(() => {
    if (catData?.categories?.edges) {
      setCategories(catData.categories.edges);
    }
  }, [catData]);

  // Wishlist count syncer
  useEffect(() => {
    const checkWishlist = () => {
      try {
        let tokenStr = localStorage.getItem("wishlistToken");
        if (tokenStr) {
          let arr = JSON.parse(tokenStr);
          if (Array.isArray(arr)) {
            arr = arr.filter(id => id && typeof id === "string" && id !== "[]" && id.trim() !== "");
            setWishlistQuantity(arr.length);
            return;
          }
        }
        setWishlistQuantity(0);
      } catch (e) {
        setWishlistQuantity(0);
      }
    };
    checkWishlist();
    window.addEventListener("wishlistUpdated", checkWishlist);
    return () => window.removeEventListener("wishlistUpdated", checkWishlist);
  }, []);

  // Live Cart count indicator
  const { data: cartData, refetch: refetchCart } = useQuery(GET_CHECKOUT_BY_TOKEN, {
    fetchPolicy: "cache-first",
    skip: !cartTokenState,
    variables: { token: cartTokenState },
  });

  useEffect(() => {
    if (cartData && !cartData.checkout) {
      localStorage.removeItem("cartToken");
      setCartTokenState(null);
      return;
    }
    if (cartData?.checkout?.lines) {
      setQuantity(cartData.checkout.lines.length || cartData.checkout.quantity || 0);
    }
  }, [cartData]);

  useEffect(() => {
    const onCartUpdated = () => {
      setCartTokenState(localStorage.getItem("cartToken"));
      if (refetchCart) refetchCart();
    };
    window.addEventListener("cart-updated", onCartUpdated);
    return () => window.removeEventListener("cart-updated", onCartUpdated);
  }, [refetchCart]);

  return (
    <div className="md:hidden font-sans">
      {/* Category Drawer Modal */}
      {showCategories && (
        <div className="fixed inset-0 z-[9999] flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
            onClick={() => setShowCategories(false)}
          />

          {/* Drawer Content */}
          <div className="relative w-[90%] max-w-md bg-sky-100 text-slate-800 h-full overflow-y-auto shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-300">
            <div className="p-5 border-b border-sky-200 flex items-center justify-between bg-sky-200/80 sticky top-0 z-20 backdrop-blur">
              <div className="flex items-center gap-2.5">
                <FolderOpen size={20} className="text-[#2563EB]" />
                <span
                  className="font-extrabold text-2xl tracking-wide"
                  style={{ fontFamily: "Outfit, sans-serif" }}
                >
                  Medical Categories
                </span>
              </div>
              <button
                onClick={() => setShowCategories(false)}
                className="w-12 h-12 rounded-full bg-transparent text-black hover:text-black hover:bg-transparent flex items-center justify-center border-0 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <nav className="flex-1 p-3 space-y-1">
              {categories.map(({ node }) => (
                <div key={node.id} className="border-b border-sky-200 last:border-0 pb-1">
                  <div className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-sky-200 transition-colors">
                    <Link
                      to={`/category/${node.slug}`}
                      onClick={() => setShowCategories(false)}
                      className="text-black font-medium  text-2xl no-underline flex-1 truncate pr-2 hover:text-blue-900"
                    >
                      {node.name}
                    </Link>
                    {node.children?.edges?.length > 0 && (
                      <button
                        onClick={() =>
                          setShowSubIcon(showSubIcon === node.id ? "" : node.id)
                        }
                        className="p-1 text-black bg-transparent hover:bg-transparent hover:text-black rounded-lg border-0 cursor-pointer"
                      >
                        {showSubIcon === node.id ? (
                          <ChevronUp size={16} />
                        ) : (
                          <ChevronDown size={16} />
                        )}
                      </button>
                    )}
                  </div>

                  {showSubIcon === node.id && node.children?.edges?.length > 0 && (
                    <ul className="pl-6 pr-2 py-1 space-y-1 list-none m-0 bg-transparent rounded-xl border-l-2 border-[#2563EB] ml-3 my-1">
                      {node.children.edges.map(({ node: subNode }) => (
                        <li key={subNode.id}>
                          <Link
                            to={`/category/${node.slug}/${subNode.slug}`}
                            onClick={() => setShowCategories(false)}
                            className="block py-2 px-2 text-lg text-black hover:text-black no-underline transition-colors rounded-lg bg-transparent hover:bg-transparent"
                          >
                            &bull; {subNode.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Modern UI2 Sticky Bottom Navigation Bar */}
      {!location.pathname.startsWith("/new-clinic-setup/") && (
        <div className="fixed bottom-0 left-0 right-0 z-[100] bg-white/95 backdrop-blur-md border-t border-slate-200/80 shadow-[0_-4px_16px_rgba(0,0,0,0.08)] flex items-center justify-around py-1 px-1 h-24 lg:hidden">

          <Link
            to="/"
            className={`flex flex-col items-center justify-center flex-1 py-1 no-underline transition-all ${location.pathname === "/"
              ? "text-blue-600 scale-105 font-bold"
              : "text-slate-600 hover:text-blue-600 font-medium"
              }`}
          >
            <Home size={20} />
            <span className="text-[11px] mt-1">Home</span>
          </Link>

          <button
            onClick={() => setShowCategories(true)}
            className={`flex flex-col items-center justify-center flex-1 py-1 bg-transparent border-0 cursor-pointer transition-all ${showCategories
              ? "text-blue-500 font-bold"
              : "text-slate-600 hover:text-blue-500 font-medium"
              }`}
          >
            <Grid size={20} />
            <span className="text-[11px] mt-1">Categories</span>
          </button>

          <Link
            to="/offline-order"
            className="flex flex-col items-center justify-center flex-1 py-1 no-underline transition-all text-slate-600 hover:text-blue-600 font-medium"
          >
            <img
              src="/landing/img/icons/clinicsetup.png"
              alt="New Clinic Setup"
              className="w-10 h-13 object-contain"
            />
            <span className="text-[11px] mt-1">Clinic Setup</span>
          </Link>

          <button
            onClick={() => navigate("/reorder")}
            className="flex flex-col items-center justify-center flex-1 py-1 bg-transparent border-0 cursor-pointer transition-all text-slate-600 hover:text-orange-500 font-medium"
          >
            <RotateCcw size={20} />
            <span className="text-[11px] mt-1">Reorder</span>
          </button>

        </div>
      )}
    </div>
  );
};

export default MobileNavbar;
