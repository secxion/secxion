const Chat = require("../models/Chat");

const getUserMessage = async (req, res) => {
    try {
        console.log("User ID from Middleware:", req.userId);

        if (!req.userId) {
            return res.status(401).json({
                message: "Unauthorized! Please login.",
                error: true,
                success: false
            });
        }

        const userMessages = await Chat.find({
            $or: [
                { senderId: req.userId },
                { recipientId: req.userId }
            ]
        }).sort({ createdAt: -1 });

        console.log("Fetched User Messages:", userMessages);

        res.json({
            message: "Chats",
            success: true,
            error: false,
            data: userMessages
        });

    } catch (err) {
        console.error("Error fetching messages:", err);
        res.status(400).json({
            message: err.message || err,
            error: true,
            success: false
        });
    }
};

module.exports = getUserMessage;