import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

const ColorContext = createContext();

export const useColors = () => useContext(ColorContext);

export const ColorProvider = ({ children }) => {
  const CLOUDFLARE_WORKER_URL =
    "https://color-versions-worker.rutubhimani123.workers.dev";

  const [colors, setColors] = useState(() => {
    const savedColors = localStorage.getItem("colors");
    return savedColors
      ? JSON.parse(savedColors)
      : {
          background_color: "rgb(255, 255, 255)",
          button_color: "rgb(22, 32, 45)",
          secondary_button_color: "rgb(202, 213, 213)",
          navbar_color: "rgb(160, 162, 165)",
          page_font_color: "rgb(0, 0, 0)",
          button_font_color: "rgb(255, 255, 255)",
          shepherd_button_color: "#fff",
          shepherd_header_color: "#fff",
          font_style: "Arial, sans-serif",
        };
  });

  const calculateContrastingColor = (bgColor) => {
    const hexToRgb = (hex) => {
      hex = hex.replace("#", "");
      if (hex.length === 3)
        hex = hex
          .split("")
          .map((char) => char + char)
          .join("");
      const bigint = parseInt(hex, 16);
      return [
        (bigint >> 16) & 255, 
        (bigint >> 8) & 255, 
        bigint & 255
      ];
    };
  
    // Normalize input to RGB array
    let rgb;
    if (Array.isArray(bgColor)) {
      rgb = bgColor;
    } else if (typeof bgColor === "string" && bgColor.startsWith("#")) {
      rgb = hexToRgb(bgColor);
    } else if (typeof bgColor === "string" && bgColor.startsWith("rgb")) {
      // Extract numbers from rgb string
      rgb = bgColor.match(/\d+/g)?.map(Number);
    }
  
    // Validate RGB
    if (!rgb || rgb.length !== 3) return "rgb(0, 0, 0)";
  
    // Calculate relative luminance (W3C formula)
    const getRGB = (c) => {
      c /= 255;
      return c <= 0.03928
        ? c / 12.92
        : Math.pow((c + 0.055) / 1.055, 2.4);
    };
  
    const r = getRGB(rgb[0]);
    const g = getRGB(rgb[1]);
    const b = getRGB(rgb[2]);
  
    const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  
    // Improved contrast logic
    return luminance > 0.5 
      ? "rgb(0, 0, 0)"  // Dark text for light backgrounds
      : "rgb(255, 255, 255)";  // White text for dark backgrounds
  };

  const convertToRgbString = (color) => {
    return Array.isArray(color)
      ? `rgb(${color[0]}, ${color[1]}, ${color[2]})`
      : color;
  };
  const fontStyles = [
    "Arial, sans-serif",
    "Georgia, serif",
    "Tahoma, sans-serif",
    "Comic Sans MS, sans-serif",
    "Times New Roman, serif",
    "Verdana, sans-serif",
  ];
  const getRandomFontStyle = () => {
    return fontStyles[Math.floor(Math.random() * fontStyles.length)];
  };

  const updateColors = async () => {
    try {
      // Attempt to fetch random color version from RL endpoint
      const response = await fetch(
        "https://cloudexpresssolutions.com:5000/run-rl"
      );
      const randomVersion = await response.json();
      console.log("color fetched from rl", randomVersion);
      const newColors = {
        background_color: convertToRgbString(
          randomVersion.data.background_color

        ),
        button_color: convertToRgbString(randomVersion.data.button_color),
        secondary_button_color: convertToRgbString(
          randomVersion.data.secondaryButtonColor || [202, 213, 213]
        ),
        navbar_color: convertToRgbString(randomVersion.data.navbar_color
        ),
        shepherd_button_color: convertToRgbString(
          randomVersion.data.shepherd_button_color

        ),
        shepherd_header_color: convertToRgbString(
          randomVersion.data.shepherd_header_color

        ),
        page_font_color: calculateContrastingColor(
          randomVersion.data.background_color
        ),
        button_font_color: calculateContrastingColor(
          randomVersion.data.button_color
        ),
        font_style: getRandomFontStyle(),
      };
      console.log(newColors);

      setColors(newColors);
      localStorage.setItem("colors", JSON.stringify(newColors));
      localStorage.setItem("lastColorUpdate", Date.now().toString());

      // Optionally, send this version back to the Cloudflare Worker
      await fetch(CLOUDFLARE_WORKER_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newColors),
      });
    } catch (error) {
      console.error(
        "Error fetching from RL endpoint, falling back to KV storage:",
        error
      );

      // Fallback to Cloudflare KV storage
      try {
        const kvResponse = await fetch(CLOUDFLARE_WORKER_URL);
        const { versions } = await kvResponse.json();
        console.log("from kv");

        if (versions && versions.length > 0) {
          const randomIndex = Math.floor(Math.random() * versions.length);
          const fallbackColors = versions[randomIndex];
          const newColors = {
            background_color: convertToRgbString(
              fallbackColors.backgroundColor
            ),
            button_color: convertToRgbString(fallbackColors.buttonColor),
            secondary_button_color: convertToRgbString(
              fallbackColors.secondaryButtonColor
            ),
            navbar_color: convertToRgbString(fallbackColors.navbarColor),
            shepherd_button_color: convertToRgbString(
              fallbackColors.shepherdbutton
            ),
            shepherd_header_color: convertToRgbString(
              fallbackColors.shepherdheader
            ),
            page_font_color: calculateContrastingColor(
              fallbackColors.backgroundColor
            ),
            button_font_color: calculateContrastingColor(
              fallbackColors.buttonColor
            ),
            font_style: fallbackColors.fontStyle,
          };
          console.log(newColors);
          setColors(newColors);
          localStorage.setItem("colors", JSON.stringify(newColors));
          localStorage.setItem("lastColorUpdate", Date.now().toString());
        }
      } catch (kvError) {
        console.error("Error fetching from KV storage:", kvError);
      }
    }
  };

  useEffect(() => {
    const interval = setInterval(updateColors, 30 * 1000); // Every minute
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--header-background",
      colors.shepherd_header_color
    );
    document.documentElement.style.setProperty(
      "--button-background",
      colors.shepherd_button_color
    );
    document.documentElement.style.setProperty(
      "--secondary-button-background",
      colors.secondary_button_color
    );
    document.documentElement.style.setProperty(
      "--button-hover-usenavbar",
      colors.background_color
    );
  }, [colors]);

  return (
    <ColorContext.Provider value={colors}>{children}</ColorContext.Provider>
  );
};

export default ColorProvider;
