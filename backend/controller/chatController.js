const Chat = require("../models/Chat");
const User = require("../models/userModel");

const fetchUserDetails = async (userId) => {
  try {
    const user = await User.findById(userId).select("name email profilePic role");
    return user;
  } catch (err) {
    console.error("Error fetching user details:", err);
    return null;
  }
};

const sendMessage = async (req, res) => {
  try {
    console.log("🔹 Received request body:", req.body);
    console.log("🔹 Authenticated user ID:", req.userId);

    const { recipientId, message } = req.body;

    if (!recipientId || !message) {
      console.log("❌ Missing recipientId or message");
      return res.status(400).json({ message: "recipientId and message are required", error: true, success: false });
    }

    const newMessage = new Chat({ senderId: req.userId, recipientId, message });
    const savedMessage = await newMessage.save();

    const senderDetails = await fetchUserDetails(req.userId);

    res.status(201).json({
      message: "Message sent",
      success: true,
      data: { ...savedMessage.toObject(), senderDetails },
    });

    console.log("✅ Message sent successfully:", savedMessage);
  } catch (err) {
    console.error("🚨 Error sending message:", err);
    res.status(500).json({ message: err.message || err, error: true, success: false });
  }
};



const getMessages = async (req, res) => {
  try {
    const { userId } = req;
    const { recipientId } = req.params;

    if (!recipientId) {
      return res.status(400).json({ message: "recipientId is required", error: true, success: false });
    }

    const messages = await Chat.find({
      $or: [
        { senderId: userId, recipientId },
        { senderId: recipientId, recipientId: userId },
      ],
    }).sort({ createdAt: 1 });

    const messagesWithUserDetails = await Promise.all(
      messages.map(async (msg) => {
        const senderDetails = await fetchUserDetails(msg.senderId);
        return { ...msg.toObject(), senderDetails };
      })
    );

    res.json({ message: "Messages fetched successfully", success: true, data: messagesWithUserDetails });
  } catch (err) {
    console.error("Error fetching messages:", err);
    res.status(500).json({ message: err.message || err, error: true, success: false });
  }
};

const markMessagesAsRead = async (req, res) => {
  try {
    const { userId } = req;
    const { senderId } = req.params;

    await Chat.updateMany(
      { senderId, recipientId: userId, isRead: false },
      { isRead: true }
    );

    res.json({ message: "Messages marked as read", success: true });
  } catch (err) {
    console.error("Error updating message status:", err);
    res.status(500).json({ message: err.message || err, error: true, success: false });
  }
};


const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("sendMessage", async ({ senderId, recipientId, message }) => {
      try {
        if (!senderId || !recipientId || !message) return;

        const newMessage = new Chat({ senderId, recipientId, message });
        const savedMessage = await newMessage.save();

        const senderDetails = await fetchUserDetails(senderId);

        io.emit(`newMessage:${recipientId}`, { ...savedMessage.toObject(), senderDetails });
      } catch (err) {
        console.error("Error saving message:", err);
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};

module.exports = { sendMessage, getMessages, markMessagesAsRead, socketHandler  };
