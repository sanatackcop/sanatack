import { Button } from "@/components/ui/button";
import { Article } from "@/types/articles/articles";
import { Course, Lesson, Module, Roadmap } from "@/utils/types";
import { Quiz, Resource, Video } from "@/utils/types/adminTypes";
import { ColumnDef } from "@tanstack/react-table";
import { Link } from "react-router-dom";
import DeleteDialog from "./components/deleteModal";

export const RoadmapColumns: ColumnDef<Roadmap>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    header: "Mapped Courses",
    cell: ({ row }) => {
      return (
        <Link to={`/admin/roadmaps/${row.original.id}`}>
          <Button size="sm">Mapped Courses</Button>
        </Link>
      );
    },
  },
];

export const CourseColumns = (
  onDelete: (id: string) => void
): ColumnDef<Course>[] => [
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
  {
    header: "Mapped Modules",
    cell: ({ row }) => {
      return (
        <Link to={`/admin/courses/${row.original.id}`}>
          <Button size="sm">Mapped Modules</Button>
        </Link>
      );
    },
  },
  {
    header: "Actions",
    cell: ({ row }) => (
      <DeleteDialog
        onDelete={() => onDelete(row.original.id)}
        label="this course"
      />
    ),
  },
];
export const QuizColumns = (
  onDelete: (id: string) => void
): ColumnDef<Quiz>[] => [
  {
    accessorKey: "question",
    header: "Question",
  },
  {
    accessorKey: "correctAnswer",
    header: "Answer",
  },
  {
    header: "Actions",
    cell: ({ row }) => (
      <DeleteDialog
        onDelete={() => onDelete(row.original.id)}
        label={`the quiz "${row.original.question}"`}
      />
    ),
  },
];

export const VideoColumns = (
  onDelete: (id: string) => void
): ColumnDef<Video>[] => [
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
  {
    header: "Actions",
    cell: ({ row }) => (
      <DeleteDialog
        onDelete={() => onDelete(row.original.id)}
        label={`the video "${row.original.title}"`}
      />
    ),
  },
];

export const ArticlesColumns = (
  onDelete: (id: string) => void
): ColumnDef<Article>[] => [
  {
    accessorKey: "id",
    id: "id",
  },
  {
    accessorKey: "data[0].title", // first section title
    header: "Title",
  },
  {
    accessorKey: "data[0].type", // type of first section
    header: "Type",
  },
  {
    header: "Actions",
    cell: ({ row }) => (
      <DeleteDialog
        onDelete={() => onDelete(row.original.id)}
        label={`the article ID ${row.original.id}`}
      />
    ),
  },
];

export const LessonColumns = (
  onDelete: (id: string) => void
): ColumnDef<Lesson>[] => [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    header: "Mapped Materials",
    cell: ({ row }) => {
      return (
        <Link to={`/admin/lessons/${row.original.id}`}>
          <Button size="sm">Mapped Materials</Button>
        </Link>
      );
    },
  },
  {
    header: "Actions",
    cell: ({ row }) => (
      <DeleteDialog
        onDelete={() => onDelete(row.original.id)}
        label={`the lesson "${row.original.name}"`}
      />
    ),
  },
];

export const ModuleLessons = (
  onDelete: (id: string) => void
): ColumnDef<Module>[] => [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    header: "Mapped Lessons",
    cell: ({ row }) => (
      <Link to={`/admin/modules/${row.original.id}`}>
        <Button size="sm">Mapped Lessons</Button>
      </Link>
    ),
  },
  {
    header: "Actions",
    cell: ({ row }) => (
      <DeleteDialog
        onDelete={() => onDelete(row.original.id)}
        label={`the module "${row.original.title}"`}
      />
    ),
  },
];
