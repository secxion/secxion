const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    isRead: {
        type: Boolean,
        default: false,
    },
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;