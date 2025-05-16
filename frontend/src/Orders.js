import React, { use, useState, useEffect } from "react";
import axios from "axios";
import "./orders.css";
function Order() {
  const [PendingCollapsed, setPendingCollapsed] = useState(false);
  const [PlacedCollapsed, setPlacedCollapsed] = useState(false);
  const [SoldCollapsed, setSoldCollapsed] = useState(false);
  const [PendingItems, setPendingItems] = useState("");
  const [PlacedItems, setPlacedItems] = useState("");
  const [SoldItems, setSoldItems] = useState("");

  let mail;
  const getEmail = () => {
    const token = localStorage.getItem("sessionToken");
    if (!token) {
      console.error("No token found");
      return;
    }
    const payload = JSON.parse(atob(token.split(".")[1]));
    mail = payload.emailAddr;
  };

  const togglePendingCollapse = () => {
    setPendingCollapsed((prevState) => !prevState);
    getEmail();
    if (!PendingCollapsed) {
      axios
        .get("http://localhost:8000/orders", {
          params: { mail, type: "Pending" },
        })
        .then((response) => {
          setPendingItems(response.data);
        })
        .catch((error) => {
          console.log(error);
          alert(
            error.response ? error.response.data.message : "Error occurred"
          );
        });
    }
  };
  const togglePlacedCollapse = () => {
    setPlacedCollapsed((prevState) => !prevState);
    getEmail();
    if (!PlacedCollapsed) {
      axios
        .get("http://localhost:8000/orders", {
          params: { mail, type: "Placed" },
        })
        .then((response) => {
          setPlacedItems(response.data);
        })
        .catch((error) => {
          console.log(error);
          alert(
            error.response ? error.response.data.message : "Error occurred"
          );
        });
    }
  };
  const toggleSoldCollapse = () => {
    setSoldCollapsed((prevState) => !prevState);
    getEmail();
    if (!SoldCollapsed) {
      axios
        .get("http://localhost:8000/orders", { params: { mail, type: "Sold" } })
        .then((response) => {
          setSoldItems(response.data);
        })
        .catch((error) => {
          console.log(error);
          alert(
            error.response ? error.response.data.message : "Error occurred"
          );
        });
    }
  };

  return (
    <div className="orders">
      <div className="container">
        <br />
        <div className="row ">
          <div className="col-md-4">
            <button
              onClick={togglePendingCollapse}
              className="btn btn-primary w-100"
            >
              {PendingCollapsed ? "Hide" : "Show"} Pending orders
            </button>
            <div
              className={`collapse ${PendingCollapsed ? "show" : ""}`}
              id="demo"
            >
              <br />
              <div className="row">
                {PendingItems && PendingItems.length > 0 ? (
                  PendingItems.map((item, index) => (
                    <div className="row mb-3" key={index}>
                      <div className="col-12">
                        <div className="card mb-1">
                          <div className="card-body">
                            <h5 className="card-title">{item.ItemName}</h5>
                            <p className="card-text">Price: {item.Price}</p>
                            <p className="card-text">
                              SellerName: {item.SellerName}
                            </p>
                            <p className="card-text">
                              Description: {item.Description}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-12">
                    <div className="card mb-3">
                      <div className="card-body">
                        <p className="card-text">No pending orders</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>{" "}
            </div>
          </div>

          <div className="col-md-4">
            <button
              onClick={togglePlacedCollapse}
              className="btn btn-primary w-100"
            >
              {PlacedCollapsed ? "Hide" : "Show"} Placed Orders
            </button>
            <div
              className={`collapse ${PlacedCollapsed ? "show" : ""}`}
              id="demo"
            >
              <br />
              <div className="row">
                {PlacedItems && PlacedItems.length > 0 ? (
                  PlacedItems.map((item, index) => (
                    <div className="row mb-3" key={index}>
                      <div className="col-12">
                        <div className="card mb-1">
                          <div className="card-body">
                            <h5 className="card-title">{item.ItemName}</h5>
                            <p className="card-text">Price: {item.Price}</p>
                            <p className="card-text">
                              SellerName: {item.SellerName}
                            </p>
                            <p className="card-text">
                              Description: {item.Description}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-12">
                    <div className="card mb-3">
                      <div className="card-body">
                        <p className="card-text">No placed orders</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>{" "}
            </div>
          </div>

          <div className="col-md-4">
            <button
              onClick={toggleSoldCollapse}
              className="btn btn-primary w-100"
            >
              {SoldCollapsed ? "Hide" : "Show"} Sold Orders
            </button>
            <div
              className={`collapse ${SoldCollapsed ? "show" : ""}`}
              id="demo"
            >
              <br />
              <div className="row">
                {SoldItems && SoldItems.length > 0 ? (
                  SoldItems.map((item, index) => (
                    <div className="row mb-3" key={index}>
                      <div className="col-12">
                        <div className="card mb-1">
                          <div className="card-body">
                            <h5 className="card-title">{item.ItemName}</h5>
                            <p className="card-text">Price: {item.Price}</p>
                            <p className="card-text">
                              Seller Name: {item.SellerName}
                            </p>
                            <p className="card-text">
                              Buyer Name: {item.BuyerName}
                            </p>
                            <p className="card-text">
                              Description: {item.Description}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-12">
                    <div className="card mb-3">
                      <div className="card-body">
                        <p className="card-text">No sold orders</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>{" "}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Order;
