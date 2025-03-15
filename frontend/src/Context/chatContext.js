import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import SummaryApi from "../common";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [adminId, setAdminId] = useState(null);

  useEffect(() => {
    console.log("⚡ ChatProvider initialized");

    const newSocket = io(process.env.REACT_APP_BACKEND_URL, {
      withCredentials: true,
      transports: ["websocket"],
    });

    setSocket(newSocket);

    newSocket.on("receiveMessage", (message) => {
      console.log("📩 New message received:", message);
      setMessages((prev) => [...prev, message]);
    });

    return () => newSocket.disconnect();
  }, []);

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const loggedInAdmin = JSON.parse(localStorage.getItem("admin")); 
        if (loggedInAdmin && loggedInAdmin._id) {
          setAdminId(loggedInAdmin._id);
          console.log("🟢 Using logged-in admin:", loggedInAdmin._id);
          return;
        }
  
        const response = await fetch(SummaryApi.getAdmins.url, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
  
        if (!response.ok) {
          throw new Error(`HTTP Error: ${response.status}`);
        }
  
        const data = await response.json();
  
        if (data.success && data.admins.length > 0) {
          setAdminId(data.admins[0]._id); 
          console.log("🟢 Fallback to first admin:", data.admins[0]._id);
        } else {
          console.error("🔴 No admin found:", data);
        }
      } catch (error) {
        console.error("🔴 Error fetching admin:", error);
      }
    };
  
    fetchAdmin();
  }, []);
  
  
  
  

  const sendMessage = async (message, senderId, recipientId = null) => {
    try {
      if (!recipientId) {
        recipientId = adminId; 
      }

      const response = await axios.post(
        SummaryApi.sendMessage.url,
        { senderId, recipientId, message },
        {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
          credentials: "include",
        }
      );

      if (response.data.success) {
        socket.emit("sendMessage", response.data.data);
      } else {
        console.error("🔴 Message not sent:", response.data.message);
      }
    } catch (error) {
      console.error("🔴 Error sending message:", error);
    }
  };

  const fetchMessages = async (userId, recipientId) => {
    try {
      const response = await fetch(`${SummaryApi.getMessages.url}/${userId}/${recipientId}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const data = await response.json();
      setMessages(data?.data || []);
    } catch (error) {
      console.error("🔴 Error fetching messages:", error);
    }
  };

  return (
    <ChatContext.Provider value={{ messages, sendMessage, fetchMessages, adminId }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
