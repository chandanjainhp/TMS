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

        {/* Main content */}

        {/* Main content */}
        {/* Main content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 pt-16">
          <div className="w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
