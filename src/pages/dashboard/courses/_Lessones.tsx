import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CheckCircle } from "lucide-react";

export default function LessonItem({
  lesson,
  materialIcon,
}: {
  lesson: {
    id: string | number;
    order: number;
    name: string;
    description?: string;
    completed?: boolean;
    materials?: {
      id: string | number;
      title: string;
      type: string;
      completed?: boolean;
    }[];
  };
  materialIcon: (type: string) => JSX.Element;
}) {
  return (
    <div className="relative ml-6 pl-4">
      <span
        aria-hidden
        className="absolute -right-8 top-0 h-full w-6 border-r-2 border-dashed border-slate-600"
      />
      <span
        aria-hidden
        className="absolute -right-8 top-4 h-4 w-6 rounded-br-lg border-b-2 border-r-2 border-dashed border-slate-600"
      />

      {/* lesson node */}
      <span
        aria-hidden
        className="absolute -right-3 top-5 h-3 w-3 rounded-full border border-slate-600 bg-slate-800"
      />

      {/* LESSON ACCORDION --------------------------------------- */}
      <Accordion type="single" collapsible>
        <AccordionItem value={`lesson-${lesson.id}`} className="border-0">
          {/* lesson trigger */}
          <AccordionTrigger className="group flex w-full items-start gap-2 rounded-md py-2 pr-2 hover:bg-white/5 sm:gap-3 sm:py-3">
            <span className="shrink-0 font-medium text-xs sm:text-sm">
              {lesson.order}.
            </span>
            <span className="truncate text-xs sm:text-sm md:text-base">
              {lesson.name}
            </span>
            {lesson.completed && (
              <CheckCircle className="ml-auto h-4 w-4 text-green-500" />
            )}
          </AccordionTrigger>

          {/* Description (optional) */}
          {lesson.description && (
            <AccordionContent>
              <p className="mt-1 text-xs leading-6 text-slate-400">
                {lesson.description}
              </p>
            </AccordionContent>
          )}

          {/* MATERIALS LIST (optional) */}
          {lesson.materials && lesson.materials.length > 0 && (
            <AccordionContent className="space-y-1 border-r-2 border-dashed border-slate-600 pr-6">
              {lesson.materials.map((mat) => (
                <div
                  key={mat.id}
                  className="flex items-center gap-2 rounded-md py-1 pr-1 hover:bg-white/5"
                >
                  {materialIcon(mat.type)}
                  <span className="truncate text-xs sm:text-sm">
                    {mat.title}
                  </span>
                  {mat.completed && (
                    <CheckCircle className="ml-auto h-3 w-3 text-green-500" />
                  )}
                </div>
              ))}
            </AccordionContent>
          )}
        </AccordionItem>
      </Accordion>
    </div>
  );
}
