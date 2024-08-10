
import React, { useState } from "react";
import OrderConfirmation from "./OrderConfirmation"; // 주문 확인 컴포넌트 임포트
import "../styles/Cart.css";

const Cart = ({ removeFromCart, navigateToMenu }) => {
  const [orderPlaced, setOrderPlaced] = useState(false); // 주문 완료 여부 상태
  const cart = JSON.parse(localStorage.getItem("items")) || [];

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price, 0).toFixed(2);
  };

  const placeOrder = async () => {
    try {
      const response = await fetch("http://localhost:3000/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cart),
      });

      if (response.ok) {
        setOrderPlaced(true); // 주문 완료 상태 설정
      } else {
        const data = await response.json();
        throw new Error(data.error);
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert(`Failed to place order: ${error.message}`);
    }
  };

  if (orderPlaced) {
    return (
      <OrderConfirmation
        cart={cart}
        total={calculateTotal()}
        navigateToMenu={navigateToMenu}
      />
    );
  }


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
