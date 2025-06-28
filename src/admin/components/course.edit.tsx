import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Trash } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { CourseDetails } from "@/types/courses";
import { getSingleCoursesApi } from "@/utils/_apis/courses-apis";
import { Level } from "@/utils/types/adminTypes";
import { updateCourse } from "@/utils/_apis/admin-api";

export default function CourseEdit({
  courseId,
  onClose,
  onUpdated,
}: {
  courseId: string;
  onClose: () => void;
  onUpdated: () => void;
}) {
  const [course, setCourse] = useState<CourseDetails | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [level, setLevel] = useState<Level>("BEGINNER");
  const [isPublished, setIsPublished] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [prerequisites, setPrerequisites] = useState<string[]>([]);
  const [outcomes, setOutcomes] = useState<{ key: string; value: number }[]>(
    []
  );

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getSingleCoursesApi({ course_id: courseId });
        setCourse(data);
        setTitle(data.title);
        setDescription(data.description);
        setLevel(data.level);
        setIsPublished(data.isPublished);
        setTags(data.course_info.tags || []);
        setSkills(data.course_info.new_skills_result || []);
        setPrerequisites(data.course_info.prerequisites || []);
        setOutcomes(
          Object.entries(data.course_info.learning_outcome || {}).map(
            ([key, value]) => ({
              key,
              value,
            })
          )
        );
      } catch (err) {
        console.error("Failed to fetch course", err);
        setError("تعذر تحميل بيانات الدورة.");
      }
    }
    fetchData();
  }, [courseId]);

  async function handleSubmit() {
    try {
      const learning_outcome: { [key: string]: number } = {};
      for (const o of outcomes) {
        if (o.key.trim()) {
          learning_outcome[o.key] = o.value;
        }
      }

      const course_info = {
        durationHours: course?.course_info.durationHours ?? 0,
        tags,
        new_skills_result: skills,
        prerequisites,
        learning_outcome,
      };

      await updateCourse(courseId, {
        title,
        description,
        level,
        course_info,
        isPublished,
      });

      onUpdated();
      onClose();
    } catch (err: any) {
      console.error("Error updating course:", err);
      const msg = err?.response?.data?.message;
      setError(
        typeof msg === "string"
          ? msg
          : Array.isArray(msg)
          ? msg.join(" - ")
          : "حدث خطأ أثناء حفظ التعديلات."
      );
    }
  }

  if (!course) return null;

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Course</DialogTitle>
        </DialogHeader>

        {error && (
          <div className="text-red-600 bg-red-50 border border-red-300 p-2 rounded mb-4">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label>اسم الدورة</label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          <div>
            <label>وصف الدورة</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div>
            <label>المستوى</label>
            <select
              className="w-full border rounded px-2 py-1"
              value={level}
              onChange={(e) => setLevel(e.target.value as any)}
            >
              <option value="BEGINNER">BEGINNER</option>
              <option value="INTERMEDIATE">INTERMEDIATE</option>
              <option value="ADVANCED">ADVANCED</option>
            </select>
          </div>

          <div>
            <label>الكلمات المفتاحية</label>
            {tags.map((tag, i) => (
              <div key={i} className="flex gap-2 mt-2 items-center">
                <Input
                  value={tag}
                  onChange={(e) => {
                    const copy = [...tags];
                    copy[i] = e.target.value;
                    setTags(copy);
                  }}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    const copy = [...tags];
                    copy.splice(i, 1);
                    setTags(copy);
                  }}
                >
                  <Trash className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ))}
            <Button onClick={() => setTags([...tags, ""])} type="button">
              + أضف كلمة
            </Button>
          </div>

          <div>
            <label>المهارات المكتسبة</label>
            {skills.map((s, i) => (
              <div key={i} className="flex gap-2 mt-2 items-center">
                <Input
                  value={s}
                  onChange={(e) => {
                    const copy = [...skills];
                    copy[i] = e.target.value;
                    setSkills(copy);
                  }}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    const copy = [...skills];
                    copy.splice(i, 1);
                    setSkills(copy);
                  }}
                >
                  <Trash className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ))}
            <Button onClick={() => setSkills([...skills, ""])} type="button">
              + أضف مهارة
            </Button>
          </div>

          <div>
            <label>المتطلبات المسبقة</label>
            {prerequisites.map((p, i) => (
              <div key={i} className="flex gap-2 mt-2 items-center">
                <Input
                  value={p}
                  onChange={(e) => {
                    const copy = [...prerequisites];
                    copy[i] = e.target.value;
                    setPrerequisites(copy);
                  }}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    const copy = [...prerequisites];
                    copy.splice(i, 1);
                    setPrerequisites(copy);
                  }}
                >
                  <Trash className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ))}
            <Button
              onClick={() => setPrerequisites([...prerequisites, ""])}
              type="button"
            >
              + أضف متطلب
            </Button>
          </div>

          <div>
            <label>النتائج التعليمية</label>
            {outcomes.map((o, i) => (
              <div key={i} className="flex gap-2 mt-2 items-center">
                <Input
                  placeholder="اسم النتيجة"
                  value={o.key}
                  onChange={(e) => {
                    const copy = [...outcomes];
                    copy[i].key = e.target.value;
                    setOutcomes(copy);
                  }}
                />
                <Input
                  placeholder="القيمة"
                  type="number"
                  value={o.value}
                  onChange={(e) => {
                    const copy = [...outcomes];
                    copy[i].value = Number(e.target.value);
                    setOutcomes(copy);
                  }}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    const copy = [...outcomes];
                    copy.splice(i, 1);
                    setOutcomes(copy);
                  }}
                >
                  <Trash className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ))}
            <Button
              onClick={() => setOutcomes([...outcomes, { key: "", value: 0 }])}
              type="button"
            >
              + أضف نتيجة
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              checked={isPublished}
              onCheckedChange={(v) => setIsPublished(!!v)}
            />
            <label>نشر الدورة</label>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              إلغاء
            </Button>
            <Button onClick={handleSubmit}>حفظ</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
