import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Loader, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import Input from "../components/login/Input";
import { useAuthStore } from "../store/authStore";

const LoginPage = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const { login, isLoading, error } = useAuthStore();

	const handleLogin = async (e) => {
		e.preventDefault();
		await login(email, password);
	};

	return (
		<div className='min-h-screen flex bg-white font-sans'>
			{/* Left Side - Image/Branding */}
			<div className='hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-900'>
				<div className='absolute inset-0 bg-gradient-to-br from-indigo-600/30 to-purple-600/30 z-10' />
				<img
					src="https://images.unsplash.com/photo-1497294815431-9365093b7331?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
					alt="Office"
					className='absolute inset-0 w-full h-full object-cover opacity-50'
				/>
				<div className='relative z-20 flex flex-col justify-between h-full p-16 text-white'>
					<div>
						<Link to="/" className="inline-flex items-center space-x-2 text-white/80 hover:text-white transition-colors">
							<ArrowLeft className="h-5 w-5" />
							<span>Back to Home</span>
						</Link>
					</div>
					<div>
						<h1 className='text-5xl font-bold mb-6 leading-tight'>Welcome to the <br />Future of Education</h1>
						<p className='text-xl text-indigo-100 max-w-md'>Streamline your institution's management with our advanced, secure, and intuitive platform.</p>
					</div>
				</div>
			</div>

			{/* Right Side - Form */}
			<div className='w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 bg-white'>
				<div className='w-full max-w-md space-y-8'>
					<div className='text-center lg:text-left'>
						<img src="/logo.png" alt="TMS" className="h-12 w-auto mb-6 mx-auto lg:mx-0" />
						<h2 className='text-4xl font-bold text-gray-900 tracking-tight'>Sign in</h2>
						<p className='mt-2 text-gray-600'>Please enter your details to access your account.</p>
					</div>

					<form onSubmit={handleLogin} className='mt-8 space-y-6'>
						<div className='space-y-4'>
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
						</div>

						<div className='flex items-center justify-between'>
							<Link to='/forgot-password' className='text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors'>
								Forgot password?
							</Link>
						</div>

						{error && (
							<motion.div
								initial={{ opacity: 0, y: -10 }}
								animate={{ opacity: 1, y: 0 }}
								className='p-4 rounded-lg bg-red-50 text-red-500 text-sm font-medium border border-red-100'
							>
								{error}
							</motion.div>
						)}

						<motion.button
							whileHover={{ scale: 1.01 }}
							whileTap={{ scale: 0.99 }}
							className='w-full py-4 px-4 bg-slate-900 text-white font-bold rounded-xl shadow-lg hover:bg-slate-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900'
							type='submit'
							disabled={isLoading}
						>
							{isLoading ? <Loader className='w-6 h-6 animate-spin mx-auto' /> : "Sign In"}
						</motion.button>
					</form>

					<div className="relative">
						<div className="absolute inset-0 flex items-center">
							<div className="w-full border-t border-gray-200"></div>
						</div>
						<div className="relative flex justify-center text-sm">
							<span className="px-2 bg-white text-gray-500">New to TSM?</span>
						</div>
					</div>

					<div className='flex flex-col gap-4 text-center'>
						<Link
							to='/signup'
							className='w-full py-4 px-4 bg-white text-slate-900 font-bold rounded-xl border-2 border-slate-100 hover:border-slate-300 hover:bg-slate-50 transition-all duration-200'
						>
							Create an account
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
};
export default LoginPage;