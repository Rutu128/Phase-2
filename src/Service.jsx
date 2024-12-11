import React from "react";
import Card from "./Card";
import Sdata from "./Sdata";
import { useColors } from "./ColorProvider";

const Service = () => {
  const colors = useColors();

  return (
    <div
      className="service-page"
      style={{
        backgroundColor: colors.background_color,
        color: colors.page_font_color,
        minHeight: "100vh",
        paddingTop: "80px",
      }}
    >
      <div className="container">
        <h1 className="text-center mb-5">Our Services</h1>
        <div className="row g-4">
          {Sdata.map((val, ind) => (
            <Card
              key={ind}
              imgsrc={val.imgsrc}
              title={val.title}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Service;