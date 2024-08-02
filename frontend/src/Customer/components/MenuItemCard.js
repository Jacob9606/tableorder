import React from "react";
import "../styles/MenuOrderPage.css";

const MenuItemCard = ({ item, addToCart }) => (
  <div className="menu-item">
    <img src={item.image_url} alt={item.name} />
    <div className="menu-item-content">
      <h2>{item.name}</h2>
      <p>${item.price.toFixed(2)}</p>
      <button onClick={() => addToCart(item)}>Add to Cart</button>
    </div>
  </div>
);

export default MenuItemCard;
