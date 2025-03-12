import React from "react";
import { NavLink } from "react-router-dom";
const Menu = () => {
  return (
    <ul className="flex flex-wrap justify-center gap-4 md:gap-8 text-white font-bold text-sm md:text-base">
      <li>
        <NavLink to="/" className={({ isActive }) => (isActive ? "text-blue-400" : "hover:text-blue-400")}>
          HOME
        </NavLink>
      </li>
      <li>
        <NavLink to="/anime-list" className={({ isActive }) => (isActive ? "text-blue-400" : "hover:text-blue-400")}>
          POPULAR
        </NavLink>
      </li>
      <li>
        <NavLink to="/jadwal-rilis" className={({ isActive }) => (isActive ? "text-blue-400" : "hover:text-blue-400")}>
          JADWAL RILIS
        </NavLink>
      </li>
      <li>
        <NavLink to="/on-going" className={({ isActive }) => (isActive ? "text-blue-400" : "hover:text-blue-400")}>
          ON-GOING ANIME
        </NavLink>
      </li>
      <li>
        <NavLink to="/genre-list" className={({ isActive }) => (isActive ? "text-blue-400" : "hover:text-blue-400")}>
          GENRE LIST
        </NavLink>
      </li>
    </ul>
  );
};

export default Menu;
