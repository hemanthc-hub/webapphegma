import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/client/react";
import { GET_PRODUCT_LIST } from "../../GraphQL/Queries";
import ProductCard from "./ProductCard";

interface RelatedProductsProps {
  categoryId?: string;
  excludeProductId?: string;
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({ categoryId, excludeProductId }) => {
  const [wishlist, setWishlist] = useState<string[]>([]);

  useEffect(() => {
    try {
      const wt = JSON.parse(localStorage.getItem("wishlistToken") || "[]");
      setWishlist(Array.isArray(wt) ? wt : []);
    } catch (e) {
      setWishlist([]);
    }
  }, []);

  const { data: productQueryResp, loading } = useQuery<any>(GET_PRODUCT_LIST, {
    variables: {
      first: 15,
      channel: "default-channel",
      filter: {
        categories: categoryId ? [categoryId] : undefined,
      },
    },
    skip: !categoryId,
    fetchPolicy: "cache-and-network"
  });

  const onAddToWishlist = (id: string) => {
    if (!wishlist.includes(id)) {
      const newWishlist = [...wishlist, id];
      setWishlist(newWishlist);
      localStorage.setItem("wishlistToken", JSON.stringify(newWishlist));
    }
  };

  const removeWishlist = (id: string) => {
    if (wishlist.includes(id)) {
      const unWishlist = wishlist.filter((item) => item !== id);
      setWishlist(unWishlist);
      localStorage.setItem("wishlistToken", JSON.stringify(unWishlist));
    }
  };

  let products = (productQueryResp as any)?.products?.edges || [];

  if (excludeProductId) {
    products = products.filter((edge: any) => edge.node.id !== excludeProductId);
  }

  if (loading) {
    return (
      <div className="w-full max-w-[95%] mx-auto my-8">
        <div className="flex items-center justify-between border-b border-slate-200/80 pb-3 mb-4">
          <div className="h-7 w-48 bg-slate-200 rounded animate-pulse"></div>
        </div>
        <div className="flex gap-4 overflow-hidden pt-4 pb-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="w-[150px] h-[250px] bg-slate-100 rounded-2xl animate-pulse shrink-0"></div>
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <>
      <div className="hidden md:block w-full max-w-[95%] mx-auto my-1">


        <div className="flex items-center justify-start border-b border-slate-200/80 pb-3 mb-1 mr-2 -ml-8">
          <h2
            className="text-xl md:text-2xl font-black text-slate-900 flex items-center gap-2 m-0 tracking-tight ml-[10px] md:ml-0"
            style={{ fontFamily: "Outfit, sans-serif" }}
          >
            <span className="text-2xl">🔥</span> SIMILAR PRODUCTS
          </h2>
        </div>


        <div
          className="flex gap-0 overflow-x-auto pt-0 pb-12 px-0 overflow-y-visible"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {products.map((value: any) => {
            const productNode = value.node;
            const isInWishlist = wishlist.includes(productNode.id);
            return (
              <div
                key={`rel-${productNode.id}`}
                className="shrink-0"
              >
                <ProductCard
                  product={productNode}
                  isInWishlist={isInWishlist}
                  onToggleWishlist={(productId, e) => {
                    if (isInWishlist) {
                      removeWishlist(productId);
                    } else {
                      onAddToWishlist(productId);
                    }
                  }}
                  defaultDiscountBadge="-10%"
                />
              </div>
            );
          })}
        </div>
      </div>
      {/*Mobile View*/}
      <div className="block md:hidden w-full my-2 px-2">
        <div className="flex items-center border-b border-slate-200/80 pb-0 mb-0">
          <h2
            className="text-xl md:text-2xl font-black text-slate-900 flex items-center gap-2 mb-2 tracking-tight ml-4"
            style={{
              fontFamily: "Outfit, sans-serif",
              position: "relative",
              left: "-10px",
            }}
          >
            <span className="text-2xl">🔥</span> SIMILAR PRODUCTS
          </h2>
        </div>

        <div
          className="flex gap-0 overflow-x-auto pb-6 pl-[15px]"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {products.map((value: any) => {
            const productNode = value.node;
            const isInWishlist = wishlist.includes(productNode.id);

            return (
              <div key={`mobile-rel-${productNode.id}`} className="shrink-0">
                <ProductCard
                  product={productNode}
                  isInWishlist={isInWishlist}
                  onToggleWishlist={(productId, e) => {
                    if (isInWishlist) {
                      removeWishlist(productId);
                    } else {
                      onAddToWishlist(productId);
                    }
                  }}
                  defaultDiscountBadge="-10%"
                />
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default RelatedProducts;
