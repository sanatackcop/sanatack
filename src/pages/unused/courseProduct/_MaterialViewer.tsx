import { BookOpen, FileText } from "lucide-react";
import { VideoView } from "./_VideoView";
import { MaterialContext } from "@/types/courses";
import ArticleView from "./_ArticleView";
import QuizView from "./_QuizView";
import CodePlayground from "./_CodeEditorView";
import { MaterialType } from "@/utils/types/adminTypes";

export default function MaterialViewer({
  material,
}: {
  material: MaterialContext;
}) {
  if (!material)
    return (
      <div className="flex h-full items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-lg text-gray-500 dark:text-gray-400 mb-2">
            اختر مادة من القائمة
          </p>
          <p className="text-sm text-gray-400">لبدء رحلة التعلم</p>
        </div>
      </div>
    );

  if (material.type == MaterialType.CODE)
    return <CodePlayground key={material.id} material={material} />;

  if (material.type == MaterialType.VIDEO)
    return <VideoView key={material.youtubeId} video={material} />;

  if (material.type == MaterialType.ARTICLE)
    return <ArticleView key={material.id} article={material} />;

  if (material.type == MaterialType.QUIZ_GROUP)
    return <QuizView key={material.id} quizGroup={material} />;

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
