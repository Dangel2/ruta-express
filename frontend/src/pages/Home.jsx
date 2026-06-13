import Hero from "../components/Hero";
import Stats from "../components/Stats";
import Services from "../components/Services";
import HowItWorks from "../components/HowItWorks";
import Pricing from "../components/Pricing";
import PromoBanner from "../components/PromoBanner";
import Promotions from "../components/Promotions";
import Testimonials from "../components/Testimonials";
import Coverage from "../components/Coverage";
import Footer from "../components/Footer";
import WhatsAppButton from "../components/WhatsAppButton";

export default function Home() {
  return (
    <>
      <Hero />
      <Stats />
      <Services />
      <HowItWorks />
      <Pricing />
      <PromoBanner />
      <Promotions />
      <Testimonials />
      <Coverage />
      <Footer />
      <WhatsAppButton />
    </>
  );
}