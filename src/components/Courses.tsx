import { CardContent } from "@/components/ui/card";
import {
  BarChart,
  Book,
  Triangle,
  Hourglass,
  AlignVerticalDistributeCenter,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import SpotlightCard from "./blocks/Components/SpotlightCard/SpotlightCard";

export default function CoursesCard() {
  const coursesCard = [
    {
      cardType: "مسار المهارات",
      heroImage: <BarChart className="h-12 w-12 mt-5 text-black" />,
      englishTitle: "Parallel Programming",
      arabicTitle: "البرمجة المتوازية",
      unites: "20",
      description:
        "لتحليل البيانات والأدوات الشائعة المستخدمة في هذا المجال. سيتعرف المتدربون على كيفية جمع البيانات وتنظيفها ومعالجتها بطرق منهجية، بالإضافة إلى استكشاف مختلف أساليب التحليل الإحصائي واستخدام البرمجيات المساعدة مثل بايثون أو آر (R).",
      level: { hard: "صعب" },
      durition: "3 شهور",
      tag: [
        {
          title: "Analysis",
          icon: (
            <AlignVerticalDistributeCenter className="h-4 w-4 text-blue-700" />
          ),
        },
      ],
    },
    {
      cardType: "مسار المهارات",
      heroImage: <BarChart className="h-12 w-12 mt-5 text-black" />,
      englishTitle: "Parallel Programming",
      arabicTitle: "البرمجة المتوازية",
      unites: "20",
      description:
        "لتحليل البيانات والأدوات الشائعة المستخدمة في هذا المجال. سيتعرف المتدربون على كيفية جمع البيانات وتنظيفها ومعالجتها بطرق منهجية، بالإضافة إلى استكشاف مختلف أساليب التحليل الإحصائي واستخدام البرمجيات المساعدة مثل بايثون أو آر (R).",
      level: { hard: "صعب" },
      durition: "3 شهور",
      tag: [
        {
          title: "Analysis",
          icon: (
            <AlignVerticalDistributeCenter className="h-4 w-4 text-blue-700" />
          ),
        },
      ],
    },
    {
      cardType: "مسار المهارات",
      heroImage: <BarChart className="h-12 w-12 mt-5 text-black" />,
      englishTitle: "Parallel Programming",
      arabicTitle: "البرمجة المتوازية",
      unites: "20",
      description:
        "لتحليل البيانات والأدوات الشائعة المستخدمة في هذا المجال. سيتعرف المتدربون على كيفية جمع البيانات وتنظيفها ومعالجتها بطرق منهجية، بالإضافة إلى استكشاف مختلف أساليب التحليل الإحصائي واستخدام البرمجيات المساعدة مثل بايثون أو آر (R).",
      level: { hard: "صعب" },
      durition: "3 شهور",
      tag: [
        {
          title: "Analysis",
          icon: (
            <AlignVerticalDistributeCenter className="h-4 w-4 text-blue-700" />
          ),
        },
      ],
    },
    {
      cardType: "مسار المهارات",
      heroImage: <BarChart className="h-12 w-12 mt-5 text-black" />,
      englishTitle: "Parallel Programming",
      arabicTitle: "البرمجة المتوازية",
      unites: "20",
      description:
        "لتحليل البيانات والأدوات الشائعة المستخدمة في هذا المجال. سيتعرف المتدربون على كيفية جمع البيانات وتنظيفها ومعالجتها بطرق منهجية، بالإضافة إلى استكشاف مختلف أساليب التحليل الإحصائي واستخدام البرمجيات المساعدة مثل بايثون أو آر (R).",
      level: { hard: "صعب" },
      durition: "3 شهور",
      tag: [
        {
          title: "Analysis",
          icon: (
            <AlignVerticalDistributeCenter className="h-4 w-4 text-blue-700" />
          ),
        },
      ],
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4 md:px-8">
      {coursesCard.map((feature, index) => (
        <SpotlightCard
          key={index}
          className="max-w-md w-full !border !border-white   
          mx-auto overflow-hidden rounded-none border-none cursor-pointer
           !p-0 bg-[#FAFFFD] bg-opacity-5"
        >
          <div className="bg-teal-800 border rounded-md rounded-bl-none rounded-br-none border-white border-opacity-20 text-white text-center py-2 font-semibold text-lg">
            {feature.cardType}
          </div>
          <CardContent className="p-4 md:p-6 text-center bg-white rounded-bl-md rounded-br-md ">
            <div className="flex justify-center mb-5">{feature.heroImage}</div>
          </CardContent>
          <div className="px-4 py-6">
            <h2 className="text-xl md:text-2xl font-bold  mb-2 text-right text-black dark:text-white ">
              {feature.arabicTitle}
              <br />
              <span className="text-xl md:text-2xl font-bold  text-black dark:text-white">
                {feature.englishTitle}
              </span>
            </h2>
            <p className="text-gray-800 dark:text-gray-300/80  text-opacity-50 text-xs md:text-sm leading-relaxed mb-4 text-right ">
              {feature.description}
            </p>
          </div>

          <div className="mt-3">
            <Separator />
            <div className="flex flex-col sm:flex-row justify-between items-center p-3 gap-2">
              <div className="flex items-center gap-2">
                <Book className="h-4 w-4 text-black dark:text-white" />
                <p className="text-xs md:text-sm text-black dark:text-white">وحده {feature.unites}</p>
              </div>
            </div>

            <Separator />
            <div className="flex flex-col sm:flex-row justify-start items-center p-3 gap-2">
              <div className="flex items-center gap-1">
                <Triangle className="h-4 w-4 text-red-600" />
                <p className="text-xs md:text-sm text-black dark:text-white">{feature.level.hard}</p>
              </div>

              <div className="flex items-center gap-1">
                <Hourglass className="h-4 w-4 text-black dark:text-white" />
                <p className="text-xs md:text-sm text-black dark:text-white ">{feature.durition}</p>
              </div>

              {feature.tag.map((tag, i) => (
                <span
                  key={i}
                  className="flex items-center gap-1 px-1 py-1 pt-2 text-xs md:text-sm text-black dark:text-white"
                >
                  {tag.icon}
                  {tag.title}
                </span>
              ))}
            </div>
          </div>
        </SpotlightCard>
      ))}
    </div>



  );
}
