import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Navbar from "../components/Navbar";
import { SparkleIcon } from "lucide-react";
import gsap from "gsap";
import Topics from "@/components/Topics";
import ProgramsSection from "@/components/ProgramsSection";
import StarBorder from "@/components/blocks/Animations/StarBorder/StarBorder";

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

            <div className="bg-[#0C0C0C] rounded-[4rem] w-full py-20 px-32">
              <ProgramsSection />
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
