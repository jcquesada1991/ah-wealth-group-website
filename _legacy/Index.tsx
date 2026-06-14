import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import ClientsSection from "@/components/ClientsSection";
import FAQSection from "@/components/FAQSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";

const Index = () => (
  <>
    <Navbar />
    <main>
      <HeroSection />
      <ServicesSection />
      <HowItWorksSection />
      <ClientsSection />
      <FAQSection />
      <ContactSection />
    </main>
    <Footer />
    <WhatsAppFloat />
  </>
);

export default Index;
