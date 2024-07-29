import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/OrderDashboard.css";

const initialOrders = [
  {
    id: 1,
    item: "Bruschetta",
    price: 7.99,
    status: "Pending",
    date: "2024-07-28T09:00:00",
  },
  {
    id: 2,
    item: "Margherita Pizza",
    price: 12.99,
    status: "Pending",
    date: "2024-07-28T12:00:00",
  },
  {
    id: 3,
    item: "Tiramisu",
    price: 6.99,
    status: "Pending",
    date: "2024-07-28T18:00:00",
  },
];

const OrderDashboard = () => {
  const [orders, setOrders] = useState(initialOrders);
  const [filter, setFilter] = useState("Pending");
  const navigate = useNavigate();

  const handleApprove = (orderId) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId ? { ...order, status: "In Progress" } : order
      )
    );
  };

  const handleReject = (orderId) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId ? { ...order, status: "Rejected" } : order
      )
    );
  };

  const handleComplete = (orderId) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId ? { ...order, status: "Completed" } : order
      )
    );
  };

  const filteredOrders = orders.filter((order) => order.status === filter);

  return (
    <div className="order-dashboard">
      <h1>Order Dashboard</h1>
      <div className="order-filters">
        {["Pending", "In Progress", "Completed", "Rejected"].map((status) => (
          <button
            key={status}
            className={`filter-button ${filter === status ? "active" : ""}`}
            onClick={() => setFilter(status)}
          >
            {status}
          </button>
        ))}
      </div>
      <div className="order-list">
        {filteredOrders.map((order) => (
          <div key={order.id} className="order-item">
            <p>
              {order.item} - ${order.price.toFixed(2)}
            </p>
            {filter === "Pending" && (
              <div className="button-group-inline">
                <button onClick={() => handleApprove(order.id)}>Approve</button>
                <button onClick={() => handleReject(order.id)}>Reject</button>
              </div>
            )}
            {filter === "In Progress" && (
              <button onClick={() => handleComplete(order.id)}>
                Ready to go
              </button>
            )}
          </div>
        ))}
      </div>
      <div className="button-group">
        <button className="revenue-button" onClick={() => navigate("/revenue")}>
          Revenue Management
        </button>
        <button className="profile-button" onClick={() => navigate("/profile")}>
          Profile
        </button>
      </div>
    </div>
  );
};

export default OrderDashboard;
