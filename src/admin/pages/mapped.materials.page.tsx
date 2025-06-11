import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LinkedQuiz,
  LinkedResource,
  LinkedVideo,
} from "@/utils/types/adminTypes";
import { DataTable } from "@/components/ui/data-table";
import { QuizColumns, ResourceColumns, VideoColumns } from "../columns";
import { getLinkedLessonMaterials } from "@/utils/_apis/admin-api";
import { lazy } from "react";
const MappedMaterialsCreate = lazy(
  () => import("../components/mapped.materials.create")
);

export declare type MappedMaterials = {
  quizzes: LinkedQuiz[];
  videos: LinkedVideo[];
  resources: LinkedResource[];
};

export default function MappedMaterials() {
  const [quiz, setQuiz] = useState<LinkedQuiz[]>([]);
  const [video, setVideo] = useState<LinkedVideo[]>([]);
  const [resource, setResource] = useState<LinkedResource[]>([]);
  const location = useLocation();
  const { pathname } = location;
  const id = pathname.split("/").at(-1) ?? "";

  async function fetchCourses() {
    try {
      const linkedMaterials = await getLinkedLessonMaterials<MappedMaterials>(
        id
      );

      if (linkedMaterials) {
        if (linkedMaterials.quizzes) setQuiz(linkedMaterials.quizzes);
        if (linkedMaterials.videos) setVideo(linkedMaterials.videos);
        if (linkedMaterials.resources) setResource(linkedMaterials.resources);
      }
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div>
      <div className="w-full flex justify-end">
        <Link to="/admin/lessons">
          <Button>Back</Button>
        </Link>
      </div>

      <MappedMaterialsCreate id={id} />

      <Tabs defaultValue="quiz">
        <TabsList className="mt-2 w-full justify-end">
          <TabsTrigger value="quiz">اختبار</TabsTrigger>
          <TabsTrigger value="video">فيديو</TabsTrigger>
          <TabsTrigger value="resource">الموارد</TabsTrigger>
        </TabsList>
        <TabsContent value="quiz">
          <DataTable
            columns={[
              ...QuizColumns,
              { accessorKey: "order", header: "Order" },
            ]}
            data={quiz}
          />
        </TabsContent>
        <TabsContent value="video">
          <DataTable
            columns={[
              ...VideoColumns,
              { accessorKey: "order", header: "Order" },
            ]}
            data={video}
          />
        </TabsContent>
        <TabsContent value="resource">
          <DataTable
            columns={[
              ...ResourceColumns,
              { accessorKey: "order", header: "Order" },
            ]}
            data={resource}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
