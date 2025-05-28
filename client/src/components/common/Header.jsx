import React, { useState } from 'react';
import { FaSearch, FaUserCircle } from 'react-icons/fa';
import { MdMenu } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from "../../store/authStore";

const settings = ["Profile", "Account", "Dashboard", "Admin Login", "Logout"];

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { logout, user } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/login');
  };

  const handleMenuClick = (setting) => {
    if (setting === "Logout") {
      handleLogout();
    } else if (setting === "Profile") {
      navigate('/profile');
    } else if (setting === "Dashboard") {
      navigate('/dashboard');
    } else if (setting === "Admin Login") {
      navigate('/admin-login');
    }
    setMenuOpen(false);
  };

  return (
    <nav className="bg-white text-gray-900 p-4 w-full shadow-md fixed top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-xl font-bold tracking-wide cursor-pointer text-indigo-600" onClick={() => navigate('/')}>
          TMS
        </div>

        <div className="hidden md:flex items-center bg-gray-100 p-2 rounded-lg">
          <FaSearch className="text-gray-500" />
          <input
            type="text"
            placeholder="Search..."
            className="ml-2 bg-transparent outline-none text-gray-900 placeholder-gray-500 w-64"
          />
        </div>

        <button
          className="md:hidden p-2 rounded focus:outline-none text-indigo-600"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <MdMenu size={24} />
        </button>

        <div className="relative hidden md:block">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded flex items-center gap-2 text-gray-900 hover:text-indigo-600"
          >
            <span className="text-sm">{user?.name || 'User'}</span>
            <FaUserCircle size={24} />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white text-gray-900 rounded shadow-lg py-1">
              {settings.map((setting) => (
                <button
                  key={setting}
                  onClick={() => handleMenuClick(setting)}
                  className="block px-4 py-2 text-left w-full hover:bg-indigo-50 text-sm"
                >
                  {setting}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden fixed top-16 right-0 left-0 z-50 bg-white p-4 rounded-lg shadow-lg mx-2">
          <div className="flex items-center bg-gray-100 p-2 rounded mb-2">
            <FaSearch className="text-gray-500" />
            <input
              type="text"
              placeholder="Search..."
              className="ml-2 bg-transparent outline-none text-gray-900 placeholder-gray-500 w-full"
            />
          </div>
          {settings.map((setting) => (
            <button
              key={setting}
              onClick={() => handleMenuClick(setting)}
              className="block w-full text-left px-2 py-2 hover:bg-indigo-50 text-sm"
            >
              {setting}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Header;
