import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, ArrowLeft, Shield, KeyRound } from "lucide-react";
import { Link } from "react-router-dom";
import Input from "../components/login/Input";
import toast from "react-hot-toast";

export default AdminForgotPasswordPage;

const AdminForgotPasswordPage = () => {
    const [email, setEmail] = useState("backupid849@gmail.com");
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate email
        if (email !== "backupid849@gmail.com") {
            toast.error("Admin password reset is only available for authorized backup email");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/admin/forgot-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (data.success) {
                setIsSubmitted(true);
                toast.success("Password reset OTP sent to your email!");
            } else {
                toast.error(data.message || "Failed to send OTP");
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='relative bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 min-h-screen flex items-center justify-center overflow-hidden px-4'>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className='max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden'
            >
                <div className='p-8'>
                    <div className='flex flex-col items-center mb-6'>
                        <div className='w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4'>
                            <Shield className='w-8 h-8 text-red-600' />
                        </div>
                        <h2 className='text-3xl font-bold text-center text-gray-900'>
                            Admin Recovery
                        </h2>
                        <p className='text-sm text-gray-600 mt-2 text-center'>
                            {isSubmitted
                                ? "Check your email for the OTP code"
                                : "Enter your backup email to receive OTP"}
                        </p>
                    </div>

                    {!isSubmitted ? (
                        <form onSubmit={handleSubmit}>
                            <div className='mb-6'>
                                <label className='block text-sm font-medium text-gray-700 mb-2'>
                                    Authorized Backup Email
                                </label>
                                <Input
                                    icon={Mail}
                                    type='email'
                                    placeholder='backupid849@gmail.com'
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                <div className="flex items-center gap-2 mt-2 text-amber-600 text-xs bg-amber-50 p-2 rounded border border-amber-100">
                                    <span>⚠️</span>
                                    <span>Only authorized backup email can reset password</span>
                                </div>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                className='w-full py-3 px-4 bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-200'
                                type='submit'
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <div className='flex items-center justify-center gap-2'>
                                        <Loader className="animate-spin w-5 h-5" />
                                        Sending OTP...
                                    </div>
                                ) : (
                                    <div className='flex items-center justify-center gap-2'>
                                        <Mail className='w-5 h-5' />
                                        Send OTP
                                    </div>
                                )}
                            </motion.button>
                        </form>
                    ) : (
                        <div className='space-y-4'>
                            <div className='bg-green-50 border border-green-200 rounded-lg p-4'>
                                <div className='flex items-start gap-3'>
                                    <div className='w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5'>
                                        <svg className='w-4 h-4 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M5 13l4 4L19 7' />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className='font-semibold text-green-900 mb-1'>OTP Sent Successfully!</h3>
                                        <p className='text-sm text-green-700 mb-2'>
                                            A 6-digit OTP has been sent to <strong>{email}</strong>
                                        </p>
                                        <p className='text-xs text-green-600'>
                                            The OTP will expire in 15 minutes.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <Link to='/admin/reset-password-otp'>
                                <motion.button
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                    className='w-full py-3 px-4 bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-200'
                                >
                                    <div className='flex items-center justify-center gap-2'>
                                        <KeyRound className='w-5 h-5' />
                                        Enter OTP & Reset Password
                                    </div>
                                </motion.button>
                            </Link>

                            <button
                                onClick={() => setIsSubmitted(false)}
                                className='w-full text-center text-sm text-indigo-600 hover:text-indigo-800 font-medium'
                            >
                                Resend OTP
                            </button>
                        </div>
                    )}
                </div>

                <div className='px-8 py-4 bg-gray-50 flex justify-center border-t border-gray-100'>
                    <Link
                        to='/admin-login'
                        className='flex items-center gap-2 text-sm text-gray-600 hover:text-indigo-600 font-medium transition-colors'
                    >
                        <ArrowLeft className='w-4 h-4' />
                        Back to Admin Login
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};
