import React, { useState, useEffect } from 'react';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import { GET_PRODUCT_LIST } from '../GraphQL/Queries';
import { useMutation, useQuery } from '@apollo/client/react';
import { UPDATE_WISHLIST_MUTATION } from '../GraphQL/Mutation';
import { Link } from 'react-router-dom';
import { Heart, Trash2 } from "lucide-react";
import { toast } from 'sonner';
import { Helmet } from 'react-helmet-async';
import ProductCard from '../components/Catalog/ProductCard';
import "./Wishlist.css"; // Keep for any residual global styles, if needed

const WishlistScreen = () => {
  const [Token, setToken] = useState();
  const [wishlistProduct, setWishlistProduct] = useState([]);
  const [updateWishlist] = useMutation(UPDATE_WISHLIST_MUTATION);
  const [addwishlist, setAddWishlist] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!(localStorage.getItem("wishlistToken") === null || localStorage.getItem("wishlistToken") === undefined || localStorage.getItem("wishlistToken") === '')) {
      let wishToken = localStorage.getItem("wishlistToken");
      try {
        setAddWishlist(wishToken ? JSON.parse(wishToken) : []);
      } catch (e) {
        console.error("Corrupted wishlistToken found, resetting.", e);
        setAddWishlist([]);
        localStorage.setItem("wishlistToken", JSON.stringify([]));
      }
    }
    const getToken = localStorage.getItem('wishlistToken');
    if (getToken) {
      setToken(getToken);
    }
  }, []);

  let wishToken = [];
  if (!(localStorage.getItem("wishlistToken") === null || localStorage.getItem("wishlistToken") === undefined || localStorage.getItem("wishlistToken") === '')) {
    try {
      wishToken = JSON.parse(localStorage.getItem("wishlistToken"));
    } catch (e) {
      wishToken = [];
      localStorage.setItem("wishlistToken", JSON.stringify([]));
    }
  }

  const { loading, data, refetch, error } = useQuery(GET_PRODUCT_LIST, {
    fetchPolicy: "no-cache",
    skip: wishToken.length === 0,
    variables: {
      first: 12,
      channel: "default-channel",
      filter: {
        ids: wishToken,
      }
    }
  });

  useEffect(() => {
    if (data?.products?.edges) {
      setWishlistProduct(data.products.edges);
    }
  }, [data]);

  const handleToggleWishlist = (removeItemID, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (addwishlist.includes(removeItemID)) {
      let unWishlist = addwishlist?.filter((item) => item !== removeItemID);
      setAddWishlist(unWishlist);
      setWishlistProduct(prev => prev.filter(item => item.node.id !== removeItemID));
      localStorage.setItem("wishlistToken", JSON.stringify(unWishlist));

      if (localStorage.getItem("token")) {
        updateWishlist({
          context: { headers: { Authorization: "JWT " + localStorage.getItem("token") } },
          variables: { input: { wishlistToken: JSON.stringify(unWishlist) } },
          onCompleted: (data) => { console.log("Removed from Wishlist DB", data);toast.success("Removed from Wishlist", {
        duration: 2000,
      }); },
        });
      }
    }
  };

  const clearWatchlist = () => {
    setAddWishlist([]);
    setWishlistProduct([]);
    localStorage.setItem("wishlistToken", JSON.stringify([]));
    if (localStorage.getItem("token")) {
      updateWishlist({
        context: { headers: { Authorization: "JWT " + localStorage.getItem("token") } },
        variables: { input: { wishlistToken: JSON.stringify([]) } },
        onCompleted: (data) => { console.log("Cleared Wishlist DB", data); },
      });
    }
    toast.success("Watchlist cleared", {
  duration: 2000,
});
  };

  return (
    <>
      <Helmet>
        <title>Hegmakart: Watchlist</title>
        <meta name="description" content="Watchlist" />
      </Helmet>
      <Header />

      <main className="main w-full bg-slate-50 min-h-screen pb-12" style={{ fontFamily: "Outfit, sans-serif" }}>
        {loading ? (
          <div className='flex items-center justify-center min-h-[60vh]'>
            <h2 className="text-xl font-semibold text-slate-500 animate-pulse">Loading your watchlist...</h2>
          </div>
        ) : wishlistProduct?.length === 0 ? (
          <div className="min-h-[60vh] flex items-center justify-center px-4">
            <div className="text-center max-w-md">
              <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart size={40} className="text-red-400" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">
                Your Watchlist is Empty
              </h2>
              <p className="text-slate-500 text-sm mb-6">
                Save items you love by clicking the heart icon on
                products. They'll appear here for easy access.
              </p>
              <Link
                to="/"
                className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors no-underline"
              >
                Start Shopping
              </Link>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 py-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-2 px-2">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 m-0">
                  My Watchlist
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  {wishlistProduct.length}{" "}
                  {wishlistProduct.length === 1 ? "item" : "items"}{" "}
                  saved
                </p>
              </div>

              {wishlistProduct.length > 0 && (
                <button
                  onClick={clearWatchlist}
                  className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl border border-red-200 bg-red-50 text-red-600 text-sm font-semibold hover:bg-red-100 transition-all cursor-pointer"
                >
                  <Trash2 size={16} />
                  <span className="hidden sm:inline">Clear All</span>
                </button>
              )}
            </div>

            {/* Watchlist Grid */}
            <div className="watchlist-grid">
              {wishlistProduct?.map((item) => (
                <ProductCard
                  key={item.node.id}
                  product={item.node}
                  isInWishlist={true}
                  onToggleWishlist={handleToggleWishlist}
                  className="carousel-grid-card"
                />
              ))}
            </div>

            {/* Continue Shopping */}
            <div className="mt-3 text-center">
             <Link
  to="/"
  className="inline-flex items-center gap-3 px-8 py-4 text-xl font-bold text-blue-600 border border-blue-200 rounded-full hover:bg-blue-50 transition-colors no-underline"
> 
                Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </>
  );
};

export default WishlistScreen;
