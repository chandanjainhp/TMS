import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function CTA() {
  return (
    <div className="bg-indigo-700 relative overflow-hidden">
      {/* Decorative background circles */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-indigo-600 blur-3xl opacity-50"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-violet-600 blur-3xl opacity-50"></div>
      </div>

      <div className="max-w-4xl mx-auto text-center py-16 px-4 sm:py-24 sm:px-6 lg:px-8 relative z-10">
        <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
          <span className="block">Ready to transform your institution?</span>
          <span className="block text-indigo-200 mt-2">Start your journey with TSM today.</span>
        </h2>
        <p className="mt-4 text-xl leading-6 text-indigo-100 max-w-2xl mx-auto">
          Join hundreds of forward-thinking educational institutions that are already using our platform to streamline their operations.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link
            to="/signup"
            className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-indigo-700 bg-white hover:bg-indigo-50 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Get Started Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
          <Link
            to="/login"
            className="inline-flex items-center justify-center px-8 py-3 border border-indigo-300 text-base font-medium rounded-full text-white hover:bg-indigo-600 transition-all"
          >
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
}