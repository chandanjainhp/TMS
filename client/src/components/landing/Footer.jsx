import { Link } from 'react-router-dom';
import { School, Github, Twitter, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex justify-center md:justify-start space-x-6 md:order-2">
            <a href="#" className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">GitHub</span>
              <Github className="h-6 w-6" />
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">Twitter</span>
              <Twitter className="h-6 w-6" />
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">LinkedIn</span>
              <Linkedin className="h-6 w-6" />
            </a>
          </div>
          <div className="flex justify-center md:justify-start mt-8 md:mt-0 md:order-1 items-center gap-2">
            <School className="h-6 w-6 text-indigo-600" />
            <p className="text-center text-base text-gray-400">
              &copy; {new Date().getFullYear()} TSM. All rights reserved.
            </p>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-100 pt-8 md:flex md:items-center md:justify-between">
          <div className="flex justify-center space-x-6 md:order-2 text-sm text-gray-500">
            <Link to="/admin" className="hover:text-indigo-600 transition-colors">Admin Portal</Link>
            <Link to="/login" className="hover:text-indigo-600 transition-colors">Login</Link>
            <Link to="/signup" className="hover:text-indigo-600 transition-colors">Sign Up</Link>
          </div>
          <p className="mt-8 text-center text-sm text-gray-400 md:mt-0 md:order-1">
            Built for modern education.
          </p>
        </div>
      </div>
    </footer>
  );
}