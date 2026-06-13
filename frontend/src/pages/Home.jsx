import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Services from "../components/Services";
import Pricing from "../components/Pricing";
import Promotions from "../components/Promotions";
import Coverage from "../components/Coverage";
import Footer from "../components/Footer";
import WhatsAppButton from "../components/WhatsAppButton";
import Stats from "../components/Stats";
import HowItWorks from "../components/HowItWorks";
import Testimonials from "../components/Testimonials";
import PromoBanner from "../components/PromoBanner";

function Home() {
  return (
    <>
  <Navbar />
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

export default Home;
