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
    const fetchAdmins = async () => {
      try {
        const storedAdmin = JSON.parse(localStorage.getItem("admin"));
        const token = localStorage.getItem("token");
        if (storedAdmin && storedAdmin._id) {
          setAdminId(storedAdmin._id);
          console.log("🟢 Using logged-in admin:", storedAdmin._id);
          return;
        }

        if (!token) {
          console.error("🔴 No JWT token found for admin request");
          return;
        }

        const response = await axios.get(SummaryApi.getAdmins.url, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        });

        if (response.data.success && response.data.admins.length > 0) {
          setAdminId(response.data.admins[0]._id);
          console.log("🟢 Fallback to first admin:", response.data.admins[0]._id);
        } else {
          console.error("🔴 No admin found in response:", response.data);
        }
      } catch (error) {
        console.error("🔴 Error fetching admins:", error.response?.data || error);
      }
    };

    fetchAdmins();
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
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        socket.emit("sendMessage", response.data.data);
      } else {
        console.error("🔴 Message not sent:", response.data.message);
      }
    } catch (error) {
      console.error("🔴 Error sending message:", error.response?.data || error);
    }
  };

  const fetchMessages = async (userId, recipientId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("🔴 No JWT token found for fetching messages");
        return;
      }

      const response = await axios.get(`${SummaryApi.getMessages.url}/${userId}/${recipientId}`, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      setMessages(response.data?.data || []);
    } catch (error) {
      console.error("🔴 Error fetching messages:", error.response?.data || error);
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
