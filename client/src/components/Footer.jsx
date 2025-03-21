import React from "react";
import logo from "../assets/logo.png";

const Footer = () => {
  return (
    <footer className="flex flex-col md:flex-row justify-between items-center w-full bg-neutral text-neutral-content p-4 md:p-10 text-center gap-4 md:gap-8 mt-16 md:mt-36">
      <aside className="flex flex-col items-center w-full md:w-auto">
        <img src={logo} alt="Logo" className="w-24 h-10 p-1 sm:w-36 sm:h-15 md:w-48 md:h-20 lg:w-64 lg:h-20 " />
      </aside>
      <nav className="flex flex-col items-center w-full md:w-auto mt-4 md:mt-0">
        <h6 className="footer-title text-base md:text-lg mb-2 md:mb-3">About me</h6>
        <div className="flex justify-center gap-4">
          <a className="hover:opacity-75 transition-opacity" href="https://github.com/Riki-Zf">
            <i className="fa-brands fa-github fa-lg"></i>
          </a>
          <a className="hover:opacity-75 transition-opacity" href="https://www.instagram.com/rikyy_zf/">
            <i className="fa-brands fa-instagram fa-lg"></i>
          </a>
          <a className="hover:opacity-75 transition-opacity" href="mailto:rikipatande81979@gmail.com">
            <i className="fa-regular fa-envelope fa-lg"></i>{" "}
          </a>
        </div>
      </nav>
    </footer>
  );
};

export default Footer;
