const Chat = require('../models/Chat');


// Function to handle receiving messages from users
const receiveMessage = async (req, res) => {
    try {
      console.log("Received message payload:", req.body); // Debugging line
  
      const { senderId, recipientId, message } = req.body;
  
      if (!senderId || !recipientId || !message) {
        return res.status(400).json({ success: false, error: "All fields are required" });
      }
  
      const newMessage = new Chat({ senderId, recipientId, message });
      await newMessage.save();
  
      res.status(201).json({ success: true, message: "Message received" });
    } catch (error) {
      console.error("Error receiving message:", error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  };
  

// Function to handle sending replies from admin to users
const sendReply = async (req, res) => {
  const { senderId, recipientId, message } = req.body;

  try {
    // Save the reply to the database
    const replyMessage = await Chat.create({
      senderId,
      recipientId,
      message,
      timestamp: new Date(),
    });
    console.log(req.body)

    // Emit the reply to the user via Socket.IO
    req.io.to(recipientId).emit('newMessage', replyMessage);

    return res.status(200).json({ success: true, data: replyMessage });
  } catch (error) {
    console.error("Error sending reply:", error);
    return res.status(500).json({ success: false, message: "Failed to send reply" });
  }
};

module.exports = {
  receiveMessage,
  sendReply,
};