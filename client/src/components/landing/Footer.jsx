import { Link } from 'react-router-dom';
import { School, Github, Twitter, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-white/10 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8 xl:col-span-1">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-indigo-600 rounded-lg">
                <School className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white tracking-tight">TSM</span>
            </div>
            <p className="text-base text-slate-400 leading-relaxed max-w-xs">
              Empowering educational institutions with modern management tools for a brighter future.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <span className="sr-only">GitHub</span>
                <Github className="h-6 w-6" />
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <span className="sr-only">Twitter</span>
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <span className="sr-only">LinkedIn</span>
                <Linkedin className="h-6 w-6" />
              </a>
            </div>
          </div>
          <div className="mt-16 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-indigo-400 tracking-wider uppercase">Product</h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <Link to="/features" className="text-base text-slate-400 hover:text-white transition-colors">Features</Link>
                  </li>
                  <li>
                    <Link to="/pricing" className="text-base text-slate-400 hover:text-white transition-colors">Pricing</Link>
                  </li>
                  <li>
                    <Link to="/security" className="text-base text-slate-400 hover:text-white transition-colors">Security</Link>
                  </li>
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-indigo-400 tracking-wider uppercase">Resources</h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <Link to="/docs" className="text-base text-slate-400 hover:text-white transition-colors">Documentation</Link>
                  </li>
                  <li>
                    <Link to="/guides" className="text-base text-slate-400 hover:text-white transition-colors">Guides</Link>
                  </li>
                  <li>
                    <Link to="/support" className="text-base text-slate-400 hover:text-white transition-colors">Support</Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-indigo-400 tracking-wider uppercase">Company</h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <Link to="/about" className="text-base text-slate-400 hover:text-white transition-colors">About</Link>
                  </li>
                  <li>
                    <Link to="/blog" className="text-base text-slate-400 hover:text-white transition-colors">Blog</Link>
                  </li>
                  <li>
                    <Link to="/careers" className="text-base text-slate-400 hover:text-white transition-colors">Careers</Link>
                  </li>
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-indigo-400 tracking-wider uppercase">Legal</h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <Link to="/privacy" className="text-base text-slate-400 hover:text-white transition-colors">Privacy</Link>
                  </li>
                  <li>
                    <Link to="/terms" className="text-base text-slate-400 hover:text-white transition-colors">Terms</Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-16 border-t border-white/10 pt-8 flex items-center justify-between">
          <p className="text-base text-slate-500">
            &copy; {new Date().getFullYear()} TSM. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm text-slate-500">
            <Link to="/admin" className="hover:text-indigo-400 transition-colors">Admin Portal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}