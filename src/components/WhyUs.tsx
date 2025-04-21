import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { SparkleIcon } from "lucide-react";

import imgBlack from "@/assets/Rectangle Black.png";
import imgGreen from "@/assets/Rectangle green.png";
import imgBrown from "@/assets/Rectangle brown.png";

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
      image: imgBlack,
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
      image: imgGreen,
    },
    {
      title: 'ابنِ الثقة عبر فهم "السبب" وراء كل ما تتعلمه',
      description:
        "نحن نركز على تحليل وشرح التفاصيل بعمق؛ ليس مجرد تزويدك بالأدوات، بل نساعدك على ابتكار حلول جديدة وتطوير التقنية.",
      points: [
        "عزز قدراتك العملية عبر تجارب حقيقية وتطبيق فوري للتقنيات الحديثة",
        "اكتسب خبرة متعمقة تضمن تطورك المستمر في عالم التقنية",
        "حافظ على المعرفة حية من خلال أساليب تعلم مبتكرة وسهلة التطبيق",
      ],
      image: imgBrown,
    },
  ];

  return (
    <section className="mt-10 md:mt-20 dark:bg-black">
      
    {/* العنوان الصغير */}
    <div className="text-center mb-2">
      <span
        ref={addToRefs}
        className="inline-block px-4 md:px-20 py-2 font-medium text-black dark:text-white 
        border border-black/20 dark:border-white/20 rounded-full text-sm transition-colors duration-300"
      >
        اصقل
      </span>
    </div>

        {/* العنوان الرئيسي + الوصف */}
        <div className="text-center mb-8 px-4">
      <h2
        ref={addToRefs}
        className="text-3xl mt-4 mb-2 md:text-[48px] font-bold text-black dark:text-white transition-colors"
      >
        ايش الفرق
      </h2>
      <p
        ref={addToRefs}
        className="text-gray-700 dark:text-gray-300 pt-3 leading-relaxed transition-colors"
      >
        نمزج التدريب التقني للموظفين مع خبراء الصناعة والمرشدين والمشاريع
        لتعزيز التفكير النقدي ودفع الابتكار.
        <br />
        نظامنا المثبت للارتقاء بالمهارات يسعى بلا هوادة نحو النجاح.
      </p>
    </div>

      <div className="max-w-screen-xl mx-auto px-4 md:px-8 space-y-16">
        {features.map((feature, index) => (
          <div
            key={index}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start"
          >
            

            {/* Right content */}
            <div className="space-y-4 text-right">
              <h3
                ref={addToRefs}
                className="text-xl md:text-2xl font-bold text-black dark:text-white"
              >
                {feature.title}
              </h3>
              <p
                ref={addToRefs}
                className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed"
              >
                {feature.description}
              </p>
              <ul className="list-none space-y-2 font-bold mt-3">
                {feature.points.map((point, i) => (
                  <li
                    key={i}
                    ref={addToRefs}
                    className="relative pr-6 text-black dark:text-white"
                  >
                    <SparkleIcon
                      className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4"
                      fill="green"
                    />
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            {/* Left image */}
            <div className="flex justify-center md:justify-end">
  <img
    src={feature.image}
    alt={`Shape for ${feature.title}`}
    className="w-64 h-64 md:w-80 md:h-80 object-contain"
  />
</div>

            
          </div>
        ))}
      </div>
    </section>
  );

  
}
//     <section className="mt-10 md:mt-20">
//   <div>
//     {/* العنوان الصغير */}
//     <div className="text-center mb-2">
//       <span
//         ref={addToRefs}
//         className="inline-block px-4 md:px-20 py-2 font-medium text-black dark:text-white 
//         border border-black/20 dark:border-white/20 rounded-full text-sm transition-colors duration-300"
//       >
//         اصقل
//       </span>
//     </div>

    // {/* العنوان الرئيسي + الوصف */}
    // <div className="text-center mb-8 px-4">
    //   <h2
    //     ref={addToRefs}
    //     className="text-3xl mt-4 mb-2 md:text-[48px] font-bold text-black dark:text-white transition-colors"
    //   >
    //     ايش الفرق
    //   </h2>
    //   <p
    //     ref={addToRefs}
    //     className="text-gray-700 dark:text-gray-300 pt-3 leading-relaxed transition-colors"
    //   >
    //     نمزج التدريب التقني للموظفين مع خبراء الصناعة والمرشدين والمشاريع
    //     لتعزيز التفكير النقدي ودفع الابتكار.
    //     <br />
    //     نظامنا المثبت للارتقاء بالمهارات يسعى بلا هوادة نحو النجاح.
    //   </p>
    // </div>

//     {/* الأكورديون */}
//     <Accordion
//       type="single"
//       collapsible
//       className="max-w-screen-xl mx-auto px-4 md:px-8"
//     >
//       {features.map((feature, index) => (
//         <AccordionItem key={index} value={`item-${index}`}>
//           <AccordionTrigger className="mt-10">
//             <h2
//               ref={addToRefs}
//               className="text-2xl md:text-[40px] font-bold text-right text-black dark:text-white transition-colors"
//             >
//               {feature.title}
//             </h2>
//           </AccordionTrigger>
//           <AccordionContent>
//             <p
//               ref={addToRefs}
//               className="text-gray-700 dark:text-gray-300 leading-relaxed text-right transition-colors"
//             >
//               {feature.description}
//             </p>
//             <ul className="list-none space-y-2 font-bold mt-4 text-right">
//               {feature.points.map((text, pointIndex) => (
//                 <li
//                   key={pointIndex}
//                   ref={addToRefs}
//                   className="relative pr-6 text-black dark:text-white transition-colors
//                   before:content-[''] before:absolute before:right-0 before:top-1/2 
//                   before:-translate-y-1/2 before:w-4 before:h-4 before:bg-transparent"
//                 >
//                   <SparkleIcon
//                     className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4"
//                     fill="green"
//                   />
//                   {text}
//                 </li>
//               ))}
//             </ul>
//           </AccordionContent>
//         </AccordionItem>
//       ))}
//     </Accordion>
//   </div>
// </section>


{/* <div className="max-w-screen-xl mx-auto px-4 md:px-8 space-y-12 mt-10">
  {features.map((feature, index) => (
    <div key={index} className="flex items-start justify-end gap-6 md:gap-10">
    
      <div className="w-20 h-32 shrink-0 rounded-br-full bg-current " style={{
        backgroundColor:
          feature.squareColor === "blue"
            ? "#031C33"
            : feature.squareColor === "green"
            ? "#0C5B2B"
            : feature.squareColor === "orange"
            ? "#6D3903"
            : "gray",
      }}></div>

      <div className="flex-1 text-right">
        <h3
          ref={addToRefs}
          className="text-xl md:text-2xl font-bold text-black dark:text-white mb-2"
        >
          {feature.title}
        </h3>
        <p
          ref={addToRefs}
          className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed"
        >
          {feature.description}
        </p>
        <ul className="list-none space-y-1 font-bold mt-3">
          {feature.points.map((point, i) => (
            <li
              key={i}
              ref={addToRefs}
              className="relative pr-6 text-black dark:text-white"
            >
              <SparkleIcon
                className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4"
                fill="green"
              />
              {point}
            </li>
          ))}
        </ul>
      </div>
    </div>
  ))}
</div> */}
