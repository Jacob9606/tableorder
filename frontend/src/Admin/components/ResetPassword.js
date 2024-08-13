import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/ResetPassword.css";
import { BASE_URL } from "../../../../config";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, password }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      alert("Password reset successful");
      navigate("/admin");
    } catch (error) {
      console.error("Error:", error);
      alert(`An error occurred: ${error.message}`);
    }
  };

  return (
    <div className="reset-password-container">
      <h1 className="reset-password-title">Reset Password</h1>
      <form onSubmit={handleSubmit} className="reset-password-form">
        <div className="form-group">
          <label htmlFor="password">New Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirm-password">Confirm Password:</label>
          <input
            type="password"
            id="confirm-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="form-input"
          />
        </div>
        <button type="submit" className="reset-button">
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
