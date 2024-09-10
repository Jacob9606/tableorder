import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/OrderDashboard.css";
import { BASE_URL } from "../../config";

const OrderDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("pending");
  const navigate = useNavigate();
  const location = useLocation();

  // 주문 목록을 가져오는 함수
  const fetchOrders = async (adminId) => {
    try {
      const response = await fetch(`${BASE_URL}/orders?admin_id=${adminId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const adminId = params.get("admin_id");

    if (!adminId) {
      console.warn("Missing admin_id in URL parameters.");
      return;
    }

    fetchOrders(adminId);

    let ws;

    // 사운드 재생 함수
    const playSound = () => {
      const audio = new Audio("/tableorder/notification.mp3");
      audio
        .play()
        .catch((error) => console.error("Audio playback failed:", error));
    };

    // WebSocket 설정
    const connectWebSocket = () => {
      ws = new WebSocket(process.env.REACT_APP_WS_URL || "ws://localhost:3000");

      ws.onopen = () => {
        console.log("WebSocket connection established");
      };

      ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        console.log("Received WebSocket message:", message);

        if (message.type === "new_order") {
          fetchOrders(adminId);
          playSound();
        }
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      ws.onclose = (event) => {
        console.log("WebSocket connection closed", event.reason);
        setTimeout(connectWebSocket, 3000); // 3초 후 재연결 시도
      };
    };

    connectWebSocket();

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [location]);

  const handleApprove = (orderGroup) => {
    orderGroup.items.forEach((order) => {
      setOrders((prevOrders) =>
        prevOrders.map((og) =>
          og.items.includes(order)
            ? {
                ...og,
                items: og.items.map((o) =>
                  o.id === order.id ? { ...o, status: "preparation" } : o
                ),
              }
            : og
        )
      );
      updateOrderStatus(order.id, "preparation");
    });
  };

  const handleReject = (orderGroup) => {
    orderGroup.items.forEach((order) => {
      setOrders((prevOrders) =>
        prevOrders.map((og) =>
          og.items.includes(order)
            ? {
                ...og,
                items: og.items.map((o) =>
                  o.id === order.id ? { ...o, status: "rejected" } : o
                ),
              }
            : og
        )
      );
      updateOrderStatus(order.id, "rejected");
    });
  };

  const handleComplete = (orderGroup) => {
    orderGroup.items.forEach((order) => {
      setOrders((prevOrders) =>
        prevOrders.map((og) =>
          og.items.includes(order)
            ? {
                ...og,
                items: og.items.map((o) =>
                  o.id === order.id ? { ...o, status: "completed" } : o
                ),
              }
            : og
        )
      );
      updateOrderStatus(order.id, "completed");
    });
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      const response = await fetch(`${BASE_URL}/orders/${orderId}`, {
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
    (orderGroup) =>
      orderGroup &&
      orderGroup.items &&
      orderGroup.items.some(
        (order) => order.status.toLowerCase() === filter.toLowerCase()
      )
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
          filteredOrders.map((orderGroup) => (
            <div
              key={`${orderGroup.table_id}-${orderGroup.customer_number}`}
              className="order-card"
            >
              <div className="order-header">
                <p>
                  <strong>Table:</strong> {orderGroup.table_id},{" "}
                  <strong>Customer:</strong> {orderGroup.customer_number} -{" "}
                  <strong>Total:</strong> ${orderGroup.total.toFixed(2)}
                </p>
              </div>
              <div className="order-items">
                {orderGroup.items.map((order) => (
                  <div key={order.id} className="order-item">
                    <p>
                      {order.item} - ${order.price.toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
              {filter === "pending" && (
                <div className="button-group-inline">
                  <button onClick={() => handleApprove(orderGroup)}>
                    Approve
                  </button>
                  <button onClick={() => handleReject(orderGroup)}>
                    Reject
                  </button>
                </div>
              )}
              {filter === "preparation" && (
                <button onClick={() => handleComplete(orderGroup)}>
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
