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

  const handleAddItem = (e) => {
    e.preventDefault();
    // 아이템 추가 로직을 여기에 추가하세요 (예: 서버로 아이템 데이터 전송)
    alert("Item added successfully");
    navigate("/manage-menu");
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
