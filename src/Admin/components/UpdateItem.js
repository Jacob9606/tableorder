import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/UpdateItem.css";

const UpdateItem = () => {
  const location = useLocation();
  const { item } = location.state;
  const [name, setName] = useState(item.name);
  const [price, setPrice] = useState(item.price);
  const [description, setDescription] = useState(item.description);
  const [image, setImage] = useState(item.image);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateItem = (e) => {
    e.preventDefault();
    // 아이템 업데이트 로직을 여기에 추가하세요 (예: 서버로 업데이트 데이터 전송)
    alert("Item updated successfully");
    navigate("/manage-menu");
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
            <img src={image} alt="Item Preview" className="image-preview" />
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
