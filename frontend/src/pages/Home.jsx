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
    <main className="min-h-screen bg-[#0A0A0A] text-white overflow-hidden">
      <div className="relative">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top,rgba(220,38,38,0.16),transparent_38%)]" />

        <div className="relative">
          <Hero />
        </div>
      </div>

      <section className="border-y border-red-600/20 bg-[#111111]">
        <Stats />
      </section>

      <section className="bg-[#0A0A0A]">
        <Services />
      </section>

      <section className="bg-[#101010] border-y border-gray-800">
        <HowItWorks />
      </section>

      <section className="bg-[#0A0A0A]">
        <Pricing />
      </section>

      <section className="bg-gradient-to-r from-red-950/30 via-[#151515] to-red-950/30 border-y border-red-600/20">
        <PromoBanner />
      </section>

      <section className="bg-[#0A0A0A]">
        <Promotions />
      </section>

      <section className="bg-[#101010] border-y border-gray-800">
        <Testimonials />
      </section>

      <section className="bg-[#0A0A0A]">
        <Coverage />
      </section>

      <Footer />
      <WhatsAppButton />
    </main>
  );
}
