import React, { useState } from "react";
import OrderConfirmation from "./OrderConfirmation";
import "../styles/Cart.css";
import { BASE_URL } from "../../config";

const Cart = ({
  removeFromCart,
  navigateToMenu,
  setViewingCart,
  setCart,
  tableId,
  adminId,
  customerNumber, // customerNumber 추가
}) => {
  const [orderPlaced, setOrderPlaced] = useState(false);
  const cart = JSON.parse(localStorage.getItem("items")) || [];

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price, 0).toFixed(2);
  };

  const placeOrder = async () => {
    if (!tableId) {
      console.error("Table number is missing");
      alert("Table number is missing. Cannot place the order.");
      return;
    }

    const cartWithTableNo = cart.map((item) => ({
      item: item.name,
      price: item.price,
      table_id: tableId,
      admin_id: adminId,
      customer_number: customerNumber, // customer_number 추가
      status: "Pending",
      created_at: new Date().toISOString(),
    }));

    console.log("Placing order with table_id:", tableId);

    try {
      const response = await fetch(`${BASE_URL}/cart`, {
        // localhost로 할때는 {BASE_URL} 뒤에 / 넣기
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cartWithTableNo),
      });

      if (response.ok) {
        setOrderPlaced(true);
        localStorage.removeItem("items");
        setCart([]);
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
          {cart.map((item, index) => (
            <div key={`${item.id}-${index}`} className="cart-item">
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
