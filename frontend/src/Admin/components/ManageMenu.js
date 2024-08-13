import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ManageMenu.css";
import { BASE_URL } from "../../../../config";

const ManageMenu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loadedImages, setLoadedImages] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await fetch(`${BASE_URL}items`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch items");
        }

        const data = await response.json();
        console.log("Fetched items:", data);
        setMenuItems(data);
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };

    fetchMenuItems();
  }, []);

  const handleDeleteMenuItem = async (itemId) => {
    try {
      const response = await fetch(`${BASE_URL}items/${itemId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete item");
      }

      setMenuItems(menuItems.filter((item) => item.id !== itemId));
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const handleImageLoad = (id) => {
    setLoadedImages((prev) => ({ ...prev, [id]: true }));
  };

  const handleImageError = (id) => {
    setLoadedImages((prev) => ({ ...prev, [id]: false }));
  };

  return (
    <div className="manage-menu-container">
      <h1 className="manage-menu-title">Manage Menu</h1>
      <button className="add-item-button" onClick={() => navigate("/add-item")}>
        Add Item
      </button>
      <div className="menu-list">
        {menuItems.map((item, index) => (
          <div key={item.id || index} className="menu-item">
            <img
              src={item.image_url}
              alt={item.name}
              className="menu-item-image"
              onLoad={() => handleImageLoad(item.id)}
              onError={() => handleImageError(item.id)}
            />
            {!loadedImages[item.id] && <p>Loading image...</p>}
            <div className="menu-item-details">
              <p>
                {item.name} - ${item.price.toFixed(2)}
              </p>
              <p>{item.description}</p>
              <button
                className="update-button"
                onClick={
                  () =>
                    navigate(`/update-item/${item.id}`, {
                      state: { item, id: item.id },
                    }) // 올바른 아이템 데이터를 전달
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
