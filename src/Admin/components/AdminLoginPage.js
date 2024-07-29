import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AdminLoginPage.css";

const AdminLoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // 로그인 로직을 여기에 추가하세요 (예: 서버로 로그인 데이터 전송)
    if (email === "admin@example.com" && password === "password") {
      onLogin(); // 로그인 성공 시 onLogin 콜백 호출
    } else {
      alert("Invalid email or password");
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
