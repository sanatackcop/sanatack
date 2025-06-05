import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { GenericCardProps } from "@/utils/types";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, PlayCircle, Clock, BookOpen } from "lucide-react";

const GenericCard: React.FC<GenericCardProps> = ({
  type,
  title,
  icon,
  subtitle,
  description,
  children,
  className = "",
  progress,
  link,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (link) {
      navigate(`${link}`);
    }
  };

  return (
    <Card
      className={`
        relative bg-white dark:bg-black 
        border border-gray-200 dark:border-gray-800 
        rounded-lg shadow-sm hover:shadow-md 
        transition-shadow duration-200
        cursor-pointer min-w-[320px] min-h-[280px]
        flex flex-col
        ${className}
      `}
      onClick={handleClick}
    >
      {progress && <ProgressBar progress={progress} />}

      <CardHeader className="p-6 flex-1">
        {type && (
          <div className="inline-block px-3 py-1 bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 rounded text-xs font-medium mb-3">
            {type}
          </div>
        )}

        {subtitle && (
          <CardTitle className="text-sm text-gray-600 dark:text-gray-400 font-medium mb-2">
            {subtitle}
          </CardTitle>
        )}

        {title && (
          <div className="flex items-start gap-3 mb-3">
            {icon && (
              <div className="flex-shrink-0 w-10 h-10 bg-black dark:bg-white rounded-lg flex items-center justify-center">
                <span className="text-white dark:text-black">{icon}</span>
              </div>
            )}
            <h2 className="text-lg font-semibold text-black dark:text-white leading-tight">
              {title}
            </h2>
          </div>
        )}

        {description && (
          <CardContent className="p-0">
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed line-clamp-3">
              {description}
            </p>
          </CardContent>
        )}
      </CardHeader>

      {children && !progress && (
        <CardFooter className="p-6 pt-0 border-t border-gray-100 dark:border-gray-800">
          <div className="w-full">{children}</div>
        </CardFooter>
      )}

      {progress && (
        <div className="p-6 pt-0">
          <button
            dir="rtl"
            className="
              w-full flex items-center justify-between 
              bg-black dark:bg-white
              text-white dark:text-black
              rounded-lg px-4 py-3 
              font-medium transition-colors duration-200 
              hover:bg-gray-800 dark:hover:bg-gray-200
            "
          >
            <span className="flex items-center gap-2">
              <PlayCircle size={18} />
              استأنف التعلم
            </span>
            <ArrowLeft size={18} />
          </button>
        </div>
      )}
    </Card>
  );
};

export default GenericCard;

export function ProgressBar({ progress }: { progress: number }) {
  const pct = Math.max(0, Math.min(progress, 100));

  return (
    <div className="w-full h-12 bg-gray-100 dark:bg-gray-900 flex items-center px-4">
      <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-black dark:bg-white transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="ml-3 text-sm font-medium text-black dark:text-white">
        {pct}%
      </span>
    </div>
  );
}

export function CleanCourseTags({
  duration,
  unitesNum,
  level,
  courseType,
}: any) {
  return (
    <div className="flex flex-wrap gap-2">
      {duration && (
        <div className="inline-flex items-center gap-1 px-2 py-1 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs">
          <Clock size={12} />
          {duration} ساعات
        </div>
      )}

      {unitesNum && (
        <div className="inline-flex items-center gap-1 px-2 py-1 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs">
          <BookOpen size={12} />
          {unitesNum} وحدات
        </div>
      )}

      {level && (
        <div className="px-2 py-1 bg-black dark:bg-white text-white dark:text-black rounded text-xs font-medium">
          {level}
        </div>
      )}

      {courseType && (
        <div className="px-2 py-1 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs">
          {courseType}
        </div>
      )}
    </div>
  );
}
