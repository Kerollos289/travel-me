import React, { useEffect, useState } from "react";
import axios from "axios";
import "./activityCategoryPage.css";

const TouristViewProducts = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);
  const username = localStorage.getItem("username");

  useEffect(() => {
    fetchProducts();
    fetchUserDetails();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:3500/api/products", {
        params: { name: search, minPrice, maxPrice },
      });
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchUserDetails = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3500/api/tourist/${username}`
      );
      setWishlist(response.data.wishlist || []);
      setCart(response.data.cart || []);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const handleAddToWishlist = async (productId) => {
    try {
      await axios.post("http://localhost:3500/api/wishlist", {
        username,
        productId,
      });
      setWishlist((prev) => [...prev, productId]);
    } catch (error) {
      console.error("Error adding to wishlist:", error);
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      await axios.post("http://localhost:3500/api/cart", {
        username,
        productId,
      });
      setCart((prev) => [...prev, productId]);
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>View Products</h1>
      <div>
        <input
          type="text"
          placeholder="Search by name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <input
          type="number"
          placeholder="Min Price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />
        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />
        <button onClick={fetchProducts}>Filter</button>
      </div>
      <div>
        {products.map((product) => (
          <div
            key={product._id}
            style={{
              border: "1px solid #ccc",
              margin: "10px",
              padding: "10px",
            }}
          >
            <img
              src={`http://localhost:3500${product.picture}`}
              alt={product.name}
              style={{ width: "100px", height: "100px" }}
            />
            <h3>{product.name}</h3>
            <p>Price: ${product.price}</p>
            <p>{product.description}</p>
            <p>Seller: {product.seller.username}</p>
            <button
              onClick={() => handleAddToWishlist(product._id)}
              disabled={wishlist.includes(product._id)}
            >
              {wishlist.includes(product._id)
                ? "Added to Wishlist"
                : "Add to Wishlist"}
            </button>
            <button
              onClick={() => handleAddToCart(product._id)}
              disabled={cart.includes(product._id)}
            >
              {cart.includes(product._id) ? "Added to Cart" : "Add to Cart"}
            </button>
            <details>
              <summary>View Details</summary>
              <p>Ratings: {product.ratings}</p>
              <p>Reviews: {product.reviews.join(", ")}</p>
            </details>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TouristViewProducts;
