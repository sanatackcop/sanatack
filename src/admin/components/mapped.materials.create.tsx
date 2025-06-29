import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MaterialType, QuizGroup, Video } from "@/utils/types/adminTypes";
import { useEffect, useState } from "react";
import { QuizGroupColumns, VideoColumns, CodeColumns } from "../columns";
import {
  getArticlesList,
  getQuizList,
  getVideosList,
  getCodeList,
  linkLessonMaterial,
} from "@/utils/_apis/admin-api";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { X, Check, Link, Loader2, Plus, Code2 } from "lucide-react";
import { Article } from "@/types/articles/articles";

interface LinkedMaterial {
  id: string;
  title: string;
  type: MaterialType;
}

export interface CodeItem {
  id: string;
  title: string;
  language: string;
  description?: string;
}

export default function MappedMaterialsCreate({ id }: { id: string }) {
  const [quiz, setQuiz] = useState<QuizGroup[]>([]);
  const [video, setVideo] = useState<Video[]>([]);
  const [code, setCode] = useState<CodeItem[]>([]);
  const [article, setArticle] = useState<Article[]>([]);
  const [linkedItems, setLinkedItems] = useState<Set<string>>(new Set());
  const [linkedMaterials, setLinkedMaterials] = useState<LinkedMaterial[]>([]);
  const [linkingStates, setLinkingStates] = useState<Record<string, boolean>>(
    {}
  );

  async function fetchCourses() {
    try {
      const [quizList, videoList, articleList, codeList] = await Promise.all([
        getQuizList<QuizGroup[]>(),
        getVideosList<Video[]>(),
        getArticlesList<Article[]>(),
        getCodeList<CodeItem[]>(),
      ]);

      if (quizList) setQuiz(quizList);
      if (articleList) setArticle(articleList);
      if (videoList) setVideo(videoList);
      if (codeList && codeList.length) setCode(codeList);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleLinkMaterial = async (
    materialId: string,
    materialType: MaterialType,
    order: number
  ) => {
    const itemKey = `${materialType}-${materialId}`;

    setLinkingStates((prev) => ({ ...prev, [itemKey]: true }));

    try {
      await linkLessonMaterial({
        material_id: materialId,
        lesson_id: id ?? "",
        type: materialType,
        order: order,
      });

      setLinkedItems((prev) => new Set([...prev, itemKey]));
    } catch (error) {
      console.error("Failed to link material:", error);
    } finally {
      setLinkingStates((prev) => ({ ...prev, [itemKey]: false }));
    }
  };

  const createLinkColumn = (materialType: MaterialType) => ({
    header: "Order & Link",
    size: 180,
    cell: ({ row }: { row: any }) => {
      const itemKey = `${materialType}-${row.original.id}`;
      const isLinking = linkingStates[itemKey];
      const isLinked = linkedItems.has(itemKey);
      const [localOrder, setLocalOrder] = useState(1);

      return (
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Label className="text-xs text-gray-500">Order:</Label>
            <Input
              type="number"
              min="0"
              value={localOrder}
              onChange={(e) => setLocalOrder(Number(e.target.value) || 0)}
              className="w-16 h-8 text-xs"
              disabled={isLinked}
            />
          </div>
          <Button
            size="sm"
            onClick={() =>
              handleLinkMaterial(row.original.id, materialType, localOrder)
            }
            disabled={isLinking || isLinked}
            className={`h-8 px-3 ${
              isLinked ? "bg-green-100 text-green-800 hover:bg-green-100" : ""
            }`}
          >
            {isLinking ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : isLinked ? (
              <>
                <Check className="h-3 w-3 mr-1" />
                Linked
              </>
            ) : (
              <>
                <Link className="h-3 w-3 mr-1" />
                Link
              </>
            )}
          </Button>
        </div>
      );
    },
  });

  // Create ArticlesColumns function if not imported
  const ArticlesColumns = (): ColumnDef<Article>[] => [
    {
      accessorKey: "title",
      header: "Title",
    },
    {
      accessorKey: "author",
      header: "Author",
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
    },
  ];

  const QuizColumnsLink: ColumnDef<QuizGroup>[] = [
    ...QuizGroupColumns(),
    createLinkColumn(MaterialType.QUIZ_GROUP),
  ];

  const VideoColumnsLink: ColumnDef<Video>[] = [
    ...VideoColumns(),
    createLinkColumn(MaterialType.VIDEO),
  ];

  const ArticleColumnsLink: ColumnDef<Article>[] = [
    ...ArticlesColumns(),
    createLinkColumn(MaterialType.ARTICLE),
  ];

  const CodeColumnsLink: ColumnDef<CodeItem>[] = [
    ...CodeColumns(),
    createLinkColumn(MaterialType.CODE),
  ];

  const addMaterial = (id: string, title: string, type: MaterialType) => {
    if (!linkedMaterials.find((m) => m.id === id && m.type === type)) {
      setLinkedMaterials((prev) => [...prev, { id, title, type }]);
    }
  };

  const removeMaterial = (id: string, type: MaterialType) => {
    setLinkedMaterials((prev) =>
      prev.filter((m) => !(m.id === id && m.type === type))
    );
  };

  const handleSubmit = async () => {
    try {
      const payload = linkedMaterials.map((m, index) => ({
        material_id: m.id,
        type: m.type,
        order: index,
      }));
      await Promise.all(
        payload.map((p) => linkLessonMaterial({ ...p, lesson_id: id ?? "" }))
      );
      setLinkedMaterials([]);
    } catch (err) {
      console.error("Failed to patch materials", err);
    }
  };

  function createQuizColumns(): ColumnDef<QuizGroup>[] {
    return [
      ...QuizGroupColumns(),
      {
        header: "Link",
        cell: ({ row }) => {
          const isLinked = linkedMaterials.some(
            (m) =>
              m.id === row.original.id && m.type === MaterialType.QUIZ_GROUP
          );
          return (
            <Button
              variant="secondary"
              onClick={() =>
                addMaterial(
                  row.original.id,
                  row.original.title,
                  MaterialType.QUIZ_GROUP
                )
              }
              disabled={isLinked}
            >
              {isLinked ? "Linked" : "Link"}
            </Button>
          );
        },
      },
    ];
  }

  function createVideoColumns(): ColumnDef<Video>[] {
    return [
      ...VideoColumns(),
      {
        header: "Link",
        cell: ({ row }) => {
          const isLinked = linkedMaterials.some(
            (m) => m.id === row.original.id && m.type === MaterialType.VIDEO
          );
          return (
            <Button
              variant="secondary"
              onClick={() =>
                addMaterial(
                  row.original.id,
                  row.original.title,
                  MaterialType.VIDEO
                )
              }
              disabled={isLinked}
            >
              {isLinked ? "Linked" : "Link"}
            </Button>
          );
        },
      },
    ];
  }

  function createArticleColumns(): ColumnDef<Article>[] {
    return [
      {
        accessorKey: "title",
        header: "Title",
      },
      {
        accessorKey: "author",
        header: "Author",
      },
      {
        accessorKey: "createdAt",
        header: "Created At",
      },
      {
        header: "Link",
        cell: ({ row }) => {
          const isLinked = linkedMaterials.some(
            (m) => m.id === row.original.id && m.type === MaterialType.ARTICLE
          );
          return (
            <Button
              variant="secondary"
              onClick={() =>
                addMaterial(
                  row.original.id,
                  row.original.title,
                  MaterialType.ARTICLE
                )
              }
              disabled={isLinked}
            >
              {isLinked ? "Linked" : "Link"}
            </Button>
          );
        },
      },
    ];
  }

  const renderChips = () => (
    <div className="flex flex-wrap gap-2 mb-4">
      {linkedMaterials.map((item, index) => (
        <div
          key={`${item.id}-${item.type}`}
          className="flex items-center bg-muted px-3 py-1 rounded-full text-sm"
        >
          <span className="mr-2">
            {item.type} {item.title} #{index + 1}
          </span>
          <button
            onClick={() => removeMaterial(item.id, item.type)}
            className="text-red-600 hover:text-red-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );

  const resetAllOrders = () => {
    setLinkedItems(new Set());
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Link A Material
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-[900px] max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Link New Materials to Lesson</DialogTitle>
        </DialogHeader>

        {/* Order Control Panel */}
        <div className="bg-gray-50 p-4 rounded-lg border">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-sm">Order Management</h3>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={resetAllOrders}
                className="h-7 px-2 text-xs"
              >
                Reset All
              </Button>
            </div>
          </div>
          <p className="text-xs text-gray-500">
            Each material will be assigned the order number shown in its row.
            You can customize individual orders.
          </p>
        </div>

        <div className="flex-1 overflow-hidden">
          <Tabs defaultValue="quiz" className="h-full flex flex-col">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="quiz" className="flex items-center gap-2">
                اختبار
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
                  {quiz.length}
                </span>
              </TabsTrigger>
              <TabsTrigger value="video" className="flex items-center gap-2">
                فيديو
                <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
                  {video.length}
                </span>
              </TabsTrigger>
              <TabsTrigger value="article" className="flex items-center gap-2">
                Article
                <span className="bg-purple-100 text-purple-800 text-xs px-2 py-0.5 rounded-full">
                  {article.length}
                </span>
              </TabsTrigger>
              <TabsTrigger value="code" className="flex items-center gap-2">
                <Code2 className="h-3 w-3" />
                Code
                <span className="bg-orange-100 text-orange-800 text-xs px-2 py-0.5 rounded-full">
                  {code.length}
                </span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="quiz" className="flex-1 overflow-auto">
              <DataTable columns={QuizColumnsLink} data={quiz} />
            </TabsContent>

            <TabsContent value="video" className="flex-1 overflow-auto">
              <DataTable columns={VideoColumnsLink} data={video} />
            </TabsContent>

            <TabsContent value="article" className="flex-1 overflow-auto">
              <DataTable columns={ArticleColumnsLink} data={article} />
            </TabsContent>

            <TabsContent value="code" className="flex-1 overflow-auto">
              <DataTable columns={CodeColumnsLink} data={code} />
            </TabsContent>
          </Tabs>
        </div>

        {linkedItems.size > 0 && (
          <div className="border-t pt-3">
            <p className="text-sm text-green-600 font-medium">
              ✓ {linkedItems.size} material(s) linked successfully
            </p>
          </div>
        )}

        {renderChips()}

        {/* Second Tabs section - Alternative interface */}
        <Tabs defaultValue="quiz">
          <TabsList className="mt-2 w-full justify-end">
            <TabsTrigger value="quiz">اختبار</TabsTrigger>
            <TabsTrigger value="video">فيديو</TabsTrigger>
            <TabsTrigger value="article">article</TabsTrigger>
          </TabsList>

          <TabsContent value="quiz">
            <DataTable columns={createQuizColumns()} data={quiz} />
          </TabsContent>
          <TabsContent value="video">
            <DataTable columns={createVideoColumns()} data={video} />
          </TabsContent>
          <TabsContent value="article">
            <DataTable columns={createArticleColumns()} data={article} />
          </TabsContent>
        </Tabs>

        <div className="flex justify-end mt-6">
          <Button
            onClick={handleSubmit}
            disabled={linkedMaterials.length === 0}
          >
            Submit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
