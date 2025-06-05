import { Course } from "@/utils/types";
import { QuizInput, ResourceInput, VideoInput } from "@/utils/types/adminTypes";
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

export const VideoColumns: ColumnDef<VideoInput>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "youtubeId",
    header: "Youtube Url",
  },
  {
    accessorKey: "duration",
    header: "Duration",
  },
];

export const ResourceColumns: ColumnDef<ResourceInput>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "type",
    header: "Type",
  },
];
