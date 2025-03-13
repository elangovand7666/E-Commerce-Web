import React, { useState, useRef, useEffect } from "react";
import "./Bot.css";
import { Link } from "react-router-dom";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const videos = "/backvideo.mp4";
  const chatContainerRef = useRef(null); // 🔹 Create a reference for scrolling

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { text: input, sender: "user" }];
    setMessages(newMessages);
    setInput("");

    try {
      const response = await fetch("http://127.0.0.1:8000/api/chat/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();
      if (data.reply) {
        setMessages([...newMessages, { text: data.reply, sender: "bot" }]);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // 🔹 Scroll to bottom whenever messages update
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div>
      <video autoPlay muted loop className="background-video">
        <source src={videos} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="top">
        <img src="123.png" alt="" />
        <h2>Ziya Store</h2>
      </div>

      <div className="chatbot-container">
        <h2 className="chathead">Ayurvedha Store Chatbot</h2>
        <div className="chat-messages" ref={chatContainerRef}>
          {messages.map((msg, index) => (
            <div key={index} className={`message-card ${msg.sender}`}>
              {msg.text}
            </div>
          ))}
        </div>
        <div className="chat-input">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Let's chat with Bot.."
          />
          <button type="submit" onClick={handleSend}>➤</button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
