import { create } from "zustand";
import { io } from "socket.io-client";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5000" : "/";

export const useSocketStore = create((set, get) => ({
    socket: null,
    onlineUsers: [],

    connectSocket: (userId) => {
        const { socket } = get();
        // If already connected with same ID, do nothing
        if (socket?.connected && socket.query?.userId === userId) return;

        // Force disconnect existing
        if (socket) {
            socket.close();
        }

        const newSocket = io(BASE_URL, {
            query: { userId },
            withCredentials: true
        });

        newSocket.connect();

        newSocket.on("getOnlineUsers", (users) => {
            set({ onlineUsers: users });
        });

        set({ socket: newSocket });
    },

    disconnectSocket: () => {
        const { socket } = get();
        if (socket) {
            socket.close();
        }
        set({ socket: null, onlineUsers: [] });
    }
}));
