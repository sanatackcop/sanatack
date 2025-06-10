import { ReactNode } from "react";

interface GenericSectionProps {
  title: string;
  description: string;
  titleClassName?: string;
  descriptionClassName?: string;
  wrapperClassName?: string;
  showDecorations?: boolean;
  extraContent?: ReactNode;
  children?: ReactNode;
}

export default function GenericSection({
  title,
  description,
  titleClassName = `
    text-3xl sm:text-4xl lg:text-5xl font-bold 
    bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700
    dark:from-slate-100 dark:via-slate-200 dark:to-slate-300
    bg-clip-text text-transparent
    leading-tight mb-4
  `,
  descriptionClassName = `
    text-lg sm:text-xl leading-relaxed 
    text-slate-600 dark:text-slate-400 max-w-3xl
  `,
  wrapperClassName = "relative px-6 py-8",
  showDecorations = false,
  extraContent,
  children,
}: GenericSectionProps) {
  return (
    <div className={wrapperClassName}>
      {showDecorations && (
        <>
          <div className="absolute top-4 right-4 w-2 h-2 bg-gray-800 rounded-full opacity-60" />
          <div className="absolute top-8 right-8 w-1 h-1 bg-zinc-900 rounded-full opacity-40" />
        </>
      )}

      <div className="max-w-4xl space-y-2">
        <h1 className={`pb-2 ${titleClassName}`}>{title}</h1>

        {children && <div className="my-6">{children}</div>}

        <p className={descriptionClassName}>{description}</p>

        {extraContent && <div className="mt-8">{extraContent}</div>}
      </div>
    </div>
  );
}
