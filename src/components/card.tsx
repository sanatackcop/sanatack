//GenericCard component
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import React from "react";

type FooterItem = {
  icon?: React.ReactNode;
  text: string;
};

type GenericCardProps = {
  type?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  footerItems?: FooterItem[];
  className?: string;
};

const GenericCard: React.FC<GenericCardProps> = ({
  type,
  title,
  subtitle,
  description,
  footerItems = [],
  className = "",
}) => {
  return (
    <Card
      className={`bg-[#111111] text-white border-[#282D3D] rounded-xl shadow-xl flex flex-col justify-between ${className}`}
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
          <h2 className="text-xl font-bold text-white mt-1">{title}</h2>
        )}
      </CardHeader>

      {description && (
        <CardContent className="text-right px-5 mt-2">
          <p className="text-md text-gray-400 leading-relaxed mb-2">
            {description}
          </p>
        </CardContent>
      )}

      {footerItems.length > 0 && (
        <CardFooter className="flex flex-col gap-2 text-xs border-t border-white/10 px-5 pt-3 pb-4">
          <div className="flex flex-wrap justify-start items-center gap-y-2 text-sm  text-right justify-start">
            {footerItems.map((item, i) => (
              <div key={i} className="flex items-center px-2 text-gray-500  ">
                {item.icon}
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default GenericCard;
