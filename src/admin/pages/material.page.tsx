import { useEffect, useState } from "react";
import { getQuizList } from "@/utils/_apis/admin-api";
import { DataTable } from "@/components/ui/data-table";
import { QuizColumns } from "../columns";
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
import { QuizInput } from "@/utils/types/adminTypes";

export default function MaterialsPage() {
  const [quiz, setQuiz] = useState<QuizInput[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  async function fetchCourses() {
    setLoading(true);
    try {
      const res = await getQuizList<QuizInput[]>();
      if (res) setQuiz(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
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
            <p className="flex justify-center">No Quiz</p>
          )}
        </TabsContent>
        {/* <TabsContent value="video">
          {courses.length > 0 ? (
            <DataTable columns={CourseColumns} data={courses} />
          ) : (
            <p className="flex justify-center">No Video</p>
          )}
        </TabsContent>
        <TabsContent value="resource">
          {courses.length > 0 ? (
            <DataTable columns={CourseColumns} data={courses} />
          ) : (
            <p className="flex justify-center">No Resource</p>
          )}
        </TabsContent> */}
      </Tabs>
    </div>
  );
}
