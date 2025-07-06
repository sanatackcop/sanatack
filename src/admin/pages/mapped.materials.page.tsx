import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LinkedVideo } from "@/utils/types/adminTypes";
import { DataTable } from "@/components/ui/data-table";
import {
  ArticlesColumns,
  CodeColumns,
  QuizGroupColumns,
  VideoColumns,
} from "../columns";
import { getLinkedLessonMaterials } from "@/utils/_apis/admin-api";
import { lazy } from "react";
import { QuizGroup } from "@/utils/types/adminTypes";
const MappedMaterialsCreate = lazy(
  () => import("../components/mapped.materials.create")
);

export declare type MappedMaterials = {
  quiz_groups: QuizGroup[];
  videos: LinkedVideo[];

  code: any[];
  article: any[];
};

export default function MappedMaterials() {
  const [quizGroup, setQuizGroup] = useState<QuizGroup[]>([]);
  const [video, setVideo] = useState<LinkedVideo[]>([]);
  const [article, setArticle] = useState<any[]>([]);
  const [code, setCode] = useState<any[]>([]);
  const location = useLocation();
  const { pathname } = location;
  const id = pathname.split("/").at(-1) ?? "";

  async function fetchCourses() {
    try {
      const linkedMaterials = await getLinkedLessonMaterials<MappedMaterials>(
        id
      );

      console.log(linkedMaterials);

      if (linkedMaterials) {
        if (linkedMaterials.quiz_groups)
          setQuizGroup(linkedMaterials.quiz_groups);
        if (linkedMaterials.videos) setVideo(linkedMaterials.videos);
        if (linkedMaterials.article) setArticle(linkedMaterials.article);
        if (linkedMaterials.code) setCode(linkedMaterials.code);
      }
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    fetchCourses();
  }, []);

  const combinedMaterial = [...quizGroup, ...video, ...article].sort(
    (a, b) => a.order - b.order
  );

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
          <TabsTrigger value="all">الكل</TabsTrigger>
          <TabsTrigger value="quiz">اختبار</TabsTrigger>
          <TabsTrigger value="video">فيديو</TabsTrigger>
          <TabsTrigger value="article">article</TabsTrigger>
          <TabsTrigger value="code">code</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <DataTable
            columns={[
              { accessorKey: "title", header: "Title" },
              { accessorKey: "type", header: "Type" },
              { accessorKey: "order", header: "Order" },
            ]}
            data={combinedMaterial}
          />
        </TabsContent>
        <TabsContent value="quiz">
          <DataTable
            columns={[
              ...QuizGroupColumns(),
              { accessorKey: "order", header: "Order" },
            ]}
            data={quizGroup}
          />
        </TabsContent>
        <TabsContent value="video">
          <DataTable
            columns={[
              ...VideoColumns(),
              { accessorKey: "order", header: "Order" },
            ]}
            data={video}
          />
        </TabsContent>
        <TabsContent value="article">
          <DataTable
            columns={[
              ...ArticlesColumns(),
              { accessorKey: "order", header: "Order" },
            ]}
            data={article}
          />
        </TabsContent>
        <TabsContent value="code">
          <DataTable columns={[...CodeColumns()]} data={code} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
