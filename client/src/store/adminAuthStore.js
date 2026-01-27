import { create } from "zustand";
import axios from "axios";

// Use relative path for API endpoint to work in both development and production
const API_URL = "/api/admin/auth";

axios.defaults.withCredentials = true;

export const useAdminAuthStore = create((set, get) => ({
	admin: null,
	isAuthenticated: false,
	error: null,
	isLoading: false,
	isCheckingAuth: true,
	message: null,
	sessionTimeout: null,
	lastActivity: Date.now(),

	signup: async (email, password, name) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${API_URL}/signup`, { email, password, name });
			set({ admin: response.data.admin, isAuthenticated: true, isLoading: false });
		} catch (error) {
			set({ error: error.response.data.message || "Error signing up", isLoading: false });
			throw error;
		}
	},

	login: async (email, password) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${API_URL}/login`, { email, password });
			set({
				isAuthenticated: true,
				admin: response.data.admin,
				error: null,
				isLoading: false,
			});

			// Start session timeout for admins (15 minutes)
			get().startSessionTimeout();
		} catch (error) {
			set({ error: error.response?.data?.message || "Error logging in", isLoading: false });
			throw error;
		}
	},

	logout: async () => {
		set({ isLoading: true, error: null });
		try {
			// Clear session timeout
			get().clearSessionTimeout();

			await axios.post(`${API_URL}/logout`);
			set({ admin: null, isAuthenticated: false, error: null, isLoading: false });
		} catch (error) {
			set({ error: "Error logging out", isLoading: false });
			throw error;
		}
	},

	checkAuth: async () => {
		set({ isCheckingAuth: true, error: null });
		try {
			const response = await axios.get(`${API_URL}/check-auth`);
			set({ admin: response.data.admin, isAuthenticated: true, isCheckingAuth: false });

			// Start session timeout if admin is authenticated
			if (response.data.admin) {
				get().startSessionTimeout();
			}
		} catch (error) {
			set({ error: null, isCheckingAuth: false, isAuthenticated: false });
		}
	},

	forgotPassword: async (email) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${API_URL}/forgot-password`, { email });
			set({ message: response.data.message, isLoading: false });
		} catch (error) {
			set({
				isLoading: false,
				error: error.response.data.message || "Error sending reset password email",
			});
			throw error;
		}
	},

	resetPassword: async (token, password) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${API_URL}/reset-password/${token}`, { password });
			set({ message: response.data.message, isLoading: false });
		} catch (error) {
			set({
				isLoading: false,
				error: error.response.data.message || "Error resetting password",
			});
			throw error;
		}
	},

	// Start session timeout - 10 minutes for admins
	startSessionTimeout: () => {
		const state = get();

		// Clear any existing timeout
		if (state.sessionTimeout) {
			clearTimeout(state.sessionTimeout);
		}

		// Set timeout for 10 minutes (600000 milliseconds)
		const timeout = setTimeout(() => {
			console.log('Admin session timeout - logging out admin');
			get().logout();
			// Show notification
			toast.error('Your admin session has expired. Please login again.');
		}, 10 * 60 * 1000); // 10 minutes

		set({ sessionTimeout: timeout, lastActivity: Date.now() });
	},

	// Reset session timeout on admin activity
	resetSessionTimeout: () => {
		const state = get();
		if (state.isAuthenticated) {
			state.startSessionTimeout();
		}
	},

	// Clear session timeout
	clearSessionTimeout: () => {
		const state = get();
		if (state.sessionTimeout) {
			clearTimeout(state.sessionTimeout);
			set({ sessionTimeout: null });
		}
	},
}));
