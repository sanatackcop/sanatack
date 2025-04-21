import { SparkleIcon } from "lucide-react";
import SpotlightCard from "./blocks/Components/SpotlightCard/SpotlightCard";

export default function ProgramsSection() {
  const programs = [
    {
      title: "برنامج المايكرو بشري",
      icon: <SparkleIcon fill="#FCCE0D" />,
      description:
        "تعمّق في المجالات المتخصصة مع برامج نانوديجري الخاصة بنا، المصمّمة بدقة لتزويدك بتجربة عملية ومهارات ذات صلة بالصناعة وشهادات معتمدة.",
    },
    {
      title: "برنامج المايكرو بشري",
      icon: <SparkleIcon fill="#FCCE0D" />,
      description:
        "تعمّق في المجالات المتخصصة مع برامج نانوديجري الخاصة بنا، المصمّمة بدقة لتزويدك بتجربة عملية ومهارات ذات صلة بالصناعة وشهادات معتمدة.",
    },
    {
      title: "برنامج المايكرو بشري",
      icon: <SparkleIcon fill="#FCCE0D" />,
      description:
        "تعمّق في المجالات المتخصصة مع برامج نانوديجري الخاصة بنا، المصمّمة بدقة لتزويدك بتجربة عملية ومهارات ذات صلة بالصناعة وشهادات معتمدة.",
    },
    {
      title: "برنامج المايكرو بشري",
      icon: <SparkleIcon fill="#FCCE0D" />,
      description:
        "تعمّق في المجالات المتخصصة مع برامج نانوديجري الخاصة بنا، المصمّمة بدقة لتزويدك بتجربة عملية ومهارات ذات صلة بالصناعة وشهادات معتمدة.",
    },
    {
      title: "برنامج المايكرو دفتري",
      icon: <SparkleIcon fill="#FCCE0D" />,
      description:
        "تعمّق في المجالات المتخصصة مع برامج نانوديجري الخاصة بنا، المصمّمة بدقة لتزويدك بتجربة عملية ومهارات ذات صلة بالصناعة وشهادات معتمدة.",
    },
    {
      title: "برنامج المايكرو دفتري",
      icon: <SparkleIcon fill="#FCCE0D" />,
      description:
        "تعمّق في المجالات المتخصصة مع برامج نانوديجري الخاصة بنا، المصمّمة بدقة لتزويدك بتجربة عملية ومهارات ذات صلة بالصناعة وشهادات معتمدة.",
    },
    {
      title: "برنامج المايكرو دفتري",
      icon: <SparkleIcon fill="#FCCE0D" />,
      description:
        "تعمّق في المجالات المتخصصة مع برامج نانوديجري الخاصة بنا، المصمّمة بدقة لتزويدك بتجربة عملية ومهارات ذات صلة بالصناعة وشهادات معتمدة.",
    },
    {
      title: "برنامج المايكرو دفتري",
      icon: <SparkleIcon fill="#FCCE0D" />,
      description:
        "تعمّق في المجالات المتخصصة مع برامج نانوديجري الخاصة بنا، المصمّمة بدقة لتزويدك بتجربة عملية ومهارات ذات صلة بالصناعة وشهادات معتمدة.",
    },
  ];

  return (
    <div className="bg-[#111111] border border-white border-opacity-20
     rounded-[70px] px-12 py-12 w-full max-w-screen-xl mx-auto">
      <div className="text-center mb-2">
        <span
          className="inline-block px-4 py-2 font-medium text-white 
            border border-white border-opacity-20 rounded-full text-sm"
        >
          طور
        </span>
      </div>

      <div className="text-center mb-8">
        <h2 className="text-white text-3xl md:text-[48px] font-bold">
          مع صنعتك يمكنك الوصول
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-6">
        {programs.map((program, i) => (
          <SpotlightCard
            key={i}
            className="!bg-black rounded-xl p-3 text-white shadow-sm border py-6 transform transition-transform duration-300 hover:scale-105 hover:border-opacity-50"
            spotlightColor="rgba(128, 128, 128, 0.3)"
          >
            <div className="flex items-center gap-2 font-bold text-xl mb-2">
              {program.icon}
              <span>{program.title}</span>
            </div>
            <p className="text-[#AAAAAA] text-opacity-70 leading-relaxed text-sm text-right pr-4">
              {program.description}
            </p>
          </SpotlightCard>
        ))}
      </div>
    </div>
  );
}
