import { Navigate, Route, Routes, useLocation } from "react-router-dom";

import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import EmailVerificationPage from "./pages/EmailVerificationPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import LoadingSpinner from "./components/login/LoadingSpinner";
import SettingsPage from "./pages/SettingsPage";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/authStore";
import { useAdminAuthStore } from "./store/adminAuthStore";
import { useEffect } from "react";
import LandingPage from "./pages/LandingPage";
import Header from "./components/common/Header";
import SessionTimeoutTracker from "./components/common/SessionTimeoutTracker";

import TeacherlogPage from "./pages/TeacherloginPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminForgotPasswordPage from "./pages/AdminForgotPasswordPage";
import AdminResetPasswordOTPPage from "./pages/AdminResetPasswordOTPPage";
import UploadPage from "./pages/UploadPage";
import RecordsPage from "./pages/RecordsPage";
import FormDataPage from "./pages/FormDataPage";
import AdminRecordsPage from "./pages/AdminRecordsPage";
import AdminTeacherLogPage from "./pages/AdminTeacherLogPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminSettingsPage from "./pages/AdminSettingsPage";

// Protect routes that require authentication
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (!user?.isVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  // Check if the route requires admin privileges
  if (isAdminRoute && (!user.role || user.role !== 'admin')) {
    console.log('User is not an admin, redirecting from admin route');
    return <Navigate to="/settings" replace />;
  }

  return children;
};

// Protect routes that require admin privileges
const AdminRoute = ({ children }) => {
  const { isAuthenticated: userIsAuthenticated, user } = useAuthStore();
  const { isAuthenticated: adminIsAuthenticated, admin } = useAdminAuthStore();

  // Check if logged in via adminAuthStore
  if (adminIsAuthenticated && admin && admin.role === 'admin') {
    return children;
  }

  // Fallback: Check if logged in via regular authStore with admin role
  if (userIsAuthenticated && user && user.role === 'admin' && user.isVerified) {
    return children;
  }

  // Not authenticated as admin, redirect to admin login
  console.log('User is not an admin, redirecting to admin login');
  return <Navigate to="/admin-login" replace />;
};

// Redirect authenticated users to the appropriate page
const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();
  const isAdminLoginPage = location.pathname === '/admin-login';

  if (isAuthenticated && user?.isVerified) {
    // If user is admin and on admin login page, redirect to admin dashboard
    if (user.role === 'admin' && isAdminLoginPage) {
      return <Navigate to="/admin" replace />;
    }
    // If user is admin and not on admin login page, redirect to admin dashboard
    else if (user.role === 'admin') {
      return <Navigate to="/admin" replace />;
    }
    // For regular users, redirect to settings
    else {
      return <Navigate to="/settings" replace />;
    }
  }

  return children;
};

function App() {
  const { isCheckingAuth, checkAuth } = useAuthStore();
  const { checkAuth: checkAdminAuth } = useAdminAuthStore();
  const location = useLocation();

  // Call checkAuth once when the app loads
  useEffect(() => {
    const initAuth = async () => {
      try {
        await checkAuth();
        await checkAdminAuth();
      } catch (error) {
        console.error('Error during authentication check:', error);
      }
    };

    initAuth();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Define routes that don't require the header
  const noHeaderRoutes = [
    "/login",
    "/signup",
    "/verify-email",
    "/forgot-password",
    "/reset-password",
    "/landing",
    "/admin-login",
    "/admin/forgot-password",
    "/admin/reset-password-otp",
  ];

  // Check if the current route needs the header
  const showHeader = !noHeaderRoutes.some((route) =>
    location.pathname.startsWith(route)
  );

  if (isCheckingAuth) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Session Timeout Tracker */}
      <SessionTimeoutTracker />
      
      {/* Header should be outside the Routes for consistent rendering */}
      {showHeader && <Header />}

      {/* Routing - Add pt-16 to account for fixed header */}
      <div className={showHeader ? "pt-16" : ""}>
        <Routes>
          {/* Main authenticated routes */}
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/teacherlog"
            element={
              <ProtectedRoute>
                <TeacherlogPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/from"
            element={
              <ProtectedRoute>
                <UploadPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/records"
            element={
              <ProtectedRoute>
                <RecordsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/form-data"
            element={
              <ProtectedRoute>
                <FormDataPage />
              </ProtectedRoute>
            }
          />

          {/* Admin routes */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboardPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/records"
            element={
              <AdminRoute>
                <AdminRecordsPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/teacher-log"
            element={
              <AdminRoute>
                <AdminTeacherLogPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <AdminRoute>
                <AdminSettingsPage />
              </AdminRoute>
            }
          />

          {/* Authentication routes */}
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
                <LoginPage />
              </RedirectAuthenticatedUser>
            }
          />
          <Route
            path="/admin-login" // Added admin login route
            element={
              <RedirectAuthenticatedUser>
                <AdminLoginPage />
              </RedirectAuthenticatedUser>
            }
          />
          <Route
            path="/admin/forgot-password"
            element={<AdminForgotPasswordPage />}
          />
          <Route
            path="/admin/reset-password-otp"
            element={<AdminResetPasswordOTPPage />}
          />
          <Route
            path="/landing"
            element={
              <RedirectAuthenticatedUser>
                <LandingPage />
              </RedirectAuthenticatedUser>
            }
          />

          {/* Other public routes */}
          <Route path="/verify-email" element={<EmailVerificationPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/login" element={<Navigate to="/login" replace />} />

          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/landing" replace />} />

          {/*
            To add more routes in the future:
            1. Create the component in the pages folder
            2. Add the route here following the same pattern
            3. If it's a protected route, wrap it with <ProtectedRoute>
            4. If it's a public route but should redirect authenticated users, wrap with <RedirectAuthenticatedUser>
            5. If the route shouldn't show sidebar, add it to the noSidebarRoutes array
          */}
        </Routes>
      </div>

      {/* Toaster component for notifications */}
      <Toaster />
    </div>
  );
}

export default App;