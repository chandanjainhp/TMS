import { Message } from "../models/message.model.js";
import { User } from "../models/user.model.js";

// Send a message
// Send a message
export const sendMessage = async (req, res) => {
    try {
        const { recipientId, subject, content, attachments } = req.body;
        const senderId = req.userId;

        // Fetch sender info
        const sender = await User.findById(senderId);
        if (!sender) {
            return res.status(401).json({ success: false, message: "Sender not found" });
        }

        // Verify recipient exists
        const recipient = await User.findById(recipientId);
        if (!recipient) {
            return res.status(404).json({ success: false, message: "Recipient not found" });
        }

        const newMessage = new Message({
            senderId,
            recipientId,
            senderName: sender.name,
            recipientName: recipient.name,
            subject,
            content,
            attachments: attachments || []
        });

        await newMessage.save();

        // Socket IO - Send real-time message
        try {
            const { getReceiverSocketId, io } = await import("../socket/socket.js");
            const receiverSocketId = getReceiverSocketId(recipientId);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("newMessage", newMessage);
            }
        } catch (socketError) {
            console.error("Socket error:", socketError);
            // Continue execution, don't fail request
        }

        console.log(`[MESSAGING] ${sender.name} sent message to ${recipient.name}`);

        res.status(201).json({
            success: true,
            data: newMessage,
            message: "Message sent successfully"
        });

    } catch (error) {
        console.error("Error in sendMessage:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get Inbox (Received messages)
export const getInbox = async (req, res) => {
    try {
        const userId = req.userId;
        const messages = await Message.find({ recipientId: userId }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: messages
        });
    } catch (error) {
        console.error("Error in getInbox:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get Sent Messages
export const getSentBox = async (req, res) => {
    try {
        const userId = req.userId;
        const messages = await Message.find({ senderId: userId }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: messages
        });
    } catch (error) {
        console.error("Error in getSentBox:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Mark as Read
export const markAsRead = async (req, res) => {
    try {
        const { messageId } = req.params;
        const userId = req.userId;

        const message = await Message.findOneAndUpdate(
            { _id: messageId, recipientId: userId, status: { $ne: 'read' } },
            {
                isRead: true,
                status: 'read',
                readAt: new Date()
            },
            { new: true }
        );

        if (message) {
            // Socket IO - Notify sender that message was read
            try {
                const { getReceiverSocketId, io } = await import("../socket/socket.js");
                const senderSocketId = getReceiverSocketId(message.senderId);
                if (senderSocketId) {
                    io.to(senderSocketId).emit("messageRead", message);
                }
            } catch (socketError) {
                console.error("Socket error (read receipt):", socketError);
            }
        }

        if (!message) {
            // If already read, just return success (idempotent) or 404 if not found
            // Check if it exists at all
            const existing = await Message.findOne({ _id: messageId, recipientId: userId });
            if (existing) return res.status(200).json({ success: true, data: existing });

            return res.status(404).json({ success: false, message: "Message not found or unauthorized" });
        }

        res.status(200).json({
            success: true,
            data: message
        });

    } catch (error) {
        console.error("Error in markAsRead:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Search Users (Teachers/Admins) to message
// This is important so users can find who to message
export const searchUsersForMessaging = async (req, res) => {
    try {
        const { query } = req.query;
        const currentUserId = req.userId;

        // First, get the current user to understand their context
        const currentUser = await User.findById(currentUserId);
        if (!currentUser) {
            return res.status(401).json({ success: false, message: "User not found" });
        }

        console.log(`[MESSAGING] User ${currentUser.name} (${currentUser.role}) searching for users with query: "${query}"`);

        // Build search filter based on user role
        const searchFilter = {
            _id: { $ne: currentUserId },
            isVerified: true
        };

        // Admins can message everyone (admins, teachers, users)
        // Teachers can message admins, other teachers, and users
        // Users can only message admins and teachers
        if (currentUser.role === 'user') {
            searchFilter.role = { $in: ['admin', 'teacher'] };
        }
        // Admins and teachers can message everyone - no role filter needed

        // Add search query if provided
        if (query && query.trim()) {
            searchFilter.$or = [
                { name: { $regex: query, $options: 'i' } },
                { email: { $regex: query, $options: 'i' } }
            ];
        }

        const users = await User.find(searchFilter)
            .select('name email role')
            .limit(50)
            .sort({ role: 1, name: 1 }); // Sort by role (admin first) then name

        console.log(`[MESSAGING] Found ${users.length} users for messaging`);

        res.status(200).json({
            success: true,
            data: users
        });
    } catch (error) {
        console.error("Error in searchUsersForMessaging:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};
