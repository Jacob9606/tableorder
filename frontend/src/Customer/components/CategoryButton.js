import React from "react";
import "../styles/MenuOrderPage.css";

const CategoryButton = ({ category, isSelected, onClick }) => (
  <button
    onClick={() => onClick(category)}
    className={`category-button ${isSelected ? "selected" : ""}`}
  >
    {category.charAt(0).toUpperCase() + category.slice(1)}
  </button>
);

export default CategoryButton;
