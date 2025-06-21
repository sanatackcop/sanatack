import { useState, useCallback } from "react";
import {
  Trash2,
  Plus,
  Image,
  Code,
  Quote,
  Type,
  FileText,
  GripVertical,
  X,
  Send,
} from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { createNewArticleApi } from "@/utils/_apis/admin-api";
import { Input } from "@/components/ui/input";

export interface ArticleCardDto {
  id?: any;
  type: "hero" | "section" | "conclusion";
  title?: string;
  image?: string;
  description?: string;
  body?: string;
  code?: { code: string; language: string };
  quote?: { text: string; author?: string };
  order?: number;
  duration?: number;
}

export default function ArticleEditor({
  open,
  onOpenChange,
  updateTable,
}: {
  open: boolean;
  onOpenChange: (state: boolean) => void;
  updateTable: () => void;
}) {
  const [articles, setArticles] = useState<ArticleCardDto[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [duration, setDuration] = useState<number>(0);

  const addCard = useCallback((type: ArticleCardDto["type"]) => {
    const newCard: ArticleCardDto = {
      id: Date.now(),
      type,
      title:
        type === "hero"
          ? "Hero Title"
          : type === "section"
          ? "Section Title"
          : "Conclusion Title",
      description: "Add your description here...",
      body: "Add your content here...",
    };
    setArticles((prev) => [...prev, newCard]);
    setEditingId(newCard.id);
  }, []);

  const updateCardField = useCallback(
    (id: number, field: keyof ArticleCardDto, value: any) => {
      setArticles((prev) =>
        prev.map((card) =>
          card.id === id ? { ...card, [field]: value } : card
        )
      );
    },
    []
  );

  const deleteCard = useCallback(
    (id: number) => {
      setArticles((prev) => prev.filter((card) => card.id !== id));
      if (editingId === id) setEditingId(null);
    },
    [editingId]
  );

  const moveCard = useCallback((id: number, direction: "up" | "down") => {
    setArticles((prev) => {
      const index = prev.findIndex((card) => card.id === id);
      if (
        (direction === "up" && index === 0) ||
        (direction === "down" && index === prev.length - 1)
      )
        return prev;

      const newArticles = [...prev];
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      [newArticles[index], newArticles[targetIndex]] = [
        newArticles[targetIndex],
        newArticles[index],
      ];
      return newArticles;
    });
  }, []);

  const createNewArticle = async () => {
    setIsSending(true);
    try {
      const ar = { ...articles, duration: duration };
      await createNewArticleApi(ar);
      setArticles([]);
      setEditingId(null);
      onOpenChange(false);
      updateTable();
    } catch (error) {
      console.error("Error sending article:", error);
      alert("Error sending article. Please check your connection.");
    } finally {
      setIsSending(false);
    }
  };

  const CardEditor = ({ card }: { card: ArticleCardDto }) => {
    const isEditing = editingId === card.id;

    return (
      <div
        className={`border rounded-lg p-4 mb-4 transition-all ${
          isEditing ? "border-blue-500 bg-blue-50" : "border-gray-200"
        }`}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <GripVertical className="w-4 h-4 text-gray-400 cursor-move" />
            <span
              className={`text-sm font-medium px-2 py-1 rounded ${
                card.type === "hero"
                  ? "bg-purple-100 text-purple-700"
                  : card.type === "section"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {card.type.toUpperCase()}
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => moveCard(card.id, "up")}
              className="p-1 hover:bg-gray-100 rounded"
              title="Move up"
            >
              ↑
            </button>
            <button
              onClick={() => moveCard(card.id, "down")}
              className="p-1 hover:bg-gray-100 rounded"
              title="Move down"
            >
              ↓
            </button>
            <button
              onClick={() => setEditingId(isEditing ? null : card.id)}
              className={`p-1 rounded ${
                isEditing ? "bg-blue-100" : "hover:bg-gray-100"
              }`}
            >
              {isEditing ? (
                <X className="w-4 h-4" />
              ) : (
                <Type className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={() => deleteCard(card.id)}
              className="p-1 hover:bg-red-100 rounded text-red-600"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {isEditing && (
          <div className="space-y-3 mt-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                type="text"
                value={card.title || ""}
                onChange={(e) =>
                  updateCardField(card.id, "title", e.target.value)
                }
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter title..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Description
              </label>
              <textarea
                value={card.description || ""}
                onChange={(e) =>
                  updateCardField(card.id, "description", e.target.value)
                }
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={2}
                placeholder="Enter description..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Body Content
              </label>
              <textarea
                value={card.body || ""}
                onChange={(e) =>
                  updateCardField(card.id, "body", e.target.value)
                }
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={4}
                placeholder="Enter body content..."
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() =>
                  updateCardField(
                    card.id,
                    "image",
                    card.image || "https://via.placeholder.com/800x400"
                  )
                }
                className="flex items-center justify-center gap-2 p-2 border rounded hover:bg-gray-50"
              >
                <Image className="w-4 h-4" />
                Add Image
              </button>
              <button
                onClick={() =>
                  updateCardField(
                    card.id,
                    "code",
                    card.code || {
                      code: "// Your code here",
                      language: "javascript",
                    }
                  )
                }
                className="flex items-center justify-center gap-2 p-2 border rounded hover:bg-gray-50"
              >
                <Code className="w-4 h-4" />
                Add Code
              </button>
              <button
                onClick={() =>
                  updateCardField(
                    card.id,
                    "quote",
                    card.quote || { text: "Your quote here", author: "Author" }
                  )
                }
                className="flex items-center justify-center gap-2 p-2 border rounded hover:bg-gray-50"
              >
                <Quote className="w-4 h-4" />
                Add Quote
              </button>
            </div>

            {card.image && (
              <div>
                <label className="block text-sm font-medium mb-1">
                  Image URL
                </label>
                <input
                  type="text"
                  value={card.image}
                  onChange={(e) =>
                    updateCardField(card.id, "image", e.target.value)
                  }
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter image URL..."
                />
              </div>
            )}

            {card.code && (
              <div className="space-y-2">
                <label className="block text-sm font-medium">Code Block</label>
                <select
                  value={card.code.language}
                  onChange={(e) => {
                    const newCode = { ...card.code, language: e.target.value };
                    updateCardField(card.id, "code", newCode);
                  }}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="javascript">JavaScript</option>
                  <option value="typescript">TypeScript</option>
                  <option value="python">Python</option>
                  <option value="html">HTML</option>
                  <option value="css">CSS</option>
                  <option value="sql">SQL</option>
                </select>
                <textarea
                  value={card.code.code}
                  onChange={(e) => {
                    const newCode = { ...card.code, code: e.target.value };
                    updateCardField(card.id, "code", newCode);
                  }}
                  className="w-full px-3 py-2 border rounded-md font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={4}
                />
              </div>
            )}

            {card.quote && (
              <div className="space-y-2">
                <label className="block text-sm font-medium">Quote</label>
                <textarea
                  value={card.quote.text}
                  onChange={(e) => {
                    const newQuote = { ...card.quote, text: e.target.value };
                    updateCardField(card.id, "quote", newQuote);
                  }}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={2}
                  placeholder="Enter quote text..."
                />
                <input
                  type="text"
                  value={card.quote.author || ""}
                  onChange={(e) => {
                    const newQuote = { ...card.quote, author: e.target.value };
                    updateCardField(card.id, "quote", newQuote);
                  }}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Quote author..."
                />
              </div>
            )}
          </div>
        )}

        {!isEditing && (
          <div className="text-sm text-gray-600">
            <p className="font-medium">{card.title}</p>
            <p className="text-xs mt-1">
              {card.description?.substring(0, 100)}...
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <div className="fixed inset-0 z-50 overflow-hidden">
        <div className="relative flex items-center justify-center min-h-screen p-4">
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-7xl h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b">
              <h1 className="text-2xl font-bold">Article Editor</h1>
              <div className="flex items-center gap-3">
                <button
                  onClick={createNewArticle}
                  disabled={articles.length === 0 || isSending}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    articles.length === 0 || isSending
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  <Send className="w-4 h-4" />
                  {isSending ? "Sending..." : "Create"}
                </button>
              </div>
            </div>

            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="p-4 border-b bg-gray-50">
                <div className="flex flex-wrap gap-2 justify-center">
                  <button
                    onClick={() => addCard("hero")}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200"
                  >
                    <Plus className="w-4 h-4" />
                    Add Hero
                  </button>
                  <button
                    onClick={() => addCard("section")}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
                  >
                    <Plus className="w-4 h-4" />
                    Add Section
                  </button>
                  <button
                    onClick={() => addCard("conclusion")}
                    className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200"
                  >
                    <Plus className="w-4 h-4" />
                    Add Conclusion
                  </button>

                  <Input
                    type="number"
                    required={true}
                    placeholder="duration: like 102 in seconds"
                    value={duration}
                    onChange={(e) => {
                      setDuration(() => Number(e.target.value));
                    }}
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                <div className="max-w-4xl mx-auto">
                  {articles.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    </div>
                  ) : (
                    articles.map((card) => (
                      <CardEditor key={card.id} card={card} />
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
