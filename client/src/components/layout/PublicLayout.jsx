import React from 'react';
import PublicNavbar from './PublicNavbar';
import Footer from '../landing/Footer';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const PublicLayout = ({ title, subtitle, children, icon: Icon, gradient = "from-indigo-600 to-violet-600" }) => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <PublicNavbar />

            {/* Hero Section */}
            <div className={`bg-gradient-to-br ${gradient} pt-32 pb-20 px-4 sm:px-6 lg:px-8 text-white relative overflow-hidden`}>
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute -top-24 -left-24 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>

                <div className="max-w-7xl mx-auto relative z-10 text-center">
                    <Link to="/" className="inline-flex items-center text-white/80 hover:text-white mb-8 transition-colors bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm hover:bg-white/20">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
                    </Link>
                    {Icon && (
                        <div className="flex justify-center mb-6">
                            <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-md shadow-xl ring-1 ring-white/30">
                                <Icon className="w-12 h-12 text-white" />
                            </div>
                        </div>
                    )}
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">{title}</h1>
                    {subtitle && <p className="text-xl md:text-2xl text-indigo-100 max-w-3xl mx-auto font-light leading-relaxed">{subtitle}</p>}
                </div>
            </div>

            {/* Main Content */}
            <main className="flex-grow">
                <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
                    <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 ring-1 ring-gray-100/50">
                        <div className="prose prose-lg prose-indigo max-w-none">
                            {children}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default PublicLayout;
