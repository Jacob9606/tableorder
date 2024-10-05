import React, { useEffect, useState } from "react";

const WebSocketClient = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // const ws = new WebSocket("ws://localhost:3001");
    const ws = new WebSocket("wss://serve-me-70c148e5be60.herokuapp.com");

    ws.onopen = () => {
      console.log("WebSocket connection established");
      ws.send("Hello Server!");
    };

    ws.onmessage = (event) => {
      const message = event.data;
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <div>
      <h1>WebSocket Client</h1>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>{msg}</li>
        ))}
      </ul>
    </div>
  );
};

export default WebSocketClient;
