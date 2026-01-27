import React from 'react';
import { ArrowLeft, Shield, Zap, Lock, Globe, Server, Users, Award, CheckCircle, HelpCircle, FileText, Mail, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from '../components/landing/Footer';

// Enhanced Page Layout
const PageLayout = ({ title, subtitle, children, icon: Icon, gradient = "from-indigo-600 to-violet-600" }) => (
    <div className="min-h-screen bg-gray-50 flex flex-col pt-16">
        {/* Hero Section */}
        <div className={`bg-gradient-to-br ${gradient} py-20 px-4 sm:px-6 lg:px-8 text-white relative overflow-hidden`}>
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute -top-24 -left-24 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>

            <div className="max-w-7xl mx-auto relative z-10 text-center">
                <Link to="/" className="inline-flex items-center text-white/80 hover:text-white mb-8 transition-colors bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm hover:bg-white/20">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
                </Link>
                {Icon && (
                    <div className="flex justify-center mb-6">
                        <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-md shadow-xl ring-1 ring-white/30">
                            <Icon className="w-12 h-12 text-white" />
                        </div>
                    </div>
                )}
                <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">{title}</h1>
                {subtitle && <p className="text-xl md:text-2xl text-indigo-100 max-w-3xl mx-auto font-light leading-relaxed">{subtitle}</p>}
            </div>
        </div>

        {/* content */}
        <div className="flex-grow">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
                <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 ring-1 ring-gray-100/50">
                    <div className="prose prose-lg prose-indigo max-w-none">
                        {children}
                    </div>
                </div>
            </div>
        </div>

        <Footer />
    </div>
);

export const AboutPage = () => (
    <PageLayout
        title="About TSM"
        subtitle="Empowering educational institutions with modern management tools for a brighter future."
        icon={Globe}
        gradient="from-blue-600 to-cyan-500"
    >
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
                <p className="text-gray-600 text-lg leading-relaxed mb-6">
                    At TSM, we believe education is the cornerstone of progress. Our mission is to strip away the administrative burden from educators, allowing them to focus on what they do best: inspiring the next generation.
                </p>
                <p className="text-gray-600 text-lg leading-relaxed">
                    Founded by a team of educators and technologists, we understand the unique challenges schools face. We're dedicated to building intuitive, powerful, and secure tools that bridge the gap between technology and teaching.
                </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-6 rounded-2xl text-center">
                    <div className="text-4xl font-bold text-blue-600 mb-2">500+</div>
                    <div className="text-gray-600 font-medium">Institutions</div>
                </div>
                <div className="bg-cyan-50 p-6 rounded-2xl text-center">
                    <div className="text-4xl font-bold text-cyan-600 mb-2">1M+</div>
                    <div className="text-gray-600 font-medium">Students</div>
                </div>
                <div className="bg-indigo-50 p-6 rounded-2xl text-center">
                    <div className="text-4xl font-bold text-indigo-600 mb-2">99.9%</div>
                    <div className="text-gray-600 font-medium">Uptime</div>
                </div>
                <div className="bg-purple-50 p-6 rounded-2xl text-center">
                    <div className="text-4xl font-bold text-purple-600 mb-2">24/7</div>
                    <div className="text-gray-600 font-medium">Support</div>
                </div>
            </div>
        </div>

        <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Our Values</h2>
            <div className="grid md:grid-cols-3 gap-8">
                {[
                    { title: "Innovation", desc: "Constantly pushing boundaries to serve you better." },
                    { title: "Security", desc: "Your data's safety is non-negotiable." },
                    { title: "Simplicity", desc: "Complex power, delivered through a simple interface." }
                ].map((val, i) => (
                    <div key={i} className="p-6 bg-gray-50 rounded-xl">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{val.title}</h3>
                        <p className="text-gray-600">{val.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    </PageLayout>
);

export const FeaturesPage = () => (
    <PageLayout
        title="Features"
        subtitle="Everything you need to run your institution efficiently."
        icon={Zap}
        gradient="from-amber-500 to-orange-600"
    >
        <div className="grid md:grid-cols-3 gap-8">
            {[
                { title: "Smart Analytics", icon: Users, desc: "Gain deep insights into student performance with AI-driven analytics dashboards." },
                { title: "Secure Management", icon: Shield, desc: "Enterprise-grade security ensures your sensitive student and faculty data is always protected." },
                { title: "Teacher Workspace", icon: Globe, desc: "A dedicated, intuitive portal for educators to manage classes, assignments, and grades." },
                { title: "Cloud Infrastructure", icon: Server, desc: "Built on robust cloud architecture for 99.9% uptime and instant scalability." },
                { title: "Real-time Messaging", icon: Users, desc: "Seamless communication channels between administration, teachers, and students." },
                { title: "Automated Reports", icon: FileText, desc: "Generate comprehensive reports with a single click, saving hours of manual work." },
            ].map((feat, i) => (
                <div key={i} className="group p-8 bg-white border border-gray-100 rounded-2xl hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-orange-600 transition-colors">
                        <feat.icon className="w-6 h-6 text-orange-600 group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{feat.title}</h3>
                    <p className="text-gray-600">{feat.desc}</p>
                </div>
            ))}
        </div>
    </PageLayout>
);

export const PricingPage = () => (
    <PageLayout
        title="Simple, Transparent Pricing"
        subtitle="Choose the plan that fits your institution's size and needs."
        icon={Award}
        gradient="from-emerald-500 to-teal-600"
    >
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
                { name: "Starter", price: "$49", desc: "For small schools", features: ["Up to 500 Students", "Basic Analytics", "Email Support"] },
                { name: "Pro", price: "$199", desc: "For growing institutions", features: ["Up to 2,000 Students", "Advanced Analytics", "Priority Support", "API Access"], recommended: true },
                { name: "Enterprise", price: "Custom", desc: "For large universities", features: ["Unlimited Students", "Custom Integrations", "Dedicated Account Manager", "SLA Guarantee"] }
            ].map((plan, i) => (
                <div key={i} className={`relative p-8 rounded-2xl border ${plan.recommended ? 'border-emerald-500 shadow-2xl scale-105 bg-white' : 'border-gray-200 bg-gray-50'}`}>
                    {plan.recommended && <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-emerald-500 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">Most Popular</div>}
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <div className="text-4xl font-bold text-gray-900 mb-2">{plan.price}<span className="text-base font-normal text-gray-500">/mo</span></div>
                    <p className="text-gray-500 mb-6">{plan.desc}</p>
                    <ul className="space-y-4 mb-8">
                        {plan.features.map((f, j) => (
                            <li key={j} className="flex items-center text-gray-700">
                                <CheckCircle className="w-5 h-5 text-emerald-500 mr-3" /> {f}
                            </li>
                        ))}
                    </ul>
                    <button className={`w-full py-3 rounded-xl font-bold transition-all ${plan.recommended ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg hover:shadow-xl' : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-emerald-500 hover:text-emerald-600'}`}>
                        Get Started
                    </button>
                </div>
            ))}
        </div>
        <p className="text-center text-gray-500 mt-12">All plans include a 14-day free trial. No credit card required.</p>
    </PageLayout>
);

export const SecurityPage = () => (
    <PageLayout
        title="Security First"
        subtitle="Your data's safety is our top priority. We use various methods to ensure security."
        icon={Lock}
        gradient="from-slate-700 to-slate-900"
    >
        <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
                <div className="flex gap-4">
                    <div className="p-3 bg-slate-100 rounded-lg h-fit"><Shield className="w-6 h-6 text-slate-700" /></div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">End-to-End Encryption</h3>
                        <p className="text-gray-600">All data is encrypted in transit and at rest using AES-256 encryption standards.</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="p-3 bg-slate-100 rounded-lg h-fit"><Lock className="w-6 h-6 text-slate-700" /></div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Access Control</h3>
                        <p className="text-gray-600">Granular role-based access control (RBAC) ensures only authorized personnel can access sensitive information.</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="p-3 bg-slate-100 rounded-lg h-fit"><Server className="w-6 h-6 text-slate-700" /></div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Automatic Backups</h3>
                        <p className="text-gray-600">Daily automated backups with 30-day retention to prevent any data loss.</p>
                    </div>
                </div>
            </div>
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Compliance & Certifications</h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                        <span className="font-bold text-slate-700">GDPR Compliant</span>
                        <CheckCircle className="w-5 h-5 text-green-500" />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                        <span className="font-bold text-slate-700">SOC 2 Type II</span>
                        <CheckCircle className="w-5 h-5 text-green-500" />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                        <span className="font-bold text-slate-700">FERPA Compliant</span>
                        <CheckCircle className="w-5 h-5 text-green-500" />
                    </div>
                </div>
            </div>
        </div>
    </PageLayout>
);

export const DocumentationPage = () => (
    <PageLayout
        title="Documentation"
        subtitle="Comprehensive guides and API references to help you build."
        icon={FileText}
        gradient="from-pink-600 to-rose-600"
    >
        <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white p-8 rounded-2xl border border-gray-200 hover:shadow-lg transition-all cursor-pointer">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Quick Start Guide</h3>
                <p className="text-gray-600 mb-4">Get up and running with TSM in less than 15 minutes.</p>
                <span className="text-pink-600 font-bold hover:underline">Read Guide →</span>
            </div>
            <div className="bg-white p-8 rounded-2xl border border-gray-200 hover:shadow-lg transition-all cursor-pointer">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">API Reference</h3>
                <p className="text-gray-600 mb-4">Detailed documentation of our REST and GraphQL APIs.</p>
                <span className="text-pink-600 font-bold hover:underline">Explore API →</span>
            </div>
        </div>
    </PageLayout>
);

export const GuidesPage = () => (
    <PageLayout
        title="Guides & Tutorials"
        subtitle="Master the platform with step-by-step instructions."
        icon={Book}
        gradient="from-violet-600 to-purple-600"
    >
        <div className="grid md:grid-cols-3 gap-6">
            {["Setting up your first class", "Importing student data", "Configuring gradebooks", "Managing teacher permissions", "Generating report cards", "Customizing your dashboard"].map((guide, i) => (
                <div key={i} className="bg-gray-50 p-6 rounded-xl hover:bg-white hover:shadow-md transition-all border border-gray-100">
                    <Book className="w-6 h-6 text-purple-600 mb-4" />
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{guide}</h3>
                    <p className="text-sm text-gray-500">5 min read</p>
                </div>
            ))}
        </div>
    </PageLayout>
);

export const SupportPage = () => (
    <PageLayout
        title="Support Center"
        subtitle="We're here to help you every step of the way."
        icon={HelpCircle}
        gradient="from-blue-500 to-indigo-600"
    >
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="text-center p-8 bg-blue-50 rounded-2xl">
                <Mail className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Email Support</h3>
                <p className="text-gray-600 mb-6">Our team typically responds within 2 hours.</p>
                <a href="mailto:support@tsm.edu" className="inline-block bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors">Contact Us</a>
            </div>
            <div className="text-center p-8 bg-indigo-50 rounded-2xl">
                <MapPin className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Visit Us</h3>
                <p className="text-gray-600 mb-6">123 Education Lane, Tech City<br />CA 94103</p>
                <button className="bg-white text-indigo-600 border border-indigo-200 px-8 py-3 rounded-xl font-bold hover:bg-indigo-50 transition-colors">Get Directions</button>
            </div>
        </div>
    </PageLayout>
);

export const BlogPage = () => (
    <PageLayout
        title="Latest Insights"
        subtitle="News, updates, and educational trends from our team."
        icon={FileText}
        gradient="from-teal-500 to-emerald-600"
    >
        <div className="grid md:grid-cols-2 gap-8">
            {[
                { title: "The Future of EdTech in 2026", date: "Jan 15, 2026", cat: "Trends" },
                { title: "How AI is Reshaping Grading", date: "Jan 10, 2026", cat: "Technology" },
                { title: "Case Study: Westview High's Transformation", date: "Jan 05, 2026", cat: "Success Stories" },
                { title: "New Features: Q1 Update", date: "Jan 01, 2026", cat: "Product" }
            ].map((post, i) => (
                <div key={i} className="flex gap-6 items-start p-6 bg-white border border-gray-100 rounded-2xl hover:shadow-lg transition-all">
                    <div className="w-24 h-24 bg-gray-200 rounded-xl flex-shrink-0"></div>
                    <div>
                        <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">{post.cat}</span>
                        <h3 className="text-xl font-bold text-gray-900 mt-1 mb-2 hover:text-teal-600 cursor-pointer">{post.title}</h3>
                        <p className="text-sm text-gray-500">{post.date}</p>
                    </div>
                </div>
            ))}
        </div>
    </PageLayout>
);

export const CareersPage = () => (
    <PageLayout
        title="Join Our Team"
        subtitle="Help us shape the future of education technology."
        icon={Users}
        gradient="from-fuchsia-600 to-purple-600"
    >
        <div className="bg-fuchsia-50 p-8 rounded-2xl text-center mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Why work with us?</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">We're a diverse team of educators, engineers, and designers passionate about making a difference. We offer remote-first work, competitive salaries, and unlimited learning budgets.</p>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-6">Open Positions</h3>
        <div className="space-y-4">
            {["Senior Full Stack Engineer", "Product Designer", "Customer Success Manager", "Marketing Specialist"].map((role, i) => (
                <div key={i} className="flex items-center justify-between p-6 bg-white border border-gray-200 rounded-xl hover:border-fuchsia-500 transition-colors group cursor-pointer">
                    <div>
                        <h4 className="font-bold text-gray-900 group-hover:text-fuchsia-600 transition-colors">{role}</h4>
                        <p className="text-sm text-gray-500">Remote • Full-time</p>
                    </div>
                    <span className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg text-sm font-bold group-hover:bg-fuchsia-600 group-hover:text-white transition-all">Apply</span>
                </div>
            ))}
        </div>
    </PageLayout>
);

export const PrivacyPage = () => (
    <PageLayout
        title="Privacy Policy"
        subtitle="Last updated: January 2026"
        icon={Shield}
        gradient="from-gray-700 to-gray-900"
    >
        <div className="space-y-6 text-gray-600">
            <p>At TSM, we take your privacy seriously. This policy describes what personal information we collect and how we use it.</p>
            <h3 className="text-xl font-bold text-gray-900">Information Collection</h3>
            <p>We collect information to provide better services to all our users. This includes:</p>
            <ul className="list-disc pl-6 space-y-2">
                <li>Personal identification information (Name, email address, phone number, etc.)</li>
                <li>Educational data (Student grades, attendance records, etc.)</li>
                <li>Usage data (Log files, time spent on pages, etc.)</li>
            </ul>
        </div>
    </PageLayout>
);

export const TermsPage = () => (
    <PageLayout
        title="Terms of Service"
        subtitle="Last updated: January 2026"
        icon={FileText}
        gradient="from-gray-700 to-gray-900"
    >
        <div className="space-y-6 text-gray-600">
            <p>By accessing this website, you agree to be bound by these website Terms and Conditions of Use, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws.</p>
            <h3 className="text-xl font-bold text-gray-900">Use License</h3>
            <p>Permission is granted to temporarily download one copy of the materials (information or software) on TSM's website for personal, non-commercial transitory viewing only.</p>
        </div>
    </PageLayout>
);
