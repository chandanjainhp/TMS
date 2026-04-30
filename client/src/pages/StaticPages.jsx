import {
  Award,
  Book,
  CheckCircle,
  FileText,
  Globe,
  HelpCircle,
  Lock,
  Mail,
  MapPin,
  Server,
  Shield,
  Users,
  Zap,
} from "lucide-react";
import PublicLayout from "../components/layout/PublicLayout";

const NeutralCard = ({ children }) => (
  <div className="rounded-xl border border-[rgba(0,0,0,0.1)] bg-white p-6">{children}</div>
);

const MetricCard = ({ value, label }) => (
  <NeutralCard>
    <p className="text-[40px] font-bold leading-[1.2] text-[rgba(0,0,0,0.95)]">{value}</p>
    <p className="mt-2 text-[#615d59]">{label}</p>
  </NeutralCard>
);

export const AboutPage = () => (
  <PublicLayout
    title="About TMS"
    subtitle="We build calm, reliable systems that let institutions run academic operations with confidence."
    icon={Globe}
  >
    <div className="grid gap-6 md:grid-cols-2">
      <NeutralCard>
        <h2 className="text-[26px] font-bold tracking-[-0.625px] text-[rgba(0,0,0,0.95)]">Our mission</h2>
        <p className="mt-3 text-[#615d59]">
          TMS exists to remove operational friction from education. We combine clear interfaces, structured workflows, and dependable infrastructure to support teachers and administration.
        </p>
      </NeutralCard>
      <div className="grid gap-4 sm:grid-cols-2">
        <MetricCard value="500+" label="Institutions" />
        <MetricCard value="1M+" label="Students served" />
        <MetricCard value="99.9%" label="Service uptime" />
        <MetricCard value="24/7" label="Support coverage" />
      </div>
    </div>
  </PublicLayout>
);

export const FeaturesPage = () => (
  <PublicLayout title="Features" subtitle="Everything needed to operate modern academic workflows." icon={Zap}>
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {[
        "Student lifecycle management",
        "Teacher workspace and score entry",
        "Centralized academic ledger",
        "Role-aware access controls",
        "Submission tracking and audit history",
        "Built-in communication channels",
      ].map((item) => (
        <NeutralCard key={item}>
          <p className="text-[18px] font-semibold text-[rgba(0,0,0,0.95)]">{item}</p>
          <p className="mt-2 text-[#615d59]">Designed with warm, readable layouts and low-friction navigation.</p>
        </NeutralCard>
      ))}
    </div>
  </PublicLayout>
);

