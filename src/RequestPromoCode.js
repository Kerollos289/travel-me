//RequestPromoCode.js
import React, { useState } from "react";
import axios from "axios";

const RequestPromoCode = () => {
  const [promoCode, setPromoCode] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleRequestPromoCode = async () => {
    setLoading(true);
    setError(null);

    try {
      // Call backend to get a random promo code
      const res = await axios.get("http://localhost:3500/api/getRandomPromoCode");
      setPromoCode(res.data.data); // Set the random promo code from response
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError("Error fetching promo code. Please try again.");
    }
  };

  return (
    <div>
      <h2>Get Your Promo Code</h2>
      <button onClick={handleRequestPromoCode} disabled={loading}>
        {loading ? "Loading..." : "Get Promo Code"}
      </button>

      {promoCode && (
        <div>
          <h3>Your Promo Code</h3>
          <p>Code: {promoCode.code}</p>
          <p>Credit: {promoCode.value}</p>
        </div>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default RequestPromoCode;
