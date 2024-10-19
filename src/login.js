// Login.js
import React from "react";
import { Link } from "react-router-dom";

const Login = () => {
  return (
    <div className="form-container">
      <h1>Login</h1>
      <form>
        <input type="email" placeholder="Email" required />
        <input type="password" placeholder="Password" required />
        <button type="submit">Login</button>
      </form>
      <p>
        Don't have an account? <Link to="/">Register here</Link>
      </p>
    </div>
  );
};

export default Login;
