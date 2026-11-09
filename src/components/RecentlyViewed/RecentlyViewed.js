import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client/react';
import { GET_PRODUCT_LIST } from '../../GraphQL/Queries';
import ProductCard from '../Catalog/ProductCard';

const RecentlyViewed = ({ excludeProductId }) => {
  const [recData, setRecData] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    // Read from localStorage
    let recent = [];
    try {
      recent = JSON.parse(localStorage.getItem('recentData')) || [];
      if (!Array.isArray(recent)) recent = [];
    } catch (e) {
      recent = [];
    }
    recent = recent.filter(id => id && typeof id === 'string' && id !== '[]' && id.trim() !== '');
    setRecData(recent);

    // Read wishlist
    let wt = JSON.parse(localStorage.getItem('wishlistToken')) || [];
    setWishlist(wt);
  }, []);

  const { data: productQueryResp } = useQuery(GET_PRODUCT_LIST, {
    variables: {
      first: 100,
      channel: 'default-channel',
      filter: {
        ids: recData,
      },
    },
    skip: recData.length === 0,
  });

  const onAddToWishlist = (id) => {
    if (!wishlist.includes(id)) {
      const newWishlist = [...wishlist, id];
      setWishlist(newWishlist);
      localStorage.setItem('wishlistToken', JSON.stringify(newWishlist));
    }
  };

  const removeWishlist = (id) => {
    if (wishlist.includes(id)) {
      const unWishlist = wishlist.filter((item) => item !== id);
      setWishlist(unWishlist);
      localStorage.setItem('wishlistToken', JSON.stringify(unWishlist));
    }
  };

  // Build the correctly sorted recently viewed list
  // The cache stores IDs in order. We want to display in reverse order (most recent first).
  // But we want to map gplProductData to those IDs.
  let sortedProducts = [];
  if (productQueryResp?.products?.edges && recData.length > 0) {
    const productMap = {};
    productQueryResp.products.edges.forEach(edge => {
      productMap[edge.node.id] = edge;
    });

    // Map ordered recData to product edges (filtering out any missing from query)
    sortedProducts = recData.map(id => productMap[id]).filter(Boolean);
  }

  // Filter out the excludeProductId if provided
  if (excludeProductId) {
    sortedProducts = sortedProducts.filter(edge => edge.node.id !== excludeProductId);
  }

  // Reverse to show the most recent first
  sortedProducts = sortedProducts.reverse();

  // console.log("=== RECENTLY VIEWED DEBUG ===");
  // console.log("Local Storage IDs (recData):", recData);
  // console.log("GraphQL Fetched Products (productQueryResp):", productQueryResp?.products?.edges || []);
  // console.log("Filtered & Sorted Products Object:", sortedProducts.map(p => ({ id: p.node.id, name: p.node.name })));
  // console.log("Exclude Product ID:", excludeProductId);

  if (sortedProducts.length === 0) {
    return null;
  }

  return (
    <>
      <div className="hidden md:block w-full max-w-[95%] mx-auto my-2">
        <div className="flex items-center justify-between border-b border-slate-200/80 pb-3 mb-0 -ml-8">
          <h2
            className="text-xl md:text-2xl font-black text-slate-900 flex items-center gap-2 m-0 tracking-tight ml-3 mr-3"
            style={{
              fontFamily: "Outfit, sans-serif",
              position: "relative",
            }}
          >
            <span className="text-2xl">👀</span> RECENTLY VIEWED
          </h2>
        </div>

        <div
          className="flex gap-0 overflow-x-auto pt-8 pb-12 pr-4 overflow-y-visible"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {sortedProducts.map((value) => {
            const productNode = value.node;
            const isInWishlist = wishlist.includes(productNode.id);

            return (
              <div key={`rec-${productNode.id}`} className="shrink-0">
                <ProductCard
                  product={productNode}
                  isInWishlist={isInWishlist}
                  onToggleWishlist={(productId, isInWish) => {
                    if (isInWish) {
                      removeWishlist(productId);
                    } else {
                      onAddToWishlist(productId);
                    }
                  }}
                  defaultDiscountBadge="-15%"
                />
              </div>
            );
          })}
        </div>
      </div>
      <div className="block md:hidden w-full max-w-[95%] mx-auto my-2 pt-4">
        <div className="flex items-center justify-between border-b border-slate-200/80 pb-3 mb-0">
          <h2
            className="text-xl font-black text-slate-900 flex items-center gap-2 m-0 tracking-tight ml-1"
            style={{ fontFamily: "Outfit, sans-serif" }}
          >
            <span className="text-2xl">👀</span> RECENTLY VIEWED
          </h2>
        </div>

        <div
          className="flex gap-0 overflow-x-auto pt-4 pb-8 pr-8"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {sortedProducts.map((value) => {
            const productNode = value.node;
            const isInWishlist = wishlist.includes(productNode.id);

            return (
              <div key={`rec-mobile-${productNode.id}`} className="shrink-0">
                <ProductCard
                  product={productNode}
                  isInWishlist={isInWishlist}
                  onToggleWishlist={(productId, isInWish) => {
                    if (isInWish) {
                      removeWishlist(productId);
                    } else {
                      onAddToWishlist(productId);
                    }
                  }}
                  defaultDiscountBadge="-15%"
                />
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default RecentlyViewed;
