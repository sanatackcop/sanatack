import { useEffect, useState } from "react";
import { getListCoursesApi } from "@/utils/_apis/admin-api";
import { Course } from "@/utils/types";
import { DataTable } from "@/components/ui/data-table";
import { CourseColumns } from "../columns";

export default function CoursePage() {
  const [courses, setCourses] = useState<Course[]>([]);

  async function fetchCourses() {
    try {
      const res = await getListCoursesApi({});
      if (res) {
        setCourses(res as Course[]);
      }
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div className=" w-full ">
      <DataTable columns={CourseColumns} data={courses} />
    </div>
  );
}
