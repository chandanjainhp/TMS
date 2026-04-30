const Input = ({ icon: Icon, ...props }) => {
	return (
		<div className='relative mb-5'>
			<div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
				<Icon className='size-4 text-[#615d59]' />
			</div>
			<input
				{...props}
				className='w-full rounded border border-[rgba(0,0,0,0.1)] bg-white py-2 pl-10 pr-3 text-[15px] text-[rgba(0,0,0,0.9)] placeholder:text-[#a39e98] focus:border-[#097fe8] focus:outline-none focus:ring-2 focus:ring-[#097fe8]/25'
			/>
		</div>
	);
};
export default Input;
