//PromoCodesPage.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./activityCategoryPage.css";

const PromoCodesPage = () => {
  const [promoCodes, setPromoCodes] = useState([]); // List of promo codes
  const [newPromoCode, setNewPromoCode] = useState({ code: "", value: "" }); // Input for new promo code
  const [editPromoCode, setEditPromoCode] = useState({
    id: null,
    code: "",
    value: "",
  }); // Promo code being edited

  // Fetch promo codes from backend
  useEffect(() => {
    fetchPromoCodes();
  }, []);

  const fetchPromoCodes = async () => {
    try {
      const res = await axios.get("http://localhost:3500/api/promoCodes");
      setPromoCodes(res.data.data);
    } catch (err) {
      console.error("Error fetching promo codes:", err.message);
    }
  };

  // Handle creating a new promo code
  const handleCreatePromoCode = async () => {
    try {
      const { code, value } = newPromoCode;

      if (!code.trim() || isNaN(value) || value <= 0) {
        alert("Please enter a valid promo code and discount value.");
        return;
      }

      const res = await axios.post("http://localhost:3500/api/promoCodes", {
        code,
        value: Number(value),
      });
      setPromoCodes([...promoCodes, res.data.data]); // Add new promo code to state
      setNewPromoCode({ code: "", value: "" }); // Clear input fields
    } catch (err) {
      console.error("Error creating promo code:", err.message);
    }
  };

  // Handle updating an existing promo code
  const handleUpdatePromoCode = async (id) => {
    try {
      const { code, value } = editPromoCode;

      if (!code.trim() || isNaN(value) || value <= 0) {
        alert("Promo code and discount value cannot be empty or invalid.");
        return;
      }

      const res = await axios.put(
        `http://localhost:3500/api/promoCodes/${id}`,
        {
          code,
          value: Number(value),
        }
      );
      const updatedPromoCodes = promoCodes.map((promo) =>
        promo._id === id ? res.data.data : promo
      );
      setPromoCodes(updatedPromoCodes); // Update promo code list
      setEditPromoCode({ id: null, code: "", value: "" }); // Clear edit state
    } catch (err) {
      console.error("Error updating promo code:", err.message);
    }
  };

  // Handle deleting a promo code
  const handleDeletePromoCode = async (id) => {
    try {
      await axios.delete(`http://localhost:3500/api/promoCodes/${id}`);
      setPromoCodes(promoCodes.filter((promo) => promo._id !== id)); // Remove promo code from state
    } catch (err) {
      console.error("Error deleting promo code:", err.message);
    }
  };

  return (
    <div>
      <h1>Promo Codes</h1>

      {/* Create new promo code */}
      <div>
        <input
          type="text"
          placeholder="Promo Code"
          value={newPromoCode.code}
          onChange={(e) =>
            setNewPromoCode({ ...newPromoCode, code: e.target.value })
          }
        />
        <input
          type="number"
          placeholder="Credit Value"
          value={newPromoCode.value}
          onChange={(e) =>
            setNewPromoCode({ ...newPromoCode, value: e.target.value })
          }
        />
        <button onClick={handleCreatePromoCode}>Create Promo Code</button>
      </div>

      {/* List promo codes */}
      <ul>
        {promoCodes.map((promo) => (
          <li key={promo._id}>
            {editPromoCode.id === promo._id ? (
              <>
                <input
                  type="text"
                  value={editPromoCode.code}
                  onChange={(e) =>
                    setEditPromoCode({ ...editPromoCode, code: e.target.value })
                  }
                />
                <input
                  type="number"
                  value={editPromoCode.value}
                  onChange={(e) =>
                    setEditPromoCode({
                      ...editPromoCode,
                      value: e.target.value,
                    })
                  }
                />
                <button onClick={() => handleUpdatePromoCode(promo._id)}>
                  Save
                </button>
              </>
            ) : (
              <>
                <span>
                  {promo.code} - {promo.value}
                </span>
                <button
                  onClick={() =>
                    setEditPromoCode({
                      id: promo._id,
                      code: promo.code,
                      value: promo.value,
                    })
                  }
                >
                  Edit
                </button>
              </>
            )}
            <button onClick={() => handleDeletePromoCode(promo._id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PromoCodesPage;
