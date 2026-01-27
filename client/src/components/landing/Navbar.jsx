import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, School } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Features', to: '#features' }, // We can handle smooth scroll or route later
    { name: 'Admin', to: '/admin-login' },
    { name: 'Login', to: '/login' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
        ? 'bg-slate-900/80 backdrop-blur-xl border-b border-white/10 py-2'
        : 'bg-transparent py-6'
        }`}
    >
      <div className="w-full px-6 sm:px-12 lg:px-16 mx-auto">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <img src="/logo.png" alt="TMS" className="h-10 w-auto bg-white rounded p-1" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-12">
            <Link
              to="/results"
              className="text-slate-300 hover:text-white font-medium transition-colors text-lg"
            >
              Check Result
            </Link>
            <Link
              to="/admin-login"
              className="text-slate-300 hover:text-white font-medium transition-colors text-lg"
            >
              Admin Portal
            </Link>
            <Link
              to="/login"
              className="text-slate-300 hover:text-white font-medium transition-colors text-lg"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="px-8 py-3 rounded-full bg-white text-slate-900 font-bold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-xl hover:shadow-2xl"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-slate-300 hover:text-white transition-colors"
            >
              {isMobileMenuOpen ? <X className="h-8 w-8" /> : <Menu className="h-8 w-8" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-slate-900/95 border-b border-white/10 backdrop-blur-xl overflow-hidden"
          >
            <div className="px-6 pt-4 pb-8 space-y-4">
              <Link
                to="/results"
                className="block px-4 py-3 rounded-xl text-lg font-medium text-slate-300 hover:text-white hover:bg-white/5"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Check Result
              </Link>
              <Link
                to="/admin-login"
                className="block px-4 py-3 rounded-xl text-lg font-medium text-slate-300 hover:text-white hover:bg-white/5"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Admin Portal
              </Link>
              <Link
                to="/login"
                className="block px-4 py-3 rounded-xl text-lg font-medium text-slate-300 hover:text-white hover:bg-white/5"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="block w-full text-center mt-6 px-8 py-4 rounded-full bg-indigo-600 text-white font-bold hover:bg-indigo-500 shadow-lg"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Get Started
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}