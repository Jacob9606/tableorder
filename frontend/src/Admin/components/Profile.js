import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Profile.css";

const Profile = ({ onLogout }) => {
  const [shopName, setShopName] = useState("My Restaurant");
  const [email, setEmail] = useState("admin@example.com");
  const [phoneNumber, setPhoneNumber] = useState("123-456-7890");
  const navigate = useNavigate();

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    // 프로필 업데이트 로직을 여기에 추가하세요 (예: 서버로 업데이트 데이터 전송)
    alert("Profile updated successfully");
  };

  const handleLogout = () => {
    // 로그아웃 로직을 여기에 추가하세요 (예: 토큰 삭제, 세션 종료 등)
    localStorage.removeItem("authToken"); // 로컬 저장소에서 토큰 제거
    onLogout(); // 로그아웃 콜백 호출
    alert("Logged out successfully");
    navigate("/admin");
  };

  return (
    <div className="profile-container">
      <h1 className="profile-title">Profile</h1>
      <form onSubmit={handleUpdateProfile} className="profile-form">
        <div className="form-group">
          <label htmlFor="shop-name">Shop Name:</label>
          <input
            type="text"
            id="shop-name"
            value={shopName}
            onChange={(e) => setShopName(e.target.value)}
            required
            className="form-input"
          />
        </div>
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
          <label htmlFor="phone-number">Phone Number:</label>
          <input
            type="text"
            id="phone-number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
            className="form-input"
          />
        </div>
        <button type="submit" className="update-button">
          Update Profile
        </button>
      </form>
      <button
        className="manage-menu-button"
        onClick={() => navigate("/manage-menu")}
      >
        Manage Menu
      </button>
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default Profile;
