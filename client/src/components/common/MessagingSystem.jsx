import { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
    Send, Search, Loader, MoreVertical,
    ArrowLeft, MessageSquare, Paperclip, File as FileIcon // Added icons
} from "lucide-react";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { useAuthStore } from "../../store/authStore";
import { useAdminAuthStore } from "../../store/adminAuthStore";
import { useSocketStore } from "../../store/socketStore";

const MessagingSystem = () => {
    // Auth context
    const { user, isCheckingAuth: isCheckingUser } = useAuthStore();
    const { admin, isCheckingAuth: isCheckingAdmin } = useAdminAuthStore();
    const currentUser = admin || user;
    const myId = currentUser?._id;

    // Socket
    const { onlineUsers, socket } = useSocketStore();

    // Data State
    const [conversations, setConversations] = useState([]);
    const [messages, setMessages] = useState([]);
    const [contacts, setContacts] = useState([]);

    // UI State
    const [selectedUser, setSelectedUser] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [loading, setLoading] = useState(true);
    const [messageInput, setMessageInput] = useState("");
    const [sending, setSending] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    // File Upload State
    const [attachment, setAttachment] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef(null);

    const scrollRef = useRef(null);
    const activeUserRef = useRef(null);

    // Sync ref for silent updates
    useEffect(() => {
        activeUserRef.current = selectedUser;
    }, [selectedUser]);

    // Initial load and socket listeners
    useEffect(() => {
        if (!myId) return;

        loadData();

        // Listen for real-time messages
        if (socket) {
            socket.on("newMessage", (newMessage) => {
                // Determine if this message belongs to the active conversation
                const isCurrentChat =
                    (newMessage.senderId === activeUserRef.current?._id) ||
                    (newMessage.senderId === myId && newMessage.recipientId === activeUserRef.current?._id);

                if (isCurrentChat) {
                    setMessages(prev => [...prev, newMessage]);
                    // Mark as read if window is open (implied)
                }

                // Always refresh convo list to show unread count/new message snippet
                loadData(true);
            });

            return () => {
                socket.off("newMessage");
            };
        }

    }, [myId, socket]);

    // Scroll effect
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const loadData = async (silent = false) => {
        if (!silent) setLoading(true);
        try {
            // Fetch everything in parallel
            const [usersRes, inboxRes, sentRes] = await Promise.all([
                axios.get(`http://localhost:5000/api/messages/users?query=`, { withCredentials: true }),
                axios.get(`http://localhost:5000/api/messages/inbox`, { withCredentials: true }),
                axios.get(`http://localhost:5000/api/messages/sent`, { withCredentials: true })
            ]);

            const allContacts = usersRes.data.success ? usersRes.data.data : [];
            const inbox = inboxRes.data.success ? inboxRes.data.data : [];
            const sent = sentRes.data.success ? sentRes.data.data : [];

            setContacts(allContacts);

            const allMsgs = [...inbox, ...sent].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

            // Build Conversation Map
            const convoMap = new Map();
            const safeId = (id) => String(id || '');

            allMsgs.forEach(msg => {
                const partnerId = safeId(msg.senderId) === safeId(myId) ? safeId(msg.recipientId) : safeId(msg.senderId);

                if (!convoMap.has(partnerId)) {
                    // Identify partner
                    let partner = allContacts.find(c => safeId(c._id) === partnerId);
                    if (!partner) {
                        // Fallback from message metadata
                        partner = {
                            _id: partnerId,
                            name: safeId(msg.senderId) === safeId(myId) ? msg.recipientName : msg.senderName,
                            role: 'User'
                        };
                    }

                    convoMap.set(partnerId, {
                        user: partner,
                        lastMessage: msg,
                        unreadCount: (!msg.isRead && safeId(msg.recipientId) === safeId(myId)) ? 1 : 0
                    });
                } else {
                    if (!msg.isRead && safeId(msg.recipientId) === safeId(myId)) {
                        convoMap.get(partnerId).unreadCount++;
                    }
                }
            });

            setConversations(Array.from(convoMap.values()));

            // Update active window if open
            if (activeUserRef.current) {
                const activeId = safeId(activeUserRef.current._id);
                // Filter messages for this chat
                const chatMsgs = allMsgs
                    .filter(m => safeId(m.senderId) === activeId || safeId(m.recipientId) === activeId)
                    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)); // Oldest first for display

                // Only update if changed (simple length check or just strict update)
                // Strict update is safer for "not visible" bugs
                setMessages(chatMsgs);
            }

        } catch (error) {
            console.error(error);
            if (!silent) toast.error("Connection error");
        } finally {
            if (!silent) setLoading(false);
        }
    };

    const handleSelectUser = async (user) => {
        setSelectedUser(user);
        setSidebarOpen(false); // Mobile UX
        loadData(true); // Trigger immediate refresh to populate messages
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if ((!messageInput.trim() && !attachment) || !selectedUser) return;

        setSending(true);
        try {
            const res = await axios.post("http://localhost:5000/api/messages/send", {
                recipientId: selectedUser._id,
                subject: "Chat",
                content: messageInput || (attachment ? "Sent an attachment" : ""),
                attachments: attachment ? [attachment] : []
            }, { withCredentials: true });

            if (res.data.success) {
                setMessageInput("");
                setAttachment(null);
                loadData(true); // Refresh all
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to send message");
        } finally {
            setSending(false);
        }
    };

    const handleFileSelect = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 10 * 1024 * 1024) {
            toast.error("File size must be less than 10MB");
            return;
        }

        setIsUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await axios.post("http://localhost:5000/api/messages/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
                withCredentials: true
            });
            if (res.data.success) {
                setAttachment(res.data.data);
                toast.success("File attached");
            }
        } catch (error) {
            toast.error("Failed to upload file");
            console.error(error);
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const removeAttachment = () => {
        setAttachment(null);
    };


    // Derived UI lists
    const filteredContacts = searchTerm
        ? contacts.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()))
        : contacts;

    // Sort contacts: Active Conversations first, then Alphabetical
    const sortedContacts = [...filteredContacts].sort((a, b) => {
        const idA = String(a._id);
        const idB = String(b._id);
        const convoA = conversations.find(c => String(c.user._id) === idA);
        const convoB = conversations.find(c => String(c.user._id) === idB);

        if (convoA && !convoB) return -1;
        if (!convoA && convoB) return 1;
        if (convoA && convoB) {
            return new Date(convoB.lastMessage.createdAt) - new Date(convoA.lastMessage.createdAt);
        }
        return a.name.localeCompare(b.name);
    });

    if (isCheckingUser || isCheckingAdmin) {
        return <div className="flex justify-center p-10"><Loader className="animate-spin text-indigo-600" /></div>;
    }

    return (
        <div className="flex h-[calc(100vh-100px)] bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200 font-sans">

            {/* LEFT SIDEBAR */}
            <div className={`${sidebarOpen ? 'w-full md:w-80' : 'hidden md:flex md:w-80'} flex-col bg-white border-r border-gray-200 transition-all z-10`}>
                <div className="p-4 bg-gray-50 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-800 mb-3">Messages</h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {/* Active Conversations First (Implicit via sort) */}
                    {sortedContacts.map(contact => {
                        const contactId = String(contact._id);
                        const convo = conversations.find(c => String(c.user._id) === contactId);
                        const isSelected = selectedUser?._id === contact._id;
                        const isAdmin = contact.role === 'admin';
                        const isTeacher = contact.role === 'teacher';

                        return (
                            <div
                                key={contact._id}
                                onClick={() => handleSelectUser(contact)}
                                className={`p-4 flex items-center gap-3 cursor-pointer hover:bg-gray-50 border-l-4 transition-all ${isSelected ? 'border-l-indigo-600 bg-indigo-50' : 'border-l-transparent'
                                    }`}
                            >
                                <div className="relative">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm ${isAdmin ? 'bg-rose-600' : isTeacher ? 'bg-emerald-600' : isSelected ? 'bg-indigo-600' : 'bg-gray-400'
                                        }`}>
                                        {contact.name.charAt(0).toUpperCase()}
                                    </div>
                                    {convo?.unreadCount > 0 && (
                                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center border-2 border-white">
                                            <span className="text-[10px] text-white font-bold">{convo.unreadCount}</span>
                                        </div>
                                    )}
                                    {onlineUsers.includes(String(contact._id)) && (
                                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" title="Online"></span>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-baseline">
                                        <div className="flex items-center gap-2">
                                            <p className={`text-sm truncate ${isSelected ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>
                                                {contact.name}
                                            </p>
                                            {isAdmin && (
                                                <span className="px-1.5 py-0.5 text-[9px] font-bold bg-rose-100 text-rose-700 rounded uppercase">Admin</span>
                                            )}
                                            {isTeacher && (
                                                <span className="px-1.5 py-0.5 text-[9px] font-bold bg-emerald-100 text-emerald-700 rounded uppercase">Teacher</span>
                                            )}
                                        </div>
                                        {convo && (
                                            <span className="text-[10px] text-gray-400 ml-2">
                                                {format(new Date(convo.lastMessage.createdAt), 'HH:mm')}
                                            </span>
                                        )}
                                    </div>
                                    <p className={`text-xs truncate mt-0.5 ${convo?.unreadCount ? 'font-semibold text-gray-900' : 'text-gray-500'}`}>
                                        {convo ? convo.lastMessage.content : <span className="italic opacity-70">Tap to chat</span>}
                                    </p>
                                </div>
                            </div>
                        );
                    })}

                    {sortedContacts.length === 0 && (
                        <div className="p-8 text-center text-gray-500 text-sm">
                            <p>No users found.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* RIGHT CHAT AREA */}
            <div className={`flex-1 flex flex-col bg-slate-50 ${!sidebarOpen ? 'flex' : 'hidden md:flex'}`}>
                {selectedUser ? (
                    <>
                        {/* Header */}
                        <div className="h-16 px-4 bg-white border-b border-gray-200 flex items-center justify-between shadow-sm sticky top-0 z-10">
                            <div className="flex items-center gap-3">
                                <button className="md:hidden p-2 hover:bg-gray-100 rounded-full" onClick={() => setSidebarOpen(true)}>
                                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                                </button>
                                <div className="w-9 h-9 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold shadow-sm">
                                    {selectedUser.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-800 text-sm">{selectedUser.name}</h3>
                                    <span className={`text-xs font-medium ${onlineUsers.includes(String(selectedUser._id)) ? 'text-green-600' : 'text-gray-400'}`}>
                                        {onlineUsers.includes(String(selectedUser._id)) ? 'Online' : 'Offline'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Messages List - CLEAN BACKGROUND */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50" ref={scrollRef}>
                            {messages.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-gray-400 opacity-60">
                                    <MessageSquare className="w-12 h-12 mb-2" />
                                    <p className="text-sm">Start the conversation!</p>
                                </div>
                            ) : (
                                messages.map((msg, idx) => {
                                    const isMe = String(msg.senderId) === String(myId);
                                    return (
                                        <div key={idx} className={`flex w-full ${isMe ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[75%] md:max-w-[60%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                                <div className={`px-4 py-2.5 rounded-2xl text-sm shadow-sm ${isMe
                                                    ? 'bg-indigo-600 text-white rounded-br-none'
                                                    : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
                                                    }`}>
                                                    {msg.attachments && msg.attachments.length > 0 && (
                                                        <div className="mb-2 space-y-1">
                                                            {msg.attachments.map((file, i) => (
                                                                <a
                                                                    key={i}
                                                                    href={`http://localhost:5000${file.fileUrl}`}
                                                                    target="_blank"
                                                                    rel="noreferrer"
                                                                    className={`flex items-center gap-2 p-2 rounded text-xs ${isMe ? 'bg-indigo-500 text-white/90' : 'bg-gray-100 text-gray-700'} hover:opacity-90 transition`}
                                                                >
                                                                    <FileIcon className="w-4 h-4" />
                                                                    <span className="underline truncate max-w-[150px]">{file.originalName}</span>
                                                                </a>
                                                            ))}
                                                        </div>
                                                    )}
                                                    {msg.content}
                                                </div>
                                                <span className="text-[10px] text-gray-400 mt-1 px-1">
                                                    {format(new Date(msg.createdAt), 'h:mm a')}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        {/* Attachment Preview */}
                        {attachment && (
                            <div className="px-4 py-2 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <FileIcon className="w-4 h-4" />
                                    <span className="truncate max-w-xs">{attachment.originalName}</span>
                                    <span className="text-gray-400 text-xs">({(attachment.size / 1024).toFixed(1)} KB)</span>
                                </div>
                                <button onClick={removeAttachment} className="text-red-500 hover:bg-red-50 p-1 rounded">
                                    <MoreVertical className="w-4 h-4 rotate-45" />
                                </button>
                            </div>
                        )}

                        {/* Input Area */}
                        <div className="p-3 bg-white border-t border-gray-200">
                            <form onSubmit={handleSendMessage} className="flex gap-2 max-w-4xl mx-auto items-end">
                                {/* File Button */}
                                <input
                                    type="file"
                                    hidden
                                    ref={fileInputRef}
                                    onChange={handleFileSelect}
                                />
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="p-3 text-gray-500 hover:bg-gray-100 rounded-xl"
                                    disabled={isUploading}
                                    title="Attach file"
                                >
                                    {isUploading ? <Loader className="w-5 h-5 animate-spin" /> : <Paperclip className="w-5 h-5" />}
                                </button>

                                <div className="flex-1 bg-gray-100 rounded-xl px-4 py-2 focus-within:ring-2 focus-within:ring-indigo-100 transition-all border border-transparent focus-within:border-indigo-300">
                                    <textarea
                                        value={messageInput}
                                        onChange={e => setMessageInput(e.target.value)}
                                        onKeyDown={e => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                handleSendMessage(e);
                                            }
                                        }}
                                        placeholder="Type a message..."
                                        className="w-full bg-transparent border-none focus:ring-0 p-0 text-sm text-gray-700 placeholder-gray-400 min-h-[24px] max-h-[100px] resize-none"
                                        style={{ height: 'auto', minHeight: '24px' }}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={(!messageInput.trim() && !attachment) || sending}
                                    className="p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                                >
                                    {sending ? <Loader className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center p-8 bg-slate-50">
                        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-sm mb-6">
                            <MessageSquare className="w-10 h-10 text-indigo-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800">TMS Chat</h2>
                        <p className="text-gray-500 mt-2 text-center max-w-xs">
                            Select a user from the sidebar to start chatting.
                        </p>
                        <button className="md:hidden mt-6 bg-indigo-600 text-white px-6 py-2 rounded-full text-sm font-medium shadow-md" onClick={() => setSidebarOpen(true)}>
                            View Contacts
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MessagingSystem;
