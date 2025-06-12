import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { lazy } from "react";
import { Lesson } from "@/utils/types";
import { DataTable } from "@/components/ui/data-table";
import { getLinkedLessonsModules } from "@/utils/_apis/admin-api";
import { ColumnDef } from "@tanstack/react-table";
const MappedLessonsCreate = lazy(
  () => import("../components/mapped.lessons.create")
);

export declare type MappedLessons = {
  order: number;
  lesson: Lesson;
};

export default function MappedLessons() {
  const [mappedLessons, setMappedLessons] = useState<MappedLessons[]>([]);
  const location = useLocation();
  const { pathname } = location;
  const id = pathname.split("/").at(-1) ?? "";

  async function fetchLessons() {
    try {
      const lessons = await getLinkedLessonsModules<MappedLessons[]>(id);
      if (lessons && lessons.length) setMappedLessons(lessons);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    fetchLessons();
  }, []);

  const LinkedLessonColumns: ColumnDef<MappedLessons>[] = [
    {
      accessorKey: "lesson.name",
      header: "Name",
    },
    {
      accessorKey: "lesson.description",
      header: "Description",
    },
  ];

  return (
    <div>
      <div className="w-full flex justify-end">
        <Link to="/admin/modules">
          <Button>Back</Button>
        </Link>
      </div>

      <div className="mb-5">
        <MappedLessonsCreate id={id} />
      </div>
      <DataTable
        columns={[
          ...LinkedLessonColumns,
          { accessorKey: "order", header: "Order" },
        ]}
        data={mappedLessons}
      />
    </div>
  );
}
