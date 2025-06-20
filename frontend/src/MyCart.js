import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./cart.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function generateOTP() {
  let otp = "";
  for (let i = 0; i < 6; i++) {
    otp += Math.floor(Math.random() * 10);
  }
  return otp;
}
function Cart() {
  let mail;
  const [cartItems, setcartItems] = useState(null);
  const [error, setError] = useState(null);
  const [filteredcartItems, setFilteredcartItems] = useState(null);

  const getMail = () => {
    // we get the email of user from token
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
  const getcartItems = () => {
    getMail();
    console.log("Mail:", mail);
    axios // we send a get request with mail as a parameter
      .get(`http://localhost:8000/mycart`, {
        params: { mail },
      })
      .then((response) => {
        // if success set the cart items with response.data
        setcartItems(response.data);
        setError(""); // remove the elements where buyer is not seller
        const filteredItems = response.data.filter(
          (item) => item.SellerMail !== mail
        );
        setFilteredcartItems(filteredItems); // then store the final items
      })
      .catch((error) => {
        setcartItems(null);
        setError(error.response?.data?.message || "An error occurred");
      });
  };

  const handleOrder = (e) => {
    e.preventDefault();
    console.log("User is ready to order!");
    getMail();
    console.log(mail);
    filteredcartItems.forEach((item) => {
      const otp = generateOTP();
      console.log("OTP", otp); // generate an otp
      console.log(item._id);
      axios // send the post request to store this order with item details,buyer details,seller mail,order status,otp
        .post(`http://localhost:8000/mycart`, {
          Cart_id: item._id,
          ItemName: item.ItemName,
          Price: item.Price,
          SellerMail: item.SellerMail,
          SellerName: item.SellerName,
          Category: item.Category,
          Description: item.Description,
          BuyerMail: mail,
          Status: "Pending",
          otp: otp,
        })
        .then((response) => {
          console.log("Order placed");
          // intimate the user
          toast.success(`Order placed! otp:${otp} item:${item._id}`, {});
          setcartItems([]);
          setFilteredcartItems([]);
        })
        .catch((error) => {
          // display error
          setError(error.response?.data?.message || "An error occurred");
          console.error("Error placing an order:", error);
          toast.error(error.response.data.message, {
            // position: toast.POSITION.TOP_CENTER,
          });
        });
    });
  };

  let totalCost = 0;
  if (filteredcartItems) {
    filteredcartItems.forEach((item) => {
      let intPrice = parseInt(item.Price, 10);
      totalCost += intPrice;
    });
  }

  const handleRemove = (id) => {
    axios
      .delete(`http://localhost:8000/mycart`, {
        // send the request using id of the item
        params: { id },
      })
      .then((response) => {
        setError("");
        toast.success("Item removed!", {
          // intimate the user abt removal
          // position: toast.POSITION.TOP_CENTER,
        });
        setFilteredcartItems(
          (prevItems) => prevItems.filter((item) => item._id !== id) // remove the item with that id
        );
        console.log("Item removed!");
      })
      .catch((error) => {
        // show error
        toast.error(error.response.data.message, {
          // position: toast.POSITION.TOP_CENTER,
        });

        setError(error.response?.data?.message || "An error occurred");
      });
  };

  useEffect(() => {
    getcartItems();
  }, []);

  return (
    <div>
      {/* put nav bar code here  */}
      <br />
      <div>
        {error ? (
          <p id="cart">{error}</p>
        ) : cartItems === null ? (
          <p>Loading items...</p>
        ) : cartItems.length > 0 ? (
          <div className="row">
            {" "}
            {/**If items are present display them */}
            {filteredcartItems.map((item, index) => (
              <div className="col-md-3 mb-4" key={index}>
                <div className="card h-100 bg-light">
                  <div className="card-body">
                    <h3 className="card-title">Name: {item.ItemName}</h3>
                    <p className="card-text text-success">
                      Price: {item.Price}
                    </p>
                    <p className="card-text text-danger">
                      Seller: {item.SellerName}
                    </p>
                    <p className="card-text text-danger">
                      Category: {item.Category}
                    </p>
                    <p className="card-text text-primary">
                      Description: {item.Description}
                    </p>
                    <button
                      className="btn btn-secondary"
                      onClick={() => handleRemove(item._id)} // remove the item by sending a request
                    >
                      Remove Item
                    </button>
                  </div>
                </div>
              </div>
            ))}
            <div className="col-12 mb-4">
              <div className="cost">Total Cost:{totalCost}</div>
              <button
                className="btn btn-secondary"
                id="order"
                onClick={handleOrder} // total is calculated by the function and onclick handleOrder function gets triggered
              >
                Order!
              </button>
            </div>
          </div>
        ) : (
          <p id="cart">Cart is empty! </p>
        )}
      </div>
      <ToastContainer />
    </div>
  );
}

export default Cart;
