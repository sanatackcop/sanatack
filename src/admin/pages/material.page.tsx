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
import { QuizInput, ResourceInput, VideoInput } from "@/utils/types/adminTypes";

export default function MaterialsPage() {
  const [quiz, setQuiz] = useState<QuizInput[]>([]);
  const [video, setVideo] = useState<VideoInput[]>([]);
  const [resource, setResource] = useState<ResourceInput[]>([]);

  async function fetchCourses() {
    try {
      const [quizList, videoList, resourceList] = await Promise.all([
        getQuizList<QuizInput[]>(),
        getVideosList<VideoInput[]>(),
        getResourcesList<ResourceInput[]>(),
      ]);

      if (quizList && quizList.length) setQuiz(quizList);
      if (videoList && videoList.length) setVideo(videoList);
      if (resourceList && resourceList.length) setResource(resourceList);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div className="w-full">
      <div className="w-full flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger className=" bg-slate-200 p-2 rounded-lg">
            إنشاء مورد
          </DropdownMenuTrigger>
          <DropdownMenuContent className="relative left-5">
            <DropdownMenuLabel>الموارد</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <QuizDialogCreate />
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <VideoDialogCreate />
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <ResourceDialogCreate />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Tabs defaultValue="quiz">
        <TabsList>
          <TabsTrigger value="quiz">اختبار</TabsTrigger>
          <TabsTrigger value="video">فيديو</TabsTrigger>
          <TabsTrigger value="resource">الموارد</TabsTrigger>
        </TabsList>
        <TabsContent value="quiz">
          {quiz.length > 0 ? (
            <DataTable columns={QuizColumns} data={quiz} />
          ) : (
            <p className="flex justify-center">No Quizzes</p>
          )}
        </TabsContent>
        <TabsContent value="video">
          {video.length > 0 ? (
            <DataTable columns={VideoColumns} data={video} />
          ) : (
            <p className="flex justify-center">No Videos</p>
          )}
        </TabsContent>
        <TabsContent value="resource">
          {resource.length > 0 ? (
            <DataTable columns={ResourceColumns} data={resource} />
          ) : (
            <p className="flex justify-center">No Resources</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
