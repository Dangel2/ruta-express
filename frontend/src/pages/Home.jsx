import Hero from "../components/Hero";
import Stats from "../components/Stats";
import Services from "../components/Services";
import HowItWorks from "../components/HowItWorks";
import Pricing from "../components/Pricing";
import Promotions from "../components/Promotions";
import Testimonials from "../components/Testimonials";
import Coverage from "../components/Coverage";
import Footer from "../components/Footer";
import WhatsAppButton from "../components/WhatsAppButton";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white overflow-hidden">
      <Hero />
      <Stats />
      <Services />
      <HowItWorks />
      <Pricing />
      <Promotions />
      <Testimonials />
      <Coverage />
      <Footer />
      <WhatsAppButton />
    </main>
  );
}
