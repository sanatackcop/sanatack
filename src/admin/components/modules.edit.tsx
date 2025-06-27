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
import { getSingleModule, updateModule } from "@/utils/_apis/admin-api";

export default function ModuleEdit({
  moduleId,
  onClose,
  onUpdated,
}: {
  moduleId: string;
  onClose: () => void;
  onUpdated: () => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getSingleModule({ module_id: moduleId });
        setTitle(data.title || "");
        setDescription(data.description || "");
      } catch (err: any) {
        console.error("Error fetching module:", err);
        const msg = err?.response?.data?.message;
        setError(
          typeof msg === "string"
            ? msg
            : Array.isArray(msg)
            ? msg.join(" - ")
            : "حدث خطأ أثناء تحميل بيانات الوحدة."
        );
      }
    };
    fetch();
  }, [moduleId]);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);

      await updateModule(moduleId, { title, description });

      onUpdated();
      onClose();
    } catch (err: any) {
      console.error("Error updating module:", err);
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
          <DialogTitle>Edit Module</DialogTitle>
        </DialogHeader>
        {error && (
          <div className="text-red-600 bg-red-50 border border-red-300 p-2 rounded mb-4">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">العنوان</label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">الشرح</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
