import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { SparkleIcon } from "lucide-react";

export default function WhyUs() {
  const textRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    gsap.fromTo(
      textRefs.current,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 1, stagger: 0.4, ease: "power4.out" }
    );
  }, []);

  const addToRefs = (el: HTMLElement | null) => {
    if (el && !textRefs.current.includes(el)) {
      textRefs.current.push(el);
    }
  };

  return (
    <>
      <section className="mt-20">
        <div className="text-center mb-2">
          <span
            ref={addToRefs}
            className="inline-block px-20 py-2 font-medium text-white 
          border border-white border-opacity-20 rounded-full text-sm"
          >
            اصقل
          </span>
        </div>
        <div className="text-center mb-8">
          <h2 ref={addToRefs} className="text-white text-[48px] font-bold">
            ايش الفرق
          </h2>
          <p ref={addToRefs}>
            نمزج التدريب التقني للموظفين مع خبراء الصناعة والمرشدين والمشاريع
            لتعزيز التفكير النقدي ودفع الابتكار. <br />
            نظامنا المثبت للارتقاء بالمهارات يسعى بلا هوادة نحو النجاح.
          </p>
        </div>

        <div className="text-white py-10">
          <div
            className="max-w-screen-xl mx-auto flex flex-col md:flex-row items-center px-8
           md:justify-between gap-8"
          >
            <div className="max-w-xl space-y-4 text-right">
              <h2 ref={addToRefs} className="text-[40px] text-nowrap font-bold">
                أظهر الكفاءة من خلال مشاريع عملية
              </h2>
              <p ref={addToRefs} className="text-gray-300 leading-relaxed">
                تتركز المشاريع على سيناريوهات وتحديات واقعية، مما يتيح لك تطبيق
                المهارات التي تتعلمها في مواقف عملية، مع منحك تجربة عملية
                حقيقية.
              </p>
              <ul className="list-none space-y-2 font-bold">
                {[
                  "اكتسب خبرة مثبّتة",
                  "احتفظ بالمعرفة لفترة أطول",
                  "طبّق المهارات الجديدة على الفور",
                ].map((text, index) => (
                  <li
                    key={index}
                    ref={addToRefs}
                    className="relative pr-6 before:content-[''] before:absolute before:right-0 before:top-1/2 before:-translate-y-1/2 before:w-4 before:h-4 before:bg-transparent"
                  >
                    <SparkleIcon
                      className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4"
                      fill="green"
                    />
                    {text}
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative w-64 h-64 bg-blue-900">
              <div className="absolute inset-0 bg-[#0C0C0C]"></div>
              <div className="absolute inset-0 bg-blue-900 rounded-tl-[100%]"></div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
