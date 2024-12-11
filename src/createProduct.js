import React, { useState } from "react";
import axios from "axios";

const CreateProduct = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [picture, setPicture] = useState(null);
  const [message, setMessage] = useState("");
  const [quantity, setQuantity] = useState("");

  const handleFileChange = (e) => {
    setPicture(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const username = localStorage.getItem("username"); // Only the username is required

    if (!username) {
      setMessage("Seller information is missing.");
      return;
    }

    const formData = new FormData();
    formData.append("picture", picture);
    formData.append("name", name);
    formData.append("price", price);
    formData.append("description", description);
    formData.append("username", username); // Send only the username
    formData.append("quantity", quantity);

    try {
      const response = await axios.post(
        "http://localhost:3500/api/products",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setMessage(response.data.message || "Product created successfully.");
      setName("");
      setPrice("");
      setDescription("");
      setPicture(null);
      setQuantity("");
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to create product.");
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "auto", padding: "20px" }}>
      <h1>Create Product</h1>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ width: "100%", padding: "10px", margin: "10px 0" }}
          />
        </div>
        <div>
          <label htmlFor="price">Price</label>
          <input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            style={{ width: "100%", padding: "10px", margin: "10px 0" }}
          />
        </div>
        <div>
          <label htmlFor="quantity">Quantity</label>
          <input
            type="number"
            id="quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
            style={{ width: "100%", padding: "10px", margin: "10px 0" }}
          />
        </div>
        <div>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            style={{ width: "100%", padding: "10px", margin: "10px 0" }}
            rows="4"
          ></textarea>
        </div>
        <div>
          <label htmlFor="picture">Picture</label>
          <input
            type="file"
            id="picture"
            onChange={handleFileChange}
            accept="image/*"
            required
            style={{ margin: "10px 0" }}
          />
        </div>
        <button type="submit" style={{ padding: "10px 20px" }}>
          Submit
        </button>
      </form>
    </div>
  );
};

export default CreateProduct;
