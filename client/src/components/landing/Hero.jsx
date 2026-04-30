import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <div className="notion-section bg-white">
      <div className="notion-container">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <span className="notion-badge mb-6">New Academic Session 2026</span>
            <h1 className="notion-display">
              Bring every class,
              <br />
              teacher, and result
              <br />
              into one calm workspace.
            </h1>
            <p className="notion-body-lg mt-6 max-w-2xl">
              TMS centralizes academic workflows with warm, distraction-free dashboards so your institution can move faster with clarity.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/signup" className="notion-btn-primary no-underline">
                Get TMS free
                <ArrowRight size={16} className="ml-2" />
              </Link>
              <Link to="/login" className="notion-btn-secondary no-underline">
                Open live workspace
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-3 gap-4">
              <div className="notion-card p-4">
                <p className="text-[2rem] font-bold leading-none tracking-[-1px] text-[rgba(0,0,0,0.95)]">500+</p>
                <p className="mt-2 text-sm text-[#615d59]">Institutions onboarded</p>
              </div>
              <div className="notion-card p-4">
                <p className="text-[2rem] font-bold leading-none tracking-[-1px] text-[rgba(0,0,0,0.95)]">50K+</p>
                <p className="mt-2 text-sm text-[#615d59]">Students managed</p>
              </div>
              <div className="notion-card p-4">
                <p className="text-[2rem] font-bold leading-none tracking-[-1px] text-[rgba(0,0,0,0.95)]">99.9%</p>
                <p className="mt-2 text-sm text-[#615d59]">Platform uptime</p>
              </div>
            </div>
          </div>

          <div className="notion-card overflow-hidden rounded-2xl">
            <div className="bg-[#f6f5f4] p-4">
              <span className="notion-badge">Workspace preview</span>
            </div>
            <img
              className="h-auto w-full border-t border-[rgba(0,0,0,0.1)] object-cover"
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1400&q=80"
              alt="TMS dashboard preview"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
