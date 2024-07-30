import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AddItem.css";

const AddItem = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("description", description);
    formData.append("image", image);

    try {
      const response = await fetch("http://localhost:3000/add-item", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log("Response Data:", data);

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      alert("Item added successfully");
      navigate("/manage-menu");
    } catch (error) {
      console.error("Error:", error);
      alert(`An error occurred: ${error.message}`);
    }
  };

  return (
    <div className="add-item-container">
      <h1 className="add-item-title">Add Item</h1>
      <form onSubmit={handleAddItem} className="add-item-form">
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
            required
            className="form-input"
          />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Item Preview"
              className="image-preview"
            />
          )}
        </div>
        <button type="submit" className="add-button">
          Add Item
        </button>
      </form>
    </div>
  );
};

export default AddItem;
