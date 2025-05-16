import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useNavBarHandlers from "./navBarFunc";
import "./navbar.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function navbar() {
  const {
    handleSearch,
    handleOrders,
    handleCart,
    handleDelivery,
    handleLogout,
    handleProfile,
  } = useNavBarHandlers();
  const [ModalVisible, setModal] = useState(false);
  const [ItemName, setItemName] = useState("");
  const [Price, setPrice] = useState("");
  const [Description, setDescription] = useState("");
  const [Category, setCategory] = useState("");
  const [ChatModalVisible, setChatModal] = useState(false);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const toggleModal = (visible) => {
    setModal(visible);
  };
  const toggleChatModal = (visible) => {
    setChatModal(visible);
  };

  const handleMessage = () => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: "user", text: message },
    ]);

    console.log("Message sent:", message);

    axios
      .post("http://localhost:8000/chatbot", { message })
      .then((res) => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: "bot", text: res.data.content },
        ]);
      })
      .catch((error) => {
        alert(error.response?.data?.message || "Error sending message");
      });

    setMessage("");
  };

  let SellerMail;
  const getEmail = () => {
    const token = localStorage.getItem("sessionToken");
    if (!token) {
      console.error("No token found");
      return;
    }
    const payload = JSON.parse(atob(token.split(".")[1]));
    SellerMail = payload.emailAddr;
    console.log("mail:", SellerMail);
  };
  const handleAddItem = (e) => {
    console.log("Category", Category);
    getEmail();
    e.preventDefault();
    axios
      .post("http://localhost:8000/", {
        ItemName,
        Price,
        Description,
        Category,
        SellerMail,
      })
      .then((response) => {
        // alert(response.data.message);
        toast.success("Item added!", {
          // position: toast.POSITION.TOP_CENTER,
        });
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
      <nav className="navbar navbar-expand-lg bg-dark">
        <a className="navbar brand text-white" href="#" id="nav">
          Buy Sell@IIIT-H
        </a>
        <div className="container">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <a
                className="nav-link text-white"
                href="#"
                onClick={() => handleProfile()}
              >
                My profile
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link text-white"
                href="#"
                onClick={() => handleSearch()}
              >
                Home
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link text-white"
                onClick={() => toggleModal(true)}
              >
                Add Item
              </a>
            </li>

            <li className="nav-item">
              <a
                className="nav-link text-white"
                onClick={() => toggleChatModal(true)}
              >
                Ask chatbot
              </a>
            </li>
            <ToastContainer />

            <li className="nav-item">
              <a
                className="nav-link text-white"
                href="#"
                onClick={() => handleOrders()}
              >
                My orders
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link text-white"
                href="#"
                onClick={() => handleCart()}
              >
                My cart
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link text-white"
                href="#"
                onClick={() => handleDelivery()}
              >
                Deliver Items
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link text-white"
                href="#"
                onClick={() => handleLogout()}
              >
                Logout
              </a>
            </li>
          </ul>
        </div>
      </nav>
      {ModalVisible && (
        <div className="modal-overlay" id="add-modal-overlay">
          <div className="modal-dialog" id="add-modal-dialog">
            <div className="modal-content" id="add-modal-content">
              <div className="close-icon" onClick={() => toggleModal(false)}>
                &times;
              </div>
              <div className="container">
                <form onSubmit={handleAddItem}>
                  <div>
                    <div>
                      <label htmlFor="Item Name">Item Name</label>
                      <input
                        type="text"
                        id="Item Name"
                        className="form-control"
                        placeholder="Enter Item Name"
                        onChange={(e) => setItemName(e.target.value)}
                        required
                      />
                    </div>
                    <br />
                    <div>
                      <label htmlFor="Price">Price</label>
                      <input
                        type="text"
                        id="Price"
                        className="form-control"
                        placeholder="Price"
                        onChange={(e) => setPrice(e.target.value)}
                        required
                      />
                    </div>
                    <br />
                    <div>
                      <label htmlFor="Description">Description</label>
                      <input
                        type="text"
                        id="Description"
                        className="form-control"
                        placeholder="Description"
                        onChange={(e) => setDescription(e.target.value)}
                        required
                      />
                    </div>
                    <br />
                    <div>
                      <label htmlFor="Category">Category</label>
                      <select
                        className="form-select"
                        value={Category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                      >
                        <option value="" disabled>
                          Select a category
                        </option>{" "}
                        <option value="Tech">Tech</option>
                        <option value="Stationery">Stationery</option>
                        <option value="Beauty">Beauty</option>
                        <option value="Grocery">Grocery</option>
                        <option value="Fashion">Fashion</option>
                        <option value="Home essentials">Home essentials</option>
                        <option value="Sports">Sports</option>
                      </select>
                    </div>{" "}
                    <br />
                    <button className="btn btn-secondary" type="submit">
                      Submit
                    </button>
                    <br />
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
      {ChatModalVisible && (
        <div className="modal-overlay" id="modal-overlay">
          <div className="modal-dialog" id="modal-dialog">
            <div className="modal-content" id="modal-content">
              <div
                className="close-icon"
                onClick={() => toggleChatModal(false)}
              >
                &times;
              </div>
              <div className="Ccontainer">
                <div>
                  <h2 className="chat-title">Chatbot</h2>

                  <div className="chatContainer">
                    {messages.map((msg, index) => (
                      <div key={index}>
                        <div className="message">
                          <div
                            className={`message ${
                              msg.sender === "user"
                                ? "user-message"
                                : "bot-message"
                            }`}
                          >
                            <div>{msg.text}</div>
                          </div>
                        </div>
                      </div>
                    ))}

                    <div className="input-container">
                      <input
                        className="inputPlace"
                        type="text"
                        placeholder="Type your message..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                      />
                      <button className="btn" id="send" onClick={handleMessage}>
                        Send
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default navbar;
