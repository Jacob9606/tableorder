import React, { useState } from "react";
import "../styles/RevenuePage.css";
import { BASE_URL } from "../../config";

const initialOrders = [
  {
    id: 1,
    item: "Bruschetta",
    price: 7.99,
    status: "Completed",
    date: "2024-07-28T09:00:00",
  },
  {
    id: 2,
    item: "Margherita Pizza",
    price: 12.99,
    status: "Completed",
    date: "2024-07-28T12:00:00",
  },
  {
    id: 3,
    item: "Tiramisu",
    price: 6.99,
    status: "Completed",
    date: "2024-07-28T18:00:00",
  },
  {
    id: 4,
    item: "Spaghetti Carbonara",
    price: 14.99,
    status: "Completed",
    date: "2024-06-27T18:00:00",
  },
  {
    id: 5,
    item: "Cannoli",
    price: 5.99,
    status: "Completed",
    date: "2023-07-26T18:00:00",
  },
];

const RevenuePage = () => {
  const [orders] = useState(initialOrders);
  const [revenueFilter, setRevenueFilter] = useState("daily");
  const [selectedMonth, setSelectedMonth] = useState("07");
  const [selectedYear, setSelectedYear] = useState("2024");

  const calculateRevenue = () => {
    const today = new Date();
    let filteredOrders;

    if (revenueFilter === "daily") {
      const dateString = today.toISOString().split("T")[0];
      filteredOrders = orders.filter(
        (order) =>
          order.date.startsWith(dateString) && order.status === "Completed"
      );
    } else if (revenueFilter === "monthly") {
      const monthString = `${selectedYear}-${selectedMonth}`;
      filteredOrders = orders.filter(
        (order) =>
          order.date.startsWith(monthString) && order.status === "Completed"
      );
    } else if (revenueFilter === "yearly") {
      const yearString = selectedYear;
      filteredOrders = orders.filter(
        (order) =>
          order.date.startsWith(yearString) && order.status === "Completed"
      );
    }

    return filteredOrders
      .reduce((total, order) => total + order.price, 0)
      .toFixed(2);
  };

  const getRevenueDetails = () => {
    const today = new Date();
    let filteredOrders;

    if (revenueFilter === "daily") {
      const dateString = today.toISOString().split("T")[0];
      filteredOrders = orders.filter(
        (order) =>
          order.date.startsWith(dateString) && order.status === "Completed"
      );
    } else if (revenueFilter === "monthly") {
      const monthString = `${selectedYear}-${selectedMonth}`;
      filteredOrders = orders.filter(
        (order) =>
          order.date.startsWith(monthString) && order.status === "Completed"
      );
    } else if (revenueFilter === "yearly") {
      const yearString = selectedYear;
      filteredOrders = orders.filter(
        (order) =>
          order.date.startsWith(yearString) && order.status === "Completed"
      );
    }

    return filteredOrders.map((order) => (
      <div key={order.id} className="order-item">
        <p>
          {order.date}: {order.item} - ${order.price.toFixed(2)}
        </p>
      </div>
    ));
  };

  return (
    <div className="revenue-page">
      <h1>Revenue Management</h1>
      <div className="revenue-filters">
        {["daily", "monthly", "yearly"].map((filter) => (
          <button
            key={filter}
            className={`filter-button ${
              revenueFilter === filter ? "active" : ""
            }`}
            onClick={() => setRevenueFilter(filter)}
          >
            {filter.charAt(0).toUpperCase() + filter.slice(1)}
          </button>
        ))}
      </div>
      {revenueFilter === "monthly" && (
        <div className="dropdowns">
          <label>
            Month:
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              {Array.from({ length: 12 }, (_, i) => {
                const month = (i + 1).toString().padStart(2, "0");
                return (
                  <option key={month} value={month}>
                    {month}
                  </option>
                );
              })}
            </select>
          </label>
          <label>
            Year:
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              {Array.from({ length: 5 }, (_, i) => {
                const year = (2020 + i).toString();
                return (
                  <option key={year} value={year}>
                    {year}
                  </option>
                );
              })}
            </select>
          </label>
        </div>
      )}
      {revenueFilter === "yearly" && (
        <div className="dropdowns">
          <label>
            Year:
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              {Array.from({ length: 5 }, (_, i) => {
                const year = (2020 + i).toString();
                return (
                  <option key={year} value={year}>
                    {year}
                  </option>
                );
              })}
            </select>
          </label>
        </div>
      )}
      <div className="revenue-details">{getRevenueDetails()}</div>
      <p>Total Revenue: ${calculateRevenue()}</p>
    </div>
  );
};

export default RevenuePage;
