import { Link } from 'react-router-dom';

export default function CTA() {
  return (
    <div className="bg-indigo-700">
      <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
          <span className="block">Ready to transform your institution?</span>
          <span className="block">Start using TSM today.</span>
        </h2>
        <p className="mt-4 text-lg leading-6 text-indigo-200">
          Join hundreds of educational institutions using our platform.
        </p>
        <Link to="/signup" className="mt-8 inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50">
          Sign up 
        </Link>
      </div>
    </div>
  );
}