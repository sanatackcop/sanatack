import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Book, Triangle, Hourglass } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CourseInterface } from "@/types/courses";

export default function CoursesCard() {
  const coursesCard: CourseInterface[] = Array.from({ length: 6 }, (_, i) => ({
    englishTitle: "",
    arabicTitle: `مسار مهنة مطور الواجهة الأمامية Frontend ${i + 1}`,
    description:
      "أطلق حياتك المهنية كمطور للواجهات الأمامية مع هذا المسار الشامل. ستتعلم أحدث الممارسات الأفضل لتطوير الويب الحديث، وستبرز من بين المرشحين الآخرين...",
    unitesNum: 70 + i,
    hardLevel: "مبتدئ",
    durition: `${100 + i * 10} ساعة`,
    courseType: "Frontend",
  }));

  return (
    <div className="px-4 md:px-8">
      <div className="mb-6 w-3/4 text-center">
        <h1 className="text-3xl font-bold flex justify-normal mt-2">الدورات</h1>
        <p className="text-lg text-gray-500 text-right mt-2">
          حسّن مهاراتك في هندسه البرمجيات و بيانات باستخدام مجموعة متنوعة من
          اللغات والأطر، بما في ذلك HTML، CSS، JavaScript، React، TypeScript،
          وطرق الذكاء الاصطناعي المتقدمة.
        </p>
      </div>
      <Tabs defaultValue="all" dir="rtl" className="w-full">
        <TabsList className="!bg-[#0C0C0C]  text-right mb-4">
          <TabsTrigger value="all">
            تصفح{" "}
            <Badge
              variant="secondary"
              className="flex h-5 w-5 items-center justify-center rounded-full "
            >
              3
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="started">
            بدأت{" "}
            <Badge
              variant="secondary"
              className="flex h-5 w-5 items-center justify-center rounded-full "
            >
              0
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="done">
            اكتملت{" "}
            <Badge
              variant="secondary"
              className="flex h-5 w-5 items-center justify-center rounded-full "
            >
              0
            </Badge>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <div dir="rtl" className="grid grid-cols-3 gap-6 ">
            {coursesCard.map((feature, index) => (
              <Card
                key={index}
                className={`bg-[#111111]  text-white border-white/20 rounded-xl shadow-xl flex flex-col justify-between ${
                  index === 0 ? "col-span-2" : ""
                }`}
              >
                <CardHeader className="relative pb-0">
                  <CardDescription className="text-xs text-gray-300 mt-2">
                    {feature.courseType}
                  </CardDescription>
                  <CardTitle className="text-sm text-blue-200 mt-2">
                    {feature.englishTitle}
                  </CardTitle>
                  <h2 className="text-xl font-bold text-white mt-1 ">
                    {feature.arabicTitle}
                  </h2>
                </CardHeader>

                <CardContent className="text-right px-5 mt-2">
                  <p className="text-xs text-gray-400 leading-relaxed mb-3">
                    {feature.description}
                  </p>
                </CardContent>

                <CardFooter className="flex flex-col gap-2 text-xs border-t border-white/10 px-5 pt-3 pb-4">
                  <div className="flex flex-wrap justify-between items-center gap-y-2 text-sm">
                    <div className="flex items-center gap-1">
                      <Book className="h-4 w-4 text-white" />
                      <span>وحده {feature.unitesNum}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Triangle className="h-4 w-4 text-red-500" />
                      <span>{feature.hardLevel}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Hourglass className="h-4 w-4 text-white" />
                      <span>{feature.durition}</span>
                    </div>
                    {/* {feature.tag.map((tag, i) => (
                      <div key={i} className="flex items-center gap-1">
                        {tag.icon}
                        <span>{tag.title}</span>
                      </div>
                    ))} */}
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
