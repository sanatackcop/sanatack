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
import { getSingleArticle, updateArticle } from "@/utils/_apis/admin-api";
import { ArticleDto } from "@/utils/types/adminTypes";

export default function ArticleEdit({
  articleId,
  onClose,
  onUpdated,
}: {
  articleId: string;
  onClose: () => void;
  onUpdated: () => void;
}) {
  const [articles, setArticles] = useState<ArticleDto[]>([]);
  const [duration, setDuration] = useState<number | undefined>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const data = await getSingleArticle({ article_id: articleId });
        setArticles(data.data ?? []);
        setDuration(data.duration ?? 0);
      } catch (err: any) {
        console.error("Error fetching article:", err);
        const msg = err?.response?.data?.message;
        setError(
          typeof msg === "string"
            ? msg
            : Array.isArray(msg)
            ? msg.join(" - ")
            : "حدث خطأ أثناء تحميل المقال."
        );
      }
    };
    fetchArticle();
  }, [articleId]);

  const updateField = (index: number, key: keyof ArticleDto, value: any) => {
    const updated = [...articles];
    updated[index] = { ...updated[index], [key]: value };
    setArticles(updated);
  };

  const addSection = () => {
    setArticles([
      ...articles,
      {
        type: "section",
        title: "",
        image: "",
        description: "",
        body: "",
        order: articles.length + 1,
      },
    ]);
  };

  const removeSection = (index: number) => {
    const updated = [...articles];
    updated.splice(index, 1);
    setArticles(updated);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);

      const cleanedData = articles.map((article) => {
        const cleaned: ArticleDto = { ...article };

        if (!cleaned.code?.code?.trim() || !cleaned.code?.language?.trim()) {
          delete cleaned.code;
        }

        if (!cleaned.quote?.text?.trim()) {
          delete cleaned.quote;
        }

        return cleaned;
      });

      await updateArticle(articleId, {
        data: cleanedData,
        duration,
      });

      onUpdated();
      onClose();
    } catch (err: any) {
      console.error("Error updating article:", err);
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
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Article</DialogTitle>
        </DialogHeader>

        {error && (
          <div className="text-red-600 bg-red-50 border border-red-300 p-2 rounded mb-4">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block mb-1">المدة (بالثواني)</label>
            <Input
              type="number"
              value={duration ?? ""}
              onChange={(e) => setDuration(Number(e.target.value))}
            />
          </div>

          {articles.map((article, i) => (
            <div
              key={i}
              className="relative p-4 border border-gray-300 rounded space-y-3"
            >
              <button
                type="button"
                className="absolute top-2 left-2 text-red-500 hover:text-red-700 text-lg"
                onClick={() => removeSection(i)}
              >
                x
              </button>

              <div>
                <label className="block mb-1">النوع</label>
                <select
                  className="w-full border rounded px-2 py-1"
                  value={article.type}
                  onChange={(e) =>
                    updateField(i, "type", e.target.value as ArticleDto["type"])
                  }
                >
                  <option value="hero">Hero</option>
                  <option value="section">Section</option>
                  <option value="conclusion">Conclusion</option>
                </select>
              </div>

              <div>
                <label className="block mb-1">العنوان</label>
                <Input
                  value={article.title ?? ""}
                  onChange={(e) => updateField(i, "title", e.target.value)}
                />
              </div>

              <div>
                <label className="block mb-1">رابط الصورة</label>
                <Input
                  value={article.image ?? ""}
                  onChange={(e) => updateField(i, "image", e.target.value)}
                />
              </div>

              <div>
                <label className="block mb-1">الوصف</label>
                <Textarea
                  value={article.description ?? ""}
                  onChange={(e) =>
                    updateField(i, "description", e.target.value)
                  }
                />
              </div>

              <div>
                <label className="block mb-1">النص</label>
                <Textarea
                  value={article.body ?? ""}
                  onChange={(e) => updateField(i, "body", e.target.value)}
                />
              </div>

              <div>
                <label className="block mb-1">كود (اختياري)</label>
                <Textarea
                  placeholder="الكود"
                  value={article.code?.code ?? ""}
                  onChange={(e) =>
                    updateField(i, "code", {
                      ...article.code,
                      code: e.target.value,
                    })
                  }
                />
                <Input
                  className="mt-2"
                  placeholder="لغة البرمجة"
                  value={article.code?.language ?? ""}
                  onChange={(e) =>
                    updateField(i, "code", {
                      ...article.code,
                      language: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <label className="block mb-1">اقتباس (اختياري)</label>
                <Textarea
                  placeholder="النص"
                  value={article.quote?.text ?? ""}
                  onChange={(e) =>
                    updateField(i, "quote", {
                      ...article.quote,
                      text: e.target.value,
                    })
                  }
                />
                <Input
                  className="mt-2"
                  placeholder="الكاتب"
                  value={article.quote?.author ?? ""}
                  onChange={(e) =>
                    updateField(i, "quote", {
                      ...article.quote,
                      author: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <label className="block mb-1">الترتيب</label>
                <Input
                  type="number"
                  value={article.order ?? ""}
                  onChange={(e) =>
                    updateField(i, "order", Number(e.target.value))
                  }
                />
              </div>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={addSection}
            className="w-full"
          >
            + إضافة قسم جديد
          </Button>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            إلغاء
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            حفظ
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
