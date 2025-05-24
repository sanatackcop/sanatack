import React from "react";
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
  const [openItems, setOpenItems] = React.useState<string[]>([]);

  return (
    <Accordion
      type="multiple"
      value={openItems}
      onValueChange={setOpenItems}
      className={`dark:text-[#949DB2] text-gray-500 ${className}`}
      dir="rtl"
    >
      {data.map((item, idx) => {
        const isOpen = openItems.includes(getId(item));
        return (
          <div key={getId(item)} className="relative">
            <AccordionItem value={getId(item)} className="relative">
              <AccordionTrigger className="relative p-1 transition">
                <div className="flex items-center w-full justify-between">
                  <div className="flex flex-col min-w-0 pr-3">
                    <span className="truncate ml-2 text-xs sm:text-sm md:text-md mb-1">
                      {getTitle(item)}
                    </span>
                    {getSubtitle && (
                      <span className="text-xs">{getSubtitle(item)}</span>
                    )}
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-2 mr-3 pb-1 space-y-2">
                {renderContent(item) && (
                  <svg
                    className="absolute top-6 sm:top-7 right-[1.9rem] sm:right-[2.1rem] w-8 h-10 z-0"
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
                )}
                {renderContent(item)}
              </AccordionContent>
            </AccordionItem>

            {idx !== data.length - 1 && (
              <div
                className={`absolute right-4 sm:right-5 top-8 sm:top-9 h-full border-r border-gray-500 transition-all duration-300 pointer-events-none ${
                  isOpen ? "border-dashed border-opacity-60" : "border-solid"
                }`}
              />
            )}
          </div>
        );
      })}
    </Accordion>
  );
}
