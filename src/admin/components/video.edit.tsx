import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { getSingleVideo, updateVideo } from "@/utils/_apis/admin-api";

export default function VideoEdit({
  videoId,
  onClose,
  onUpdated,
}: {
  videoId: string;
  onClose: () => void;
  onUpdated: () => void;
}) {
  const [title, setTitle] = useState("");
  const [youtubeId, setYoutubeId] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState<number | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const data = await getSingleVideo({ video_id: videoId });
        setTitle(data.title || "");
        setYoutubeId(data.youtubeId || "");
        setDescription(data.description || "");
        setDuration(data.duration || 0);
      } catch (err: any) {
        console.error("Error fetching video:", err);
        const msg = err?.response?.data?.message;
        setError(
          typeof msg === "string"
            ? msg
            : Array.isArray(msg)
            ? msg.join(" - ")
            : "حدث خطأ أثناء تحميل الفيديو."
        );
      }
    };
    fetchVideo();
  }, [videoId]);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null); // reset any previous error

      await updateVideo(videoId, {
        title,
        youtubeId,
        description,
        duration,
      });

      onUpdated();
      onClose();
    } catch (err: any) {
      console.error("Error updating video:", err);
      const msg = err?.response?.data?.message;
      setError(
        typeof msg === "string"
          ? msg
          : Array.isArray(msg)
          ? msg.join(" - ")
          : "حدث خطأ أثناء حفظ الفيديو."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Video</DialogTitle>
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
            <label className="block text-sm font-medium mb-1">
              رابط اليوتيوب
            </label>
            <Input
              value={youtubeId}
              onChange={(e) => setYoutubeId(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">الشرح</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              المدة (بالثواني)
            </label>
            <Input
              type="number"
              value={duration ?? ""}
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
