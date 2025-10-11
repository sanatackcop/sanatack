import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trash2 } from "lucide-react";
import { FlashcardEditForm } from "./FlashcardsList";
import { ProgressIndicator } from "./consts";

export function FlashCardHome({
  totalCards,
  activeSet,
  handleCardUpdate,
  handleStudyStart,
  reviewedCount,
}: {
  totalCards: number;
  activeSet: any;
  handleCardUpdate: any;
  reviewedCount: number;
  handleStudyStart: any;
}) {
  return (
    <>
      <div className="flex flex-col items-center">
        <ProgressIndicator
          reviewed={reviewedCount}
          total={totalCards}
          onStartStudy={handleStudyStart}
        />
      </div>

      <div className="space-y-2 px-16 sm:px-0 flex-col flex justify-center align-baseline">
        <div className="flex w-full items-center justify-between">
          <h2 className="text-[18px] text-zinc-900 font-medium">
            Flashcards <span className="text-sm">({totalCards})</span>
          </h2>
        </div>

        {activeSet.flashcards.map((flashcard: any, idx: number) => (
          <Card key={flashcard.id || idx} className="shadow-sm">
            <div className="mx-5 space-y-4 py-2">
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center">
                  <span className="text-sm font-medium text-opacity-75 text-zinc-800 flex items-center gap-2">
                    <span>Card {idx + 1} </span>
                    <Badge variant={"outline"} className="rounded-2xl">
                      {flashcard.category}
                    </Badge>
                  </span>
                </div>
                {/* <div className="py-2 px-2 cursor-pointer hover:bg-red-200/50 rounded-xl group">
                  <Trash2 className="w-4 h-4 group-hover:text-red-600" />
                </div> */}
              </div>

              <FlashcardEditForm
                flashcard={flashcard}
                onUpdate={(updates) => handleCardUpdate(idx, updates)}
              />
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
