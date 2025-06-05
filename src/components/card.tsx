import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { GenericCardProps } from "@/utils/types";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

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
    <>
      <Card
        className={`bg-[#eaeaea] border-gray-300  dark:bg-[#111111] dark:text-white dark:border-white/10 rounded-xl shadow-xl 
          h-80 cursor-pointer flex flex-col justify-between ${className}`}
        onClick={handleClick}
      >
        {progress && <ProgressBar progress={progress} />}

        <CardHeader className="relative pb-0 text-[#34363F] dark:text-white ">
          {type && (
            <CardDescription className="text-xs text-gray-300 mt-2">
              {type}
            </CardDescription>
          )}
          {subtitle && (
            <CardTitle className="text-sm text-blue-200 mt-2">
              {subtitle}
            </CardTitle>
          )}
          {title && (
            <>
              <h2 className="sm:text-xl font-bold mt-1 text-[#34363F] dark:text-white flex items-center gap-2">
                {icon && <span>{icon}</span>}
                {title}
              </h2>
            </>
          )}
          {description && (
            <CardContent className="text-start mt-2">
              <p className="text-sm sm:text-md text-[#565863] leading-relaxed mb-2">
                {description}
              </p>
            </CardContent>
          )}
        </CardHeader>

        {children && !progress && (
          <CardFooter className=" flex flex-col items-start gap-2 border-t border-white/10 p-5 text-xs">
            {children && <div>{children}</div>}
          </CardFooter>
        )}

        {progress && (
          <div
            dir="rtl"
            className="flex w-full items-center justify-between rounded-lg bg-indigo-600 px-4 py-4 text-lg font-bold text-white transition-colors hover:bg-indigo-700"
          >
            <span>استأنف</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white ">
              <ArrowLeft className="h-4 w-4 text-indigo-600" />
            </span>
          </div>
        )}
      </Card>
    </>
  );
};

export default GenericCard;

export function ProgressBar({ progress }: { progress: number }) {
  const pct = Math.max(0, Math.min(progress, 100));

  return (
    <div
      dir="rtl"
      className="w-full h-14 bg-[#999999] dark:bg-neutral-700 rounded-lg overflow-hidden"
    >
      <div
        className="h-full bg-emerald-500 flex items-center justify-center transition-all duration-300 ease-in-out"
        style={{ width: `${pct}%` }}
      >
        <span className="text-[#34363F] dark:text-white text-lg font-bold">
          {pct}%
        </span>
      </div>
    </div>
  );
}
