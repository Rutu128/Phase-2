import React from "react";
import { NavLink } from "react-router-dom";
import { useColors } from "./ColorProvider";

const Card = (props) => {
  const colors = useColors();

  return (
    <div className="col-md-4 col-10 mx-auto">
      <div className="card">
        <img src={props.imgsrc} className="card-img-top" alt={props.title} />
        <div
          className="card-body"
          style={{
            backgroundColor: colors.background_color,
            color: colors.page_font_color,
          }}
        >
          <h5 className="card-title font-weight-bold">{props.title}</h5>
          <p className="card-text">
            Some quick example text to build on the card title and make up the
            bulk of the card's content.
          </p>
          <NavLink
            to="#"
            className="btn"
            style={{
              backgroundColor: colors.button_color,
              color: colors.button_font_color,
            }}
          >
            Go somewhere
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Card;