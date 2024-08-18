import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/OrderDashboard.css";
import { BASE_URL } from "../../config";

const OrderDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("pending");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${BASE_URL}orders`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        console.log("Response status:", response.status);

        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }

        const data = await response.json();
        console.log("Fetched orders data:", data);
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  const handleApprove = (orderId) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId ? { ...order, status: "preparation" } : order
      )
    );
    updateOrderStatus(orderId, "preparation");
  };

  const handleReject = (orderId) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId ? { ...order, status: "rejected" } : order
      )
    );
    updateOrderStatus(orderId, "rejected");
  };

  const handleComplete = (orderId) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId ? { ...order, status: "completed" } : order
      )
    );
    updateOrderStatus(orderId, "completed");
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      const response = await fetch(`${BASE_URL}orders/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error("Failed to update order status");
      }
      console.log(`Order ${orderId} status updated to ${status}`);
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const filteredOrders = orders.filter(
    (order) => order.status.toLowerCase() === filter.toLowerCase()
  );

  return (
    <div className="order-dashboard">
      <h1>Order Dashboard</h1>
      <div className="order-filters">
        {["Pending", "Preparation", "Completed", "Rejected"].map((status) => (
          <button
            key={status}
            className={`filter-button ${
              filter === status.toLowerCase() ? "active" : ""
            }`}
            onClick={() => setFilter(status.toLowerCase())}
          >
            {status}
          </button>
        ))}
      </div>
      <div className="order-list">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <div key={order.id} className="order-item">
              <p>
                {order.item} - ${order.price.toFixed(2)}
              </p>
              {filter === "pending" && (
                <div className="button-group-inline">
                  <button onClick={() => handleApprove(order.id)}>
                    Approve
                  </button>
                  <button onClick={() => handleReject(order.id)}>Reject</button>
                </div>
              )}
              {filter === "preparation" && (
                <button onClick={() => handleComplete(order.id)}>
                  Ready to go
                </button>
              )}
            </div>
          ))
        ) : (
          <p>No orders to display</p>
        )}
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
