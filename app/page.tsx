import Header from "@/components/Header";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import GoogleReviews from "@/components/GoogleReviews";
import Services from "@/components/Services";
import About from "@/components/About";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-slate-900 selection:bg-indigo-500/30">
      <Header />
      <Hero />
      <HowItWorks />
      <GoogleReviews />
      <Services />
      <About />
      <FAQ />
      <Footer />
    </main>
  );
}
