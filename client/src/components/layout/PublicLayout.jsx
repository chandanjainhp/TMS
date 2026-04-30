import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import PublicNavbar from "./PublicNavbar";
import Footer from "../landing/Footer";

const PublicLayout = ({ title, subtitle, children, icon: Icon }) => {
  return (
    <div className="min-h-screen bg-white">
      <PublicNavbar />

      <section className="notion-section border-b border-[rgba(0,0,0,0.1)] bg-[#f6f5f4]">
        <div className="notion-container">
          <Link
            to="/landing"
            className="mb-6 inline-flex items-center gap-2 text-[15px] font-medium text-[rgba(0,0,0,0.95)] no-underline hover:text-[#0075de]"
          >
            <ArrowLeft size={16} />
            Back to home
          </Link>
          {Icon && (
            <div className="mb-4 inline-flex rounded-full bg-[#f2f9ff] p-3 text-[#097fe8]">
              <Icon size={24} />
            </div>
          )}
          <h1 className="text-[40px] font-bold leading-[1.1] tracking-[-1px] text-[rgba(0,0,0,0.95)] md:text-[54px] md:tracking-[-1.875px]">
            {title}
          </h1>
          {subtitle && <p className="mt-4 max-w-3xl text-[20px] font-semibold leading-[1.4] tracking-[-0.125px] text-[#615d59]">{subtitle}</p>}
        </div>
      </section>

      <main className="notion-section bg-white">
        <div className="notion-container">
          <div className="notion-card p-6 md:p-10">{children}</div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PublicLayout;
