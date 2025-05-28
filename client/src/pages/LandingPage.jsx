import React from "react";
import Navbar from "../components/landing/Navbar";  
import Hero from "../components/landing/Hero";
import Features from "../components/landing/Features";  
import CTA from "../components/landing/CTA";
import Footer from "../components/landing/Footer";

export default function LandingPage() {
  return (
    <div className="relative z-10 min-h-screen flex flex-col overflow-x-hidden overflow-y-auto">
      <Navbar />
      <div className="flex-grow">
        <Hero />
        <Features />
        <CTA />
      </div>
      <Footer />
    </div>
  );
};