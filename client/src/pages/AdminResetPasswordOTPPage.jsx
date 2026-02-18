import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, ArrowLeft, KeyRound, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default AdminResetPasswordOTPPage;

const AdminResetPasswordOTPPage = () => {
    const [email, setEmail] = useState("backupid849@gmail.com");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate email
        if (email !== "backupid849@gmail.com") {
            toast.error("Admin password reset is only available for authorized backup email");
            return;
        }

        // Validate OTP
        if (!otp || otp.length !== 6) {
            toast.error("Please enter a valid 6-digit OTP");
            return;
        }

        // Validate password
        if (newPassword.length < 8) {
            toast.error("Password must be at least 8 characters long");
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/admin/reset-password-otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    otp,
                    newPassword
                }),
            });

            const data = await response.json();

            if (data.success) {
                toast.success("Admin password reset successful!");
                setTimeout(() => {
                    navigate('/admin-login');
                }, 2000);
            } else {
                toast.error(data.message || "Failed to reset password");
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
                            <KeyRound className='w-8 h-8 text-red-600' />
                        </div>
                        <h2 className='text-3xl font-bold text-center text-gray-900'>
                            Verify OTP
                        </h2>
                        <p className='text-sm text-gray-600 mt-2 text-center'>
                            Enter the OTP sent to your email and create a new password
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className='space-y-4'>
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-2'>
                                Email Address
                            </label>
                            <input
                                type='email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50'
                                required
                                readOnly
                            />
                        </div>

                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-2'>
                                6-Digit OTP
                            </label>
                            <input
                                type='text'
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                placeholder='Enter 6-digit OTP'
                                maxLength={6}
                                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-center text-2xl tracking-widest font-bold text-gray-800'
                                required
                            />
                            <p className='text-xs text-gray-500 mt-2 text-center'>
                                ⏰ OTP is valid for 15 minutes
                            </p>
                        </div>

                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-2'>
                                New Password
                            </label>
                            <div className='relative'>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder='Enter new password'
                                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent pr-12'
                                    required
                                    minLength={8}
                                />
                                <button
                                    type='button'
                                    onClick={() => setShowPassword(!showPassword)}
                                    className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600'
                                    tabIndex={-1}
                                >
                                    {showPassword ? <EyeOff className='w-5 h-5' /> : <Eye className='w-5 h-5' />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-2'>
                                Confirm New Password
                            </label>
                            <div className='relative'>
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder='Confirm new password'
                                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent pr-12'
                                    required
                                    minLength={8}
                                />
                                <button
                                    type='button'
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600'
                                    tabIndex={-1}
                                >
                                    {showConfirmPassword ? <EyeOff className='w-5 h-5' /> : <Eye className='w-5 h-5' />}
                                </button>
                            </div>
                            <p className='text-xs text-gray-500 mt-2'>
                                Password must be at least 8 characters long
                            </p>
                        </div>

                        <div className='bg-amber-50 border border-amber-100 rounded-lg p-3 flex items-start gap-2'>
                            <div className='text-amber-600 mt-0.5'>⚠️</div>
                            <p className='text-xs text-amber-800'>
                                Make sure to use a strong password with uppercase, lowercase, numbers, and special characters
                            </p>
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
                                    <div className='w-5 h-5 border-t-2 border-white rounded-full animate-spin' />
                                    Resetting Password...
                                </div>
                            ) : (
                                <div className='flex items-center justify-center gap-2'>
                                    <Lock className='w-5 h-5' />
                                    Reset Password
                                </div>
                            )}
                        </motion.button>
                    </form>
                </div>

                <div className='px-8 py-4 bg-gray-50 flex justify-between items-center border-t border-gray-100'>
                    <Link
                        to='/admin/forgot-password'
                        className='flex items-center gap-2 text-sm text-gray-600 hover:text-indigo-600 transition-colors'
                    >
                        <ArrowLeft className='w-4 h-4' />
                        Request New OTP
                    </Link>
                    <Link
                        to='/admin-login'
                        className='text-sm text-gray-600 hover:text-indigo-600 transition-colors'
                    >
                        Back to Login
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};
