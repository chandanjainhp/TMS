import { motion } from "framer-motion";
import { useState } from "react";
import { useAuthStore } from "../store/authStore";
import Input from "../components/login/Input";
import { ArrowLeft, Loader, Mail } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const ForgotPasswordPage = () => {
	const [email, setEmail] = useState("");
	const [isSubmitted, setIsSubmitted] = useState(false);
	const navigate = useNavigate();

	const { isLoading, forgotPassword } = useAuthStore();

	const handleSubmit = async (e) => {
		e.preventDefault();
		await forgotPassword(email);
		setIsSubmitted(true);
		// Navigate to reset password page after 3 seconds
		setTimeout(() => {
			navigate("/reset-password");
		}, 3000);
	};

	return (
		<div className='min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center relative overflow-hidden'>
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className='max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden'
			>
				<div className='p-8'>
					<div className="flex justify-center mb-6">
						<div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
							<Mail className="w-8 h-8 text-indigo-600" />
						</div>
					</div>

					<h2 className='text-3xl font-bold mb-2 text-center text-gray-900'>
						Forgot Password
					</h2>

					{!isSubmitted ? (
						<>
							<p className='text-gray-600 mb-8 text-center'>
								Enter your email address and we'll send you an OTP to reset your password.
							</p>
							<form onSubmit={handleSubmit} className="space-y-6">
								<Input
									icon={Mail}
									type='email'
									placeholder='Email Address'
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									required
								/>
								<motion.button
									whileHover={{ scale: 1.01 }}
									whileTap={{ scale: 0.99 }}
									className='w-full py-3 px-4 bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-200'
									type='submit'
								>
									{isLoading ? <Loader className='size-6 animate-spin mx-auto' /> : "Send OTP"}
								</motion.button>
							</form>
						</>
					) : (
						<div className='text-center'>
							<div className='w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4'>
								<Mail className='h-8 w-8 text-green-600' />
							</div>
							<p className='text-gray-900 font-semibold mb-2'>
								OTP Sent!
							</p>
							<p className='text-gray-600 mb-6'>
								We've sent a 6-digit code to <strong>{email}</strong>.
							</p>
							<p className='text-sm text-gray-500'>
								Redirecting to reset page...
							</p>
							<Link
								to="/reset-password"
								className='mt-4 inline-block text-indigo-600 hover:text-indigo-800 font-semibold transition-colors'
							>
								Manual Redirect &rarr;
							</Link>
						</div>
					)}
				</div>

				<div className='px-8 py-4 bg-gray-50 flex justify-center border-t border-gray-100'>
					<Link to={"/login"} className='text-sm text-gray-600 hover:text-indigo-600 font-medium flex items-center transition-colors'>
						<ArrowLeft className='h-4 w-4 mr-2' /> Back to Login
					</Link>
				</div>
			</motion.div>
		</div>
	);
};
export default ForgotPasswordPage;
