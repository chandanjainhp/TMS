import { BarChart3, GraduationCap, LayoutDashboard, MessageSquare, ShieldCheck, Users } from "lucide-react";

const featureCards = [
  {
    title: "Academic ledger",
    description: "Track marks, attendance, and progression in one structured timeline for every student.",
    icon: Users,
  },
  {
    title: "Teacher workspace",
    description: "Give educators a focused environment for score entry, submissions, and class actions.",
    icon: GraduationCap,
  },
  {
    title: "Admin command center",
    description: "Oversee curriculum, records, and faculty operations from a single view.",
    icon: LayoutDashboard,
  },
  {
    title: "Institution analytics",
    description: "Monitor performance trends with fast, explainable reporting and visual summaries.",
    icon: BarChart3,
  },
  {
    title: "Secure collaboration",
    description: "Keep communication and sensitive academic data protected with role-driven access.",
    icon: ShieldCheck,
  },
  {
    title: "Built-in messaging",
    description: "Connect administration, teachers, and students without leaving your workspace.",
    icon: MessageSquare,
  },
];

export default function Features() {
  return (
    <>
      <section className="notion-section bg-[#f6f5f4]" id="features">
        <div className="notion-container">
          <div className="max-w-3xl">
            <span className="notion-badge mb-4">Core capabilities</span>
            <h2 className="notion-h2">A complete operating system for your academic institution.</h2>
            <p className="notion-body mt-4 max-w-2xl">
              TMS follows a content-first model: compact data, clear hierarchy, and calm visuals that help teams execute without noise.
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featureCards.map(({ title, description, icon: Icon }) => (
              <article key={title} className="notion-card p-6 transition-shadow hover:shadow-[rgba(0,0,0,0.05)_0px_8px_24px]">
                <div className="mb-4 inline-flex rounded-full bg-[#f2f9ff] p-2 text-[#097fe8]">
                  <Icon size={18} />
                </div>
                <h3 className="text-[22px] font-bold leading-[1.27] tracking-[-0.25px] text-[rgba(0,0,0,0.95)]">{title}</h3>
                <p className="mt-2 text-base leading-[1.5] text-[#615d59]">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="notion-section bg-white">
        <div className="notion-container">
          <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
            <div className="notion-card p-8">
              <p className="text-[12px] font-semibold uppercase tracking-[0.125px] text-[#097fe8]">Measured impact</p>
              <p className="mt-4 text-[40px] font-bold leading-[1.2] text-[rgba(0,0,0,0.95)]">$4,200 ROI</p>
              <p className="mt-3 text-[#615d59]">Average annual productivity gain per department after migrating manual grade workflows to TMS.</p>
            </div>
            <div className="notion-card overflow-hidden">
              <div className="border-b border-[rgba(0,0,0,0.1)] bg-[#f6f5f4] p-5">
                <h3 className="text-[22px] font-bold tracking-[-0.25px] text-[rgba(0,0,0,0.95)]">Trusted by modern education teams</h3>
              </div>
              <div className="grid grid-cols-2 gap-3 p-5 sm:grid-cols-3">
                {["Westview", "Northgate", "Riverbend", "Cedar Hill", "St. Mark", "Summit"].map((name) => (
                  <div key={name} className="rounded border border-[rgba(0,0,0,0.1)] bg-white p-3 text-center text-sm font-semibold text-[#31302e]">
                    {name}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
