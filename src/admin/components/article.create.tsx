import { useCallback, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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

export interface ArticleCardDto {
  article_id?: number;
  type: "hero" | "section" | "conclusion";
  title?: string;
  image?: string;
  description?: string;
  body?: string;
  code?: { code: string; language: string };
  quote?: { text: string; author?: string };
  order?: number;
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

  const form = useForm<{ title: string }>({
    defaultValues: { title: "" },
  });

  const addCard = useCallback((type: ArticleCardDto["type"]) => {
    const newCard: ArticleCardDto = {
      article_id: Date.now(),
      type,
      title: type.charAt(0).toUpperCase() + type.slice(1) + " Title",
      description: "Add your description here...",
      body: "Add your content here...",
    };
    setArticles((prev) => [...prev, newCard]);
    setEditingId(newCard.article_id!);
  }, []);

  const updateCardField = useCallback(
    (id: number, field: keyof ArticleCardDto, value: any) => {
      setArticles((prev) =>
        prev.map((card) =>
          card.article_id === id ? { ...card, [field]: value } : card
        )
      );
    },
    []
  );

  const deleteCard = useCallback(
    (id: number) => {
      setArticles((prev) => prev.filter((card) => card.article_id !== id));
      if (editingId === id) setEditingId(null);
    },
    [editingId]
  );

  const moveCard = useCallback((id: number, direction: "up" | "down") => {
    setArticles((prev) => {
      const index = prev.findIndex((card) => card.article_id === id);
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
      const payload = {
        title: form.getValues("title"),
        data: articles.map((segment, index) => ({ ...segment, order: index })),
        duration,
      };
      await createNewArticleApi(payload);
      form.reset();
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
    const isEditing = editingId === card.article_id;

    return (
      <div
        className={`border rounded-lg p-4 mb-4 ${
          isEditing ? "border-blue-500 bg-blue-50" : "border-gray-200"
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <GripVertical className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-semibold">
              {card.type.toUpperCase()}
            </span>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => moveCard(card.article_id!, "up")}
            >
              ↑
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => moveCard(card.article_id!, "down")}
            >
              ↓
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setEditingId(isEditing ? null : card.article_id!)}
            >
              {isEditing ? (
                <X className="w-4 h-4" />
              ) : (
                <Type className="w-4 h-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => deleteCard(card.article_id!)}
            >
              <Trash2 className="w-4 h-4 text-red-600" />
            </Button>
          </div>
        </div>

        {isEditing && (
          <div className="space-y-3 mt-4">
            {/* Title */}
            <Input
              value={card.title || ""}
              onChange={(e) =>
                updateCardField(card.article_id!, "title", e.target.value)
              }
              placeholder="Title"
            />

            {/* Description */}
            <Input
              value={card.description || ""}
              onChange={(e) =>
                updateCardField(card.article_id!, "description", e.target.value)
              }
              placeholder="Description"
            />

            {/* Body */}
            <Input
              value={card.body || ""}
              onChange={(e) =>
                updateCardField(card.article_id!, "body", e.target.value)
              }
              placeholder="Body"
            />

            {/* Buttons to Add Optional Fields */}
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant="outline"
                onClick={() =>
                  updateCardField(
                    card.article_id!,
                    "image",
                    card.image || "https://via.placeholder.com/800x400"
                  )
                }
              >
                <Image className="w-4 h-4 mr-1" /> Add Image
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  updateCardField(card.article_id!, "code", {
                    code: card.code?.code || "// Your code here",
                    language: card.code?.language || "javascript",
                  })
                }
              >
                <Code className="w-4 h-4 mr-1" /> Add Code
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  updateCardField(card.article_id!, "quote", {
                    text: card.quote?.text || "Your quote here",
                    author: card.quote?.author || "Author",
                  })
                }
              >
                <Quote className="w-4 h-4 mr-1" /> Add Quote
              </Button>
            </div>

            {/* Image Field */}
            {card.image && (
              <Input
                value={card.image}
                onChange={(e) =>
                  updateCardField(card.article_id!, "image", e.target.value)
                }
                placeholder="Image URL"
              />
            )}

            {/* Code Field */}
            {card.code && (
              <div className="space-y-2">
                <select
                  value={card.code.language}
                  onChange={(e) =>
                    updateCardField(card.article_id!, "code", {
                      ...card.code!,
                      language: e.target.value,
                    })
                  }
                  className="w-full border rounded px-2 py-1"
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
                  onChange={(e) =>
                    updateCardField(card.article_id!, "code", {
                      ...card.code!,
                      code: e.target.value,
                    })
                  }
                  rows={4}
                  className="w-full border rounded px-2 py-1 font-mono text-sm"
                />
              </div>
            )}

            {/* Quote Field */}
            {card.quote && (
              <div className="space-y-2">
                <textarea
                  value={card.quote.text}
                  onChange={(e) =>
                    updateCardField(card.article_id!, "quote", {
                      ...card.quote!,
                      text: e.target.value,
                    })
                  }
                  rows={2}
                  placeholder="Quote text"
                  className="w-full border rounded px-2 py-1"
                />
                <Input
                  value={card.quote.author || ""}
                  onChange={(e) =>
                    updateCardField(card.article_id!, "quote", {
                      ...card.quote!,
                      author: e.target.value,
                    })
                  }
                  placeholder="Quote author"
                />
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <div className="fixed inset-0 z-50 overflow-hidden">
        <div className="relative flex items-center justify-center min-h-screen p-4">
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b">
              <h1 className="text-2xl font-bold">Article Editor</h1>
              <Button
                onClick={createNewArticle}
                disabled={
                  articles.length === 0 || isSending || !form.watch("title")
                }
              >
                <Send className="w-4 h-4 mr-2" />{" "}
                {isSending ? "Sending..." : "Create"}
              </Button>
            </div>
            <div className="p-4 border-b bg-gray-50">
              <div className="max-w-4xl mx-auto space-y-4">
                <FormProvider {...form}>
                  <Form {...form}>
                    <form className="space-y-4">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Article Title</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Enter article title"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </form>
                  </Form>
                </FormProvider>
                <div className="flex flex-wrap gap-2 items-center">
                  {["hero", "section", "conclusion"].map((type) => (
                    <Button
                      key={type}
                      variant="outline"
                      onClick={() => addCard(type as any)}
                    >
                      <Plus className="w-4 h-4 mr-1" /> Add {type}
                    </Button>
                  ))}
                  <Input
                    type="number"
                    required
                    placeholder="duration (in seconds)"
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-40"
                  />
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <div className="max-w-4xl mx-auto">
                {articles.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    No segments added yet
                  </div>
                ) : (
                  articles.map((card) => (
                    <CardEditor key={card.article_id} card={card} />
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
