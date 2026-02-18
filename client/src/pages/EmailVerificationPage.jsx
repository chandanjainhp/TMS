import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import toast from "react-hot-toast";
import { Mail, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const EmailVerificationPage = () => {
	const [code, setCode] = useState(["", "", "", "", "", ""]);
	const inputRefs = useRef([]);
	const navigate = useNavigate();

	const { error, isLoading, verifyEmail, resendVerificationEmail } = useAuthStore();

	const handleChange = (index, value) => {
		const newCode = [...code];

		// Handle pasted content
		if (value.length > 1) {
			const pastedCode = value.slice(0, 6).split("");
			for (let i = 0; i < 6; i++) {
				newCode[i] = pastedCode[i] || "";
			}
			setCode(newCode);

			// Focus on the last non-empty input or the first empty one
			const lastFilledIndex = newCode.findLastIndex((digit) => digit !== "");
			const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5;
			inputRefs.current[focusIndex].focus();
		} else {
			newCode[index] = value;
			setCode(newCode);

			// Move focus to the next input field if value is entered
			if (value && index < 5) {
				inputRefs.current[index + 1].focus();
			}
		}
	};

	const handleKeyDown = (index, e) => {
		if (e.key === "Backspace" && !code[index] && index > 0) {
			inputRefs.current[index - 1].focus();
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const verificationCode = code.join("");
		try {
			await verifyEmail(verificationCode);
			navigate("/overview");
			toast.success("Email verified successfully");
		} catch (error) {
			console.log(error);
		}
	};

	const handleResendEmail = async () => {
		try {
			await resendVerificationEmail();
			toast.success("Verification email sent! Check your inbox.");
		} catch (error) {
			toast.error(error.response?.data?.message || "Failed to resend email");
		}
	};

	// Auto submit when all fields are filled
	useEffect(() => {
		if (code.every((digit) => digit !== "")) {
			handleSubmit(new Event("submit"));
		}
	}, [code]);

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

					<h2 className='text-3xl font-bold mb-4 text-center text-gray-900'>
						Verify Your Email
					</h2>
					<p className='text-center text-gray-600 mb-8'>
						Enter the 6-digit code sent to your email address to confirm your account.
					</p>

					<form onSubmit={handleSubmit} className='space-y-6'>
						<div className='flex justify-between gap-2'>
							{code.map((digit, index) => (
								<input
									key={index}
									ref={(el) => (inputRefs.current[index] = el)}
									type='text'
									maxLength='6'
									value={digit}
									onChange={(e) => handleChange(index, e.target.value)}
									onKeyDown={(e) => handleKeyDown(index, e)}
									className='w-12 h-12 text-center text-2xl font-bold bg-gray-50 text-gray-900 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors'
								/>
							))}
						</div>

						{error && <p className='text-red-500 text-sm font-medium text-center bg-red-50 p-2 rounded-lg border border-red-100'>{error}</p>}

						<motion.button
							whileHover={{ scale: 1.01 }}
							whileTap={{ scale: 0.99 }}
							type='submit'
							disabled={isLoading || code.some((digit) => !digit)}
							className='w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-xl shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all'
						>
							{isLoading ? "Verifying..." : "Verify Email"}
						</motion.button>
					</form>

					<div className='mt-6 text-center text-sm'>
						<p className="text-gray-600">Didn't receive the code?</p>
						<button
							onClick={handleResendEmail}
							disabled={isLoading}
							className='text-indigo-600 hover:text-indigo-800 font-semibold mt-1 hover:underline disabled:opacity-50'
						>
							Resend Email
						</button>
					</div>
				</div>

				<div className='px-8 py-4 bg-gray-50 flex justify-center border-t border-gray-100'>
					<Link to="/login" className='text-sm text-gray-600 hover:text-indigo-600 font-medium flex items-center transition-colors'>
						<ArrowLeft className='h-4 w-4 mr-2' /> Back to Login
					</Link>
				</div>
			</motion.div>
		</div>
	);
};
export default EmailVerificationPage;
