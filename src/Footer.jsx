import React from "react";
import { useColors } from "./ColorProvider";

const Footer = () => {
  const colors = useColors();

  return (
    <footer className="w-100 text-center py-3" style={{ backgroundColor: colors.navbar_color, color: colors.navbar_font_color }}>
      <p className="m-0">2021 React Website. All Rights Reserved | Terms and Conditions</p>
    </footer>
  );
};

export default Footer;