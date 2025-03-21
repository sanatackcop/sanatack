import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Navbar from "../components/Navbar";
import { Linkedin, SparkleIcon, Twitter } from "lucide-react";
import gsap from "gsap";
import Topics from "@/components/Topics";
import ProgramsSection from "@/components/ProgramsSection";
import StarBorder from "@/components/blocks/Animations/StarBorder/StarBorder";
import WhyUs from "@/components/WhyUs";
import CoursesCard from "@/components/Courses";
import Subscription from "@/components/Subscription";
import { Separator } from "@/components/ui/separator";

export default function LandingPage() {
  useEffect(() => {
    gsap.fromTo(
      ".galaxy-bg",
      { opacity: 0, y: -50 },
      { opacity: 1, y: 0, duration: 2, ease: "power3.out" }
    );
    gsap.fromTo(
      ".blue-galaxy",
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 2, ease: "power3.out" }
    );

    gsap.fromTo(
      ".navbar",
      { opacity: 0, y: -30 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
    );
    gsap.fromTo(
      ".hero-text",
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out", delay: 0.5 }
    );
    gsap.fromTo(
      ".footer",
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out", delay: 1 }
    );
  }, []);

  return (
    <>
      <div>
        <div className="flex flex-col min-h-screen">
          <header className="navbar">
            <Navbar />
          </header>
          <main className="flex-grow relative z-10 text-white text-center space-y-4 mt-4">
            <div className="flex flex-col pt-5 items-center justify-center space-y-4">
              <div className="bg-black border border-[#9191915b] flex items-center justify-center gap-2 transition-transform duration-300 group rounded-full w-52 h-7">
                <SparkleIcon className="text-[#8280D6] h-4 w-4" />
                <p className="text-xs text-center font-bold pb-1">
                  مرحبا في النسخه التجريبيه
                </p>
              </div>

              <div className="pt-4">
                <h1 className="hero-text text-2xl md:text-5xl font-bold leading-tight">
                  ارتقِ بمسيرتك إلى آفاق جديدة
                </h1>
                <p className="mt-4 text-base md:text-lg text-[#6B737D] font-bold">
                  عبر التطبيق العملي والتعليم التفاعلي
                </p>
                <p className="text-base md:text-lg text-[#6B737D] font-bold">
                  احصل على جودة تضاهي معسكرات التدريب المكثّفة
                </p>
              </div>

              <div className="flex items-center justify-center gap-7">
                <Button className=" font-bold text-base p-7 rounded-[20px]">
                  تصفّح البرامج
                </Button>
                <StarBorder
                  as="button"
                  className="font-bold hover:opacity-45 transition-all duration-1000"
                  color="white"
                  speed="5s"
                >
                  انضم مجانا
                </StarBorder>
              </div>
            </div>

            <Topics />

            <div
              className="bg-[#0C0C0C] rounded-[4rem] w-full py-10 md:py-20 
             md:px-32 mx-auto"
            >
              <ProgramsSection />
              <WhyUs />
            </div>

            <div className="px-4 md:px-32 py-2  mx-auto">
              <div className="flex flex-col sm:flex-row justify-between items-center">
                <h1 className="text-2xl mb-2 md:text-4xl font-bold text-center sm:text-left">
                  برامج موصى بها لك
                </h1>
                <Button className="mb-5 sm:mt-0 font-bold text-base p-4 md:p-7 rounded-[20px]">
                  تصفّح البرامج
                </Button>
              </div>

              <CoursesCard />
            </div>

            <div className="mt-5 bg-white rounded-tl-[4rem] rounded-tr-[4rem] md:rounded-tl-[10rem] md:rounded-tr-[10rem] h-full w-full relative px-4 py-8 md:px-0">
              <Subscription />
            </div>
          </main>
          <footer className="bg-white w-full">
            <Separator className="!bg-gray-200" />
            <div className="flex flex-col sm:flex-row justify-between items-center px-4 md:px-40 py-5">
              <div className="flex gap-2 mb-4 sm:mb-0">
                <Linkedin className="text-[#808080] h-5 w-5" />
                <Twitter className="text-[#808080] h-5 w-5" />
              </div>
              <p className="text-[#808080] font-bold">Sanatack@</p>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}
