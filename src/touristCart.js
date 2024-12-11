import React, { useState, useEffect } from "react";
import axios from "axios";

const TouristCart = () => {
  const [cart, setCart] = useState([]);
  const [message, setMessage] = useState("");

  const username = localStorage.getItem("username"); // Assume the username is stored in localStorage

  // Fetch cart on component load
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await axios.get(
         'http://localhost:3500/api/tourist/cart',
          { params: { username } }
        );
        setCart(response.data); // Assuming response.data is the cart array
      } catch (error) {
        setMessage(error.response?.data?.message || "Failed to load cart.");
      }
    };

    fetchCart();
  }, [username]);

  const updateQuantity = async (productId, action) => {
    try {
      const response = await axios.put(
        'http://localhost:3500/api/tourist/cart/quantity',
        { username, productId, action }
      );
      setCart(response.data.cart); // Assuming the backend sends the updated cart
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
       ' http://localhost:3500/api/tourist/cart/${productId}',
        { data: { username } } // Pass the username in the body
      );
      setCart(response.data.cart); // Assuming the backend sends the updated cart
      setMessage(response.data.message);
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Failed to remove product from cart."
      );
    }
  };
  return (
    <div style={{ maxWidth: "800px", margin: "auto", padding: "20px" }}>
      <h1>My Cart</h1>
      {message && <p>{message}</p>}
      {cart.length > 0 ? (
        <ul>
          {cart.map((item, index) => {
            // Ensure item.product exists before accessing its properties
            const product = item.product;
            if (!product) {
              return <li key={index}>Product information is missing.</li>;
            }

            return (
              <li
                key={product._id} // Access product ID from nested object
                style={{ borderBottom: "1px solid #ddd", padding: "10px 0" }}
              >
                {/* Check if product.picture exists, else show a fallback */}
                <img
                  src={product.picture || "default-image.jpg"} // Fallback image if 'picture' is missing
                  alt={product.name}
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                  }}
                />
                <h3>{product.name}</h3>
                <p>Price: ${product.price}</p>
                <p>Description: {product.description}</p>
                <p>Seller: {product.seller?.username}</p>
                <p>Available Quantity: {product.availableQuantity}</p>
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
                    disabled={item.quantity >= product.availableQuantity}
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
    </div>
  );
};

export default TouristCart;