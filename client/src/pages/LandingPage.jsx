import Navbar from "../components/landing/Navbar";
import Hero from "../components/landing/Hero";
import Features from "../components/landing/Features";
import CTA from "../components/landing/CTA";
import Footer from "../components/landing/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-white">
      <Navbar />
      <main>
        <section id="hero">
          <Hero />
        </section>
        <section id="features">
          <Features />
        </section>
        <section id="cta">
          <CTA />
        </section>
      </main>
      <Footer />
    </div>
  );
}
