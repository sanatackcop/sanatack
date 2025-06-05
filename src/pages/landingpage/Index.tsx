import Navbar from "@/components/Navbar";
import FAQs from "./FAQs";
import WhyUs from "./Why";
import Hero from "./Hero";
import { CourseFeature } from "./CourseFeature";
import Footer from "@/components/layout/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen w-full">
      <Navbar />
      <Hero />
      {/* <Bannar10x /> */}
      <CourseFeature />
      {/* <CodeEditorPlayground /> */}
      {/* <HowToLearn /> */}
      <WhyUs />
      <FAQs />
      <Footer />
    </div>
  );
}
