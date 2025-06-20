import React, { Fragment, useState } from "react";
import "./LoginPage.css";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReCAPTCHA from "react-google-recaptcha";

function LoginDetails() {
  // use states to set email and passwords of user
  const [emailAddr, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const onChange = () => {
    console.log("Recaptcha done!");
  };
  const handleLoginSubmission = (e) => {
    e.preventDefault();
    console.log(emailAddr);
    axios// send a post request to backend with user details for verification
      .post("http://localhost:8000/login", { emailAddr, password })
      .then((response) => {
        // alert(response.data.message);// if response is success store the token in local storage
        console.log("Token:", response.data.token);
        localStorage.setItem("sessionToken", response.data.token);
        toast.success("Login Successful!", {
          // position: toast.POSITION.TOP_CENTER,
        });
        navigate("/profile");// redirect to profile page
      })
      .catch((error) => {
        // alert(error.response.data.message);
        toast.error(error.response.data.message, { // display the error
          // position: toast.POSITION.TOP_CENTER,
        });
      });
  };
  const handleSignup = () => {
    navigate("/signup");
  };

  return (
    <div id="login-page">
      <div className="container">
        <br />
        <h1 id="header">Login</h1>
        <br />
        <br />
        <div className="login-box">
          <form onSubmit={handleLoginSubmission}>
            <div className="form">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                className="form-control"
                placeholder="abc.xyz@students.iiit.ac.in"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <br />
            <div className="form">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                className="form-control"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <br />
            <ReCAPTCHA
              sitekey="6LdydssqAAAAAJZ2AUgQPHPPbM5a7tGQM3Php7wS"
              onChange={onChange} // a debugging function
            />
            <br/>
            <button type="submit" className="btn btn-primary">
              Login
            </button>
            <br />
            <button
              type="submit"
              className="btn btn-link"
              onClick={handleSignup} // if user is not registered -> button to go there
              id="link"
            >
              New User? Signup!
            </button>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default LoginDetails;
