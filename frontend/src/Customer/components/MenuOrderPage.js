import React, { useState, useEffect } from "react";
import CategoryButton from "./CategoryButton";
import MenuItemCard from "./MenuItemCard";
import CartButton from "./CartButton";
import Cart from "./Cart";
import "../styles/MenuOrderPage.css";

const MenuOrderPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("Breakfast");
  const [cart, setCart] = useState([]);
  const [viewingCart, setViewingCart] = useState(false);
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    // Get the menu items from the database
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

    // Restore cart state from localStorage
    const storedCart = JSON.parse(localStorage.getItem("items")) || [];
    setCart(storedCart);
  }, []);

  const addToCart = (item) => {
    setCart((prevCart) => {
      const updatedCart = [...prevCart, item];
      localStorage.setItem("items", JSON.stringify(updatedCart)); // Save the updated cart to local storage
      return updatedCart;
    });
  };

  const removeFromCart = (itemId) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.filter((item) => item.id !== itemId);
      localStorage.setItem("items", JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  const navigateToCart = () => {
    setViewingCart(true);
  };

  const navigateToMenu = () => {
    setViewingCart(false);
  };

  const placeOrder = async () => {
    const items = cart;
    console.log("Placing order:", items);

    try {
      const response = await fetch("http://localhost:3000/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(items),
      });

      if (!response.ok) {
        throw new Error("Failed to place order");
      }

      setViewingCart(false); // 메뉴 페이지로 돌아갑니다.
      localStorage.removeItem("items");
      setCart([]);
      
      console.log("Order placed successfully");
    } catch (error) {
      console.error("Error placing order:", error);
    }
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

  const uniqueCategories = [...new Set(menuItems.map(item => item.category))];
  const filteredItems = menuItems.filter(
    (item) => item.category === selectedCategory
  );

  return (
    <div className="container">
      <h1 className="title">Menu</h1>
      <div className="category-buttons">
        {/* {Object.keys(menuItems).map((category) => (
          <CategoryButton
            key={category}
            category={category}
            isSelected={selectedCategory === category}
            onClick={setSelectedCategory}
          />
        ))} */}
        {uniqueCategories.map((category) => (
          <CategoryButton
            key={category}
            category={category}
            isSelected={selectedCategory === category}
            onClick={() => setSelectedCategory(category)}
          />
        ))}
      </div>
      <div className="menu-grid">
        {filteredItems.map((item) => (
          <MenuItemCard key={item.id} item={item} addToCart={addToCart} />
        ))}
      </div>
      <CartButton cartLength={cart.length} onClick={navigateToCart} />
    </div>
  );
};

export default MenuOrderPage;
