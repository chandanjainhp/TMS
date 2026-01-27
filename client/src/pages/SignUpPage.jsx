import { motion } from "framer-motion";
import Input from "../components/login/Input";
import { Loader, Lock, Mail, User, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PasswordStrengthMeter from "../components/login/PasswordStrengthMeter";
import { useAuthStore } from "../store/authStore";

const SignUpPage = () => {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const navigate = useNavigate();

	const { signup, error, isLoading } = useAuthStore();

	const handleSignUp = async (e) => {
		e.preventDefault();

		try {
			await signup(email, password, name);
			navigate("/verify-email");
		} catch (error) {
			console.log(error);
		}
	};
	return (
		<div className='min-h-screen flex bg-white font-sans'>
			{/* Left Side - Image/Branding */}
			<div className='hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-900'>
				<div className='absolute inset-0 bg-gradient-to-br from-indigo-900/40 to-purple-900/40 z-10' />
				<img
					src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
					alt="Students"
					className='absolute inset-0 w-full h-full object-cover opacity-60'
				/>
				<div className='relative z-20 flex flex-col justify-between h-full p-16 text-white'>
					<div>
						<Link to="/" className="inline-flex items-center space-x-2 text-white/80 hover:text-white transition-colors">
							<ArrowLeft className="h-5 w-5" />
							<span>Back to Home</span>
						</Link>
					</div>
					<div>
						<h1 className='text-5xl font-bold mb-6 leading-tight'>Join the <br />Community</h1>
						<p className='text-xl text-indigo-100 max-w-md'>Empower your teaching and learning experience with our world-class tools.</p>
					</div>
				</div>
			</div>

			{/* Right Side - Form */}
			<div className='w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 bg-white'>
				<div className='w-full max-w-md space-y-8'>
					<div className='text-center lg:text-left'>
						<h2 className='text-4xl font-bold text-gray-900 tracking-tight'>Create Account</h2>
						<p className='mt-2 text-gray-600'>Get started with your free account today.</p>
					</div>

					<form onSubmit={handleSignUp} className='mt-8 space-y-5'>
						<Input
							icon={User}
							type='text'
							placeholder='Full Name'
							value={name}
							onChange={(e) => setName(e.target.value)}
						/>
						<Input
							icon={Mail}
							type='email'
							placeholder='Email Address'
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

						{error && (
							<motion.div
								initial={{ opacity: 0, y: -10 }}
								animate={{ opacity: 1, y: 0 }}
								className='p-4 rounded-lg bg-red-50 text-red-500 text-sm font-medium border border-red-100'
							>
								{error}
							</motion.div>
						)}

						<PasswordStrengthMeter password={password} />

						<motion.button
							className='w-full py-4 px-4 bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 mt-2'
							whileHover={{ scale: 1.01 }}
							whileTap={{ scale: 0.99 }}
							type='submit'
							disabled={isLoading}
						>
							{isLoading ? <Loader className=' animate-spin mx-auto' size={24} /> : "Sign Up"}
						</motion.button>
					</form>

					<div className="relative mt-8">
						<div className="absolute inset-0 flex items-center">
							<div className="w-full border-t border-gray-200"></div>
						</div>
						<div className="relative flex justify-center text-sm">
							<span className="px-2 bg-white text-gray-500">Already have an account?</span>
						</div>
					</div>

					<div className='flex justify-center'>
						<Link to={'/login'} className='font-bold text-indigo-600 hover:text-indigo-500 hover:underline'>
							Log in here
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
};
export default SignUpPage;
