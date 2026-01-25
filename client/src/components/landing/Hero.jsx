import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle } from 'lucide-react';

export default function Hero() {
  return (
    <div className="relative bg-white overflow-hidden pt-20">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute -top-[30%] -right-[10%] w-[70%] h-[70%] rounded-full bg-gradient-to-br from-indigo-100/40 to-purple-100/40 blur-3xl" />
        <div className="absolute top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-gradient-to-tr from-blue-100/40 to-indigo-100/40 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto lg:flex lg:items-center lg:justify-between relative z-10 px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="lg:w-1/2"
        >
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-sm font-medium mb-6">
            <span className="flex h-2 w-2 rounded-full bg-indigo-600 mr-2"></span>
            New Academic Year 2026 Ready
          </div>

          <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl text-left">
            <span className="block">Transform Your</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
              Institution Today
            </span>
          </h1>

          <p className="mt-4 text-lg text-gray-600 sm:mt-5 sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0 text-left">
            A comprehensive Teacher Student Management System designed to streamline workflows, enhance communication, and boost productivity for educational institutions.
          </p>

          <div className="mt-8 sm:mt-10 sm:flex sm:justify-start gap-4">
            <div className="rounded-md shadow">
              <Link
                to="/signup"
                className="w-full flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-full text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-500/30 md:text-lg md:px-10"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
            <div className="mt-3 sm:mt-0">
              <Link
                to="/login"
                className="w-full flex items-center justify-center px-8 py-4 border border-gray-200 text-base font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50 transition-all md:text-lg md:px-10"
              >
                Live Demo
              </Link>
            </div>
          </div>

          <div className="mt-8 flex items-center gap-6 text-sm text-gray-500">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              <span>Easy Setup</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              <span>Secure Data</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              <span>24/7 Support</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="mt-12 lg:mt-0 lg:w-1/2"
        >
          <div className="relative rounded-2xl shadow-2xl overflow-hidden border border-gray-100 bg-white p-4 sm:p-6 lg:ml-10">
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-indigo-50/50 blur-3xl"></div>
            <img
              className="relative rounded-xl w-full object-cover shadow-inner"
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1351&q=80"
              alt="Students learning"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}