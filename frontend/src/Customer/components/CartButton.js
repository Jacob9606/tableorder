import React from "react";
import "../styles/MenuOrderPage.css";

const CartButton = ({ cartLength, onClick }) => (
  <div className="cart-button-container">
    <button className="cart-button" onClick={onClick}>
      🛒 View Cart ({cartLength} items)
    </button>
  </div>
);

export default CartButton;
