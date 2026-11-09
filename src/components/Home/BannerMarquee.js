import React from 'react';
import { Link } from 'react-router-dom';
import './BannerMarquee.css';

const BannerMarquee = ({ bannerList }) => {
  // Flatten banners from all collections
  let allBanners = [];
  if (bannerList && bannerList.length > 0) {
    bannerList.forEach(col => {
      if (col?.node?.products?.edges) {
        col.node.products.edges.forEach(prod => {
          if (prod?.node?.media?.[0]?.url) {
            allBanners.push(prod);
          }
        });
      }
    });
  }
  
  if (allBanners.length === 0) return null;

  // Duplicate items to ensure enough exist for an infinite scroll 
  // (At least 12 required to look good in 2 rows, but more is better for CSS marquee)
  let displayBanners = [...allBanners];
  while (displayBanners.length < 16) {
    displayBanners = [...displayBanners, ...allBanners];
  }

  // Split into two rows
  const half = Math.ceil(displayBanners.length / 2);
  const row1 = displayBanners.slice(0, half);
  const row2 = displayBanners.slice(half);

  const renderBanner = (hproducts2, idx, rowKey) => {
    let linkPath = null;
    if (hproducts2.node.metadata?.length > 0) {
       const collectionMeta = hproducts2.node.metadata.find(m => m.key === 'collection');
       const productMeta = hproducts2.node.metadata.find(m => m.key === 'product');
       if (collectionMeta) linkPath = `/collection/${collectionMeta.value}`;
       else if (productMeta) linkPath = `/product/${productMeta.value}`;
    }

    const content = (
      <img
        src={hproducts2.node.media[0].url}
        className="banner-image"
        alt={hproducts2.node.name || "Banner"}
        loading="eager"
        decoding="async"
      />
    );

    return (
      <div key={`${rowKey}-${hproducts2.node.id}-${idx}`} className="banner-item ui2-glow-card">
        {linkPath ? (
           <Link to={{ pathname: linkPath }} className="banner-link">
             {content}
           </Link>
        ) : (
           content
        )}
      </div>
    );
  };

  return (
    <div className="banner-marquee-section">
      <div className="marquee-row">
        <div className="marquee-content left-to-right">
          {row1.map((item, idx) => renderBanner(item, idx, 'r1a'))}
          {row1.map((item, idx) => renderBanner(item, idx, 'r1b'))}
        </div>
      </div>
      {/* <div className="marquee-row">
        <div className="marquee-content right-to-left">
          {row2.map((item, idx) => renderBanner(item, idx, 'r2a'))}
          {row2.map((item, idx) => renderBanner(item, idx, 'r2b'))}
        </div>
      </div> */}
    </div>
  );
};

export default BannerMarquee;
