import React from "react";
import logo from "../assets/logo.png";

const Navbar = () => {
  return (
    <>
      <div className="navbar bg-base-100 flex justify-center">
        <img src={logo} alt="" className="w-30 h-12 p-1 sm:w-40 sm:h-15 md:w-56 md:h-20 lg:w-64 lg:h-20 justify-center" />
      </div>
    </>
  );
};

export default Navbar;
