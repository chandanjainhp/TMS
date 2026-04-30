import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, ArrowLeft, Shield, KeyRound, Loader } from "lucide-react";
import { Link } from "react-router-dom";
import Input from "../components/login/Input";
import toast from "react-hot-toast";

const AdminForgotPasswordPage = () => {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch('/api/auth/admin/forgot-password', {
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
        <div className='relative min-h-screen bg-[#f6f5f4] flex items-center justify-center overflow-hidden px-4'>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className='max-w-md w-full rounded border border-[rgba(0,0,0,0.1)] bg-white shadow-[rgba(0,0,0,0.04)_0px_4px_18px] overflow-hidden'
            >
                <div className='p-8'>
                    <div className='flex flex-col items-center mb-6'>
                        <div className='w-16 h-16 bg-[#f2f9ff] rounded-full flex items-center justify-center mb-4'>
                            <Shield className='w-8 h-8 text-[#097fe8]' />
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
                                    Admin Email
                                </label>
                                <Input
                                    icon={Mail}
                                    type='email'
                                    placeholder='admin@institution.edu'
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                className='w-full py-3 px-4 bg-[#0075de] text-white font-bold rounded shadow hover:bg-[#005bab] focus:outline-none focus:ring-2 focus:ring-[#097fe8] focus:ring-offset-2 transition duration-200'
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
                                    className='w-full py-3 px-4 bg-[#0075de] text-white font-bold rounded shadow hover:bg-[#005bab] focus:outline-none focus:ring-2 focus:ring-[#097fe8] focus:ring-offset-2 transition duration-200'
                                >
                                    <div className='flex items-center justify-center gap-2'>
                                        <KeyRound className='w-5 h-5' />
                                        Enter OTP & Reset Password
                                    </div>
                                </motion.button>
                            </Link>

                            <button
                                onClick={() => setIsSubmitted(false)}
                                className='w-full text-center text-sm text-[#0075de] hover:text-[#005bab] font-medium'
                            >
                                Resend OTP
                            </button>
                        </div>
                    )}
                </div>

                <div className='px-8 py-4 bg-[#f6f5f4] flex justify-center border-t border-[rgba(0,0,0,0.1)]'>
                    <Link
                        to='/admin-login'
                        className='flex items-center gap-2 text-sm text-[#615d59] hover:text-[#0075de] font-medium transition-colors'
                    >
                        <ArrowLeft className='w-4 h-4' />
                        Back to Admin Login
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default AdminForgotPasswordPage;
