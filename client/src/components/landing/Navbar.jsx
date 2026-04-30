import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, Menu, X } from "lucide-react";

const productGroups = [
  {
    label: "Academic Operations",
    items: [
      { name: "Score Entry", to: "/score-entry" },
      { name: "Academic Ledger", to: "/academic-ledger" },
      { name: "Submission History", to: "/submission-history" },
    ],
  },
  {
    label: "Institution Management",
    items: [
      { name: "Admin Dashboard", to: "/admin" },
      { name: "Teacher Dashboard", to: "/teacher-dashboard" },
      { name: "Messaging", to: "/messages" },
    ],
  },
];

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProductOpen, setIsProductOpen] = useState(false);

  return (
    <nav className="border-b border-[rgba(0,0,0,0.1)] bg-white">
      <div className="notion-container">
        <div className="flex min-h-[72px] items-center justify-between">
          <Link to="/landing" className="flex items-center gap-3 text-[rgba(0,0,0,0.95)] no-underline">
            <img src="/logo.png" alt="TMS" className="h-8 w-auto rounded border border-[rgba(0,0,0,0.1)] bg-white p-1" />
            <span className="text-[15px] font-semibold">TMS</span>
          </Link>

          <div className="hidden items-center gap-6 md:flex">
            <div
              className="relative"
              onMouseEnter={() => setIsProductOpen(true)}
              onMouseLeave={() => setIsProductOpen(false)}
            >
              <button
                type="button"
                className="inline-flex items-center gap-1 text-[15px] font-medium text-[rgba(0,0,0,0.95)] hover:text-[#0075de]"
              >
                Product
                <ChevronDown size={16} />
              </button>
              {isProductOpen && (
                <div className="absolute left-0 top-full z-20 mt-3 grid w-[540px] grid-cols-2 gap-4 rounded-xl border border-[rgba(0,0,0,0.1)] bg-white p-4 shadow-[rgba(0,0,0,0.04)_0px_4px_18px]">
                  {productGroups.map((group) => (
                    <div key={group.label}>
                      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.125px] text-[#615d59]">
                        {group.label}
                      </p>
                      <div className="space-y-1">
                        {group.items.map((item) => (
                          <Link
                            key={item.name}
                            to={item.to}
                            className="block rounded px-2 py-1.5 text-[15px] text-[rgba(0,0,0,0.95)] no-underline hover:bg-[#f6f5f4]"
                          >
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Link to="/features" className="text-[15px] font-medium text-[rgba(0,0,0,0.95)] no-underline hover:text-[#0075de]">
              Features
            </Link>
            <Link to="/pricing" className="text-[15px] font-medium text-[rgba(0,0,0,0.95)] no-underline hover:text-[#0075de]">
              Pricing
            </Link>
            <Link to="/docs" className="text-[15px] font-medium text-[rgba(0,0,0,0.95)] no-underline hover:text-[#0075de]">
              Docs
            </Link>
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
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="border-t border-[rgba(0,0,0,0.1)] bg-white md:hidden">
          <div className="notion-container space-y-2 py-3">
            <Link to="/features" className="block rounded px-2 py-2 text-[15px] text-[rgba(0,0,0,0.95)] no-underline hover:bg-[#f6f5f4]">
              Features
            </Link>
            <Link to="/pricing" className="block rounded px-2 py-2 text-[15px] text-[rgba(0,0,0,0.95)] no-underline hover:bg-[#f6f5f4]">
              Pricing
            </Link>
            <Link to="/docs" className="block rounded px-2 py-2 text-[15px] text-[rgba(0,0,0,0.95)] no-underline hover:bg-[#f6f5f4]">
              Docs
            </Link>
            <Link to="/admin-login" className="block rounded px-2 py-2 text-[15px] text-[rgba(0,0,0,0.95)] no-underline hover:bg-[#f6f5f4]">
              Admin portal
            </Link>
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
