import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Loader, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import Input from "../components/login/Input";
import { useAuthStore } from "../store/authStore";

const AdminLoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const { adminLogin, isLoading, error, isAuthenticated, user } = useAuthStore();

    // Redirect if already logged in as admin
    useEffect(() => {
        if (isAuthenticated && user?.role === 'admin') {
            window.location.href = '/admin';
        }
    }, [isAuthenticated, user]);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await adminLogin(email, password);
            // Redirect is handled in the adminLogin function
        } catch (err) {
            console.error('Admin login error:', err);
        }
    };

    return (
        <div className='relative bg-white min-h-screen flex items-center justify-center overflow-hidden'>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className='max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden'
            >
                <div className='p-8'>
                    <div className='flex flex-col items-center mb-6'>
                        <Shield className='w-12 h-12 text-indigo-600 mb-2' />
                        <h2 className='text-3xl font-bold text-center text-gray-900'>
                            Admin Portal
                        </h2>
                        <p className='text-sm text-gray-500 mt-2'>
                            Restricted access to authorized personnel only
                        </p>
                    </div>

                    <form onSubmit={handleLogin}>
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
                            placeholder='Admin Password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        {error && (
                            <p className='text-red-500 font-semibold mb-4'>{error}</p>
                        )}

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className='w-full py-3 px-4 bg-indigo-600 text-white font-bold rounded-lg shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-200'
                            type='submit'
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <Loader className='w-6 h-6 animate-spin mx-auto' />
                            ) : (
                                "Access Dashboard"
                            )}
                        </motion.button>
                    </form>
                </div>
                <div className='px-8 py-4 bg-gray-50 flex justify-center'>
                    <p className='text-sm text-gray-600'>
                        Standard user?{" "}
                        <Link
                            to='/login'
                            className='text-indigo-600 hover:underline'
                        >
                            User login
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default AdminLoginPage;