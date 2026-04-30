import { motion } from "framer-motion";

const LoadingSpinner = () => {
	return (
		<div className='flex min-h-screen items-center justify-center bg-white'>
			{/* Simple Loading Spinner */}
			<motion.div
				className='h-12 w-12 rounded-full border-4 border-[#dbeffd] border-t-[#0075de]'
				animate={{ rotate: 360 }}
				transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
			/>
		</div>
	);
};

export default LoadingSpinner;
