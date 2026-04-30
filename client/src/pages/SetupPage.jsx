import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Shield, User, Mail, Lock, Building2, GraduationCap, Eye, EyeOff } from 'lucide-react';

const DEPARTMENTS = ['Physics', 'Mathematics', 'Electronics', 'Computer Science', 'Chemistry', 'Biology'];

const ROLES = [
    {
        id: 'principal',
        label: 'Principal',
        subtitle: 'Super Administrator',
        description: 'Full system access. Upload master student data, oversee all departments.',
        icon: Shield,
        color: 'indigo',
    },
    {
        id: 'hod',
        label: 'HOD',
        subtitle: 'Head of Department',
        description: 'Manage one department — teachers, marks, and academic records.',
        icon: Building2,
        color: 'violet',
    },
];

function InputField({ icon: Icon, label, type = 'text', value, onChange, placeholder, required, children }) {
    const [show, setShow] = useState(false);
    const isPassword = type === 'password';
    return (
        <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Icon className="h-4 w-4 text-gray-400" />
                </div>
                <input
                    type={isPassword && show ? 'text' : type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    required={required}
                    className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                />
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShow(!show)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600"
                    >
                        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                )}
            </div>
            {children}
        </div>
    );
}

export default function SetupPage() {
    const [role, setRole] = useState('principal');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [department, setDepartment] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('/api/setup/check-setup').then((res) => {
            if (res.data.setupComplete) navigate('/admin-login');
        }).catch(() => {});
    }, [navigate]);

    const handleSetup = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) return toast.error("Passwords do not match");
        if (password.length < 8) return toast.error("Password must be at least 8 characters");
        if (role === 'hod' && !department) return toast.error("Please select a department for HOD role");

        setIsLoading(true);
        try {
            await axios.post('/api/setup/setup-admin', {
                email,
                password,
                name,
                role,
                department: role === 'principal' ? 'Global' : department,
            });
            toast.success("Admin account created! Please log in.");
            navigate('/admin-login');
        } catch (error) {
            toast.error(error.response?.data?.message || "Setup failed");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-[#f6f5f4] font-sans">
            {/* Left - Branding */}
            <div className="hidden lg:flex lg:w-5/12 relative overflow-hidden bg-[#efeeec] flex-col justify-between p-12 border-r border-[rgba(0,0,0,0.1)]">
                <div className="absolute inset-0 bg-gradient-to-br from-[#f2f9ff] to-[#efeeec] z-10" />
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-[#d2e9ff]/50 blur-[100px]" />
                    <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#dbe9d2]/35 blur-[80px]" />
                </div>

                <div className="relative z-20">
                    <img src="/logo.png" alt="TMS" className="h-10 w-auto bg-white rounded px-1.5 py-0.5" />
                </div>

                <div className="relative z-20 space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[rgba(0,0,0,0.1)] text-[#0075de] text-xs font-semibold uppercase tracking-wider">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                        First-Time Setup
                    </div>
                    <h1 className="text-4xl font-semibold tracking-[-0.02em] text-[rgba(0,0,0,0.95)] leading-tight">
                        Initialize Your<br />
                        <span className="text-[#0075de]">
                            Institution
                        </span>
                    </h1>
                    <p className="text-[#615d59] text-base leading-relaxed max-w-xs">
                        Create your first administrator account to begin managing your institution.
                    </p>

                    <div className="space-y-3 pt-2">
                        {[
                            { step: '1', label: 'Choose admin role', done: true },
                            { step: '2', label: 'Set account credentials', done: true },
                            { step: '3', label: 'Log in and configure', done: false },
                        ].map((s) => (
                            <div key={s.step} className="flex items-center gap-3">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${s.done ? 'bg-[#0075de] text-white' : 'bg-white text-[#615d59] border border-[rgba(0,0,0,0.1)]'}`}>
                                    {s.step}
                                </div>
                                <span className={`text-sm ${s.done ? 'text-[#37352f]' : 'text-[#615d59]'}`}>{s.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="relative z-20 text-xs text-[#615d59]">
                    &copy; {new Date().getFullYear()} TMS. All rights reserved.
                </div>
            </div>

            {/* Right - Form */}
            <div className="w-full lg:w-7/12 flex items-start justify-center p-6 sm:p-10 overflow-y-auto bg-[#f6f5f4]">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="w-full max-w-lg py-8"
                >
                    <div className="mb-8">
                        <div className="lg:hidden mb-6">
                            <img src="/logo.png" alt="TMS" className="h-9 w-auto" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">Create Admin Account</h2>
                        <p className="text-gray-500 text-sm mt-1">This runs once. Choose carefully — you can add more admins after setup.</p>
                    </div>

                    <form onSubmit={handleSetup} className="space-y-5">
                        {/* Role Selector */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Admin Role</label>
                            <div className="grid grid-cols-2 gap-3">
                                {ROLES.map((r) => {
                                    const Icon = r.icon;
                                    const selected = role === r.id;
                                    return (
                                        <button
                                            key={r.id}
                                            type="button"
                                            onClick={() => { setRole(r.id); setDepartment(''); }}
                                            className={`relative text-left p-4 rounded-xl border-2 transition-all ${selected
                                                ? 'border-[#0075de] bg-[#f2f9ff]'
                                                : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                                                }`}
                                        >
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${selected ? 'bg-[#0075de] text-white' : 'bg-gray-100 text-gray-500'}`}>
                                                <Icon className="w-4 h-4" />
                                            </div>
                                            <p className={`text-sm font-bold ${selected ? 'text-[#005bab]' : 'text-gray-800'}`}>{r.label}</p>
                                            <p className={`text-xs mt-0.5 ${selected ? 'text-[#0075de]' : 'text-gray-400'}`}>{r.subtitle}</p>
                                            <p className={`text-xs mt-1.5 leading-snug ${selected ? 'text-[#005bab]' : 'text-gray-500'}`}>{r.description}</p>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Department (HOD only) */}
                        {role === 'hod' && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                            >
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Department</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                        <GraduationCap className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <select
                                        value={department}
                                        onChange={(e) => setDepartment(e.target.value)}
                                        required={role === 'hod'}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#0075de] focus:border-transparent transition-all bg-gray-50 focus:bg-white appearance-none"
                                    >
                                        <option value="">Select Department</option>
                                        {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                                    </select>
                                </div>
                            </motion.div>
                        )}

                        <InputField
                            icon={User}
                            label="Full Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder={role === 'principal' ? 'Dr. Principal Name' : 'Dr. HOD Name'}
                            required
                        />

                        <InputField
                            icon={Mail}
                            label="Email Address"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@institution.edu"
                            required
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <InputField
                                icon={Lock}
                                label="Password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Min 8 characters"
                                required
                            />
                            <InputField
                                icon={Lock}
                                label="Confirm Password"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Repeat password"
                                required
                            />
                        </div>

                        {/* Password strength hint */}
                        {password && (
                            <div className="flex gap-1">
                                {[1, 2, 3, 4].map((level) => (
                                    <div
                                        key={level}
                                        className={`h-1 flex-1 rounded-full transition-colors ${password.length >= level * 3
                                            ? level <= 1 ? 'bg-red-400'
                                                : level <= 2 ? 'bg-yellow-400'
                                                    : level <= 3 ? 'bg-blue-400'
                                                        : 'bg-green-500'
                                            : 'bg-gray-200'
                                            }`}
                                    />
                                ))}
                                <span className="text-xs text-gray-400 ml-1 whitespace-nowrap">
                                    {password.length < 4 ? 'Weak' : password.length < 7 ? 'Fair' : password.length < 10 ? 'Good' : 'Strong'}
                                </span>
                            </div>
                        )}

                        <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3.5 px-4 bg-[#0075de] text-white font-bold rounded shadow-[rgba(0,0,0,0.04)_0px_4px_18px] hover:bg-[#005bab] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0075de] disabled:opacity-60"
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Creating account...
                                </span>
                            ) : (
                                `Create ${role === 'principal' ? 'Principal' : 'HOD'} Account`
                            )}
                        </motion.button>

                        <p className="text-center text-xs text-gray-400">
                            Already set up?{' '}
                            <button type="button" onClick={() => navigate('/admin-login')} className="text-[#0075de] font-semibold hover:underline">
                                Go to Admin Login
                            </button>
                        </p>
                    </form>
                </motion.div>
            </div>
        </div>
    );
}
