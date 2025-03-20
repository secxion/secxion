import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useSelector } from "react-redux";
import SummaryApi from "../common";
import { toast } from "react-toastify";
import ChatBox from "../Components/ChatBox";

const socket = io(process.env.REACT_APP_BACKEND_URL || "http://localhost:5000", {
  withCredentials: true,
});

const AdminChat = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const admin = useSelector((state) => state.user.user); // Get current admin from Redux

  useEffect(() => {
    fetchUsers();

    socket.on("newMessage", (newMsg) => {
      if (newMsg.recipientId === admin._id) {
        setMessages((prev) => [...prev, newMsg]);
      }
    });

    return () => socket.disconnect();
  }, [admin]);

  const fetchUsers = async () => {
    try {
      console.log("Fetching users...");

      const res = await fetch(SummaryApi.getUserMessage.url, {
        method: SummaryApi.getUserMessage.method,
        credentials: "include",
      });

      const data = await res.json();
      console.log("Fetched Users Response:", data);

      if (data.success && Array.isArray(data.data)) {
        setUsers(data.data);
      } else {
        toast.error("Failed to fetch users");
        setUsers([]); // Prevent UI crashes
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Error fetching users");
      setUsers([]); // Ensure no undefined errors
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar (Scrollable User List) */}
      <div className="w-1/4 bg-white p-4 border-r shadow-md flex flex-col">
        <h2 className="text-lg font-bold mb-4">Users</h2>
        
        {/* Scrollable User List */}
        <div className="overflow-auto flex-1">
          {users.length > 0 ? (
            users.map((user) => (
              <div
                key={user._id}
                className={`p-2 mb-2 rounded-lg cursor-pointer ${
                  selectedUser?._id === user._id ? "bg-blue-500 text-white" : "bg-gray-200"
                }`}
                onClick={() => setSelectedUser(user)}
              >
                <p>{user.name ? user.name : `User ${user._id}`}</p> {/* ✅ Fix Name Display */}
              </div>
            ))
          ) : (
            <p>No users available</p>
          )}
        </div>
      </div>

      {/* Chat Panel */}
      <div className="w-3/4 p-4">
        {selectedUser ? (
          <ChatBox
            userId={selectedUser._id}
            recipientId={admin._id}
            messages={messages}
            setMessages={setMessages}
          />
        ) : (
          <p className="text-center text-gray-500">Select a user to chat</p>
        )}
      </div>
    </div>
  );
};

export default AdminChat;
