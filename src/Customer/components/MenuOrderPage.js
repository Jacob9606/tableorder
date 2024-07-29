import React, { useState } from "react";
import CategoryButton from "./CategoryButton";
import MenuItemCard from "./MenuItemCard";
import CartButton from "./CartButton";
import Cart from "./Cart";
import "../styles/MenuOrderPage.css";

const menuItems = {
  appetizers: [
    {
      id: 1,
      name: "Bruschetta",
      price: 7.99,
      image: "/api/placeholder/300/200",
    },
    {
      id: 2,
      name: "Mozzarella Sticks",
      price: 6.99,
      image: "/api/placeholder/300/200",
    },
  ],
  mainCourses: [
    {
      id: 3,
      name: "Margherita Pizza",
      price: 12.99,
      image: "/api/placeholder/300/200",
    },
    {
      id: 4,
      name: "Spaghetti Carbonara",
      price: 14.99,
      image: "/api/placeholder/300/200",
    },
  ],
  desserts: [
    { id: 5, name: "Tiramisu", price: 6.99, image: "/api/placeholder/300/200" },
    { id: 6, name: "Cannoli", price: 5.99, image: "/api/placeholder/300/200" },
  ],
};

const MenuOrderPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("appetizers");
  const [cart, setCart] = useState([]);
  const [viewingCart, setViewingCart] = useState(false);

  const addToCart = (item) => {
    if (!cart.some((cartItem) => cartItem.id === item.id)) {
      setCart([...cart, item]);
    }
  };

  const removeFromCart = (itemId) => {
    setCart(cart.filter((item) => item.id !== itemId));
  };

  const navigateToCart = () => {
    setViewingCart(true);
  };

  const navigateToMenu = () => {
    setViewingCart(false);
  };

  const placeOrder = () => {
    // 주문 로직을 여기에 추가하세요 (예: 서버로 주문 데이터 전송)
    alert("Order placed successfully!");
    setCart([]); // 주문 후 카트를 비웁니다.
    setViewingCart(false); // 메뉴 페이지로 돌아갑니다.
  };

  if (viewingCart) {
    return (
      <Cart
        cart={cart}
        removeFromCart={removeFromCart}
        navigateToMenu={navigateToMenu}
        placeOrder={placeOrder}
      />
    );
  }

  return (
    <div className="container">
      <h1 className="title">Menu</h1>
      <div className="category-buttons">
        {Object.keys(menuItems).map((category) => (
          <CategoryButton
            key={category}
            category={category}
            isSelected={selectedCategory === category}
            onClick={setSelectedCategory}
          />
        ))}
      </div>
      <div className="menu-grid">
        {menuItems[selectedCategory].map((item) => (
          <MenuItemCard key={item.id} item={item} addToCart={addToCart} />
        ))}
      </div>
      <CartButton cartLength={cart.length} onClick={navigateToCart} />
    </div>
  );
};

export default MenuOrderPage;
