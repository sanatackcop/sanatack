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
      <Accordion type="single" collapsible className="space-y-4" dir="rtl">
        {course.modules.map((module, idx) => (
          <AccordionItem
            key={module.id}
            value={module.id.toString()}
            className="border border-slate-700/40 overflow-hidden bg-[#282D3D] "
          >
            <AccordionTrigger className="px-6 py-4 hover:bg-slate-800/50 transition lg:px-8">
              <div className="flex items-center gap-4 w-full justify-between">
                <div className="flex flex-col min-w-0 pr-5">
                  <span className="truncate ml-2 font-semibold text-2xl mb-1">
                    {module.title}
                  </span>
                </div>

                <div className="bg-[#1E2127] text-white w-20 h-20 rounded-md grid place-items-center text-2xl font-black">
                  {idx + 1}
                </div>
              </div>
            </AccordionTrigger>

            <AccordionContent className="px-6 pb-6 pt-2 space-y-4 lg:px-8">
              <ul className="space-y-4">
                {module.lessons.map((lesson) => (
                  <li
                    key={lesson.id}
                    className="bg-slate-800/50 rounded-xl p-4 hover:bg-slate-800/70 transition flex items-start gap-4"
                  >
                    {/* <div className="mt-1 shrink-0">
                      {lesson.isLocked ? (
                        <Lock size={18} className="text-slate-500" />
                      ) : lesson.isCompleted ? (
                        <Check size={18} className="text-emerald-400" />
                      ) : (
                        <Play size={18} className="text-sky-400" />
                      )}
                    </div> */}

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold mb-1 text-white truncate">
                        {lesson.order}. {lesson.name}
                      </h3>

                      {lesson.description && (
                        <p className="text-slate-400 text-sm leading-6 mb-1 line-clamp-2">
                          {lesson.description}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
