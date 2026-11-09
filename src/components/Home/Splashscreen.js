import React from "react";
import "./Splashscreen.css";

const SplashScreen = () => {
  return (
    <div className="hegma-splash" role="status" aria-label="Loading Hegmakart">
      <img
        src="/assets/images/logo3.png"
        alt="Hegmakart"
        className="hegma-splash-logo"
      />

      <div className="hegma-splash-loader" aria-hidden="true"></div>
    </div>
  );
};

export default SplashScreen;