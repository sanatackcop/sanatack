import { useEffect, useRef, useState } from "react";
import { MousePointerClick } from "lucide-react";
import img1 from "../../assets/1.png";
import img2 from "../../assets/2.png";
import img3 from "../../assets/3.png";
import img4 from "../../assets/4.png";

const images = [
  {
    src: img1,
    title: "انطلق نحو التعلم",
    caption: "ابدأ رحلتك التعليمية من الصفر حتى الاحتراف، بخطوات منظمة وواضحة.",
    position: "bottom-28 left-54",
    arrowDirection: "left",
  },
  {
    src: img2,
    title: "تحكم كامل",
    caption: "تابع تقدمك لحظة بلحظة، وتحكم بكل تفاصيل دوراتك بسهولة وفعالية.",
    position: "top-25 right-28",
    arrowDirection: "left",
  },
  {
    src: img3,
    title: "تجربة ذكية",
    caption: "استخدم اختصارات لوحة المفاتيح لتجربة تعليمية أسرع وأكثر سلاسة.",
    position: "top-40 left-1/3",
    arrowDirection: "right",
  },
  {
    src: img4,
    title: "شهادات موثوقة",
    caption: "احصل على شهادات معتمدة تعزز سيرتك الذاتية وتفتح لك أبواب الفرص.",
    position: "bottom-28 left-1/3",
    arrowDirection: "right",
  },
];

export default function ImageGallery() {
  const [visibleIndex, setVisibleIndex] = useState(0);
  const containerRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = Number(entry.target.getAttribute("data-index"));
          if (entry.isIntersecting) {
            setVisibleIndex(index);
          }
        });
      },
      { threshold: 0.5 }
    );

    containerRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  const currentImage = images[visibleIndex];

  return (
    <div className="w-full">
      <div className="sticky top-20 h-screen flex items-center justify-center z-10  overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 flex gap-2 pt-20 z-20">
          {images.map((_, i) => (
            <div
              key={i}
              className={`h-1 w-12 rounded-full transition-colors duration-300 ${
                i === visibleIndex ? "bg-gray-800" : "bg-gray-300"
              }`}
            ></div>
          ))}
        </div>

        <div className="relative w-full h-full flex items-center justify-center">
          <img
            src={String(currentImage.src)}
            alt={`Image ${visibleIndex}`}
            className="max-h-[70vh] max-w-[70vw] object-contain shadow-2xl rounded-xl transition duration-700"
          />

          <div className={`absolute ${currentImage.position} group`}>
            <div
              className="relative flex bg-white/90 backdrop-blur-sm p-4 rounded-md border border-gray-200 max-w-sm h-18 shadow-lg"
              style={{ filter: "drop-shadow(0 4px 10px rgba(0, 0, 0, 0.6))" }}
            >
              <div>
                <h3 className="text-lg font-bold text-[#6a8afc] mb-1">
                  {currentImage.title}
                </h3>
                <p className="text-sm text-gray-700">{currentImage.caption}</p>
              </div>
            </div>

            {currentImage.arrowDirection === "right" && (
              <MousePointerClick
                size={28}
                color="#6a8afc"
                className="absolute top-0 -translate-y-1/2 -right-8 scale-x-[-1] drop-shadow-lg"
              />
            )}
            {currentImage.arrowDirection === "left" && (
              <MousePointerClick
                size={28}
                color="#6a8afc"
                className="absolute top-0 -translate-y-1/2 -left-8 drop-shadow-lg"
              />
            )}
          </div>
        </div>
      </div>

      {images.map((_, i) => (
        <div
          key={i}
          ref={(el) => (containerRefs.current[i] = el)}
          data-index={i}
          className="h-screen"
        ></div>
      ))}
      <div className="h-screen"></div>
    </div>
  );
}
