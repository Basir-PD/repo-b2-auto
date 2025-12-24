import Header from "@/components/Header";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Stats from "@/components/Stats";
import GoogleReviews from "@/components/GoogleReviews";
import FAQ from "@/components/FAQ";
import ContactMap from "@/components/ContactMap";
import Footer from "@/components/Footer";
import SectionConnector from "@/components/SectionConnector";
import ScrollProgress from "@/components/ScrollProgress";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-slate-900 selection:bg-indigo-500/30">
      <ScrollProgress />
      <Header />
      <Hero />
      <SectionConnector variant="wave" fromColor="white" toColor="slate-50" />
      <HowItWorks />
      <SectionConnector variant="curve" fromColor="slate-50" toColor="white" />
      <Stats />
      <SectionConnector variant="diagonal" fromColor="white" toColor="white" />
      <GoogleReviews />
      <SectionConnector variant="zigzag" fromColor="white" toColor="slate-50" />
      <FAQ />
      <SectionConnector variant="wave" fromColor="slate-50" toColor="white" flip />
      <ContactMap />
      <SectionConnector variant="curve" fromColor="white" toColor="slate-950" />
      <Footer />
    </main>
  );
}
