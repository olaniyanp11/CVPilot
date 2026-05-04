import Ticker from "@/components/Ticker";
import Hero from "@/components/Hero";
import LogoBar from "@/components/LogoBar";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import Testimonials from "@/components/Testimonials";
import Pricing from "@/components/Pricing";
import CtaBanner from "@/components/CtaBanner";

export default function Home() {
  return (
    <main className="overflow-x-hidden">
      <Hero />
      <Features />
      <Ticker />
      <HowItWorks />
      <Testimonials />
      <LogoBar />
      <Pricing />
      <CtaBanner />
    </main>
  );
}
