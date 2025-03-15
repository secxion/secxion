import React, { useEffect, useState, useRef, useCallback } from "react";
import { FaPaperPlane } from "react-icons/fa";
import SummaryApi from "../common";
import { toast } from "react-toastify";

const ChatBox = ({ userId, recipientId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const chatEndRef = useRef(null);

  const fetchMessages = useCallback(async () => {
    try {
      const response = await fetch(
        SummaryApi.getUserMessage.url
          .replace(":userId", userId)
          .replace(":recipientId", recipientId),
        {
          method: SummaryApi.getUserMessage.method,
          credentials: "include",
        }
      );

      const data = await response.json();
      if (data.success) {
        setMessages(data.data || []);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("Failed to fetch messages");
    }
  }, [userId, recipientId]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  


  const handleMessageChange = (e) => {
    setNewMessage(e.target.value);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const messageData = { senderId: userId, recipientId, message: newMessage };

    try {
      const response = await fetch(SummaryApi.sendMessage.url, {
        method: SummaryApi.sendMessage.method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(messageData),
      });

      const data = await response.json();
      if (data.success) {
        setMessages((prevMessages) => [...prevMessages, data.data]);
        setNewMessage("");
        scrollToBottom();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    }
  };

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevent default behavior of Enter key
      handleSendMessage(e); // Send message
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-lg max-w-lg mx-auto">
      <div className="h-80 overflow-y-auto border-b pb-2">
        {messages.length > 0 ? (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-2 p-2 rounded-lg text-sm ${
                msg.senderId === userId
                  ? "bg-blue-500 text-white self-end"
                  : "bg-gray-300 text-gray-800 self-start"
              }`}
            >
              {msg.message}
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No messages yet</p>
        )}
        <div ref={chatEndRef}></div>
      </div>

      <form onSubmit={handleSendMessage} className="mt-4 flex items-center">
        <textarea
          placeholder="Type a message..."
          value={newMessage}
          onChange={handleMessageChange}
          onKeyDown={handleKeyDown}
          className="flex-1 p-2 border rounded-lg focus:ring focus:ring-blue-300"
          rows={2}
        />
        <button
          type="submit"
          className="ml-2 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          <FaPaperPlane />
        </button>
      </form>
    </div>
  );
};

export default ChatBox;