import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AdminLoginPage.css";

const AdminLoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const loginData = {
      email,
      password,
    };

    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      if (response.status === 200) {
        localStorage.setItem("authToken", data.token); // 토큰을 로컬 저장소에 저장
        onLogin(); // 로그인 성공 시 onLogin 콜백 호출
        alert("Login successful.");
        navigate("/order-dashboard");
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error("Error:", error);
      alert(`An error occurred: ${error.message}`);
    }
  };

  return (
    <div className="login-container">
      <h1 className="login-title">Admin Login</h1>
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="form-input"
          />
        </div>
        <button type="submit" className="login-button">
          Login
        </button>
      </form>
      <div className="button-group">
        <button className="signup-button" onClick={() => navigate("/signup")}>
          Sign Up
        </button>
        <button
          className="forgot-button"
          onClick={() => navigate("/forgot-password")}
        >
          Forgot Password
        </button>
      </div>
    </div>
  );
};

export default AdminLoginPage;
