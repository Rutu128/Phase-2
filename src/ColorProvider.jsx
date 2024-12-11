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
      return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
    };

    let rgb;
    if (Array.isArray(bgColor)) {
      rgb = bgColor;
    } else if (typeof bgColor === "string" && bgColor.startsWith("#")) {
      rgb = hexToRgb(bgColor);
    } else if (typeof bgColor === "string") {
      rgb = bgColor.match(/\d+/g)?.map(Number);
    }

    if (!rgb || rgb.length !== 3) return "rgb(0, 0, 0)";

    const [r, g, b] = rgb.map((c) =>
      c / 255 <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    );
    const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    return luminance > 0.179 ? "rgb(0, 0, 0)" : "rgb(255, 255, 255)";
  };

  const convertToRgbString = (color) => {
    return Array.isArray(color)
      ? `rgb(${color[0]}, ${color[1]}, ${color[2]})`
      : color;
  };

  const updateColors = async () => {
    try {
      // Attempt to fetch random color version from RL endpoint
      const response = await fetch(
        "https://cloudexpresssolutions.com:5000/run-rl"
      );
      const randomVersion = await response.json();
      console.log("color fetched from rl");
      const newColors = {
        background_color: convertToRgbString(
          randomVersion.backgroundColor || [255, 255, 255]
        ),
        button_color: convertToRgbString(
          randomVersion.buttonColor || [22, 32, 45]
        ),
        secondary_button_color: convertToRgbString(
          randomVersion.secondaryButtonColor || [202, 213, 213]
        ),
        navbar_color: convertToRgbString(
          randomVersion.navbarColor || [160, 162, 165]
        ),
        shepherd_button_color: convertToRgbString(
          randomVersion.shepherdButtonColor || [255, 255, 255]
        ),
        shepherd_header_color: convertToRgbString(
          randomVersion.shepherdHeaderColor || [255, 255, 255]
        ),
        page_font_color: calculateContrastingColor(
          randomVersion.backgroundColor || [255, 255, 255]
        ),
        button_font_color: calculateContrastingColor(
          randomVersion.buttonColor || [22, 32, 45]
        ),
        font_style: randomVersion.fontStyle || "Arial, sans-serif",
      };

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
