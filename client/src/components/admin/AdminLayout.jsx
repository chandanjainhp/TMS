import { useState, useEffect } from 'react';
import Header from '../common/Header';
import { useAuthStore } from '../../store/authStore';
import { useAdminAuthStore } from '../../store/adminAuthStore';

const AdminLayout = ({ children }) => {
  const { user } = useAuthStore();
  const { admin, isAuthenticated: isAdminAuthenticated } = useAdminAuthStore();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Check if user is admin - check both stores
  const isAdmin = (isAdminAuthenticated && admin && admin.role === 'admin') || (user?.role === 'admin');

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile && sidebarOpen) {
        setSidebarOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [sidebarOpen]);

  // Toggle sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {/* Main content with padding to account for sidebar */}
      <div className="flex-1 flex flex-col overflow-hidden transition-all duration-300 ease-in-out">
        {/* Header with highest z-index */}
        <div className="sticky top-0 z-50">
          <Header />
        </div>

        {/* Mobile sidebar toggle button */}
        {isAdmin && isMobile && (
          <button
            onClick={toggleSidebar}
            className="fixed left-4 bottom-4 z-50 p-3 bg-indigo-600 text-white rounded-full shadow-lg focus:outline-none flex items-center justify-center w-12 h-12"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        )}

        {/* Main content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-white pt-16">
          <div className="container mx-auto px-4 py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
