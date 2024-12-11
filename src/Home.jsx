import React, { useEffect, useState } from "react";
import { useColors } from "./ColorProvider";
import Common from "./Common";
import web from "../src/images/homepage1.jpg";
import Shepherd from "shepherd.js";
import "shepherd.js/dist/css/shepherd.css";
import { HelpCircle } from "lucide-react";
import "./Home.css";
import shepherdVersion from "./shepherdversion.json";

const Home = () => {
  const colors = useColors();
  const [tour, setTour] = useState(null);

  useEffect(() => {
    // Retrieve or set shepherd speed and blur values
    let speed = sessionStorage.getItem("shepherd-speed");
    let blur = sessionStorage.getItem("shepherd-blur");

    if (!speed || !blur) {
      // If not found, pick random speed and blur values
      const randomVersion = Math.floor(Math.random() * 4) + 1; // Random version between 1-4
      const selectedData = shepherdVersion[randomVersion];
      speed = selectedData.speed;
      blur = selectedData.blur;
      
      sessionStorage.setItem("shepherd-speed", speed);
      sessionStorage.setItem("shepherd-blur", blur);
    }
    console.log(speed+" "+blur);
    // Select a random version for steps on every reload
    const version = Math.floor(Math.random() * 4) + 1; 
    const stepsData = shepherdVersion[version];

    // Set dynamic CSS variables for animation speed and blur
    document.documentElement.style.setProperty("--animation-speed", `${speed}s`);
    document.documentElement.style.setProperty("--blur-start", `${blur}px`);

    // Initialize Shepherd tour
    const newTour = new Shepherd.Tour({
      useModalOverlay: true,
      defaultStepOptions: {
        scrollTo: true,
        classes: "shepherd-theme-custom",
        cancelIcon: {
          enabled: true,
        },
        buttons: [
          {
            action() {
              return this.back();
            },
            classes: "shepherd-button-secondary",
            text: "Back",
          },
          {
            action() {
              return this.next();
            },
            text: "Next",
          },
        ],
      },
    });

    // Define Shepherd tour steps
    const steps = [
      {
        id: "greet",
        title: "Welcome!",
        text: `<div class="shepherd-text-blur">${stepsData.greet}</div>`,
        attachTo: { element: "", on: "center" },
        buttons: [
          {
            action() {
              return this.next();
            },
            text: "Next",
          },
        ],
      },
      {
        id: "navbar",
        title: "Navigation Bar",
        text: `<div class="shepherd-text-blur">${stepsData.navbar}</div>`,
        attachTo: { element: ".navbar", on: "bottom" },
      },
      {
        id: "home-nav",
        title: "Home Page",
        text: `<div class="shepherd-text-blur">${stepsData["home-nav"]}</div>`,
        attachTo: { element: '.nav-link[href="/"]', on: "bottom" },
      },
      {
        id: "service-nav",
        title: "Services",
        text: `<div class="shepherd-text-blur">${stepsData["service-nav"]}</div>`,
        attachTo: { element: '.nav-link[href="/service"]', on: "bottom" },
      },
      {
        id: "about-nav",
        title: "About Us",
        text: `<div class="shepherd-text-blur">${stepsData["about-nav"]}</div>`,
        attachTo: { element: '.nav-link[href="/about"]', on: "bottom" },
      },
      {
        id: "contact-nav",
        title: "Contact Us",
        text: `<div class="shepherd-text-blur">${stepsData["contact-nav"]}</div>`,
        attachTo: { element: '.nav-link[href="/contact"]', on: "bottom" },
      },
      {
        id: "recordings-nav",
        title: "Recordings",
        text: `<div class="shepherd-text-blur">${stepsData["recordings-nav"]}</div>`,
        attachTo: { element: '.nav-link[href="/recordings"]', on: "bottom" },
      },
    ];

    // Add steps to the tour
    steps.forEach((step) => {
      newTour.addStep(step);
    });

    setTour(newTour);

    // Cleanup
    return () => {
      if (newTour) {
        newTour.complete();
      }
    };
  }, []);

  const startTour = () => {
    if (tour) {
      tour.start();
    }
  };

  return (
    <div
      style={{
        backgroundColor: colors.background_color,
        minHeight: "100vh",
        paddingTop: "80px",
        position: "relative",
      }}
    >
      <button
        onClick={startTour}
        className="fixed bottom-4 right-4 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-3 shadow-lg flex items-center gap-2"
        aria-label="Start Tour"
        style={{
          backgroundColor: colors.button_color,
          color: colors.button_font_color,
        }}
      >
        <HelpCircle size={24} />
        <span className="mr-1" style={{ color: colors.button_font_color }}>
          Take Tour
        </span>
      </button>

      <Common
        name="Grow your Business with"
        highlight="React JS"
        imgsrc={web}
        visit="/service"
        btname="Get Started"
      />
    </div>
  );
};

export default Home;
