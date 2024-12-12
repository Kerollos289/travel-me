import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";

import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useElements, useStripe, CardElement } from "@stripe/react-stripe-js";

const stripePromise = loadStripe("your-publishable-key-here");

const TouristCart = () => {
  const [cart, setCart] = useState([]);
  const [paidProducts, setPaidProducts] = useState([]);
  const [orderHistory, setOrderHistory] = useState([]);
  const [ratings, setRatings] = useState({});  // Store ratings by order item
  const [comments, setComments] = useState({});
  const [message, setMessage] = useState("");
  const [paymentOption, setPaymentOption] = useState("wallet");
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");

  const username = localStorage.getItem("username");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch the cart items
        const cartResponse = await axios.get(
          `http://localhost:3500/api/tourist/cart`,
          { params: { username } }
        );
        setCart(cartResponse.data);

        // Fetch the paid products
        const paidResponse = await axios.get(
          `http://localhost:3500/api/tourist/paidProducts`,
          { params: { username } }
        );
        setPaidProducts(paidResponse.data);

        // Fetch the order history
        const ordersResponse = await axios.get(
          `http://localhost:3500/api/tourist/orders`,
          { params: { username } }
        );
        // Fetch addresses from the tourist's profile
        const profileResponse = await axios.get(`http://localhost:3500/api/touristsAccounts/${username}`);
        setAddresses(profileResponse.data.addresses || []);
        setOrderHistory(ordersResponse.data);
      } catch (error) {
        setMessage(error.response?.data?.message || "Failed to load data.");
      }
    };

    fetchData();
  }, [username]);

  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
  };

  const updateQuantity = async (productId, action) => {
    try {
      const response = await axios.put(
        `http://localhost:3500/api/tourist/cart/quantity`,
        { username, productId, action }
      );
      setCart(response.data.cart);
      setMessage(response.data.message);
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Failed to update product quantity."
      );
    }
  };

  const handleRemove = async (productId) => {
    try {
      const response = await axios.delete(
        `http://localhost:3500/api/tourist/cart/${productId}`,
        { data: { username } }
      );
      setCart(response.data.cart);
      setMessage(response.data.message);
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Failed to remove product from cart."
      );
    }
  };

    // Handle rating change
    const handleRatingChange = (orderId, productId, rating) => {
      setRatings((prevRatings) => ({
        ...prevRatings,
        [`${orderId}_${productId}`]: rating,
      }));
    };
  
    // Handle comment change
    const handleCommentChange = (orderId, productId, comment) => {
      setComments((prevComments) => ({
        ...prevComments,
        [`${orderId}_${productId}`]: comment,
      }));
    };

   

    
  const handlePayment = async () => {
    try {
      const response = await axios.post(`http://localhost:3500/api/cart/pay`, {
        username,
      });
      setMessage(response.data.message);

      // Update cart and paid products after payment
      setCart([]);
      const paidResponse = await axios.get(
        `http://localhost:3500/api/tourist/paidProducts`,
        { params: { username } }
      );
      setPaidProducts(paidResponse.data);
    } catch (error) {
      setMessage(error.response?.data?.message || "Payment failed.");
    }
  };

  return (
    <Elements stripe={stripePromise}>
    <div style={{ maxWidth: "800px", margin: "auto", padding: "20px" }}>
      <h1>My Cart</h1>
      {message && <p>{message}</p>}
      {cart.length > 0 ? (
        <ul>
          {cart.map((item, index) => {
            const product = item.product;
            if (!product) {
              return <li key={index}>Product information is missing.</li>;
            }
            const totalPrice = product.price * item.quantity;

            return (
              <li
                key={product._id}
                style={{ borderBottom: "1px solid #ddd", padding: "10px 0" }}
              >
                <img
                  src={`http://localhost:3500${product.picture}`}
                  alt={product.name}
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                  }}
                />
                <h3>{product.name}</h3>
                <p>Price: ${product.price}</p>
                <p>Total: ${totalPrice}</p>
                <p>Description: {product.description}</p>
                <p>Seller: {product.seller?.username}</p>
                <p>Available Quantity: {product.quantity}</p>
                <div>
                  <button
                    onClick={() => updateQuantity(product._id, "decrement")}
                    disabled={item.quantity <= 1}
                    style={{
                      padding: "5px 10px",
                      backgroundColor: "#ddd",
                      marginRight: "5px",
                    }}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(product._id, "increment")}
                    disabled={item.quantity >= product.quantity}
                    style={{
                      padding: "5px 10px",
                      backgroundColor: "#ddd",
                      marginLeft: "5px",
                    }}
                  >
                    +
                  </button>
                </div>
                <button
                  style={{
                    padding: "5px 10px",
                    backgroundColor: "#f00",
                    color: "#fff",
                    border: "none",
                    marginTop: "10px",
                  }}
                  onClick={() => handleRemove(product._id)}
                >
                  Remove from Cart
                </button>
              </li>
            );
          })}
        </ul>
      ) : (
        <p>Your cart is empty.</p>
      )}

      {/* Display addresses as purely cosmetic */}
      <div style={{ marginTop: "20px" }}>
          <h3>Select Address</h3>
          {addresses.length > 0 ? (
  <ul>
    {addresses.map((address, index) => (
      <li key={index} style={{ padding: "5px 0" }}>
        <label>
          <input
            type="radio"
            name="address"
            value={JSON.stringify(address)} // Or keep it as the raw object if needed for backend submission
            onChange={() => handleAddressSelect(address)}
          />
          {`${address.street}, ${address.city}, ${address.country}`}
        </label>
      </li>
    ))}
  </ul>
) : (
  <p>No saved addresses found.</p>
)}

        </div>
        <button
          onClick={() => alert(`Selected Address: ${selectedAddress}`)}
          style={{
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            marginTop: "20px",
          }}
        >
          Confirm Address
        </button>

