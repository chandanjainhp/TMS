import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <nav className="flex justify-center space-x-6">
          <Link to="/admin" className="text-gray-500 hover:text-gray-900">Admin</Link>
          <Link to="/login" className="text-gray-500 hover:text-gray-900">Login</Link>
          <Link to="/signup" className="text-gray-500 hover:text-gray-900">Sign Up</Link>
        </nav>
        <p className="mt-8 text-center text-gray-400">
          &copy; {new Date().getFullYear()} TSM - Teacher Student Management. All rights reserved.
        </p>
      </div>
    </footer>
  );
}