import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MaterialType, Quiz, Resource, Video } from "@/utils/types/adminTypes";
import { useEffect, useState } from "react";
import { QuizColumns, ResourceColumns, VideoColumns } from "../columns";
import {
  getQuizList,
  getResourcesList,
  getVideosList,
  linkLessonQuiz,
} from "@/utils/_apis/admin-api";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function MappedMaterialsCreate({ id }: { id: string }) {
  const [quiz, setQuiz] = useState<Quiz[]>([]);
  const [video, setVideo] = useState<Video[]>([]);
  const [resource, setResource] = useState<Resource[]>([]);
  const [order, setOrder] = useState<number | "">("");

  async function fetchCourses() {
    try {
      const [quizList, videoList, resourceList] = await Promise.all([
        getQuizList<Quiz[]>(),
        getVideosList<Video[]>(),
        getResourcesList<Resource[]>(),
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

  const QuizColumnsLink: ColumnDef<Quiz>[] = [
    ...QuizColumns,
    {
      header: "Link",
      cell: ({ row }) => {
        return (
          <Button
            onClick={async () =>
              await linkLessonQuiz({
                material_id: row.original.id,
                lesson_id: id ?? "",
                type: MaterialType.Quiz,
                order: order || 0,
              })
            }
          >
            Link
          </Button>
        );
      },
    },
  ];

  const VideoColumnsLink: ColumnDef<Video>[] = [
    ...VideoColumns,
    {
      header: "Link",
      cell: ({ row }) => {
        return (
          <Button
            onClick={async () =>
              await linkLessonQuiz({
                material_id: row.original.id,
                lesson_id: id ?? "",
                type: MaterialType.Video,
                order: order || 0,
              })
            }
          >
            Link
          </Button>
        );
      },
    },
  ];
  const ResourceColumnsLink: ColumnDef<Resource>[] = [
    ...ResourceColumns,
    {
      header: "Link",
      cell: ({ row }) => {
        return (
          <Button
            onClick={async () =>
              await linkLessonQuiz({
                material_id: row.original.id,
                lesson_id: id ?? "",
                type: MaterialType.Resource,
                order: order || 0,
              })
            }
          >
            Link
          </Button>
        );
      },
    },
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Link A Material</Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Link A New Material</DialogTitle>
        </DialogHeader>
        <div className="w-full flex flex-col  items-end">
          <Label>Set Counter</Label>
          <Input
            type="number"
            value={order}
            onChange={(e) => {
              const value = e.target.value;
              setOrder(value === "" ? "" : Number(value));
            }}
            className="w-20 mb-5"
          />
          <Button onClick={() => setOrder(order == "" ? 0 : order + 1)}>
            Increment Order
          </Button>
          <p>Current Order: {order || 0}</p>
        </div>
        <Tabs defaultValue="quiz">
          <TabsList className="mt-2 w-full justify-end">
            <TabsTrigger value="quiz">اختبار</TabsTrigger>
            <TabsTrigger value="video">فيديو</TabsTrigger>
            <TabsTrigger value="resource">الموارد</TabsTrigger>
          </TabsList>
          <TabsContent value="quiz">
            <DataTable columns={QuizColumnsLink} data={quiz} />
          </TabsContent>
          <TabsContent value="video">
            <DataTable columns={VideoColumnsLink} data={video} />
          </TabsContent>
          <TabsContent value="resource">
            <DataTable columns={ResourceColumnsLink} data={resource} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
