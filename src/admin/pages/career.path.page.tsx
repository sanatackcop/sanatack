import { useEffect, useState } from "react";
import { deleteCourse, getListCoursesApi } from "@/utils/_apis/admin-api";
import { Course } from "@/utils/types";
import { DataTable } from "@/components/ui/data-table";
import { CourseColumns } from "../columns";
import CourseCreate from "../components/course.create";

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
  async function handleDelete(courseId: string) {
      try {
        await deleteCourse(courseId);
        fetchCourses();
      } catch (err) {
        console.error("Failed to delete course:", err);
      }
    }

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div className=" w-full ">
      <div className="mb-5">
        <CourseCreate updateTable={() => fetchCourses()} />
      </div>

      <DataTable columns={CourseColumns(handleDelete)} data={courses} />
    </div>
  );
}
