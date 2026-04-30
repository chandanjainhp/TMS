import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

const navLinks = [
  { name: "Features", to: "/features" },
  { name: "Pricing", to: "/pricing" },
  { name: "Security", to: "/security" },
  { name: "Support", to: "/support" },
];

export default function PublicNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="border-b border-[rgba(0,0,0,0.1)] bg-white">
      <div className="notion-container">
        <div className="flex min-h-[72px] items-center justify-between">
          <Link to="/landing" className="flex items-center gap-3 no-underline">
            <img src="/logo.png" alt="TMS" className="h-8 w-auto rounded border border-[rgba(0,0,0,0.1)] bg-white p-1" />
            <span className="text-[15px] font-semibold text-[rgba(0,0,0,0.95)]">TMS</span>
          </Link>

          <div className="hidden items-center gap-6 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-[15px] font-medium no-underline ${
                  isActive(link.to) ? "text-[#0075de]" : "text-[rgba(0,0,0,0.95)] hover:text-[#0075de]"
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link to="/login" className="text-[15px] font-medium text-[rgba(0,0,0,0.95)] no-underline hover:text-[#0075de]">
              Log in
            </Link>
            <Link to="/signup" className="notion-btn-primary no-underline">
              Get started
            </Link>
          </div>

          <button
            type="button"
            className="rounded border border-[rgba(0,0,0,0.1)] p-2 text-[rgba(0,0,0,0.95)] md:hidden"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="border-t border-[rgba(0,0,0,0.1)] bg-white md:hidden">
          <div className="notion-container space-y-2 py-3">
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to} className="block rounded px-2 py-2 text-[15px] text-[rgba(0,0,0,0.95)] no-underline hover:bg-[#f6f5f4]">
                {link.name}
              </Link>
            ))}
            <Link to="/login" className="block rounded px-2 py-2 text-[15px] text-[rgba(0,0,0,0.95)] no-underline hover:bg-[#f6f5f4]">
              Log in
            </Link>
            <Link to="/signup" className="notion-btn-primary mt-2 w-full no-underline text-center">
              Get started
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
