import Navbar from "../components/landing/Navbar";  
import Hero from "../components/landing/Hero";
import Features from "../components/landing/Features";  
import CTA from "../components/landing/CTA";
import Footer from "../components/landing/Footer";

export default function LandingPage() {
  return (
    <div className="relative z-10 flex flex-col overflow-x-hidden">
      <Navbar />
      <div className="flex-grow">
        <Hero />
        <Features />
        <CTA />
      </div>
      <Footer />
    </div>
  );
}