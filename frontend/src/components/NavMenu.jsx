import React from "react";
import { NavLink, useLocation } from "react-router";
import "./NavMenu.css";

const NavMenu = ({ navMenu }) => {
  return navMenu.map((navMenu, i) => (
    <NavLink
      end={navMenu.link === "/dashboard"}
      to={navMenu.link}
      key={i}
      className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
    >
      <img src={navMenu.img} />
      {navMenu.name}
    </NavLink>
  ));
};

export default NavMenu;
