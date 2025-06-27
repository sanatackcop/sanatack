import { FileText } from "lucide-react";
import { VideoView } from "./_VideoView";
import QuizView from "./_QuizView";
import { Material } from "@/types/courses";
import { MaterialType } from "@/utils/types/adminTypes";
import ArticleView from "./_ArticleView";

export default function MaterialViewer({ material }: { material: Material }) {
  if (material.type === MaterialType.VIDEO) {
    return <VideoView video={material} />;
  }

  if (material.type === MaterialType.ARTICLE) {
    return <ArticleView material={{ ...material, order: 0, duration: 999 }} />;
  }

  if (material.type === MaterialType.QUIZ_GROUP) {
    return <QuizView quizGroup={material} />;
  }

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900">
      <div className="flex-1 p-6 flex items-center justify-center">
        <div
          className="max-w-3xl mx-auto prose dark:prose-invert text-right"
          dir="rtl"
        >
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center mx-auto mb-3">
              <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              محتوى الدرس سيظهر هنا...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
