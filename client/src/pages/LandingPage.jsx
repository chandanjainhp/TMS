import Navbar from "../components/landing/Navbar";
import Hero from "../components/landing/Hero";
import Features from "../components/landing/Features";
import CTA from "../components/landing/CTA";
import Footer from "../components/landing/Footer";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-slate-900 flex flex-col overflow-x-hidden text-white font-sans">
      <Navbar />
      <div className="flex-grow">
        <section id="hero">
          <Hero />
        </section>
        <section id="features">
          <Features />
        </section>
        <section id="cta">
          <CTA />
        </section>
      </div>
      <Footer />
    </div>
  );
}