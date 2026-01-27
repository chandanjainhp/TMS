import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function CTA() {
  return (
    <div className="bg-indigo-600 relative overflow-hidden py-32">
      {/* Decorative background circles */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] rounded-full bg-indigo-500 blur-[150px] opacity-40"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-violet-500 blur-[120px] opacity-50"></div>
      </div>

      <div className="max-w-5xl mx-auto text-center px-6 relative z-10">
        <h2 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-8">
          <span className="block">Ready to transform your institution?</span>
          <span className="block text-indigo-200 mt-2">Start your journey with TSM today.</span>
        </h2>
        <p className="text-xl md:text-2xl text-indigo-100 max-w-3xl mx-auto mb-12 leading-relaxed opacity-90">
          Join hundreds of forward-thinking educational institutions that are already using our platform to streamline their operations and empower their students.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-6">
          <Link
            to="/signup"
            className="inline-flex items-center justify-center px-10 py-4 border border-transparent text-lg font-bold rounded-full text-indigo-700 bg-white hover:bg-slate-50 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
          >
            Get Started Now
            <ArrowRight className="ml-3 h-6 w-6" />
          </Link>
          <Link
            to="/login"
            className="inline-flex items-center justify-center px-10 py-4 border-2 border-indigo-300 text-lg font-bold rounded-full text-white hover:bg-white hover:text-indigo-600 transition-all"
          >
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
}