import React, { useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { BASE_URL } from "../../config";
import MenuOrderPage from "./Customer/components/MenuOrderPage";
import AdminLoginPage from "./Admin/components/AdminLoginPage";
import OrderDashboard from "./Admin/components/OrderDashboard";
import RevenuePage from "./Admin/components/RevenuePage";
import SignupPage from "./Admin/components/SignupPage";
import ForgotPassword from "./Admin/components/ForgotPassword";
import Profile from "./Admin/components/Profile";
import ManageMenu from "./Admin/components/ManageMenu";
import AddItem from "./Admin/components/AddItem";
import UpdateItem from "./Admin/components/UpdateItem";
import ResetPassword from "./Admin/components/ResetPassword";
import Cart from "./Customer/components/Cart";
import OrderConfirmation from "./Customer/components/OrderConfirmation";

const App = () => {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  const handleAdminLogin = () => {
    setIsAdminLoggedIn(true);
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    localStorage.removeItem("authToken"); // 토큰 삭제
  };

  return (
    <Routes>
      <Route path={`${BASE_URL}menu`} element={<MenuOrderPage />} />
      <Route
        path={`${BASE_URL}admin`}
        element={
          isAdminLoggedIn ? (
            <Navigate to={`${BASE_URL}dashboard`} />
          ) : (
            <AdminLoginPage onLogin={handleAdminLogin} />
          )
        }
      />
      <Route path={`${BASE_URL}signup`} element={<SignupPage />} />
      <Route path={`${BASE_URL}forgot-password`} element={<ForgotPassword />} />
      <Route path={`${BASE_URL}reset-password`} element={<ResetPassword />} />
      <Route
        path={`${BASE_URL}dashboard`}
        element={
          isAdminLoggedIn ? (
            <OrderDashboard />
          ) : (
            <Navigate to={`${BASE_URL}admin`} />
          )
        }
      />
      <Route
        path={`${BASE_URL}revenue`}
        element={
          isAdminLoggedIn ? (
            <RevenuePage />
          ) : (
            <Navigate to={`${BASE_URL}admin`} />
          )
        }
      />
      <Route
        path={`${BASE_URL}profile`}
        element={
          isAdminLoggedIn ? (
            <Profile onLogout={handleAdminLogout} />
          ) : (
            <Navigate to={`${BASE_URL}admin`} />
          )
        }
      />
      <Route
        path={`${BASE_URL}manage-menu`}
        element={
          isAdminLoggedIn ? (
            <ManageMenu />
          ) : (
            <Navigate to={`${BASE_URL}admin`} />
          )
        }
      />
      <Route
        path={`${BASE_URL}add-item`}
        element={
          isAdminLoggedIn ? <AddItem /> : <Navigate to={`${BASE_URL}admin`} />
        }
      />
      <Route
        path={`${BASE_URL}update-item/:id`}
        element={
          isAdminLoggedIn ? (
            <UpdateItem />
          ) : (
            <Navigate to={`${BASE_URL}admin`} />
          )
        }
      />
      <Route path={`${BASE_URL}cart`} element={<Cart />} />
      <Route
        path={`${BASE_URL}order-confirmation`}
        element={<OrderConfirmation />}
      />
      <Route
        path={`${BASE_URL}`}
        element={<Navigate to={`${BASE_URL}admin`} />}
      />
    </Routes>
  );
};

export default App;
