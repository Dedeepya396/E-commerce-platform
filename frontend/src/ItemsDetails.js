import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useNavBarHandlers from "./navBarFunc";
import "./ItemDetails.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ItemDetails() {
  const [ItemDet, setItemDet] = useState(null);
  const [error, setError] = useState("");
  const { id } = useParams();
  const {
    handleSearch,
    handleOrders,
    handleCart,
    handleDelivery,
    handleLogout,
    handleProfile,
  } = useNavBarHandlers();
  const getItemDetails = () => {
    console.log("func:", id);
    axios
      .get(`http://localhost:8000/search/${id}`)
      .then((response) => {
        setItemDet(response.data);
        setError("");
        console.log("Item details:", response.data);
      })
      .catch((error) => {
        setItemDet(null);
        setError(error.response?.data?.message || "An error occurred");
        console.error("Error fetching profile:", error);
      });
  };
  let mail;
  const AddtoCart = () => {
    if (ItemDet) {
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
      if (mail !== ItemDet.SellerMail) {
        axios
          .post(`http://localhost:8000/search/${id}`, {
            Name: ItemDet.ItemName,
            Price: ItemDet.Price,
            SellerMail: ItemDet.SellerMail,
            SellerName: ItemDet.SellerName,
            Category: ItemDet.Category,
            Description: ItemDet.Description,
            BuyerEmail: mail,
          })
          .then((response) => {
            console.log("Item added to cart");
            toast.success("Item added to cart!", {
              // position: toast.POSITION.TOP_CENTER,
            });
          })
          .catch((error) => {
            setError(error.response?.data?.message || "An error occurred");
            console.error("Error fetching profile:", error);
            toast.error(error.response.data.message, {
              // position: toast.POSITION.TOP_CENTER,
            });
          });
      } else {
        setError("You cannot add your item!");
      }
    }
  };
  useEffect(() => {
    getItemDetails();
  }, [id]);
  return (
    <div>
      {/* put nav bar code here if needed */}
      <div className="ItemDet-page">
        {ItemDet ? (
          <div className="container">
            <div className="col gx-3">
              <h1 className="header-item">Item Details</h1>
              <div className="ItemDet-box">
                <div className="det_box">
                  <div>Item Name: &nbsp; {ItemDet.ItemName} </div>
                </div>
                <br />
                <div className="det_box">
                  <div>Price: &nbsp; {ItemDet.Price} </div>
                </div>
                <br />
                <div className="det_box">
                  <div>Seller Name: &nbsp; {ItemDet.SellerName} </div>
                </div>
                <br />
                <div className="det_box">
                  <div>Category: &nbsp; {ItemDet.Category} </div>
                </div>
                <br />
                <div className="det_box">
                  <div>Description: &nbsp; {ItemDet.Description} </div>
                </div>
                <br />
                <div className="row">
                  <button className="btn btn-secondary" onClick={AddtoCart}>
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p>Loading...</p>
        )}
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
      <ToastContainer />
    </div>
  );
}
export default ItemDetails;
