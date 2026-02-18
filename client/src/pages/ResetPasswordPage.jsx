import { useState } from "react";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";
import Input from "../components/login/Input";
import { Lock } from "lucide-react";
import toast from "react-hot-toast";

const ResetPasswordPage = () => {
	const [otp, setOtp] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const { resetPassword, error, isLoading, message } = useAuthStore();

	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (password !== confirmPassword) {
			toast.error("Passwords do not match");
			return;
		}

		if (otp.length !== 6) {
			toast.error("Please enter a valid 6-digit OTP");
			return;
		}

		try {
			await resetPassword(otp, password);

			toast.success("Password reset successfully, redirecting to login page...");
			setTimeout(() => {
				navigate("/login");
			}, 2000);
		} catch (error) {
			console.error(error);
			toast.error(error.message || "Error resetting password");
		}
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
							<Lock className="w-8 h-8 text-indigo-600" />
						</div>
					</div>

					<h2 className='text-3xl font-bold mb-6 text-center text-gray-900'>
						Reset Password
					</h2>
					<p className='text-gray-600 mb-8 text-center'>
						Enter the OTP code sent to your email and your new password.
					</p>

					{error && <div className='p-3 bg-red-50 text-red-500 text-sm font-medium rounded-lg mb-4 text-center border border-red-100'>{error}</div>}
					{message && <div className='p-3 bg-green-50 text-green-500 text-sm font-medium rounded-lg mb-4 text-center border border-green-100'>{message}</div>}

					<form onSubmit={handleSubmit} className="space-y-4">
						<Input
							icon={Lock}
							type='text'
							placeholder='Enter 6-digit OTP'
							value={otp}
							onChange={(e) => setOtp(e.target.value)}
							maxLength={6}
							required
						/>

						<Input
							icon={Lock}
							type='password'
							placeholder='New Password'
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
						/>

						<Input
							icon={Lock}
							type='password'
							placeholder='Confirm New Password'
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
							required
						/>

						<motion.button
							whileHover={{ scale: 1.01 }}
							whileTap={{ scale: 0.99 }}
							className='w-full py-3 px-4 bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-200 mt-2'
							type='submit'
							disabled={isLoading}
						>
							{isLoading ? "Resetting..." : "Reset Password"}
						</motion.button>
					</form>
				</div>
			</motion.div>
		</div>
	);
};
export default ResetPasswordPage;
