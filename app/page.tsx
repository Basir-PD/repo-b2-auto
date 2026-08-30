import Header from "@/components/Header";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Services from "@/components/Services";
import Stats from "@/components/Stats";
// Customer reviews — off for now, no real reviews to show yet.
// import GoogleReviews from "@/components/GoogleReviews";
import QuoteForm from "@/components/QuoteForm";
import FAQ from "@/components/FAQ";
import ContactMap from "@/components/ContactMap";
import Footer from "@/components/Footer";
import MobileCallBar from "@/components/MobileCallBar";

export default function Home() {
  return (
    <>
      <Header />
      {/*
        Section order follows the sales funnel:
        trust (hero) → how → what → proof → convert (quote) → objections (FAQ) → find us.
      */}
      <main id="main" className="min-h-screen bg-white text-slate-900">
        <Hero />
        <HowItWorks />
        <Services />
        <Stats />
        {/* <GoogleReviews /> */}
        <QuoteForm />
        <FAQ />
        <ContactMap />
      </main>
      <Footer />
      <MobileCallBar />
    </>
  );
}
