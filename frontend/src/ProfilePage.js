import axios from "axios";
import React, { useEffect, useState } from "react";
import "./ProfilePage.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  // use states to store profile of the user
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  let mail;
  // a function to retrieve the email of current logged in user -> from local storage token
  const getEmail = () => {
    const token = localStorage.getItem("sessionToken");
    if (!token) {
      console.error("No token found");
      return;
    }
    const payload = JSON.parse(atob(token.split(".")[1])); // split the token at . and take 2nd element
    mail = payload.emailAddr; // retrieve mail
    console.log("mail:", mail);
  };
  const getProfileDetails = () => {
    console.log("func:", mail);
    axios // sends a get request to backend to get user details from database with email as parameter
      .get("http://localhost:8000/profile", {
        params: { email: mail },
      })
      .then((response) => {
        // if response is success store the data of the response as profile of user
        setProfile(response.data);
        setError("");
        console.log("User details:", response.data);
      })
      .catch((error) => {
        setProfile(null);
        // show an error
        setError(error.response?.data?.message || "An error occurred");
        console.error("Error fetching profile:", error);
      });
  };
  // will run these functions before returning a page
  useEffect(() => {
    getEmail();
    getProfileDetails();
  }, []);

  const [emailAddr, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [Fname, setFname] = useState("");
  const [Lname, setLname] = useState("");
  const [Age, setAge] = useState("");
  const [ContactNumber, setContactNumber] = useState("");

  const handleEdits = (e) => {
    e.preventDefault();
    getEmail();
    axios
      .put("http://localhost:8000/profile", {
        Fname,
        Lname,
        mail,
        Age,
        ContactNumber,
      })
      .then((response) => {
        // alert(response.data.message);
        toast.success("Edits Successful!", {
          // position: toast.POSITION.TOP_CENTER,
        });
        navigate("/profile");
      })
      .catch((error) => {
        // alert(error.response.data.message);
        toast.error(error.response.data.message, {
          // position: toast.POSITION.TOP_CENTER,
        });
      });
  };

  return (
    <div>
      {/* Put nav bar code here if needed */}
      <div className="profile-page">
        {error ? ( // if there is an error show that error
          <p>{error}</p>
        ) : profile ? (
          <div className="container">
            <h2 id="profile-header">Profile Details!</h2>
            <div className="col gx-3">
              <div className="profile-box">
                <div className="det_box">
                  <div>First Name: &nbsp; {profile.Fname}</div> {/*Display the details of user from profile variable */}
                </div>
                <br />

                <div className="det_box">
                  <div>Last Name:&nbsp; {profile.Lname} </div>
                </div>
                <br />

                <div className="det_box">
                  <div>Email Address: &nbsp; {profile.EmailAddr} </div>
                </div>
                <br />

                <div className="det_box">
                  <div>Age: &nbsp; {profile.Age}</div>
                </div>
                <br />

                <div className="det_box">
                  <div>Contact Number: &nbsp; {profile.ContactNumber}</div>
                </div>
                <br />
                <ToastContainer />

                <div className="row">
                  <button
                    className="btn btn-secondary"
                    data-bs-toggle="modal"
                    data-bs-target="#modal"
                  >
                    Edit {/*Edit button which triggers a modal which allows user to edit their details */}
                  </button>
                  <div className="modal" id="modal">
                    <div className="modal-dialog">
                      <div className="modal-content">
                        <div className="modal-header">
                          <h5 className="modal-title">Edit Details</h5>
                          <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                          ></button>
                        </div>
                        <div className="container">
                          <form onSubmit={handleEdits}>{/**On submission edits will be handled */}
                            <div className="edit-box">
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
                                <label htmlFor="Contact Number">
                                  Contact Number
                                </label>
                                <input
                                  type="text"
                                  id="Contact Number"
                                  className="form-control"
                                  placeholder="Contact Number"
                                  onChange={(e) =>
                                    setContactNumber(e.target.value)
                                  }
                                  required
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

                              <button className="btn btn-primary" type="submit">
                                Submit
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p>Loading profile...</p> // if profile is null show this 
        )}
      </div>
    </div>
  );
}

export default App;
