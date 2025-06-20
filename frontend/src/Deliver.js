import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./deliver.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Deliver() {
  let mail;
  const [DeliverItems, setDeliverItems] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const getMail = () => {
    const token = localStorage.getItem("sessionToken");
    if (!token) {
      console.error("No token found");
      return;
    }
    let payload;
    try {
      payload = JSON.parse(atob(token.split(".")[1]));
    } catch (err) {
      console.error("Invalid token format:", err);
      setError("Invalid session token. Please log in again.");
      return;
    }
    mail = payload?.emailAddr;
  };

  const getDeliveryItems = () => { // get details of items which are to be delivered
    getMail();
    console.log("Mail:", mail);
    axios
      .get(`http://localhost:8000/deliver`, {
        params: { mail },
      })
      .then((response) => {
        setDeliverItems(response.data);
        setError("");
      })
      .catch((error) => {
        setDeliverItems(null);
        setError(error.response?.data?.message || "An error occurred");
      });
  };
  const checkOtp = (e, itemId) => {
    e.preventDefault();
    console.log("Seller entered otp!", otp, itemId);
    axios
      .post(`http://localhost:8000/deliver`, { otp, itemId })
      .then((response) => {
        console.log("Transaction closed");
        toast.success("Transaction closed!", {
          // position: toast.POSITION.TOP_CENTER,
        });
        setDeliverItems((prevItems) =>
          prevItems.filter((item) => item._id !== itemId)
        );
        setError("");
      })
      .catch((error) => {
        console.log("Transaction failed:(");
        toast.error(error.response.data.message, {
          // position: toast.POSITION.TOP_CENTER,
        });
      });
  };

  const endOrder = () => {
    toast.success("All orders delivered!", {
      // position: toast.POSITION.TOP_CENTER,
    });

    console.log("Orders delivered!");
  };
  useEffect(() => {
    getDeliveryItems();
  }, []);

  return (
    <div className="Deliver">
      <div className="container">
        {error ? (
          <p>{error}</p>
        ) : DeliverItems === null ? (
          <p>Loading items...</p> // displays items that are to be delivered
        ) : DeliverItems.length > 0 ? (
          <div className="row">
            {DeliverItems.map((item, index) => (
              <div className="col-md-3 mb-4" key={index}>
                <div className="card h-100 bg-light">
                  <div className="card-body">
                    <h3 className="card-title">Name:{item.ItemName}</h3>
                    <p className="card-text text-success">
                      Cart-Id: {item.Cart_id}
                    </p>
                    <p className="card-text text-success">
                      Price: {item.Price}
                    </p>
                    <p className="card-text text-danger">
                      Buyer Name: {item.BuyerName}
                    </p>
                    <p className="card-text text-danger">
                      Category: {item.Category}
                    </p>
                    <p className="card-text text-primary">
                      Description: {item.Description}
                    </p>
                    <form onSubmit={(e) => checkOtp(e, item._id)}>
                      <label htmlFor="otp">Enter otp</label>
                      <input
                        type="password"
                        className="form-control"
                        required
                        onChange={(e) => setOtp(e.target.value)} // if we want to confirm an order enter otp and verify it
                        // if otp is right -> order is confirmed
                      />
                      <br />
                      <button className="btn btn-secondary" type="submit">
                        Confirm OTP
                      </button>
                <ToastContainer />
                    </form>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No items found.</p>
        )}
      </div>
    </div>
  );
}
export default Deliver;
