import { getCourseTypeIcon, getLevelIcon } from "@/utils/getIcon";
import { Book, Hourglass } from "lucide-react";
import { tagsInterface, LevelEnum } from "@/types/courses";

interface TagItem {
  icon?: React.ReactNode;
  text: string | number;
}

interface TagsListProps {
  items: TagItem[];
  className?: string;
}

export default function TagsList({ items, className }: TagsListProps) {
  if (!items.length) return null;

  return (
    <div
      className={`flex sm:flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-500 ${
        className ?? ""
      }`}
    >
      {items.map((item, index) => (
        <div key={index} className="flex items-center px-2">
          {item.icon}
          <span className="ml-1">{item.text}</span>
        </div>
      ))}
    </div>
  );
}

export const CourseTags = ({
  duration,
  unitesNum,
  level,
  courseType,
  className,
}: tagsInterface) => {
  const tags: TagItem[] = [
    {
      icon: <Hourglass className="h-3 w-3 text-white-500 mx-1" />,
      text: duration || `Duration`,
    },
    {
      icon: getLevelIcon(level as LevelEnum),
      text: `${level}`,
    },
    {
      icon: <Book className="h-3 w-3 text-green-500 mx-1" />,
      text: unitesNum || `Unites`,
    },
    {
      icon: getCourseTypeIcon(`${courseType}`),
      text: courseType || `Type`,
    },
  ];

  return <TagsList items={tags} className={className} />;
};
