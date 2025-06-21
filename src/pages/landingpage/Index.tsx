import Navbar from "@/components/Navbar";
import FAQs from "./FAQs";
import WhyUs from "./Why";
import Hero from "./Hero";
import { CourseFeature } from "./CourseFeature";
import Footer from "@/components/layout/Footer";

export default function LandingPage() {
  return (
    <div className="w-full bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/20">
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
