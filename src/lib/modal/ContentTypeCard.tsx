export default function ContentTypeCard({
  title,
  subtitle,
  onClick,
  Icon,
  isRTL,
}: {
  title: string;
  subtitle: string;
  onClick: () => void;
  Icon: any;
  isRTL: boolean;
}) {
  return (
    <div
      onClick={onClick}
      tabIndex={0}
      role="button"
      className={`group relative p-6 w-full flex flex-col ${
        isRTL ? "items-end" : "items-start"
      } justify-center gap-y-2 rounded-2xl border shadow-sm 
        cursor-pointer transition-all dark:bg-zinc-900 dark:border-zinc-800 bg-white border-zinc-200
        hover:shadow-md hover:border-zinc-300 dark:hover:border-zinc-700
        focus:outline-none`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <Icon className="h-8 w-8 text-zinc-500 opacity-85 group-hover:text-zinc-800 group-hover:opacity-100 dark:text-zinc-400 dark:group-hover:text-zinc-200 transition-all duration-200" />
      <h3
        className={`font-medium text-base text-zinc-600 opacity-90 group-hover:text-zinc-900 group-hover:opacity-100 dark:text-zinc-300 dark:group-hover:text-zinc-100 transition-all duration-200 ${
          isRTL ? "text-right" : "text-left"
        }`}
      >
        {title}
      </h3>
      <div
        className={`text-sm text-zinc-500 opacity-85 group-hover:text-zinc-800 group-hover:opacity-100 dark:text-zinc-400 dark:group-hover:text-zinc-200 transition-all duration-200 ${
          isRTL ? "text-right" : "text-left"
        }`}
      >
        {subtitle}
      </div>
    </div>
  );
}
