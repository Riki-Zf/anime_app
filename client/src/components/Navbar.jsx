import React from "react";
import logo from "../assets/logo.png";

const Navbar = () => {
  return (
    <>
      {/* // alert */}
      <div role="alert" className="alert alert-info">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="h-6 w-6 shrink-0 stroke-current">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <marquee>web masih dalam tahap pengembangan, beberapa fitur belum berfungsi...</marquee>
      </div>

      <div className="navbar bg-base-100 flex justify-center">
        <img src={logo} alt="" className="w-30 h-12 p-1 sm:w-40 sm:h-15 md:w-50 md:h-20 lg:w-64 lg:h-20 justify-center" />
      </div>
    </>
  );
};

export default Navbar;
