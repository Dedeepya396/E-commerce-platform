import React, { Fragment, useState } from "react";
import "./Signup.css";
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReCAPTCHA from "react-google-recaptcha";

function Signup() {
  const [emailAddr, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [Fname, setFname] = useState("");
  const [Lname, setLname] = useState("");
  const [Age, setAge] = useState("");
  const [ContactNumber, setContactNumber] = useState("");

  const navigate = useNavigate();

  const onChange = () => {
    console.log("Recaptcha done!");
  };
  const handleSignupSubmission = (e) => {
    e.preventDefault();
    console.log(emailAddr);
    axios
      .post("http://localhost:8000/signup", {
        Fname,
        Lname,
        emailAddr,
        password,
        Age,
        ContactNumber,
      })
      .then((response) => {
        // alert(response.data.message);
        console.log("Token:", response.data.token);
        localStorage.setItem("sessionToken", response.data.token);
        toast.success("Signup Successful!", {
          // position: toast.POSITION.TOP_CENTER,
        });

        navigate("/profile");
      })
      .catch((error) => {
        console.log(error);
        // alert(error.response.data.message);
        toast.error(error.response.data.message, {
          // position: toast.POSITION.TOP_CENTER,
        });
      });
  };
  const handleLoginNav = () => {
    navigate("/login");
  };
  return (
    <div className="signup-page">
      <div className="container">
        <br />
        <form onSubmit={handleSignupSubmission}>
          <div className="signup-box">
            <div>
              <label htmlFor="First Name">First Name</label>
              <input
                type="text"
                id="First Name"
                className="form-control"
                placeholder="First Name"
                onChange={(e) => setFname(e.target.value)}
                required
              />
            </div>
            <br />

            <div>
              <label htmlFor="Last Name">Last Name</label>
              <input
                type="text"
                id="Last Name"
                className="form-control"
                placeholder="Last Name"
                onChange={(e) => setLname(e.target.value)}
                required
              />
            </div>
            <br />

            <div>
              <label htmlFor="Contact Number">Contact Number</label>
              <input
                type="text"
                id="Contact Number"
                className="form-control"
                placeholder="Contact Number"
                onChange={(e) => setContactNumber(e.target.value)}
                required
              />
            </div>
            <br />

            <div>
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                className="form-control"
                placeholder="abc@students/research.iiit.ac.in"
                required
                onChange={(e) => setEmail(e.target.value)}
              />
              <br />
            </div>

            <div>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="Enter password"
                required
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <br />

            <div>
              <label htmlFor="age">Age</label>
              <input
                type="number"
                className="form-control"
                id="age"
                placeholder="Enter age"
                required
                onChange={(e) => setAge(e.target.value)}
              />
            </div>
            <br />
            <ReCAPTCHA
              sitekey="6LdydssqAAAAAJZ2AUgQPHPPbM5a7tGQM3Php7wS"
              onChange={onChange}
            />
            <br />
            <button className="btn btn-primary" type="submit">
              Signup
            </button>
            <button id="link" className="btn btn-link" onClick={handleLoginNav}>
              Already user? Login!
            </button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Signup;