{cart.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h3>Select Payment Method</h3>
          <div>
            <label>
              <input
                type="radio"
                name="paymentOption"
                value="wallet"
                checked={paymentOption === "wallet"}
                onChange={(e) => setPaymentOption(e.target.value)}
              />
              Pay with Wallet
            </label>
          </div>
          <div>
            <label>
              <input
                type="radio"
                name="paymentOption"
                value="cash"
                checked={paymentOption === "cash"}
                onChange={(e) => setPaymentOption(e.target.value)}
              />
              Cash on Delivery
            </label>
          </div>
          <div>
            <label>
              <input
                type="radio"
                name="paymentOption"
                value="card"
                checked={paymentOption === "card"}
                onChange={(e) => setPaymentOption(e.target.value)}
              />
              Pay with Card
            </label>
          </div>

          {paymentOption === "card" && (
            <div style={{ marginTop: "10px" }}>
              <CardElement options={{ style: { base: { fontSize: "16px" } } }} />
            </div>
          )}

          <button
            onClick={handlePayment}
            style={{
              padding: "10px 20px",
              backgroundColor: "#28a745",
              color: "#fff",
              border: "none",
              marginTop: "20px",
            }}
          >
            Pay Now
          </button>
        </div>
      )}
      <h2>Paid Products</h2>
      {paidProducts.length > 0 ? (
        <ul>
          {paidProducts.map((product) => (
            <li key={product._id} style={{ padding: "10px 0" }}>
              <h3>{product.name}</h3>
              <p>Price: ${product.price}</p>
              <p>Description: {product.description}</p>
              <p>Seller: {product.seller?.username}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No products purchased yet.</p>
      )}

<div style={{ maxWidth: "800px", margin: "auto", padding: "20px" }}>
  <h2>Order History</h2>
  {orderHistory.length > 0 ? (
    <ul>
      {orderHistory.map((order) => (
        <li
          key={order._id}
          style={{ borderBottom: "1px solid #ddd", padding: "10px 0" }}
        >
          <h3>Order Date: {new Date(order.orderDate).toLocaleDateString()}</h3>
          <p>Total Amount: ${order.totalAmount}</p>
          <ul>
            {order.products.map((item, index) => (
              <li key={index}>
                <p>
                  {item.product.name} (x{item.quantity}) - ${item.total}
                </p>
                {/* Rating input */}
                <div>
                  <label>Rating: </label>
                  <select
                    value={ratings[`${order._id}_${item.product._id}`] || 0}
                    onChange={(e) =>
                      handleRatingChange(order._id, item.product._id, e.target.value)
                    }
                  >
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <option key={rating} value={rating}>
                        {rating}
                      </option>
                    ))}
                  </select>
                </div>
                {/* Comment input */}
                <div>
                  <label>Comment: </label>
                  <textarea
                    value={comments[`${order._id}_${item.product._id}`] || ""}
                    onChange={(e) =>
                      handleCommentChange(order._id, item.product._id, e.target.value)
                    }
                    placeholder="Write a comment"
                  />
                </div>
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  ) : (
    <p>No past orders found.</p>
  )}
</div>

    </div>
    </Elements>
  );
};

const TouristCartWrapper = () => (
  <Elements stripe={stripePromise}>
    <TouristCart />
  </Elements>
);

export default TouristCartWrapper;
