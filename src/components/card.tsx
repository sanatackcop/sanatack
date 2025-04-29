import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { GenericCardProps } from "@/utils/types";

import { useLocation, useNavigate } from "react-router-dom";

const GenericCard: React.FC<GenericCardProps> = ({
  type,
  title,
  subtitle,
  description,
  children,
  className = "",
  id,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = () => {
    if (id) {
      navigate(`${location.pathname}/${id}`);
    }
  };

  return (
    <Card
      className={`bg-[#111111] text-white border-[#282D3D] rounded-xl shadow-xl flex flex-col justify-between ${className}`}
      onClick={handleClick}
    >
      <CardHeader className="relative pb-0">
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
          <h2 className="sm:text-xl font-bold text-white mt-1">{title}</h2>
        )}
      </CardHeader>

      {description && (
        <CardContent className="text-start px-5 mt-2">
          <p className="text-sm sm:text-md text-gray-400 leading-relaxed mb-2">
            {description}
          </p>
        </CardContent>
      )}

      <CardFooter className="flex flex-col gap-2 text-xs border-t border-white/10 px-5 pt-3 pb-4">
        {children && <div className="mt-4">{children}</div>}
      </CardFooter>
    </Card>
  );
};

export default GenericCard;
