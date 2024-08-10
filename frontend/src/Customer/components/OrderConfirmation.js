import React from "react";
import "../styles/OrderConfirmation.css";

const OrderConfirmation = ({ cart, total, navigateToMenu }) => {
  return (
    <div className="order-confirmation-container">
      <h1 className="order-confirmation-title">Order Confirmation</h1>
      <p className="order-confirmation-message">
        Your order is being prepared!
      </p>

      <div className="order-details">
        {cart.map((item) => (
          <div key={item.id} className="order-item">
            <img
              src={item.image_url}
              alt={item.name}
              className="order-item-image"
            />
            <div className="order-item-details">
              <h2>{item.name}</h2>
              <p>${item.price.toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="order-total">
        <h2>Total: ${total}</h2>
      </div>

      <button onClick={navigateToMenu} className="back-to-menu-button">
        Back to Menu
      </button>
    </div>
  );
};

export default OrderConfirmation;
