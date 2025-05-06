import TimeLine from "@/components/timeLine";
import { CourseDetails, LessonDetailsDto } from "@/types/courses";
import { getLessonResourceIcon } from "@/utils/getIcon";

export default function CourseDetailsContent({
  course,
  className = "",
}: {
  course: CourseDetails;
  className?: string;
}) {
  const renderResources = (lesson: LessonDetailsDto) => {
    const allResources = [
      ...(lesson.resources || []).map((r: any) => ({ ...r, type: "resource" })),
      ...(lesson.videos || []).map((r: any) => ({ ...r, type: "video" })),
      ...(lesson.quizzes || []).map((r: any) => ({ ...r, type: "quiz" })),
    ];

    return (
      <ul>
        {allResources.map((res, index) => {
          const isLast = index === allResources.length - 1;
          const title = res.type === "quiz" ? "Quiz" : res.title;
          return (
            <li
              key={`${res.type}-${res.id}`}
              className="group relative w-fit py-1"
            >
              <a href={res.url} target="_blank" rel="noopener noreferrer">
                {getLessonResourceIcon(res.type)}
                {res.title || title}
                {!isLast && (
                  <div className="absolute right-5 sm:right-7 top-8 sm:top-10 h-full w-px bg-white/30 transition-all duration-300" />
                )}
              </a>
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <div className={className}>
      <TimeLine
        data={course.modules}
        getId={(module) => module.id.toString()}
        getTitle={(module) => module.title}
        renderContent={(module) => (
          <TimeLine
            data={module.lessons}
            className="mr-2"
            getId={(lesson) => lesson.id.toString()}
            getTitle={(lesson) => (
              <div className="group relative w-fit">
                <span>{lesson.name}</span>
                {lesson.description && (
                  <span className="absolute right-full top-1/2 -translate-y-1/2 mr-2 bg-white text-xs text-muted-foreground p-2 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-10 w-52 text-right">
                    {lesson.description}
                  </span>
                )}
              </div>
            )}
            renderContent={(lesson) => (
              <div className="space-y-4 mr-2 sm:mr-4">
                {renderResources(lesson)}
              </div>
            )}
          />
        )}
      />
    </div>
  );
}
