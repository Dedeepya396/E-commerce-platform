import React, { Fragment } from "react";
import "./FrontPage.css";
import bs_icon from "./Images/buysell-icon.png";
import bs_photo from "./Images/buysell-photo.png";
import cart_image from "./Images/cart.png";
import bs_chat from "./Images/bs-icon.png";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
function FrontPage() {
  const navigate = useNavigate();
  const handleLogin = () => {
    navigate("login/"); // if login button is pressed -> navigate to login/ url
  };
  const handleSignup = () => {
    navigate("Signup/");// if signup button is pressed -> navigate to signup/ url
  };
  return (
    <div id="front-page">
      <div className="container">
        <br/>
        <div className="Images">
          {/* Normal images for home page with translation*/}
          <img src={bs_icon} alt="bs_icon" className="image-style"></img>
          <img src={cart_image} alt="cart_image" className="image-style"></img>
          <img src={bs_chat} alt="bs_chat" className="image-style"></img>
        </div>
        <h1 className="header1">BUY, SELL @ IIIT H</h1>

        <div className="row row-col-4">
          <div className="col ">
            <div className="box">
              <h2>Already a user? Login</h2> {/*Login page */}
              <button className="Front-button" onClick={handleLogin}>
                Login!
              </button>
            </div>
          </div>

          <div className="col">
            <div className="box">
              <h2>New user? Signup</h2>{/*Signup page */}
              <button className="Front-button" onClick={handleSignup}>
                Signup!
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FrontPage;
