import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Loader, ArrowLeft, Shield } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../components/login/Input";
import { useAdminAuthStore } from "../store/adminAuthStore";

const AdminLoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const { login, isLoading, error } = useAdminAuthStore();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate("/admin");
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className='min-h-screen flex bg-white font-sans'>
            {/* Left Side - Image/Branding */}
            <div className='hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-900'>
                <div className='absolute inset-0 bg-gradient-to-br from-indigo-900/60 to-slate-900/60 z-10' />
                <img
                    src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
                    alt="Admin Control"
                    className='absolute inset-0 w-full h-full object-cover opacity-40'
                />
                <div className='relative z-20 flex flex-col justify-between h-full p-10 text-white'>
                    <div>
                        <Link to="/" className="inline-flex items-center space-x-2 text-white/80 hover:text-white transition-colors">
                            <ArrowLeft className="h-5 w-5" />
                            <span>Back to Home</span>
                        </Link>
                    </div>
                    <div>
                        <div className="flex items-center space-x-3 mb-4">
                            <img src="/logo.png" alt="TMS" className="h-10 w-auto bg-white rounded p-1 mb-4" />
                            <h1 className='text-3xl font-bold'>Admin Portal</h1>
                        </div>
                        <p className='text-lg text-indigo-100 max-w-md leading-relaxed'>Secure access for institution administrators. Manage your organization with precision and control.</p>
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className='w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-10 lg:p-12 bg-white'>
                <div className='w-full max-w-sm space-y-6'>
                    <div className='text-center lg:text-left'>
                        <h2 className='text-3xl font-bold text-gray-900 tracking-tight'>Admin Sign In</h2>
                        <p className='mt-1 text-gray-600 text-sm'>Enter your credentials to access the dashboard.</p>
                    </div>

                    <form onSubmit={handleLogin} className='mt-6 space-y-4'>
                        <div className='space-y-3'>
                            <Input
                                icon={Mail}
                                type='email'
                                placeholder='Admin Email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />

                            <Input
                                icon={Lock}
                                type='password'
                                placeholder='Password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <div className='flex items-center justify-between'>
                            <Link to='/admin-forgot-password' className='text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors'>
                                Forgot password?
                            </Link>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className='p-3 rounded-lg bg-red-50 text-red-500 text-xs font-medium border border-red-100'
                            >
                                {error}
                            </motion.div>
                        )}

                        <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            className='w-full py-3 px-4 bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600'
                            type='submit'
                            disabled={isLoading}
                        >
                            {isLoading ? <Loader className='w-6 h-6 animate-spin mx-auto' /> : "Access Dashboard"}
                        </motion.button>
                    </form>

                    <div className="relative mt-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">Not an admin?</span>
                        </div>
                    </div>

                    <div className='flex justify-center'>
                        <Link to={'/login'} className='font-bold text-indigo-600 hover:text-indigo-500 hover:underline text-sm'>
                            Go to Student/Teacher Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default AdminLoginPage;