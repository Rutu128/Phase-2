import React, { useState } from "react";
import { useColors } from "./ColorProvider";

const Contact = () => {
  const colors = useColors();
  const [data, setData] = useState({
    fullname: "",
    phone: "",
    email: "",
    msg: "",
  });

  const InputEvent = (event) => {
    const { name, value } = event.target;
    setData((preVal) => ({ ...preVal, [name]: value }));
  };

  const formSubmit = (e) => {
    e.preventDefault();
    alert(
      `My Name is ${data.fullname}. Number is ${data.phone}, email is ${data.email} and here is what I want to say: ${data.msg}`
    );
  };

  return (
    <div className="contact-page" style={{ backgroundColor: colors.background_color, color: colors.page_font_color, minHeight: '100vh', paddingTop: '80px' }}>
      <div className="container">
        <h1 className="text-center mb-5">Contact Us</h1>
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <form onSubmit={formSubmit} className="contact-form">
              {[
                { label: "Full Name", name: "fullname", type: "text", placeholder: "Enter your Name" },
                { label: "Phone Number", name: "phone", type: "tel", placeholder: "Enter your Number" },
                { label: "Email address", name: "email", type: "email", placeholder: "name@example.com" },
              ].map((field) => (
                <div className="mb-3" key={field.name}>
                  <label htmlFor={field.name} className="form-label">
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    className="form-control"
                    id={field.name}
                    name={field.name}
                    value={data[field.name]}
                    onChange={InputEvent}
                    placeholder={field.placeholder}
                  />
                </div>
              ))}
              <div className="mb-3">
                <label htmlFor="msg" className="form-label">
                  Message
                </label>
                <textarea
                  className="form-control"
                  id="msg"
                  rows="5"
                  name="msg"
                  value={data.msg}
                  onChange={InputEvent}
                  placeholder="Your Message"
                ></textarea>
              </div>
              <div className="text-center">
                <button
                  type="submit"
                  className="btn btn-primary btn-lg"
                  style={{ backgroundColor: colors.button_color, color: colors.button_font_color }}
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;