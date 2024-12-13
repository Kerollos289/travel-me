import React, { useState, useEffect } from "react";
import axios from "axios";
import "./activityCategoryPage.css";

const AdminSellerViewProducts = () => {
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState("");
  const [editingProductId, setEditingProductId] = useState(null);
  const [newDescription, setNewDescription] = useState("");
  const [newPrice, setNewPrice] = useState("");

  // Fetch all products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:3500/api/products");
        setProducts(response.data);
      } catch (error) {
        setMessage(error.response?.data?.message || "Failed to load products.");
      }
    };

    fetchProducts();
  }, []);

  // Archive or unarchive a product
  const handleArchiveToggle = async (productId, archived) => {
    try {
      const response = await axios.patch(
        `http://localhost:3500/api/products/${productId}/archive`,
        { archived: !archived }
      );
      setProducts((prev) =>
        prev.map((product) =>
          product._id === productId ? response.data.product : product
        )
      );
      setMessage(response.data.message);
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Failed to update archive status."
      );
    }
  };

  // Save the updated description
  const handleSaveDescription = async (productId) => {
    try {
      const response = await axios.patch(
        `http://localhost:3500/api/products/${productId}`,
        { description: newDescription }
      );
      setProducts((prev) =>
        prev.map((product) =>
          product._id === productId ? response.data.product : product
        )
      );
      setEditingProductId(null);
      setNewDescription("");
      setMessage(response.data.message);
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Failed to update product description."
      );
    }
  };

  // Save the updated price
  const handleSavePrice = async (productId) => {
    try {
      const response = await axios.patch(
        `http://localhost:3500/api/products/${productId}`,
        { price: newPrice }
      );
      setProducts((prev) =>
        prev.map((product) =>
          product._id === productId ? response.data.product : product
        )
      );
      setEditingProductId(null);
      setNewPrice("");
      setMessage(response.data.message);
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Failed to update product price."
      );
    }
  };

  return (
    <div style={{ maxWidth: "1000px", margin: "auto", padding: "20px" }}>
      <h1>Admin - View Products</h1>
      {message && <p>{message}</p>}
      {products.length > 0 ? (
        <ul>
          {products.map((product) => (
            <li
              key={product._id}
              style={{
                borderBottom: "1px solid #ddd",
                padding: "10px 0",
                marginBottom: "20px",
              }}
            >
              <img
                src={`http://localhost:3500${product.picture}`}
                alt={product.name}
                style={{ width: "150px", height: "150px", objectFit: "cover" }}
              />
              <h3>{product.name}</h3>
              <p>
                Price:
                {editingProductId === product._id ? (
                  <input
                    type="number"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    style={{ width: "70px", marginLeft: "10px" }}
                  />
                ) : (
                  `$${product.price}`
                )}
              </p>
              <p>Quantity: {product.quantity}</p>
              <p>Seller: {product.seller.username}</p>
              <p>Number of Sales: {product.numberOfSales}</p>
              <p>Ratings: {product.ratings} ⭐</p>
              <p>Reviews: {product.reviews.join(", ")}</p>
              <p>
                Description:{" "}
                {editingProductId === product._id ? (
                  <input
                    type="text"
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    style={{ width: "70%" }}
                  />
                ) : (
                  product.description
                )}
              </p>
              <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                {editingProductId === product._id ? (
                  <>
                    <button
                      onClick={() => handleSaveDescription(product._id)}
                      style={{
                        padding: "5px 10px",
                        backgroundColor: "#28a745",
                        color: "#fff",
                        border: "none",
                      }}
                    >
                      Save Description
                    </button>
                    <button
                      onClick={() => handleSavePrice(product._id)}
                      style={{
                        padding: "5px 10px",
                        backgroundColor: "#007bff",
                        color: "#fff",
                        border: "none",
                      }}
                    >
                      Save Price
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setEditingProductId(product._id);
                        setNewDescription(product.description);
                        setNewPrice(product.price);
                      }}
                      style={{
                        padding: "5px 10px",
                        backgroundColor: "#ffc107",
                        color: "#fff",
                        border: "none",
                      }}
                    >
                      Edit Description
                    </button>
                    <button
                      onClick={() => {
                        setEditingProductId(product._id);
                        setNewPrice(product.price);
                      }}
                      style={{
                        padding: "5px 10px",
                        backgroundColor: "#17a2b8",
                        color: "#fff",
                        border: "none",
                      }}
                    >
                      Edit Price
                    </button>
                  </>
                )}
                <button
                  onClick={() =>
                    handleArchiveToggle(product._id, product.archived)
                  }
                  style={{
                    padding: "5px 10px",
                    backgroundColor: product.archived ? "#6c757d" : "#dc3545",
                    color: "#fff",
                    border: "none",
                  }}
                >
                  {product.archived ? "Unarchive" : "Archive"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No products found.</p>
      )}
    </div>
  );
};

export default AdminSellerViewProducts;
