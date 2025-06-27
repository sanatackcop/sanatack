import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { getSingleLesson, updateLesson } from "@/utils/_apis/admin-api";

export default function LessonEdit({
  lessonId,
  onClose,
  onUpdated,
}: {
  lessonId: string;
  onClose: () => void;
  onUpdated: () => void;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const data = await getSingleLesson({ lesson_id: lessonId });
        setName(data.name || "");
        setDescription(data.description || "");
      } catch (err) {
        console.error("Error fetching lesson:", err);
        setError("حدث خطأ أثناء تحميل الدرس.");
      }
    };

    fetchLesson();
  }, [lessonId]);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await updateLesson(lessonId, { name, description });
      onUpdated();
      onClose();
    } catch (err: any) {
      console.error("Error updating lesson:", err);
      const msg =
        err?.response?.data?.message || "فشل في تحديث الدرس. حاول مرة أخرى.";
      setError(typeof msg === "string" ? msg : msg.join(" - "));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Lesson</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">الاسم</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">الشرح</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          {error && (
            <div className="text-red-600 bg-red-100 border border-red-300 p-2 rounded text-sm">
              {error}
            </div>
          )}

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
