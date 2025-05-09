import { ReactNode } from "react";

interface GenericSectionProps {
  title: string;
  description: string;
  titleClassName?: string;
  descriptionClassName?: string;
  children?: ReactNode;
}

export default function GenericSection({
  title,
  description,
  titleClassName = "text-lg sm:text-3xl font-bold flex justify-normal mt-2 mr-4 text-[#34363F] dark:text-white ",
  descriptionClassName = "sm:text-lg text-gray-500 text-right mt-2 mr-4",
  children,
}: GenericSectionProps) {
  return (
    <div className="mb-6 w-3/4">
      <h1 className={titleClassName}>{title}</h1>
      {children && <div className="mt-4">{children}</div>}
      <p className={descriptionClassName}>{description}</p>
    </div>
  );
}
