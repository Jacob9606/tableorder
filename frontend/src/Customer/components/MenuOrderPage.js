import React, { useState, useEffect } from "react";
import CategoryButton from "./CategoryButton";
import MenuItemCard from "./MenuItemCard";
import CartButton from "./CartButton";
import Cart from "./Cart";
import "../styles/MenuOrderPage.css";
import servemelogo from "../../servemelogo.png";
import { BASE_URL } from "../../config";
import { useLocation } from "react-router-dom";

const MenuOrderPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("Main");
  const [cart, setCart] = useState([]);
  const [viewingCart, setViewingCart] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  const location = useLocation();
  const [tableId, setTableId] = useState(null);
  const [adminId, setAdminId] = useState(null);

  // generateCustomerNumber 함수를 useState보다 위로 이동
  const generateCustomerNumber = () => {
    const newCustomerNumber = Math.floor(Math.random() * 10000);
    localStorage.setItem("customer_number", newCustomerNumber);
    return newCustomerNumber;
  };

  const [customerNumber, setCustomerNumber] = useState(() => {
    const params = new URLSearchParams(location.search);
    return params.get("customer_number") || generateCustomerNumber();
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tableIdParam = params.get("table_id");
    const adminIdParam = params.get("admin_id");
    setTableId(tableIdParam);
    setAdminId(adminIdParam);

    if (!tableIdParam) {
      console.warn("Missing table_id in URL parameters.");
      return;
    }

    const fetchMenuItems = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/items?admin_id=${adminIdParam}`, // 백틱으로 감싸서 템플릿 리터럴로 수정
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch items");
        }

        const data = await response.json();
        setMenuItems(data);
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };

    fetchMenuItems();

    const storedCart = JSON.parse(localStorage.getItem("items")) || [];
    setCart(storedCart);
  }, [location]);

  const addToCart = (item) => {
    setCart((prevCart) => {
      const updatedCart = [...prevCart, item];
      localStorage.setItem("items", JSON.stringify(updatedCart));
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

  // 직원 호출 버튼 클릭 시 WebSocket을 통해 서버로 호출 메시지 전송
  const callStaff = () => {
    const ws = new WebSocket("ws://localhost:3000");

    ws.onopen = () => {
      console.log(
        "WebSocket connection established, sending call_staff message"
      );
      ws.send(
        JSON.stringify({
          type: "call_staff",
          table_id: tableId,
        })
      );
    };

    ws.onmessage = (event) => {
      console.log("Message from server:", event.data);
    };

    ws.onclose = (event) => {
      console.log(
        `WebSocket closed: Code: ${event.code}, Reason: ${event.reason}` // 템플릿 리터럴 사용하여 수정
      );
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
  };

  if (viewingCart) {
    return (
      <Cart
        removeFromCart={removeFromCart}
        navigateToMenu={navigateToMenu}
        setViewingCart={setViewingCart}
        setCart={setCart}
        tableId={tableId}
        customerNumber={customerNumber}
        adminId={adminId}
      />
    );
  }

  const uniqueCategories = [...new Set(menuItems.map((item) => item.category))];
  const filteredItems = menuItems.filter(
    (item) => item.category === selectedCategory
  );

  return (
    <div className="container">
      <div className="header-container">
        <div className="logo-container">
          <img src={servemelogo} alt="Serve Me Logo" className="logo" />
        </div>
        <h1 className="table-id">Table: {tableId}</h1>
      </div>
      <div className="category-buttons">
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
      {cart.length > 0 && (
        <CartButton cartLength={cart.length} onClick={navigateToCart} />
      )}
      {/* 직원 호출 버튼 추가 */}
      <button onClick={callStaff} className="call-staff-button">
        Call Employee
      </button>
    </div>
  );
};

export default MenuOrderPage;
