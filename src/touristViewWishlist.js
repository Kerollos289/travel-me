import React, { useState, useEffect } from "react";
import axios from "axios";
import "./activityCategoryPage.css";

const TouristViewWishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [message, setMessage] = useState("");

  const username = localStorage.getItem("username"); // Assume the username is stored in localStorage

  // Fetch wishlist on component load
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3500/api/tourist/wishlist`,
          {
            params: { username },
          }
        );
        setWishlist(response.data);
      } catch (error) {
        setMessage(error.response?.data?.message || "Failed to load wishlist.");
      }
    };

    fetchWishlist();
  }, [username]);

  // Remove product from wishlist
  const handleRemove = async (productId) => {
    try {
      const response = await axios.delete(
        `http://localhost:3500/api/tourist/wishlist/${productId}`,
        {
          data: { username },
        }
      );
      setWishlist(response.data.wishlist);
      setMessage(response.data.message);
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Failed to remove product from wishlist."
      );
    }
  };

  // Add product to cart
  const handleAddToCart = async (productId) => {
    try {
      const response = await axios.post("http://localhost:3500/api/cart", {
        username,
        productId,
      });
      setMessage(response.data.message || "Product added to cart.");
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Failed to add product to cart."
      );
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "auto", padding: "20px" }}>
      <h1>My Wishlist</h1>
      {message && <p>{message}</p>}
      {wishlist.length > 0 ? (
        <ul>
          {wishlist.map((product) => (
            <li
              key={product._id}
              style={{ borderBottom: "1px solid #ddd", padding: "10px 0" }}
            >
              <img
                src={`http://localhost:3500${product.picture}`}
                alt={product.name}
                style={{ width: "100px", height: "100px", objectFit: "cover" }}
              />
              <h3>{product.name}</h3>
              <p>Price: ${product.price}</p>
              <p>Description: {product.description}</p>
              <p>Seller: {product.seller.username}</p>
              <p>Ratings: {product.ratings} ⭐</p>
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  style={{
                    padding: "5px 10px",
                    backgroundColor: "#f00",
                    color: "#fff",
                    border: "none",
                  }}
                  onClick={() => handleRemove(product._id)}
                >
                  Remove from Wishlist
                </button>
                <button
                  style={{
                    padding: "5px 10px",
                    backgroundColor: "#007bff",
                    color: "#fff",
                    border: "none",
                  }}
                  onClick={() => handleAddToCart(product._id)}
                >
                  Add to Cart
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>Your wishlist is empty.</p>
      )}
    </div>
  );
};

export default TouristViewWishlist;