export const PricingPage = () => (
  <PublicLayout title="Simple pricing" subtitle="Transparent plans that scale with your institution." icon={Award}>
    <div className="grid gap-4 md:grid-cols-3">
      {[
        { name: "Starter", price: "$49/mo", desc: "For small schools", features: ["Up to 500 students", "Core workflows", "Email support"] },
        {
          name: "Pro",
          price: "$199/mo",
          desc: "For growing institutions",
          features: ["Up to 2,000 students", "Advanced analytics", "Priority support"],
          recommended: true,
        },
        { name: "Enterprise", price: "Custom", desc: "For large campuses", features: ["Unlimited scale", "Custom integrations", "Dedicated support"] },
      ].map((plan) => (
        <div
          key={plan.name}
          className={`rounded-xl border p-6 ${plan.recommended ? "border-[#0075de] bg-[#f2f9ff]" : "border-[rgba(0,0,0,0.1)] bg-white"}`}
        >
          {plan.recommended && <span className="notion-badge mb-3">Most popular</span>}
          <h3 className="text-[22px] font-bold tracking-[-0.25px] text-[rgba(0,0,0,0.95)]">{plan.name}</h3>
          <p className="mt-1 text-[32px] font-bold tracking-[-0.625px] text-[rgba(0,0,0,0.95)]">{plan.price}</p>
          <p className="mt-1 text-[#615d59]">{plan.desc}</p>
          <ul className="mt-4 space-y-2">
            {plan.features.map((feature) => (
              <li key={feature} className="flex items-center gap-2 text-[#615d59]">
                <CheckCircle size={16} className="text-[#1aae39]" />
                {feature}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  </PublicLayout>
);

export const SecurityPage = () => (
  <PublicLayout title="Security first" subtitle="Data protection is integrated into every layer of TMS." icon={Lock}>
    <div className="grid gap-4 md:grid-cols-2">
      {[
        { title: "End-to-end encryption", icon: Shield, desc: "Data is protected in transit and at rest." },
        { title: "Access control", icon: Lock, desc: "Role-based permissions keep data visible only to authorized users." },
        { title: "Operational resilience", icon: Server, desc: "Backups and monitoring protect continuity for critical records." },
      ].map(({ title, icon: Icon, desc }) => (
        <NeutralCard key={title}>
          <div className="mb-3 inline-flex rounded-full bg-[#f2f9ff] p-2 text-[#097fe8]">
            <Icon size={18} />
          </div>
          <h3 className="text-[22px] font-bold tracking-[-0.25px] text-[rgba(0,0,0,0.95)]">{title}</h3>
          <p className="mt-2 text-[#615d59]">{desc}</p>
        </NeutralCard>
      ))}
      <NeutralCard>
        <h3 className="text-[22px] font-bold tracking-[-0.25px] text-[rgba(0,0,0,0.95)]">Compliance</h3>
        <div className="mt-4 space-y-2">
          {["GDPR aligned", "SOC 2 Type II controls", "FERPA-aware workflows"].map((item) => (
            <p key={item} className="flex items-center gap-2 text-[#615d59]">
              <CheckCircle size={16} className="text-[#1aae39]" />
              {item}
            </p>
          ))}
        </div>
      </NeutralCard>
    </div>
  </PublicLayout>
);

export const DocumentationPage = () => (
  <PublicLayout title="Documentation" subtitle="Clear guides for setup, workflow, and integration." icon={FileText}>
    <div className="grid gap-4 md:grid-cols-2">
      <NeutralCard>
        <h3 className="text-[22px] font-bold tracking-[-0.25px] text-[rgba(0,0,0,0.95)]">Quick start</h3>
        <p className="mt-2 text-[#615d59]">Get your first institution workspace running in under 15 minutes.</p>
      </NeutralCard>
      <NeutralCard>
        <h3 className="text-[22px] font-bold tracking-[-0.25px] text-[rgba(0,0,0,0.95)]">API reference</h3>
        <p className="mt-2 text-[#615d59]">Use secure endpoints for records, users, messaging, and reporting.</p>
      </NeutralCard>
    </div>
  </PublicLayout>
);

export const GuidesPage = () => (
  <PublicLayout title="Guides" subtitle="Step-by-step walkthroughs for common operational tasks." icon={Book}>
    <div className="grid gap-4 md:grid-cols-2">
      {[
        "Importing student data",
        "Configuring subjects and grading",
        "Managing teacher permissions",
        "Reviewing submission history",
      ].map((guide) => (
        <NeutralCard key={guide}>
          <p className="text-[18px] font-semibold text-[rgba(0,0,0,0.95)]">{guide}</p>
        </NeutralCard>
      ))}
    </div>
  </PublicLayout>
);

export const SupportPage = () => (
  <PublicLayout title="Support center" subtitle="Direct help for setup, troubleshooting, and rollout." icon={HelpCircle}>
    <div className="grid gap-4 md:grid-cols-2">
      <NeutralCard>
        <Mail className="mb-3 text-[#097fe8]" size={20} />
        <h3 className="text-[22px] font-bold tracking-[-0.25px] text-[rgba(0,0,0,0.95)]">Email support</h3>
        <p className="mt-2 text-[#615d59]">Typical response window: under 2 hours on business days.</p>
        <a href="mailto:support@tsm.edu" className="mt-4 inline-block text-[15px] font-semibold no-underline">
          support@tsm.edu
        </a>
      </NeutralCard>
      <NeutralCard>
        <MapPin className="mb-3 text-[#097fe8]" size={20} />
        <h3 className="text-[22px] font-bold tracking-[-0.25px] text-[rgba(0,0,0,0.95)]">Office</h3>
        <p className="mt-2 text-[#615d59]">123 Education Lane, Tech City, CA 94103</p>
      </NeutralCard>
    </div>
  </PublicLayout>
);

export const BlogPage = () => (
  <PublicLayout title="Blog" subtitle="Product updates, operational practices, and educational insights." icon={FileText}>
    <div className="space-y-4">
      {[
        "How institutions reduce grading turnaround time",
        "Building consistent submission workflows",
        "What reliable academic records look like at scale",
      ].map((title) => (
        <NeutralCard key={title}>
          <h3 className="text-[22px] font-bold tracking-[-0.25px] text-[rgba(0,0,0,0.95)]">{title}</h3>
          <p className="mt-2 text-[#615d59]">Updated for the 2026 academic session.</p>
        </NeutralCard>
      ))}
    </div>
  </PublicLayout>
);

export const CareersPage = () => (
  <PublicLayout title="Careers" subtitle="Join a team focused on practical, high-impact education software." icon={Users}>
    <div className="space-y-4">
      {["Senior Full Stack Engineer", "Product Designer", "Customer Success Manager", "QA Engineer"].map((role) => (
        <NeutralCard key={role}>
          <p className="text-[18px] font-semibold text-[rgba(0,0,0,0.95)]">{role}</p>
          <p className="mt-1 text-[#615d59]">Remote · Full-time</p>
        </NeutralCard>
      ))}
    </div>
  </PublicLayout>
);

export const PrivacyPage = () => (
  <PublicLayout title="Privacy policy" subtitle="How we collect, use, and protect information in TMS." icon={Shield}>
    <div className="space-y-4 text-[#615d59]">
      <NeutralCard>
        <h3 className="text-[22px] font-bold tracking-[-0.25px] text-[rgba(0,0,0,0.95)]">Information collected</h3>
        <p className="mt-2">We process account data, academic records, and service activity logs required to operate the platform.</p>
      </NeutralCard>
      <NeutralCard>
        <h3 className="text-[22px] font-bold tracking-[-0.25px] text-[rgba(0,0,0,0.95)]">Use of data</h3>
        <p className="mt-2">Data is used to provide academic workflows, communication, analytics, and account security.</p>
      </NeutralCard>
    </div>
  </PublicLayout>
);

export const TermsPage = () => (
  <PublicLayout title="Terms of service" subtitle="Conditions for using TMS products and services." icon={FileText}>
    <div className="space-y-4 text-[#615d59]">
      <NeutralCard>
        <h3 className="text-[22px] font-bold tracking-[-0.25px] text-[rgba(0,0,0,0.95)]">Service usage</h3>
        <p className="mt-2">By using TMS, institutions agree to maintain lawful use and responsible data stewardship.</p>
      </NeutralCard>
      <NeutralCard>
        <h3 className="text-[22px] font-bold tracking-[-0.25px] text-[rgba(0,0,0,0.95)]">Account responsibility</h3>
        <p className="mt-2">You are responsible for managing credentials and access policies for authorized users.</p>
      </NeutralCard>
    </div>
  </PublicLayout>
);
