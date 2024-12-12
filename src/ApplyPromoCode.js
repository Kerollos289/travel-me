//ApplyPromoCode.js
import React, { useState } from "react";
import axios from "axios";

const ApplyPromoCode = () => {
  const [email, setEmail] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [walletBalance, setWalletBalance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const handleApplyPromoCode = async () => {
    setLoading(true);
    setError(null);
    setSuccessMessage("");

    try {
      const response = await axios.post("http://localhost:3500/api/applyPromo", {
        email,
        promoCode,
      });

      // Update wallet balance on success
      setWalletBalance(response.data.wallet);
      setSuccessMessage(response.data.message);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(err.response ? err.response.data.message : "Error applying promo code");
    }
  };

  return (
    <div>
      <h2>Apply Promo Code</h2>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="text"
        placeholder="Enter promo code"
        value={promoCode}
        onChange={(e) => setPromoCode(e.target.value)}
      />
      <button onClick={handleApplyPromoCode} disabled={loading}>
        {loading ? "Applying..." : "Apply Promo Code"}
      </button>

      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
      {walletBalance !== null && <p>Your Wallet: ${walletBalance}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default ApplyPromoCode;
