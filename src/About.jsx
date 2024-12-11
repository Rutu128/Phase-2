import React from "react";
import web from "../src/images/homepage2.png";
import { NavLink } from "react-router-dom";
import Common from "./Common";
import { useColors } from "./ColorProvider";

const About = () => {
  const colors = useColors();

  return (
    <div style={{ backgroundColor: colors.background_color, color: colors.page_font_color,minHeight:'100vh',paddingTop:'12rem' }}>
      <Common 
        name="Welcome to About page" 
        imgsrc={web} 
        visit="/contact" 
        btname="Contact Now" 
      />
    </div>
  );
};

export default About;