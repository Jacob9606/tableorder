import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ForgotPassword.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // 비밀번호 재설정 로직을 여기에 추가하세요 (예: 서버로 이메일 전송)
    alert("Password reset link sent to your email");
    navigate("/admin");
  };

  return (
    <div className="forgot-password-container">
      <h1 className="forgot-password-title">Forgot Password</h1>
      <form onSubmit={handleSubmit} className="forgot-password-form">
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
        <button type="submit" className="reset-button">
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
