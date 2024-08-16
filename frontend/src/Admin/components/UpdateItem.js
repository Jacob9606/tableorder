import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/UpdateItem.css";
import { BASE_URL } from "../config";

const UpdateItem = () => {
  const location = useLocation();
  const { item, id } = location.state || {}; // id를 올바르게 액세스
  const [name, setName] = useState(item ? item.name : "");
  const [price, setPrice] = useState(item ? item.price : "");
  const [description, setDescription] = useState(item ? item.description : "");
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  const handleUpdateItem = async (e) => {
    e.preventDefault();

    if (!id) {
      alert("No item data available");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("description", description);
    if (image) {
      formData.append("image", image);
    }

    try {
      const response = await fetch(`${BASE_URL}items/${id}`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to update item");
      }

      const data = await response.json();
      console.log("Update successful:", data);
      alert("Item updated successfully");
      navigate("/manage-menu");
    } catch (error) {
      console.error("Error updating item:", error);
      alert(`An error occurred: ${error.message}`);
    }
  };

  return (
    <div className="update-item-container">
      <h1 className="update-item-title">Update Item</h1>
      <form onSubmit={handleUpdateItem} className="update-item-form">
        <div className="form-group">
          <label htmlFor="item-name">Item Name:</label>
          <input
            type="text"
            id="item-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="item-price">Item Price:</label>
          <input
            type="number"
            step="0.01"
            id="item-price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="item-description">Item Description:</label>
          <input
            type="text"
            id="item-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="item-image">Item Image:</label>
          <input
            type="file"
            id="item-image"
            onChange={handleImageChange}
            className="form-input"
          />
          {image && (
            <img
              src={URL.createObjectURL(image)}
              alt="Item Preview"
              className="image-preview"
            />
          )}
        </div>
        <button type="submit" className="update-button">
          Update Item
        </button>
      </form>
    </div>
  );
};

export default UpdateItem;
