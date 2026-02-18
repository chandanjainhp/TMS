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
import { useSocketStore } from "./store/socketStore";
import LandingPage from "./pages/LandingPage";
import Header from "./components/common/Header";
import SessionTimeoutTracker from "./components/common/SessionTimeoutTracker";

import TeacherlogPage from "./pages/TeacherloginPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminForgotPasswordPage from "./pages/AdminForgotPasswordPage";
import AdminResetPasswordOTPPage from "./pages/AdminResetPasswordOTPPage";
import UploadPage from "./pages/UploadPage";
import StudentRepositoryPage from "./pages/StudentRepositoryPage";
import RecordsPage from "./pages/RecordsPage";
import FormDataPage from "./pages/FormDataPage";
import AdminRecordsPage from "./pages/AdminRecordsPage";
import AdminTeacherLogPage from "./pages/AdminTeacherLogPage";
import ManageSubjectsPage from "./pages/ManageSubjectsPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminSettingsPage from "./pages/AdminSettingsPage";
import AdminAnalyticsPage from "./pages/AdminAnalyticsPage";
import StudentResultPage from "./pages/StudentResultPage";
import MessagingPage from "./pages/MessagingPage";
import AdminMessagesPage from "./pages/AdminMessagesPage";
import TeacherDashboardPage from "./pages/TeacherDashboardPage";
import PrincipalDashboardPage from "./pages/PrincipalDashboardPage";
import {
  AboutPage, FeaturesPage, PricingPage, SecurityPage,
  DocumentationPage, GuidesPage, SupportPage,
  BlogPage, CareersPage, PrivacyPage, TermsPage
} from "./pages/StaticPages";


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
  // Enhanced to support 'principal', 'hod' (admin), and legacy 'admin'
  const ALLOWED_ADMIN_ROLES = ['admin', 'hod', 'principal', 'superAdmin'];

  if (adminIsAuthenticated && admin && ALLOWED_ADMIN_ROLES.includes(admin.role)) {
    return children;
  }

  // Fallback: Check if logged in via regular authStore with admin role
  if (userIsAuthenticated && user && ALLOWED_ADMIN_ROLES.includes(user.role) && user.isVerified) {
    return children;
  }

  // Not authenticated as admin, redirect to admin login
  console.log('User is not an admin, redirecting to admin login');
  return <Navigate to="/admin-login" replace />;
};

// Protect routes that require teacher privileges
const TeacherRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated && user && (user.role === 'teacher' || user.role === 'admin')) {
    return children;
  }

  console.log('User is not a teacher, redirecting to login');
  return <Navigate to="/teacherlog" replace />;
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
    // If user is teacher, redirect to teacher dashboard
    else if (user.role === 'teacher') {
      return <Navigate to="/teacher-dashboard" replace />;
    }
    // For regular users, redirect to settings
    else {
      return <Navigate to="/settings" replace />;
    }
  }

  return children;
};

function App() {
  const { isCheckingAuth, checkAuth, user } = useAuthStore();
  const { checkAuth: checkAdminAuth, admin } = useAdminAuthStore();
  const { connectSocket, disconnectSocket } = useSocketStore();
  const location = useLocation();

  const currentUser = admin || user;

  // Socket connection management
  useEffect(() => {
    if (currentUser?._id) {
      connectSocket(currentUser._id);
    } else {
      disconnectSocket();
    }
  }, [currentUser, connectSocket, disconnectSocket]);

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
    "/admin",
    "/results",
    "/teacher-dashboard",
    "/about", "/features", "/pricing", "/security",
    "/docs", "/guides", "/support",
    "/blog", "/careers", "/privacy", "/terms"
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
            path="/teacher-dashboard"
            element={
              <TeacherRoute>
                <TeacherDashboardPage />
              </TeacherRoute>
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

          {/*
          <Route
            path="/from"
            element={<Navigate to="/score-entry" replace />}
          />
          */}

          <Route
            path="/score-entry"
            element={
              <ProtectedRoute>
                <UploadPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/academic-ledger"
            element={
              <ProtectedRoute>
                <StudentRepositoryPage />
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
            path="/submission-history"
            element={
              <ProtectedRoute>
                <FormDataPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/messages"
            element={
              <ProtectedRoute>
                <MessagingPage />
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
            path="/admin/subjects"
            element={
              <AdminRoute>
                <ManageSubjectsPage />
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
          <Route
            path="/admin/analytics"
            element={
              <AdminRoute>
                <AdminAnalyticsPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/messages"
            element={
              <AdminRoute>
                <AdminMessagesPage />
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

          {/* Principal Route */}
          <Route
            path="/principal"
            element={
              <AdminRoute>
                <PrincipalDashboardPage />
              </AdminRoute>
            }
          />

          <Route path="/results" element={<StudentResultPage />} />

          {/* Static Pages */}
          <Route path="/about" element={<AboutPage />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/security" element={<SecurityPage />} />
          <Route path="/docs" element={<DocumentationPage />} />
          <Route path="/guides" element={<GuidesPage />} />
          <Route path="/support" element={<SupportPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/careers" element={<CareersPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />

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