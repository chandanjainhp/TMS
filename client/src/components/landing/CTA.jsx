import { Link } from "react-router-dom";

export default function CTA() {
  return (
    <section className="notion-section bg-[#f6f5f4]">
      <div className="notion-container">
        <div className="notion-card rounded-2xl p-8 md:p-12">
          <span className="notion-badge">Start quickly</span>
          <h2 className="mt-4 text-[40px] font-bold leading-[1.1] tracking-[-1px] text-[rgba(0,0,0,0.95)] md:text-[54px] md:tracking-[-1.875px]">
            Replace scattered sheets
            <br />
            with one reliable system.
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-[1.5] text-[#615d59]">
            Launch with your current team, import existing records, and standardize operations in days.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/signup" className="notion-btn-primary no-underline">
              Get TMS free
            </Link>
            <Link to="/admin-login" className="notion-btn-secondary no-underline">
              Open admin portal
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
