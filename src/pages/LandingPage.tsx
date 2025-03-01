import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Navbar from "../components/Navbar";
import { SparkleIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import Footer from "@/components/layout/Footer";
import GalaxyBg from "../assets/galaxy.svg";
import BlueGalaxy from "../assets/blueGalaxy.svg";
import gsap from "gsap";
import Squares from "@/components/blocks/Backgrounds/Squares/Squares";

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
      <div className="relative">
        <div className="absolute 
        inset-0 z-0">
          <Squares
            speed={0.1}
            squareSize={80}
            direction="left"
            borderColor="#fff"
            hoverFillColor="#222"
          />
        </div>
      <div className="overflow-y-hidden flex flex-col min-h-screen relative">
          <header className="navbar">
            <Navbar />
          </header>

        <main className="flex-grow relative z-10 text-white text-center space-y-4 mt-4">
            <div className="flex flex-col pt-5 items-center justify-center space-y-4">
              <div className="bg-black m-2 border border-[#9191915b] flex items-center justify-center gap-2 transition-transform duration-300 group rounded-full w-52 h-7">
                <SparkleIcon className="text-[#8280D6] h-4 w-4" />
                <p className="text-xs text-center font-bold pb-1">
                  مرحبا في النسخه التجريبيه
                </p>
              </div>

              <div className="pt-4">
                <h1 className="hero-text text-2xl md:text-5xl font-bold leading-tight">
                  ارتقِ بمسيرتك إلى آفاق جديدة
                </h1>
                <p className="mt-2 text-base md:text-lg text-[#6B737D] font-bold">
                  عبر التطبيق العملي والتعليم التفاعلي
                </p>
              </div>

              <div className="pt-5">
                <p className="text-base md:text-lg text-[#6B737D] font-bold">
                  سجل الان
                </p>
                <div className="flex mt-4">
                  <Input
                    type="text"
                    placeholder="ادخل الايميل"
                    className="flex-grow px-4 py-5 bg-[#1B1D23] text-white placeholder-white rounded-none border border-[#585E67] focus:outline-none"
                  />
                  <Button className="font-bold px-8 py-5 text-white bg-black border border-[#585E67] rounded-none">
                    سجل
                  </Button>
                </div>
              </div>
            </div>
          </main>

          <div className="absolute top-80 -z-6 galaxy-bg">
            <img
              src={String(GalaxyBg)}
              alt="Galaxy Background"
              className="w-full"
            />
          </div>

          <div className="absolute left-0 h-96 bottom-0 -z-9 blue-galaxy">
          <img src={String(BlueGalaxy)} alt="Blue Galaxy" className="w-full" />
        </div>

        {/* Footer with GSAP animation */}
        <Footer />
      </div>
      </div>
    </>
  );
}
