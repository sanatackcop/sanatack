import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type GenericAccordionProps<T> = {
  data: T[];
  getId: (item: T) => string;
  getTitle: (item: T) => string | React.ReactNode;
  getSubtitle?: (item: T) => string | React.ReactNode;
  renderContent: (item: T) => React.ReactNode;
  className?: string;
};

export default function GenericAccordion<T>({
  data,
  getId,
  getTitle,
  getSubtitle,
  renderContent,
  className = "",
}: GenericAccordionProps<T>) {
  return (
    <Accordion
      type="multiple"
      className={`text-[#949DB2] ${className}`}
      dir="rtl"
    >
      {data.map((item, idx) => (
        <div key={getId(item)} className="relative">
          <AccordionItem value={getId(item)} className="relative">
            <AccordionTrigger className="relative group p-3 transition">
              <div className="flex items-center w-full justify-between">
                <div className="flex flex-col min-w-0 pr-5">
                  <span className="truncate ml-2 font-semibold text-xs sm:text-sm md:text-md mb-1">
                    {getTitle(item)}
                  </span>
                  {getSubtitle && (
                    <span className="text-xs text-muted-foreground">
                      {getSubtitle(item)}
                    </span>
                  )}
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-2 mr-5 pb-2 space-y-2">
              <svg
                className="absolute top-9 right-9 sm:right-12 w-10 h-12 z-0"
                viewBox="0 0 40 40"
                preserveAspectRatio="none"
              >
                <path
                  d="M40,0 Q20,20 20,40"
                  stroke="gray"
                  strokeWidth="1"
                  fill="none"
                />
              </svg>
              {renderContent(item)}
            </AccordionContent>
          </AccordionItem>
          {idx !== data.length - 1 && (
            <div className="absolute right-6 sm:right-7 top-10 sm:top-12 h-full w-px bg-white/30 transition-all duration-300" />
          )}
        </div>
      ))}
    </Accordion>
  );
}
