import React, { useState, useEffect } from "react";
import CategoryButton from "./CategoryButton";
import MenuItemCard from "./MenuItemCard";
import CartButton from "./CartButton";
import Cart from "./Cart";
import "../styles/MenuOrderPage.css";



const MenuOrderPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("appetizers");
  const [cart, setCart] = useState([]);
  const [viewingCart, setViewingCart] = useState(false);
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    const fetchMenuItems = async() => {
      try {
        const response = await fetch("http://localhost:3000/items", {
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

  const addToCart = (item) => {
    // Update the cart state
    setCart(prevCart => {
        const updatedCart = [...prevCart, item];
        localStorage.setItem("items", JSON.stringify(updatedCart)); // Save the updated cart to local storage
        
        return updatedCart; // Return the updated cart to set the state
    });
};

  const removeFromCart = (itemId) => {
    const items = JSON.parse(localStorage.getItem("items"))
    
  };

  const navigateToCart = () => {
    setViewingCart(true);
  };

  const navigateToMenu = () => {
    setViewingCart(false);
  };

  const placeOrder = async () => {
    const items = localStorage.getItem("items")
    console.log(typeof(items))

    const response = await fetch("http://localhost:3000/cart", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(items)
    })

    localStorage.removeItem("items")
    setViewingCart(false); // 메뉴 페이지로 돌아갑니다.
  };

  if (viewingCart) {
    return (
      <Cart
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
        {menuItems.map((item) => (
          <MenuItemCard key={item.id} item={item} addToCart={addToCart} />
        ))}
      </div>
      <CartButton cartLength={cart.length} onClick={navigateToCart} />
    </div>
  );
};

export default MenuOrderPage;
