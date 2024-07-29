import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ManageMenu.css";

const initialMenuItems = [
  {
    id: 1,
    name: "Bruschetta",
    price: 7.99,
    description: "Delicious grilled bread",
    image: "/images/bruschetta.jpg",
  },
  {
    id: 2,
    name: "Margherita Pizza",
    price: 12.99,
    description: "Classic pizza with tomato and cheese",
    image: "/images/pizza.jpg",
  },
];

const ManageMenu = () => {
  const [menuItems, setMenuItems] = React.useState(initialMenuItems);
  const navigate = useNavigate();

  const handleDeleteMenuItem = (itemId) => {
    setMenuItems(menuItems.filter((item) => item.id !== itemId));
  };

  return (
    <div className="manage-menu-container">
      <h1 className="manage-menu-title">Manage Menu</h1>
      <button className="add-item-button" onClick={() => navigate("/add-item")}>
        Add Item
      </button>
      <div className="menu-list">
        {menuItems.map((item) => (
          <div key={item.id} className="menu-item">
            <img src={item.image} alt={item.name} className="menu-item-image" />
            <div className="menu-item-details">
              <p>
                {item.name} - ${item.price.toFixed(2)}
              </p>
              <p>{item.description}</p>
              <button
                className="update-button"
                onClick={() =>
                  navigate(`/update-item/${item.id}`, { state: { item } })
                }
              >
                Update
              </button>
              <button
                onClick={() => handleDeleteMenuItem(item.id)}
                className="delete-button"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageMenu;
