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
  titleClassName = "text-3xl font-bold flex justify-normal mt-2",
  descriptionClassName = "text-lg text-gray-500 text-right mt-2",
  children,
}: GenericSectionProps) {
  return (
    <div className="mb-6 w-3/4 text-center">
      <h1 className={titleClassName}>{title}</h1>
      <p className={descriptionClassName}>{description}</p>
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}
