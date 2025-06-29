import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MaterialType, QuizGroup, Video } from "@/utils/types/adminTypes";
import { useEffect, useState } from "react";
import { QuizGroupColumns, VideoColumns } from "../columns";
import {
  getArticlesList,
  getQuizList,
  getVideosList,
  linkLessonMaterial,
} from "@/utils/_apis/admin-api";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { X } from "lucide-react";
import { Article } from "@/types/articles/articles";

interface LinkedMaterial {
  id: string;
  title: string;
  type: MaterialType;
}

export default function MappedMaterialsCreate({ id }: { id: string }) {
  const [quiz, setQuiz] = useState<QuizGroup[]>([]);
  const [video, setVideo] = useState<Video[]>([]);
  const [article, setArticle] = useState<Article[]>([]);
  const [linkedMaterials, setLinkedMaterials] = useState<LinkedMaterial[]>([]);

  async function fetchCourses() {
    try {
      const [quizList, videoList, articleList] = await Promise.all([
        getQuizList<QuizGroup[]>(),
        getVideosList<Video[]>(),
        getArticlesList<Article[]>(),
      ]);

      if (quizList) setQuiz(quizList);
      if (articleList) setArticle(articleList);
      if (videoList) setVideo(videoList);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    fetchCourses();
  }, []);

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

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Link A Material</Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Link A New Material</DialogTitle>
        </DialogHeader>

        {renderChips()}

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
