// Cart.jsx

import React from "react";
import "../styles/Cart.css";

const Cart = ({ cart, removeFromCart, navigateToMenu, placeOrder }) => {
  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price, 0).toFixed(2);
  };

  return (
    <div className="cart-container">
      <h1 className="cart-title">Cart</h1>
      {cart.length === 0 ? (
        <p className="cart-empty">Your cart is empty.</p>
      ) : (
        <div className="cart-items">
          {cart.map((item) => (
            <div key={item.id} className="cart-item">
              <img
                src={item.image_url}
                alt={item.name}
                className="cart-item-image"
              />
              <div className="cart-item-details">
                <h2>{item.name}</h2>
                <p>${item.price.toFixed(2)}</p>
              </div>
              <button
                onClick={() => removeFromCart(item.id)}
                className="cart-item-remove"
              >
                Remove
              </button>
            </div>
          ))}
          <div className="cart-total">
            <h2>Total: ${calculateTotal()}</h2>
          </div>
          <button onClick={placeOrder} className="order-button">
            Place Order
          </button>
        </div>
      )}
      <button onClick={navigateToMenu} className="back-to-menu-button">
        Back to Menu
      </button>
    </div>
  );
};

export default Cart;
