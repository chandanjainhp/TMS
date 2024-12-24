import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/authStore";
import { useEffect } from "react";
import FloatingShape from "./components/login/FloatingShape";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import EmailVerificationPage from "./pages/EmailVerificationPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import Sidebar from "./components/common/Sidebar";
import OverviewPage from "./pages/OverviewPage";
import SettingsPage from "./pages/SettingsPage";
import BranchPage from "./pages/BranchPage";
import LoadingSpinner from "./components/login/LoadingSpinner";
import Header from "./components/common/Header";

// Protect routes that require authentication
const ProtectedRoute = ({ children }) => {
	const { isAuthenticated, user } = useAuthStore();

	if (!isAuthenticated) {
		return <Navigate to="/login" replace />;
	}

	if (!user.isVerified) {
		return <Navigate to="/verify-email" replace />;
	}

	return children;
};

// Redirect authenticated users to the home page
const RedirectAuthenticatedUser = ({ children }) => {
	const { isAuthenticated, user } = useAuthStore();

	if (isAuthenticated && user.isVerified) {
		return <Navigate to="/overview" replace />;
	}

	return children;
};

function App() {
	const { isCheckingAuth, checkAuth, isAuthenticated } = useAuthStore();
	const location = useLocation(); // Get the current route

	useEffect(() => {
		checkAuth();
	}, [checkAuth]);

	if (isCheckingAuth) return <LoadingSpinner />;

	// List of public routes
	const publicRoutes = ["/signup", "/login", "/forgot-password", "/reset-password/:token"];
	const isPublicRoute = publicRoutes.some(route => location.pathname.match(new RegExp(route)));

	return (
		<div className="">
			{/* Floating shapes for public routes */}
			{isPublicRoute && (
				<>
					<FloatingShape color="bg-[#E74C3C]" size="w-64 h-64" top="-5%" left="10%" delay={0} />
					<FloatingShape color="bg-[#ECF0F1]" size="w-48 h-48" top="70%" left="80%" delay={5} />
					<FloatingShape color="bg-[#FFFFFF]" size="w-32 h-32" top="40%" left="-10%" delay={2} />
				</>
			)}

			{/* Public routes */}
			{isPublicRoute && (
				<div className="min-h-screen bg-gradient-to-br from-[#2C3E50] via-[#34495E] to-[#34495E] flex items-center justify-center relative overflow-hidden z-10">
					<Routes>
						<Route
							path="/signup"
							element={
								<RedirectAuthenticatedUser>
									<SignUpPage />
								</RedirectAuthenticatedUser>
							}
						/>
						<Route
							path="/login"
							element={
								<RedirectAuthenticatedUser>
									<div className="flex items-center justify-center h-screen w-full">
										<LoginPage />
									</div>
								</RedirectAuthenticatedUser>
							}
						/>
						<Route path="/verify-email" element={<EmailVerificationPage />} />
						<Route
							path="/forgot-password"
							element={
								<RedirectAuthenticatedUser>
									<ForgotPasswordPage />
								</RedirectAuthenticatedUser>
							}
						/>
						<Route
							path="/reset-password/:token"
							element={
								<RedirectAuthenticatedUser>
									<ResetPasswordPage />
								</RedirectAuthenticatedUser>
							}
						/>
					</Routes>
				</div>
			)}

			{/* Sidebar and Main Content */}
			<div className="flex w-full">
				{/* Render Sidebar only if authenticated */}
				{isAuthenticated && (
					<>
						<Sidebar />
						{/* <Header /> */}
					</>
				)}
				<div
					className={`flex-1 ${isAuthenticated ? "ml-[width-of-sidebar]" : "flex items-center justify-center"}`}
				>
					<Routes>
						{/* Protected routes */}
						<Route
							path="/settings"
							element={
								<ProtectedRoute>
									<SettingsPage />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/branch"
							element={
								<ProtectedRoute>
									<BranchPage />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/overview"
							element={
								<ProtectedRoute>
									<OverviewPage />
								</ProtectedRoute>
							}
						/>
					</Routes>
				</div>
			</div>

			<Toaster />
		</div>
	);
}

export default App;
