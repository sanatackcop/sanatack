import { useEffect, useState } from "react";
import {
  getQuizList,
  getResourcesList,
  getVideosList,
} from "@/utils/_apis/admin-api";
import { DataTable } from "@/components/ui/data-table";
import { QuizColumns, ResourceColumns, VideoColumns } from "../columns";
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
import { Quiz, Resource, Video } from "@/utils/types/adminTypes";
import { CustomError } from "@/utils/_apis/api";

export default function MaterialsPage() {
  const [quiz, setQuiz] = useState<Quiz[]>([]);
  const [video, setVideo] = useState<Video[]>([]);
  const [resource, setResource] = useState<Resource[]>([]);

  const [error, setError] = useState<string | null>(null);

  const [menuOpen, setMenuOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState<
    "quiz" | "video" | "resource" | null
  >(null);

  async function fetchCourses() {
    try {
      const [quizList, videoList, resourceList] = await Promise.all([
        getQuizList<Quiz[]>(),
        getVideosList<Video[]>(),
        getResourcesList<Resource[]>(),
      ]);

      if (quizList?.length) setQuiz(quizList);
      if (videoList?.length) setVideo(videoList);
      if (resourceList?.length) setResource(resourceList);
    } catch (err: unknown) {
      if ((err as CustomError).error.type == "network")
        setError("Error when trying to fetch data.");
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
  };

  const handleDialogOpen = (type: "quiz" | "video" | "resource") => {
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
            <DropdownMenuLabel>الموارد</DropdownMenuLabel>
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
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {openDialog && dialogMap[openDialog]}

      <Tabs defaultValue="quiz">
        <TabsList className="mt-2 w-full justify-end">
          <TabsTrigger value="quiz">اختبار</TabsTrigger>
          <TabsTrigger value="video">فيديو</TabsTrigger>
          <TabsTrigger value="resource">الموارد</TabsTrigger>
        </TabsList>
        <TabsContent value="quiz">
          <DataTable columns={QuizColumns} data={quiz} />
        </TabsContent>
        <TabsContent value="video">
          <DataTable columns={VideoColumns} data={video} />
        </TabsContent>
        <TabsContent value="resource">
          <DataTable columns={ResourceColumns} data={resource} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
