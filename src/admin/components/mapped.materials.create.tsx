// Updated MappedMaterialsCreate without react-beautiful-dnd, with drag-and-drop using native events

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
import { useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { X, Check, Link, Plus, Code2, ListChecks, Move } from "lucide-react";

import { QuizGroupColumns, VideoColumns, CodeColumns } from "../columns";
import {
  getArticlesList,
  getQuizList,
  getVideosList,
  getCodeList,
  linkLessonMaterial,
} from "@/utils/_apis/admin-api";
import { DataTable } from "@/components/ui/data-table";
import { MaterialType, QuizGroup, Video } from "@/utils/types/adminTypes";
import { Article } from "@/types/articles/articles";
import { CodeMaterial } from "@/types/courses";

interface LinkedMaterial {
  id: string;
  title: string;
  type: MaterialType;
  order: number;
}

export default function MappedMaterialsCreate({ id }: { id: string }) {
  const [quiz, setQuiz] = useState<QuizGroup[]>([]);
  const [video, setVideo] = useState<Video[]>([]);
  const [code, setCode] = useState<CodeMaterial[]>([]);
  const [article, setArticle] = useState<Article[]>([]);
  const [linkedMaterials, setLinkedMaterials] = useState<LinkedMaterial[]>([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const [quizList, videoList, articleList, codeList] = await Promise.all([
          getQuizList<QuizGroup[]>(),
          getVideosList<Video[]>(),
          getArticlesList<Article[]>(),
          getCodeList<CodeMaterial[]>(),
        ]);

        setQuiz(quizList);
        setArticle(articleList);
        setVideo(videoList);
        setCode(codeList);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCourses();
  }, []);

  const addMaterial = (
    id: string,
    title: string,
    type: MaterialType,
    order: number
  ) => {
    if (!linkedMaterials.find((m) => m.id === id && m.type === type)) {
      setLinkedMaterials((prev) => [...prev, { id, title, type, order }]);
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

  const createLinkColumn = <T extends { id: string; title: string }>(
    materialType: MaterialType
  ): ColumnDef<T> => ({
    id: "link",
    header: "Order & Link",
    size: 200,
    cell: ({ row }) => {
      const [localOrder, setLocalOrder] = useState(0);
      const isLinked = linkedMaterials.some(
        (m) => m.id === row.original.id && m.type === materialType
      );

      return (
        <div className="flex items-center gap-2">
          <Input
            type="number"
            min={0}
            value={localOrder}
            onChange={(e) => setLocalOrder(Number(e.target.value))}
            className="w-14 h-8 text-xs"
            disabled={isLinked}
          />
          <Button
            size="sm"
            onClick={() =>
              addMaterial(
                row.original.id,
                row.original.title,
                materialType,
                localOrder
              )
            }
            disabled={isLinked}
            className={`h-8 px-3 ${
              isLinked ? "bg-green-100 text-green-800 hover:bg-green-100" : ""
            }`}
          >
            {isLinked ? (
              <>
                <Check className="h-3 w-3 mr-1" /> Linked
              </>
            ) : (
              <>
                <Link className="h-3 w-3 mr-1" /> Link
              </>
            )}
          </Button>
        </div>
      );
    },
  });
  const handleDrag = (startIndex: number, endIndex: number) => {
    const updated = [...linkedMaterials];
    const [movedItem] = updated.splice(startIndex, 1);
    updated.splice(endIndex, 0, movedItem);
    setLinkedMaterials(updated);
  };

  const renderChips = () => (
    <div className="mb-4">
      <h4 className="text-sm font-medium flex items-center gap-2 mb-2">
        <ListChecks className="w-4 h-4 text-muted-foreground" />
        Linked Materials ({linkedMaterials.length})
      </h4>
      <ul className="flex flex-col gap-2">
        {linkedMaterials.map((item, index) => (
          <li
            key={`${item.id}-${item.type}`}
            draggable
            onDragStart={(e) =>
              e.dataTransfer.setData("text/plain", index.toString())
            }
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              const sourceIndex = Number(e.dataTransfer.getData("text/plain"));
              handleDrag(sourceIndex, index);
            }}
            className="flex items-center bg-muted px-3 py-1 rounded-full text-sm shadow border w-fit gap-2 cursor-move"
          >
            <Move className="w-4 h-4 text-muted-foreground" />
            <span>
              {item.type} {item.title} #{index}
            </span>
            <button
              onClick={() => removeMaterial(item.id, item.type)}
              className="text-red-600 hover:text-red-800"
            >
              <X className="w-4 h-4" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );

  const ArticlesColumns = (): ColumnDef<Article>[] => [
    { accessorKey: "title", header: "Title" },
    { accessorKey: "author", header: "Author" },
    { accessorKey: "createdAt", header: "Created At" },
  ];

  const QuizColumns: ColumnDef<QuizGroup>[] = [
    ...QuizGroupColumns(),
    createLinkColumn(MaterialType.QUIZ_GROUP),
  ];
  const VideoColumnsExt: ColumnDef<Video>[] = [
    ...VideoColumns(),
    createLinkColumn(MaterialType.VIDEO),
  ];
  const ArticleColumns: ColumnDef<Article>[] = [
    ...ArticlesColumns(),
    createLinkColumn(MaterialType.ARTICLE),
  ];
  const CodeColumnsExt: ColumnDef<CodeMaterial>[] = [
    ...CodeColumns(),
    createLinkColumn<CodeMaterial>(MaterialType.CODE),
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" /> Link A Material
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-[900px] max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Link className="w-5 h-5 text-muted-foreground" /> Link Materials to
            Lesson
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <Tabs defaultValue="quiz" className="h-full flex flex-col">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="quiz">اختبار ({quiz.length})</TabsTrigger>
              <TabsTrigger value="video">فيديو ({video.length})</TabsTrigger>
              <TabsTrigger value="article">
                Article ({article.length})
              </TabsTrigger>
              <TabsTrigger value="code">
                <Code2 className="h-3 w-3" /> Code ({code.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="quiz" className="flex-1 overflow-auto">
              <DataTable columns={QuizColumns} data={quiz} />
            </TabsContent>
            <TabsContent value="video" className="flex-1 overflow-auto">
              <DataTable columns={VideoColumnsExt} data={video} />
            </TabsContent>
            <TabsContent value="article" className="flex-1 overflow-auto">
              <DataTable columns={ArticleColumns} data={article} />
            </TabsContent>
            <TabsContent value="code" className="flex-1 overflow-auto">
              <DataTable columns={CodeColumnsExt} data={code} />
            </TabsContent>
          </Tabs>
        </div>

        {renderChips()}

        <div className="flex justify-end mt-4">
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
