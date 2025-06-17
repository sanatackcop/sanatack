import TimeLine from "@/components/timeLine";
import { RoadMapInterface, LessonDetails } from "@/types/courses";
import { getLessonResourceIcon } from "@/utils/getIcon";

export default function RoadMapContent({
  RoadMap,
  className = "",
}: {
  RoadMap: RoadMapInterface;
  className?: string;
}) {
  const renderResources = (lesson: LessonDetails) => {
    if (!lesson.materials || lesson.materials.length === 0) return null;

    return (
      <ul>
        {lesson.materials.map((material, index) => {
          const isLast = index === lesson.materials.length - 1;
          let title = "";

          if (material.type === "video" && material.video) {
            title = material.video.title || "video";
          } else if (material.type === "resource" && material.resource) {
            title = material.resource.title || "resource";
          } else if (material.type === "quiz" && material.quiz) {
            title = "quiz";
          }

          return (
            <li
              key={`${material.type}-${material.order}`}
              className="group relative w-fit py-1 text-sm flex items-center gap-1 mr-[0.2rem]"
            >
              {getLessonResourceIcon(material.type)}
              {title}
              {!isLast && (
                <div className="absolute right-5 sm:right-6 top-7 sm:top-9 h-full w-px bg-gray-500 transition-all duration-300" />
              )}
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <div className={className}>
      <TimeLine
        data={RoadMap.courses}
        getId={(course) => course.id.toString()}
        getTitle={(course) => course.title}
        renderContent={(course) => (
          <TimeLine
            data={course.modules}
            getId={(module) => module.id.toString()}
            getTitle={(module) => module.title}
            className="mr-2"
            renderContent={(module) => (
              <TimeLine
                data={module.lessons}
                getId={(lesson) => lesson.id.toString()}
                className="mr-2"
                getTitle={(lesson) => (
                  <div className="group relative w-fit cursor-pointer">
                    <span>{lesson.name}</span>
                    {lesson.description && (
                      <span className="absolute right-full top-1/2 -translate-y-1/2 mr-2 bg-white text-xs text-muted-foreground p-2 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 w-52 text-right">
                        {lesson.description}
                      </span>
                    )}
                  </div>
                )}
                renderContent={(lesson) => {
                  const content = renderResources(lesson);
                  if (!content) return null;
                  return <div className="space-y-2">{content}</div>;
                }}
              />
            )}
          />
        )}
      />
    </div>
  );
}
