import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Services from "../components/Services";
import Pricing from "../components/Pricing";
import Promotions from "../components/Promotions";
import Coverage from "../components/Coverage";
import Footer from "../components/Footer";
import WhatsAppButton from "../components/WhatsAppButton";

function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Services />
      <Pricing />
      <Promotions />
      <Coverage />
      <Footer />
      <WhatsAppButton />
    </>
  );
}

export default Home;
