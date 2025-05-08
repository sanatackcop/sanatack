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
    if (!lesson.materials || lesson.materials.length === 0) return null;

    return (
      <ul>
        {lesson.materials.map((material, index) => {
          const isLast = index === lesson.materials.length - 1;
          let title = "";
          let url = "";

          if (material.type === "video" && material.video) {
            url = material.video.youtubeId || "";
            title = material.video.title || title;
          } else if (material.type === "resource" && material.resource) {
            url = material.resource.url || "";
            title = material.resource.title || title;
          } else if (material.type === "quiz" && material.quiz) {
            title = "Quiz";
          }

          return (
            <li
              key={`${material.type}-${material.order}`}
              className="group relative w-fit py-1"
            >
              <a href={url} target="_blank" rel="noopener noreferrer">
                {getLessonResourceIcon(material.type)}
                {title}
                {!isLast && (
                  <div className="absolute right-5 sm:right-7 top-8 sm:top-10 h-full w-px bg-gray-700 transition-all duration-300" />
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
              <div className="group relative w-fit cursor-pointer">
                <span>{lesson.name}</span>
                {lesson.description && (
                  <span className="absolute right-full top-1/2 -translate-y-1/2 mr-2 bg-white text-xs text-muted-foreground p-2 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-10 w-52 text-right">
                    {lesson.description}
                  </span>
                )}
              </div>
            )}
            renderContent={(lesson) => {
              const content = renderResources(lesson);
              if (!content) return null;

              return <div className="space-y-4 mr-2 sm:mr-4">{content}</div>;
            }}
          />
        )}
      />
    </div>
  );
}
