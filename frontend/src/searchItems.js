import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import useNavBarHandlers from "./navBarFunc";
import "./searchItems.css";

function SearchPage() {
  const navigate = useNavigate();
  const [searchReq, setSearchreq] = useState(""); // stores the user's search request
  const [itemsList, setItems] = useState(null); // stores the items based on search request
  const [error, setError] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]); // stores selected categories
  const {
    handleSearch,
    handleOrders,
    handleCart,
    handleDelivery,
    handleLogout,
    handleProfile,
  } = useNavBarHandlers();

  const categories = [
    "Tech",
    "Stationery",
    "Beauty",
    "Grocery",
    "Fashion",
    "Home essentials",
    "Sports",
  ];

  const handleCategoryChange = (category) => {
    if (selectedCategories.includes(category)) {
      // if a category is already selected remove it else include it
      setSelectedCategories((prev) =>
        prev.filter((selected) => selected !== category)
      );
    } else {
      setSelectedCategories((prev) => [...prev, category]);
    }
  };

  const handleSearchReq = (e) => {
    e.preventDefault();
    getItems(searchReq);
  };

  const getItems = (query = "") => {
    axios // a get request will be sent with search query as a parameter
      .get(`http://localhost:8000/search?q=${query}`)
      .then((response) => {
        setItems(response.data); // store the items based on response
        setError("");
      })
      .catch((error) => {
        setItems(null);
        setError(error.response?.data?.message || "An error occurred"); // display error
      });
  };

  const handleClick = (id) => {
    console.log("User has clicked on item with ID:", id);
    navigate(`/search/${id}`);
  };

  useEffect(() => {
    getItems();
  }, []);

  const filteredItems = itemsList
    ? itemsList.filter(
        (item) => item.ItemName.toLowerCase().includes(searchReq.toLowerCase()) //get items which have search req name
      )
    : [];
  const finalItems = filteredItems.filter(
    (item) =>
      selectedCategories.length === 0 ||
      selectedCategories.includes(item.Category) // get items which contains category
  );

  return (
    <div className="search-body">
      {/* put nav bar code here  */}
      <br />
      <h3>Categories</h3>
      <form>
        <div className="row">
          {/**Display categories for filtering */}
          {categories.map((category, index) => (
            <div className="col" key={index}>
              <label htmlFor={category}>{category}</label>
              <input
                type="checkbox"
                id={category}
                onChange={() => handleCategoryChange(category)}
                checked={selectedCategories.includes(category)} // include clicked category
              />
            </div>
          ))}
        </div>
      </form>

      <br />
      <form onSubmit={handleSearchReq}>
        {" "}
        {/**Items will be updated by the search request */} {/*A search bar */}
        <input
          type="text"
          className="form-control"
          placeholder="Search items"
          value={searchReq}
          onChange={(e) => setSearchreq(e.target.value)}
        />
      </form>

      <br />
      <div>
        {error ? (
          <p>{error}</p> // display error
        ) : finalItems === null ? (
          <p>Loading items...</p> // if there are no items show loading items
        ) : finalItems.length > 0 ? (
          <div className="row">
            {" "}
            {/**Display items in an order */}
            {finalItems.map((item, index) => (
              <div className="col-md-3 mb-4" key={index}>
                <div className="card h-100">
                  <div className="card-body">
                    <h3 className="card-title">{item.ItemName}</h3>
                    <p className="card-text ">Price: {item.Price}</p>
                    <p className="card-text ">Seller: {item.SellerName}</p>
                    <p className="card-text ">Category: {item.Category}</p>
                    <p className="card-text ">
                      Description: {item.Description}
                    </p>
                    <button
                      className="btn btn-secondary"
                      onClick={() => handleClick(item._id)} //If user clicks on an item redirect it to its page
                    >
                      View Item
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p></p>
        )}
      </div>
    </div>
  );
}
export default SearchPage;
