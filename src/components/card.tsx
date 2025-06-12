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
        group relative overflow-hidden
        bg-gradient-to-br from-slate-50 to-slate-100 
        dark:from-slate-900 dark:to-slate-800
        border border-slate-200/50 dark:border-slate-700/50
        rounded-xl shadow-sm hover:shadow-lg
        transition-all duration-300 ease-out
        hover:-translate-y-1
        cursor-pointer min-w-[320px] min-h-[280px]
        flex flex-col backdrop-blur-sm
        ${className}
      `}
      onClick={handleClick}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-slate-100/20 dark:to-slate-800/30 pointer-events-none" />

      {progress && <ProgressBar progress={progress} />}

      <CardHeader className="relative p-6 flex-1 z-10">
        {type && (
          <div className="inline-flex items-center px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-medium mb-4 border border-slate-200/50 dark:border-slate-700/50">
            {type}
          </div>
        )}

        {subtitle && (
          <CardTitle className="text-sm text-slate-600 dark:text-slate-400 font-medium mb-3">
            {subtitle}
          </CardTitle>
        )}

        {title && (
          <div className="flex items-start gap-4 mb-4">
            {icon && (
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-slate-700 to-slate-900 dark:from-slate-200 dark:to-slate-50 rounded-xl flex items-center justify-center shadow-sm">
                <span className="text-white dark:text-slate-900 text-lg">
                  {icon}
                </span>
              </div>
            )}
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 leading-tight">
              {title}
            </h2>
          </div>
        )}

        {description && (
          <CardContent className="p-0">
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed line-clamp-3">
              {description}
            </p>
          </CardContent>
        )}
      </CardHeader>

      {children && !progress && (
        <CardFooter className="relative p-6 pt-0 border-t border-slate-200/50 dark:border-slate-700/50 z-10">
          <div className="w-full">{children}</div>
        </CardFooter>
      )}

      {progress && (
        <div className="relative p-6 pt-0 z-10">
          <button
            dir="rtl"
            className="
              w-full flex items-center justify-between 
              bg-gradient-to-r from-slate-800 to-slate-900
              dark:from-slate-100 dark:to-slate-200
              text-white dark:text-slate-900
              rounded-xl px-5 py-3.5 
              font-medium transition-all duration-200 
              hover:from-slate-700 hover:to-slate-800
              dark:hover:from-slate-50 dark:hover:to-slate-150
              shadow-sm hover:shadow-md
              border border-slate-700/20 dark:border-slate-300/20
            "
          >
            <span className="flex items-center gap-2.5">
              <PlayCircle size={20} />
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
    <div className="w-full h-14 bg-slate-100/80 dark:bg-slate-800/80 flex items-center px-6 border-b border-slate-200/30 dark:border-slate-700/30">
      <div className="flex-1 h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden shadow-inner">
        <div
          className="h-full bg-gradient-to-r from-slate-600 to-slate-800 dark:from-slate-300 dark:to-slate-100 transition-all duration-500 ease-out rounded-full"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="ml-4 text-sm font-semibold text-slate-800 dark:text-slate-200 min-w-[3rem] text-right">
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
    <div className="flex flex-wrap gap-2.5">
      {duration && (
        <div className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700/50 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-medium transition-colors hover:bg-slate-200 dark:hover:bg-slate-700">
          <Clock size={14} />
          {duration} ساعات
        </div>
      )}

      {unitesNum && (
        <div className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700/50 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-medium transition-colors hover:bg-slate-200 dark:hover:bg-slate-700">
          <BookOpen size={14} />
          {unitesNum} وحدات
        </div>
      )}

      {level && (
        <div className="px-3 py-2 bg-gradient-to-r from-slate-700 to-slate-800 dark:from-slate-200 dark:to-slate-100 text-white dark:text-slate-900 rounded-lg text-xs font-semibold shadow-sm">
          {level}
        </div>
      )}

      {courseType && (
        <div className="px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-700/50 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-medium transition-colors hover:bg-slate-100 dark:hover:bg-slate-800">
          {courseType}
        </div>
      )}
    </div>
  );
}
