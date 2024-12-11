import React from "react";
import { NavLink } from "react-router-dom";
import { useColors } from "./ColorProvider";

const Common = (props) => {
  const colors = useColors();

  return (
    <section className="d-flex align-items-center">
      <div className="container-fluid">
        <div className="row">
          <div className="col-10 mx-auto">
            <div className="row">
              <div className="col-md-6 pt-5 pt-lg-0 order-2 order-lg-1 d-flex justify-content-center flex-column">
                <h1>
                  {props.name}
                  <strong className="brand-name" style={{ color: colors.highlight_color }}> {props.highlight}</strong>
                </h1>
                <h2 className="my-3" style={{ color: colors.secondary_font_color , fontFamily: colors.font_style}}>
                  {props.description || "The Best Framework for making Responsive Animated Websites"}
                </h2>
                <div className="mt-3">
                  <NavLink to={props.visit} className="btn-get-started" style={{
                    backgroundColor: colors.button_color,
                    color: colors.button_font_color,
                    padding: '10px 20px',
                    borderRadius: '5px',
                    fontWeight: 'bold',
                    textDecoration: 'none',
                    transition: 'all 0.3s ease'
                  }}>
                    {props.btname}
                  </NavLink>
                </div>
              </div>

              <div className="col-lg-6 order-1 order-lg-2 header-img">
                <img src={props.imgsrc} className="img-fluid animated" alt="home img" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Common;