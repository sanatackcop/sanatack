import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings2 } from "lucide-react";

const GenerateContentComponent = ({
  title = "Create Flashcards",
  description = "Create a flashcard set with custom settings and personalization",
  buttonLabel = "Generate",
  onClick,
  disabled = false,
}: any) => {
  return (
    <Card
      className="relative z-0 mx-5 justify-between overflow-hidden flex  p-5
    borde-2 border-dashed border-gray-200 hover:border-gray-300 transition-colors duration-200"
    >
      <div className="max-w-[65%]">
        <h2 className="text-xl font-medium tracking-tight text-gray-900 mb-2 dark:text-gray-100">
          {title}
        </h2>
        <p className="text-gray-600 text-sm dark:text-gray-100/70 leading-relaxed">
          {description}
        </p>
      </div>

      <div className="flex gap-2 shrink-0">
        <Button
          disabled={disabled}
          className="rounded-2xl px-6 py-3 font-medium shadow-sm transition-all duration-200"
          onClick={onClick}
        >
          <Settings2 className="mr-2 h-4 w-4" />
          {buttonLabel}
        </Button>
      </div>
    </Card>
  );
};

export default GenerateContentComponent;
