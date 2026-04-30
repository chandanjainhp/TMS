import { Link } from "react-router-dom";

const footerColumns = [
  {
    title: "Product",
    links: [
      { label: "Features", to: "/features" },
      { label: "Pricing", to: "/pricing" },
      { label: "Security", to: "/security" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Documentation", to: "/docs" },
      { label: "Guides", to: "/guides" },
      { label: "Support", to: "/support" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", to: "/about" },
      { label: "Careers", to: "/careers" },
      { label: "Blog", to: "/blog" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", to: "/privacy" },
      { label: "Terms", to: "/terms" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-[rgba(0,0,0,0.1)] bg-white py-12">
      <div className="notion-container">
        <div className="grid gap-8 md:grid-cols-[1.2fr_2fr]">
          <div>
            <Link to="/landing" className="inline-flex items-center gap-3 no-underline">
              <img src="/logo.png" alt="TMS" className="h-8 w-auto rounded border border-[rgba(0,0,0,0.1)] bg-white p-1" />
              <span className="text-[15px] font-semibold text-[rgba(0,0,0,0.95)]">TMS</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-[1.5] text-[#615d59]">
              Teacher Management System helps institutions run teaching operations with clear workflows and reliable academic records.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {footerColumns.map((column) => (
              <div key={column.title}>
                <h3 className="text-[12px] font-semibold uppercase tracking-[0.125px] text-[#615d59]">{column.title}</h3>
                <div className="mt-3 space-y-2">
                  {column.links.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      className="block text-[15px] text-[rgba(0,0,0,0.95)] no-underline hover:text-[#0075de]"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 border-t border-[rgba(0,0,0,0.1)] pt-6 text-sm text-[#615d59]">
          © {new Date().getFullYear()} TMS. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
