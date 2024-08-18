import React, { useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
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
    localStorage.removeItem("authToken");
  };

  return (
    <Routes>
      <Route path="/menu" element={<MenuOrderPage />} />
      <Route
        path="/admin"
        element={
          isAdminLoggedIn ? (
            <Navigate to="/dashboard" />
          ) : (
            <AdminLoginPage onLogin={handleAdminLogin} />
          )
        }
      />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route
        path="/dashboard"
        element={
          isAdminLoggedIn ? <OrderDashboard /> : <Navigate to="/admin" />
        }
      />
      <Route
        path="/revenue"
        element={isAdminLoggedIn ? <RevenuePage /> : <Navigate to="/admin" />}
      />
      <Route
        path="/profile"
        element={
          isAdminLoggedIn ? (
            <Profile onLogout={handleAdminLogout} />
          ) : (
            <Navigate to="/admin" />
          )
        }
      />
      <Route
        path="/manage-menu"
        element={isAdminLoggedIn ? <ManageMenu /> : <Navigate to="/admin" />}
      />
      <Route
        path="/add-item"
        element={isAdminLoggedIn ? <AddItem /> : <Navigate to="/admin" />}
      />
      <Route
        path="/update-item/:id"
        element={isAdminLoggedIn ? <UpdateItem /> : <Navigate to="/admin" />}
      />
      <Route path="/cart" element={<Cart />} />
      <Route path="/order-confirmation" element={<OrderConfirmation />} />
      <Route path="/" element={<Navigate to="/admin" />} />
    </Routes>
  );
};

export default App;
