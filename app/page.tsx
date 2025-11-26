import Header from "@/components/Header";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Stats from "@/components/Stats";
import GoogleReviews from "@/components/GoogleReviews";
import FAQ from "@/components/FAQ";
import ContactMap from "@/components/ContactMap";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-slate-900 selection:bg-indigo-500/30">
      <Header />
      <Hero />
      <HowItWorks />
      <Stats />
      <GoogleReviews />
      <FAQ />
      <ContactMap />
      <Footer />
    </main>
  );
}
