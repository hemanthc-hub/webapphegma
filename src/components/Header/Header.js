import React from "react";
import StickyHeader from "./StickyHeader";

const Header = () => {
  return (
    <header className="header w-full m-0 p-0 sticky top-0 z-[100] bg-white">
      <StickyHeader />
    </header>
  );
};

export default Header;
