import React from "react";
import { NavLink } from "react-router-dom";
import { useColors } from "./ColorProvider";

const Navbar = () => {
  const colors = useColors();

  return (
    <div className="container-fluid nav_bg" style={{ backgroundColor: colors.navbar_color }}>
      <div className="row">
        <div className="col-10 mx-auto">
          <nav className="navbar navbar-expand-lg">
            <div className="container-fluid">
              <NavLink className="navbar-brand" to="/" style={{ color: colors.navbar_font_color }}>
                React Website
              </NavLink>
              <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent"
                aria-expanded="false"
                aria-label="Toggle navigation"
                style={{ backgroundColor: colors.button_color, color: colors.navbar_font_color }}
              >
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className="collapse navbar-collapse justify-content-end" id="navbarSupportedContent">
                <ul className="navbar-nav mb-2 mb-lg-0">
                  {["Home", "Service", "About", "Contact", "Recordings"].map((item) => (
                    <li className="nav-item" key={item}>
                      <NavLink
                        className="nav-link"
                        exact={item === "Home"}
                        to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                        style={{ color: colors.navbar_font_color }}
                        activeStyle={{ fontWeight: "bold", textDecoration: "underline" }}
                      >
                        {item}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Navbar;