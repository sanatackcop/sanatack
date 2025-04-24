import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { SparkleIcon } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function WhyUs() {
  const textRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    gsap.fromTo(
      textRefs.current,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 1, stagger: 0.1, ease: "power4.out" }
    );
  }, []);

  const addToRefs = (el: HTMLElement | null) => {
    if (el && !textRefs.current.includes(el)) {
      textRefs.current.push(el);
    }
  };

  const features = [
    {
      title: "أظهر الكفاءة من خلال مشاريع عملية",
      description:
        "تتركز المشاريع على سيناريوهات وتحديات واقعية، مما يتيح لك تطبيق المهارات التي تتعلمها في مواقف عملية، مع منحك تجربة عملية حقيقية.",
      points: [
        "اكتسب خبرة مثبّتة",
        "احتفظ بالمعرفة لفترة أطول",
        "طبّق المهارات الجديدة على الفور",
      ],
      squareColor: "blue",
    },
    {
      title: "خدمات من الدرجة الأولى لضمان نجاح المتعلمين",
      description:
        "يقدم المراجعون تعليقات بناءة وفي الوقت المناسب على تقديمات مشاريعك، مع تسليط الضوء على مجالات التحسين وتقديم نصائح عملية لتعزيز عملك.",
      points: [
        "احصل على مساعدة من الخبراء المتخصصين",
        "تعرّف على أفضل الممارسات الصناعية",
        "اكسب رؤى قيّمة وطوّر مهاراتك",
      ],
      squareColor: "green",
    },
    {
      title: 'ابنِ الثقة عبر فهم "السبب" وراء كل ما تتعام',
      description:
        "نحن نركز على تحليل وشرح التفاصيل بعمق؛ ليس مجرد تزويدك بالأدوات، بل نساعدك على ابتكار حلول جديدة وتطوير التقنية.",
      points: [
        "عزز قدراتك العملية عبر تجارب حقيقية وتطبيق فوري للتقنيات الحديثة",
        "اكتسب خبرة متعمقة تضمن تطورك المستمر في عالم التقنية",
        "حافظ على المعرفة حية من خلال أساليب تعلم مبتكرة وسهلة التطبيق",
      ],
      squareColor: "orange",
    },
  ];

  return (
    <section className="mt-10 md:mt-20">
      <div>
        <div className="text-center mb-2">
          <span
            ref={addToRefs}
            className="inline-block px-4 md:px-20 py-2 font-medium  text-black dark:text-white border border-black dark:border-white border-opacity-20 rounded-full text-sm"
          >
            اصقل
          </span>
        </div>
        <div className="text-center mb-8 px-4">
          <h2
            ref={addToRefs}
            className="text-black text-3xl mt-4 mb-2 md:text-[48px] font-bold dark:text-white"
          >
            ايش الفرق
          </h2>
          <p ref={addToRefs} className="dark:text-gray-300 text-gray-500 pt-3 ">
            نمزج التدريب التقني للموظفين مع خبراء الصناعة والمرشدين والمشاريع
            لتعزيز التفكير النقدي ودفع الابتكار.
            <br />
            نظامنا المثبت للارتقاء بالمهارات يسعى بلا هوادة نحو النجاح.
          </p>
        </div>

        <Accordion
          type="single"
          collapsible
          className="max-w-screen-xl mx-auto px-4 md:px-8"
        >
          {features.map((feature, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="mt-10">
                <h2
                  ref={addToRefs}
                  className="text-2xl md:text-[40px] font-bold text-right text-black dark:text-white"
                >
                  {feature.title}
                </h2>
              </AccordionTrigger>
              <AccordionContent>
                <p
                  ref={addToRefs}
                  className=" leading-relaxed text-right   text-black dark:text-gray-300"
                >
                  {feature.description}
                </p>
                <ul className="list-none space-y-2 font-bold mt-4 text-right  text-black dark:text-white">
                  {feature.points.map((text, pointIndex) => (
                    <li
                      key={pointIndex}
                      ref={addToRefs}
                      className="relative pr-6 before:content-[''] before:absolute before:right-0 before:top-1/2 before:-translate-y-1/2 before:w-4 before:h-4 before:bg-transparent"
                    >
                      <SparkleIcon
                        className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 "
                        fill="green"
                      />
                      {text}
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}


