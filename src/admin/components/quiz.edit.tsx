import { useEffect, useState } from "react";
import { getSingleQuiz, updateQuiz } from "@/utils/_apis/admin-api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";

export default function QuizEdit({
  quizId,
  onClose,
  onUpdated,
}: {
  quizId: string;
  onClose: () => void;
  onUpdated: () => void;
}) {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState<string[]>([]);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [explanation, setExplanation] = useState("");
  const [duration, setDuration] = useState<number>(60);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getSingleQuiz({ quiz_id: quizId });
        setQuestion(data.question || "");
        setOptions(data.options || []);
        setCorrectAnswer(data.correctAnswer || "");
        setExplanation(data.explanation || "");
        setDuration(data.duration || 60);
      } catch (err: any) {
        console.error("Error fetching quiz:", err);
        const msg = err?.response?.data?.message;
        setError(
          typeof msg === "string"
            ? msg
            : Array.isArray(msg)
            ? msg.join(" - ")
            : "حدث خطأ أثناء تحميل بيانات الاختبار."
        );
      }
    };
    fetch();
  }, [quizId]);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);
      await updateQuiz(quizId, {
        question,
        options,
        correctAnswer,
        explanation,
        duration,
      });
      onUpdated();
      onClose();
    } catch (err: any) {
      console.error("Error updating quiz:", err);
      const msg = err?.response?.data?.message;
      setError(
        typeof msg === "string"
          ? msg
          : Array.isArray(msg)
          ? msg.join(" - ")
          : "حدث خطأ أثناء حفظ التعديلات."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Quiz</DialogTitle>
        </DialogHeader>
        {error && (
          <div className="text-red-600 bg-red-50 border border-red-300 p-2 rounded mb-4">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block mb-1">السؤال</label>
            <Textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-1">الاختيارات</label>
            {options.map((opt, i) => (
              <div key={i} className="flex gap-2 mt-2 items-center">
                <Input
                  value={opt}
                  onChange={(e) => {
                    const copy = [...options];
                    copy[i] = e.target.value;
                    setOptions(copy);
                  }}
                />
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={() => {
                    const copy = [...options];
                    copy.splice(i, 1);
                    setOptions(copy);
                  }}
                >
                  <Trash className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ))}
            <Button type="button" onClick={() => setOptions([...options, ""])}>
              + أضف اختيار
            </Button>
          </div>

          <div>
            <label className="block mb-1">الإجابة الصحيحة</label>
            <Input
              value={correctAnswer}
              onChange={(e) => setCorrectAnswer(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-1">الشرح</label>
            <Textarea
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-1">المدة (بالثواني)</label>
            <Input
              type="number"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              إلغاء
            </Button>
            <Button onClick={handleSubmit} disabled={loading}>
              حفظ
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
