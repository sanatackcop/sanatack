import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CourseDetails } from "@/types/courses";

export default function CourseDetailsContent({
  course,
  className = "",
}: {
  course: CourseDetails;
  className?: string;
}) {
  return (
    <div className={`${className}`}>
      <Accordion
        type="single"
        collapsible
        className="sm:space-y-4 bg-[#282D3D] text-[#949DB2] "
        dir="rtl"
      >
        {course.modules.map((module, idx) => (
          <AccordionItem
            key={module.id}
            value={module.id.toString()}
            className="border-0 overflow-hidden"
          >
            <AccordionTrigger className="px-2 py-2 md:px-6 md:py-4 hover:bg-slate-800/50 transition lg:px-8">
              <div className="flex items-center gap-4 w-full justify-between">
                <div className="flex flex-col min-w-0 pr-5">
                  <span className="truncate ml-2 font-semibold text-xs sm:text-sm md:text-md lg:text-lg mb-1">
                    {module.title}
                  </span>
                </div>

                <div className="bg-[#1E2127] w-5 h-5 sm:w-10 sm:h-10 md:w-20 md:h-20 text-white grid place-items-center md:text-2xl font-black">
                  {idx + 1}
                </div>
              </div>
            </AccordionTrigger>

            <AccordionContent className=" px-6 pb-6 pt-2 space-y-4 lg:px-8">
              <Accordion type="multiple" className="md:space-y-2">
                {module.lessons.map((lesson) => (
                  <AccordionItem
                    key={lesson.id}
                    value={lesson.id.toString()}
                    className="border-0 overflow-hidden"
                  >
                    <AccordionTrigger className="px-6 py-4 hover:bg-slate-800/50 transition">
                      <div className="flex items-center gap-4 w-full">
                        <div className="flex flex-col min-w-0 pr-5">
                          <span className="truncate ml-2 font-semibold text-xs sm:text-sm md:text-md lg:text-lg mb-1">
                            {lesson.order}. {lesson.name}
                          </span>
                        </div>
                      </div>
                    </AccordionTrigger>

                    <AccordionContent className="px-6 py-4 space-y-4">
                      {lesson.description && (
                        <p className="text-slate-400 leading-6 mb-1">
                          {lesson.description}
                        </p>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
