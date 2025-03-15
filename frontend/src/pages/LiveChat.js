import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useSelector } from "react-redux"; 
import SummaryApi from "../common";
import ChatBox from "../Components/ChatBox";

const socket = io(process.env.REACT_APP_BACKEND_URL || "http://localhost:5000", {
  withCredentials: true,
});

const LiveChat = () => {
  const [admins, setAdmins] = useState([]);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [messages, setMessages] = useState([]); 
  const currentUser = useSelector((state) => state.user.user);

  console.log("🟢 Redux currentUser:", currentUser);

  useEffect(() => {
    fetchAdmins();
    socket.on("newMessage", (newMsg) => {
      setMessages((prev) => [...prev, newMsg]);
    });

    return () => socket.disconnect();
  }, []);

  const fetchAdmins = async () => {
    try {
      const res = await fetch(SummaryApi.getAdmins.url, {
        method: SummaryApi.getAdmins.method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",      });
  
      const data = await res.json();
      console.log("Admin API response:", data);
  
      if (data?.success && Array.isArray(data.admins) && data.admins.length > 0) {
        // Filter for admins with the role of "ADMIN"
        const adminList = data.admins.filter(admin => admin.role === "ADMIN");
        setAdmins(adminList);
  
        // Select the first online admin or the first admin in the list
        const onlineAdmin = adminList.find((admin) => admin.online);
        setSelectedAdmin(onlineAdmin || adminList[0]);
      } else {
        console.warn("No admins available");
        setAdmins([]);
        setSelectedAdmin(null); // No admins to select
      }
    } catch (error) {
      console.error("Error fetching admins:", error);
      setAdmins([]);
      setSelectedAdmin(null); // No admins to select
    }
  };

  return (
    <div className="live-chat-container">
      <h2>Live Chat</h2>
      <p>Current User: {currentUser ? currentUser.name : "Not Logged In"}</p>
      <div>
        <h4>Available Admins:</h4>
        <ul>
          {admins.length > 0 ? (
            admins.map((admin) => (
              <li
                key={admin._id}
                onClick={() => setSelectedAdmin(admin)}
                style={{
                  cursor: "pointer",
                  fontWeight: selectedAdmin?._id === admin._id ? "bold" : "normal",
                }}
              >
                {admin.name} {admin.online ? "🟢" : "🔴"}
              </li>
            ))
          ) : (
            <p>No admins available</p>
          )}
        </ul>
      </div>

      <div>
        Chatting with: {selectedAdmin ? selectedAdmin.name : "No admin available"}
      </div>

      {selectedAdmin && (
  <ChatBox userId={currentUser._id} recipientId={selectedAdmin._id} messages={messages} setMessages={setMessages} />
)}
    </div>
  );
};

export default LiveChat;