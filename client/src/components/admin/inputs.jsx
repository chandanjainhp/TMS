const Input = ({ icon: Icon, ...props }) => {
  return (
    <div className="relative mb-4">
      {Icon && (
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <Icon className="h-4 w-4 text-[#a39e98]" />
        </div>
      )}
      <input
        {...props}
        className={`w-full rounded border border-[rgba(0,0,0,0.1)] bg-white py-2 pr-3 text-sm text-[rgba(0,0,0,0.95)] outline-none placeholder:text-[#a39e98] focus:border-[#097fe8] transition-colors ${
          Icon ? 'pl-9' : 'pl-3'
        }`}
      />
    </div>
  );
};

export default Input;
