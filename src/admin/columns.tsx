import { Course } from "@/utils/types";
import { QuizInput } from "@/utils/types/adminTypes";
import { ColumnDef } from "@tanstack/react-table";

export const CourseColumns: ColumnDef<Course>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "level",
    header: "Level",
  },
];

export const QuizColumns: ColumnDef<QuizInput>[] = [
  {
    accessorKey: "question",
    header: "Question",
  },
  {
    accessorKey: "correctAnswer",
    header: "Answer",
  },
];
