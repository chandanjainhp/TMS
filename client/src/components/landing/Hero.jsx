import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle } from 'lucide-react';

export default function Hero() {
  return (
    <div className="relative overflow-hidden pt-32 pb-20 lg:pt-48 lg:pb-32">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[60vw] h-[60vw] rounded-full bg-indigo-600/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-purple-600/20 blur-[100px]" />
      </div>

      <div className="w-full px-6 sm:px-12 lg:px-16 mx-auto relative z-10">
        <div className="lg:flex lg:items-center lg:justify-between gap-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:w-[55%]"
          >
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/5 border border-white/10 text-indigo-300 text-sm font-medium mb-8 backdrop-blur-sm">
              <span className="flex h-2 w-2 rounded-full bg-indigo-400 mr-3 animate-pulse"></span>
              New Academic Year 2026 Ready
            </div>

            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight text-white leading-[1.1] mb-8">
              Transform Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                Institution Today
              </span>
            </h1>

            <p className="text-xl sm:text-2xl text-slate-400 max-w-2xl leading-relaxed mb-12">
              A comprehensive Teacher Student Management System designed to streamline workflows, enhance communication, and boost productivity for educational institutions.
            </p>

            <div className="flex flex-col sm:flex-row gap-6">
              <Link
                to="/signup"
                className="inline-flex items-center justify-center px-10 py-5 text-lg font-bold rounded-full text-white bg-indigo-600 hover:bg-indigo-500 transition-all shadow-xl hover:shadow-indigo-500/25 transform hover:-translate-y-1"
              >
                Get Started
                <ArrowRight className="ml-3 h-6 w-6" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center px-10 py-5 text-lg font-bold rounded-full text-white bg-white/5 border border-white/10 hover:bg-white/10 transition-all backdrop-blur-sm"
              >
                Live Demo
              </Link>
            </div>

            <div className="mt-16 flex items-center gap-12 border-t border-white/10 pt-8">
              <div className="flex flex-col">
                <span className="text-3xl font-bold text-white mb-1">500+</span>
                <span className="text-slate-500 text-sm uppercase tracking-wider">Institutions</span>
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-bold text-white mb-1">50k+</span>
                <span className="text-slate-500 text-sm uppercase tracking-wider">Students</span>
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-bold text-white mb-1">99.9%</span>
                <span className="text-slate-500 text-sm uppercase tracking-wider">Uptime</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="mt-20 lg:mt-0 lg:w-[45%]"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-3xl blur-2xl opacity-20 transform rotate-6"></div>
              <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-slate-800/50 backdrop-blur-md">
                <img
                  className="w-full h-auto object-cover opacity-90 hover:opacity-100 transition-opacity duration-700"
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1351&q=80"
                  alt="Students learning"
                />

                {/* Floating UI Elements for decoration */}
                <div className="absolute bottom-8 left-8 p-4 bg-slate-900/90 backdrop-blur-xl rounded-2xl border border-white/10 shadow-xl max-w-xs">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center">
                      <CheckCircle className="h-6 w-6 text-green-400" />
                    </div>
                    <div>
                      <p className="text-white font-bold">System Status</p>
                      <p className="text-green-400 text-sm">All systems operational</p>
                    </div>
                  </div>
                  <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 w-[92%]"></div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}