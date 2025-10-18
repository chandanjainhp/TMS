import { create } from "zustand";
import axios from "axios";

// Use environment variables for API URL
const API_URL = "/api/auth";

// Set axios defaults
axios.defaults.withCredentials = true;
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Add request interceptor for debugging - only in development
if (import.meta.env.MODE !== 'production') {
  axios.interceptors.request.use(request => {
    console.log('Starting Request', {
      url: request.url,
      method: request.method,
      withCredentials: request.withCredentials,
      headers: request.headers
    });
    return request;
  });

  // Add response interceptor for debugging
  axios.interceptors.response.use(
    response => {
      console.log('Response:', {
        status: response.status,
        data: response.data
      });
      return response;
    },
    error => {
      console.error('Response Error:', {
        message: error.message,
        response: error.response ? {
          status: error.response.status,
          data: error.response.data
        } : 'No response'
      });
      return Promise.reject(error);
    }
  );
}

export const useAuthStore = create((set, get) => ({
	user: null,
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
			set({ user: response.data.user, isAuthenticated: true, isLoading: false });
		} catch (error) {
			set({ error: error.response.data.message || "Error signing up", isLoading: false });
			throw error;
		}
	},
	login: async (email, password, isAdmin = false) => {
		set({ isLoading: true, error: null });
		try {
			// Choose the appropriate endpoint based on isAdmin flag
			const endpoint = isAdmin ? `${API_URL}/AdminLoginPage` : `${API_URL}/login`;
			const response = await axios.post(endpoint, { email, password }, { withCredentials: true });

			console.log('Login response:', response.data);

			set({
				isAuthenticated: true,
				user: response.data.user,
				error: null,
				isLoading: false,
			});

			// Start session timeout for regular users (30 minutes)
			get().startSessionTimeout();

			// Redirect based on user role
			if (response.data.user && response.data.user.role === 'admin') {
				console.log('Redirecting to admin dashboard');
				window.location.href = '/admin';
			} else {
				console.log('Redirecting to home');
				window.location.href = '/';
			}
		} catch (error) {
			console.error('Login error:', error);
			set({ error: error.response?.data?.message || "Error logging in", isLoading: false });
			throw error;
		}
	},

	adminLogin: async (email, password) => {
		set({ isLoading: true, error: null });
		try {
			console.log('Admin login attempt for:', email);
			const response = await axios.post(`${API_URL}/AdminLoginPage`,
				{ email, password },
				{ withCredentials: true }
			);

			console.log('Admin login response:', response.data);

			set({
				isAuthenticated: true,
				user: response.data.user,
				error: null,
				isLoading: false,
			});

			// Redirect to admin dashboard
			console.log('Redirecting to admin dashboard');
			window.location.href = '/admin';
		} catch (error) {
			console.error('Admin login error:', error);
			set({
				error: error.response?.data?.message || "Invalid admin credentials",
				isLoading: false
			});
			throw error;
		}
	},

	logout: async () => {
		set({ isLoading: true, error: null });
		try {
			console.log('Logging out...');
			
			// Clear session timeout
			get().clearSessionTimeout();
			
			await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
			console.log('Logout successful');
			set({ user: null, isAuthenticated: false, error: null, isLoading: false });

			// Redirect to login page
			window.location.href = '/login';
		} catch (error) {
			console.error('Logout error:', error);
			// Even if there's an error, clear the user state
			set({ user: null, isAuthenticated: false, error: "Error logging out", isLoading: false });
		}
	},
	verifyEmail: async (code) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${API_URL}/verify-email`, { code });
			set({ user: response.data.user, isAuthenticated: true, isLoading: false });
			return response.data;
		} catch (error) {
			set({ error: error.response.data.message || "Error verifying email", isLoading: false });
			throw error;
		}
	},
	checkAuth: async () => {
		set({ isCheckingAuth: true, error: null });
		try {
			console.log('Auth store: Checking authentication');
			// Ensure withCredentials is set to true
			const response = await axios.get(`${API_URL}/check-auth`, {
				withCredentials: true
			});
			console.log('Auth store: Authentication check response:', response.data);
			set({
				user: response.data.user,
				isAuthenticated: true,
				isCheckingAuth: false
			});
			
			// Start session timeout if user is authenticated
			if (response.data.user) {
				get().startSessionTimeout();
			}
		} catch (error) {
			console.error('Auth store: Authentication check error:', error);
			set({
				user: null,
				error: null,
				isCheckingAuth: false,
				isAuthenticated: false
			});
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
	resetPassword: async (otp, password) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${API_URL}/reset-password`, { otp, password });
			set({ message: response.data.message, isLoading: false });
		} catch (error) {
			set({
				isLoading: false,
				error: error.response.data.message || "Error resetting password",
			});
			throw error;
		}
	},

	changePassword: async (currentPassword, newPassword) => {
		const state = get();

		// Check if user is authenticated
		if (!state.isAuthenticated) {
			const error = new Error('You must be logged in to change your password.');
			error.response = { status: 401, data: { message: 'You must be logged in to change your password.' } };
			set({ error: 'You must be logged in to change your password.' });
			throw error;
		}

		set({ isLoading: true, error: null, message: null });
		try {
			console.log('Auth store: Sending change password request');
			// Add withCredentials to ensure cookies are sent with the request
			const response = await axios.post(`${API_URL}/change-password`,
				{ currentPassword, newPassword },
				{ withCredentials: true }
			);
			console.log('Auth store: Change password response:', response.data);
			set({ message: response.data.message, isLoading: false });
			return response.data;
		} catch (error) {
			console.error('Auth store: Change password error:', error);
			set({
				isLoading: false,
				error: error.response?.data?.message || "Error changing password",
			});
			throw error;
		}
	},

	// Start session timeout - 30 minutes for regular users
	startSessionTimeout: () => {
		const state = get();
		
		// Clear any existing timeout
		if (state.sessionTimeout) {
			clearTimeout(state.sessionTimeout);
		}

		// Set timeout for 30 minutes (1800000 milliseconds)
		const timeout = setTimeout(() => {
			console.log('Session timeout - logging out user');
			get().logout();
			// Show notification
			if (typeof window !== 'undefined' && window.toast) {
				window.toast.error('Your session has expired. Please login again.');
			}
		}, 30 * 60 * 1000); // 30 minutes

		set({ sessionTimeout: timeout, lastActivity: Date.now() });
	},

	// Reset session timeout on user activity
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
