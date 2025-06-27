import { useEffect, useState } from "react";
import {
  getQuizList,
  getArticlesList,
  getVideosList,
  deleteQuiz,
  deleteArticle,
  deleteVideo,
} from "@/utils/_apis/admin-api";
import { DataTable } from "@/components/ui/data-table";
import { ArticlesColumns, QuizColumns, VideoColumns } from "../columns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import QuizDialogCreate from "../components/quiz.create";
import VideoDialogCreate from "../components/video.create";
import ResourceDialogCreate from "../components/resource.create";
import { Quiz, Video } from "@/utils/types/adminTypes";
import { CustomError } from "@/utils/_apis/api";
import ArticleDialogCreate from "../components/article.create";
import { Article } from "@/types/articles/articles";
import QuizEdit from "../components/quiz.edit";
import VideoEdit from "../components/video.edit";
import ArticleEdit from "../components/article.edit";

export default function MaterialsPage() {
  const [quiz, setQuiz] = useState<Quiz[]>([]);
  const [video, setVideo] = useState<Video[]>([]);
  const [article, setArticles] = useState<Article[]>([]);

  const [editingQuizId, setEditingQuizId] = useState<string | null>(null);
  const [editingVideoId, setEditingVideoId] = useState<string | null>(null);
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);

  const [error, setError] = useState<string | null>(null);

  const [menuOpen, setMenuOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState<
    "quiz" | "video" | "resource" | "article" | null
  >(null);

  async function fetchCourses() {
    try {
      const [quizList, videoList, articleList] = await Promise.all([
        getQuizList<Quiz[]>(),
        getVideosList<Video[]>(),
        getArticlesList<Article[]>(),
      ]);

      if (quizList?.length) setQuiz(quizList);
      if (videoList?.length) setVideo(videoList);
      if (articleList?.length) setArticles(articleList);
    } catch (err: unknown) {
      if ((err as CustomError).error.type == "network")
        setError("Error when trying to fetch data.");
    }
  }

  async function handleDeleteQuiz(id: string) {
    try {
      await deleteQuiz(id);
      fetchCourses();
    } catch (err) {
      console.error("Failed to delete quiz:", err);
    }
  }
  async function handleDeleteVideo(id: string) {
    try {
      await deleteVideo(id);
      fetchCourses();
    } catch (err) {
      console.error("Failed to delete video:", err);
    }
  }

  async function handleDeleteArticle(id: string) {
    try {
      await deleteArticle(id);
      fetchCourses();
    } catch (err) {
      console.error("Failed to delete article:", err);
    }
  }

  useEffect(() => {
    fetchCourses();
  }, []);

  const dialogMap: Record<string, React.ReactNode> = {
    quiz: (
      <QuizDialogCreate
        open
        onOpenChange={(open) => !open && setOpenDialog(null)}
        updateTable={() => fetchCourses()}
      />
    ),
    video: (
      <VideoDialogCreate
        open
        onOpenChange={(open) => !open && setOpenDialog(null)}
        updateTable={() => fetchCourses()}
      />
    ),
    resource: (
      <ResourceDialogCreate
        open
        onOpenChange={(open) => !open && setOpenDialog(null)}
        updateTable={() => fetchCourses()}
      />
    ),
    article: (
      <ArticleDialogCreate
        open
        onOpenChange={(open) => !open && setOpenDialog(null)}
        updateTable={() => fetchCourses()}
      />
    ),
  };

  const handleDialogOpen = (
    type: "quiz" | "video" | "resource" | "article"
  ) => {
    setMenuOpen(false); // close dropdown
    setTimeout(() => setOpenDialog(type), 0); // wait for DOM to clean up
  };

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <div className="w-full flex justify-start">
        <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
          <DropdownMenuTrigger className="bg-slate-200 p-2 rounded-lg">
            إنشاء مورد
          </DropdownMenuTrigger>
          <DropdownMenuContent className="relative left-5">
            <DropdownMenuLabel>Matrials</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleDialogOpen("quiz")}>
              اختبار
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDialogOpen("video")}>
              فيديو
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDialogOpen("resource")}>
              مورد
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDialogOpen("article")}>
              article{" "}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {openDialog && dialogMap[openDialog]}

      <Tabs defaultValue="quiz">
        <TabsList className="mt-2 w-full justify-end">
          <TabsTrigger value="quiz">quiz</TabsTrigger>
          <TabsTrigger value="video">video</TabsTrigger>
          <TabsTrigger value="article">article</TabsTrigger>
        </TabsList>
        <TabsContent value="quiz">
          <DataTable
            columns={QuizColumns(handleDeleteQuiz, (id) =>
              setEditingQuizId(id)
            )}
            data={quiz}
          />
        </TabsContent>
        <TabsContent value="video">
          <DataTable
            columns={VideoColumns(handleDeleteVideo, (id) =>
              setEditingVideoId(id)
            )}
            data={video}
          />
        </TabsContent>
        <TabsContent value="article">
          <DataTable
            columns={ArticlesColumns(handleDeleteArticle, (id) =>
              setEditingArticleId(id)
            )}
            data={article}
          />
        </TabsContent>
      </Tabs>
      {editingQuizId && (
        <QuizEdit
          quizId={editingQuizId}
          onClose={() => setEditingQuizId(null)}
          onUpdated={fetchCourses}
        />
      )}

      {editingVideoId && (
        <VideoEdit
          videoId={editingVideoId}
          onClose={() => setEditingVideoId(null)}
          onUpdated={fetchCourses}
        />
      )}

      {editingArticleId && (
        <ArticleEdit
          articleId={editingArticleId}
          onClose={() => setEditingArticleId(null)}
          onUpdated={fetchCourses}
        />
      )}
    </div>
  );
}
