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
  const [messages, setMessages] = useState([]); // ✅ Fixed: Messages now actively used
  const currentUser = useSelector((state) => state.user.user);

  useEffect(() => {
    fetchAdmins();
    socket.on("newMessage", (newMsg) => {
      if (newMsg.senderId === selectedAdmin?._id || newMsg.recipientId === selectedAdmin?._id) {
        setMessages((prev) => [...prev, newMsg]); // ✅ Using messages correctly
      }
    });

    return () => socket.disconnect();
  }, [selectedAdmin]);

  const fetchAdmins = async () => {
    try {
      const res = await fetch(SummaryApi.getAdmins.url, {
        method: SummaryApi.getAdmins.method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      const data = await res.json();
      if (data?.success && Array.isArray(data.admins) && data.admins.length > 0) {
        const adminList = data.admins.filter((admin) => admin.role === "ADMIN");
        setAdmins(adminList);

        const onlineAdmin = adminList.find((admin) => admin.online);
        setSelectedAdmin(onlineAdmin || adminList[0]);
      } else {
        setAdmins([]);
        setSelectedAdmin(null);
      }
    } catch (error) {
      setAdmins([]);
      setSelectedAdmin(null);
    }
  };

  return (
    <div className="pt-48 fixed inset-0 flex">
      {/* Sidebar with Admins */}
      <div className="w-1/4 pt-48 bg-gray-100 dark:bg-gray-800 shadow-lg p-4 rounded-lg">
        <h3 className="text-lg pt-48 font-semibold text-gray-900 dark:text-gray-100 mb-3">Admins</h3>
        <ul className="space-y-2">
          {admins.length > 0 ? (
            admins.map((admin) => (
              <li
                key={admin._id}
                onClick={() => setSelectedAdmin(admin)}
                className={`p-3 rounded-lg cursor-pointer flex items-center justify-between text-gray-800 dark:text-gray-200 ${
                  selectedAdmin?._id === admin._id ? "bg-blue-500 text-white" : "hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                <span>{admin.name}</span>
                <span>{admin.online ? "🟢" : "🔴"}</span>
              </li>
            ))
          ) : (
            <p className="text-gray-500">Loading...</p>
          )}
        </ul>
      </div>

      {/* Chat Section */}
      <div className="w-3/4 flex flex-col h-full bg-white dark:bg-gray-900 shadow-lg rounded-lg">
        {selectedAdmin ? (
          <ChatBox userId={currentUser?._id} recipientId={selectedAdmin._id} messages={messages} setMessages={setMessages} />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Initiating....
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveChat;
