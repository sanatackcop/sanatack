import { FileText, Play, Files, Code, Server } from "lucide-react";
import { JSX } from "react";

interface CareerIconProps {
  title: string;
  size?: number;
  className?: string;
}

export const CareerIcon: React.FC<CareerIconProps> = ({
  title,
  size = 18,
  className = "text-white-400",
}) => {
  const iconsMap: Record<string, JSX.Element> = {
    "Frontend Developer": <Code size={size} className={className} />,
    "Backend Developer": <Server size={size} className={className} />,
  };

  return iconsMap[title] || <Code size={size} className={className} />;
};

const lessonResourceIcons: Record<string, { icon: JSX.Element; bg: string }> = {
  video: {
    icon: (
      <Play
        style={{ fill: "white" }}
        className="h-3 w-3 sm:h-5 sm:w-5 text-white"
      />
    ),
    bg: "bg-[#05192D]",
  },
  resource: {
    icon: <FileText className="h-3 w-3 sm:h-5 sm:w-5 text-white" />,
    bg: "bg-[#05192D]",
  },
  quiz: {
    icon: <Files className="h-3 w-3 sm:h-5 sm:w-5 text-white" />,
    bg: "bg-[#05192D]",
  },
};

export const getLessonResourceIcon = (type: string) => {
  const data = lessonResourceIcons[type.toLowerCase()];
  return (
    <div
      className={`inline-flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 mx-2 rounded-full ${
        data?.bg || "bg-[#05192D]"
      }`}
    >
      {data?.icon || <FileText className="h-3 w-3 sm:h-5 sm:w-5 text-white" />}
    </div>
  );
};
