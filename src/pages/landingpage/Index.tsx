import Navbar from "@/components/Navbar";
import FAQs from "./FAQs";
import HowToLearn from "./HowToLearn";
import WhyUs from "./Why";
import CodeEditorPlayground from "./Play";
import Bannar10x from "./Bannar";
import Hero from "./Hero";
import { CourseFeature } from "./CourseFeature";
import ArabicFooterSection from "@/components/layout/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen w-full">
      <Navbar />
      <Hero />
      <Bannar10x />
      <CourseFeature />
      <CodeEditorPlayground />
      <HowToLearn />
      <WhyUs />
      <FAQs />
      <ArabicFooterSection />
    </div>
  );
}
