import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    recipientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    senderName: {
        type: String,
        required: true
    },
    recipientName: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        default: "No Subject"
    },
    content: {
        type: String,
        required: true
    },
    // Optional file attachments
    attachments: [{
        originalName: String,
        fileUrl: String,
        mimeType: String,
        size: Number
    }],
    isRead: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ['sent', 'delivered', 'read'],
        default: 'sent'
    },
    readAt: {
        type: Date
    }
}, { timestamps: true });

export const Message = mongoose.model("Message", messageSchema);
