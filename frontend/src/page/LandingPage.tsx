import CTASection from "@/components/landing/CTASection";
import FAQSection from "@/components/landing/FAQSection";
import FeatureSection from "@/components/landing/FeaturesSection";
import HeroSection from "@/components/landing/HeroSection";
import PricingSection from "@/components/landing/PricingSection";
import WorkflowSection from "@/components/landing/WorkflowSection";


export default function LandingPage() {
    return (
        <main className="min-h-screen bg-black">
            <HeroSection />
            <FeatureSection />
            <WorkflowSection />
            <PricingSection />
            <FAQSection />
            <CTASection />
        </main>
    );
}