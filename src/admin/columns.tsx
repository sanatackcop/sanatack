import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Course, Lesson, Module, Roadmap } from "@/utils/types";
import { QuizGroup, Article, Video } from "@/utils/types/adminTypes";
import { Link } from "react-router-dom";
import DeleteDialog from "./components/deleteModal";
import { CodeMaterial } from "@/types/courses";

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
  onDelete: (id: string) => void,
  onEdit: (id: string) => void
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
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => onEdit(row.original.id)}
        >
          Edit
        </Button>
        <DeleteDialog
          onDelete={() => onDelete(row.original.id)}
          label="this course"
        />
      </div>
    ),
  },
];

export const QuizGroupColumns = (
  onDelete?: (id: string) => void,
  onEdit?: (id: string) => void
): ColumnDef<QuizGroup>[] => {
  const columns: ColumnDef<QuizGroup>[] = [
    {
      accessorKey: "title",
      header: "Title",
    },
    {
      header: "Show Quizzes",
      cell: ({ row }) => {
        const data = row.original;
        console.log({ data });
        return (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                عرض الأسئلة
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-[800px]">
              <DialogHeader>
                <DialogTitle>الأسئلة: {data.title}</DialogTitle>
              </DialogHeader>

              <div className="space-y-6 pt-4">
                {data.quizzes.map((quiz, index) => (
                  <div
                    key={quiz.id}
                    className="border rounded-md p-4 space-y-2 bg-muted/20"
                  >
                    <p className="font-semibold">
                      {index + 1}. {quiz.question}
                    </p>

                    <ul className="list-disc list-inside pl-2 space-y-1">
                      {quiz.options.map((opt, i) => (
                        <li
                          key={i}
                          className={
                            opt === quiz.correctAnswer
                              ? "font-bold text-green-600"
                              : ""
                          }
                        >
                          {opt}
                        </li>
                      ))}
                    </ul>

                    {quiz.explanation && (
                      <p className="text-muted-foreground text-sm">
                        الشرح: {quiz.explanation}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        );
      },
    },
  ];

  if (onDelete || onEdit) {
    columns.push({
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          {onEdit && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onEdit(row.original.id)}
            >
              Edit
            </Button>
          )}
          {onDelete && (
            <DeleteDialog
              onDelete={() => onDelete(row.original.id)}
              label={`the quiz "${row.original.title}"`}
            />
          )}
        </div>
      ),
    });
  }

  return columns;
};

export const VideoColumns = (
  onDelete?: (id: string) => void,
  onEdit?: (id: string) => void
): ColumnDef<Video>[] => {
  const columns: ColumnDef<Video>[] = [
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
      header: "Youtube URL",
    },
    {
      accessorKey: "duration",
      header: "Duration",
    },
  ];

  if (onDelete || onEdit) {
    columns.push({
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          {onEdit && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onEdit(row.original.id)}
            >
              Edit
            </Button>
          )}
          {onDelete && (
            <DeleteDialog
              onDelete={() => onDelete(row.original.id)}
              label={`the video "${row.original.title}"`}
            />
          )}
        </div>
      ),
    });
  }

  return columns;
};

export const ArticlesColumns = (
  onDelete?: (id: string) => void,
  onEdit?: (id: string) => void
): ColumnDef<Article>[] => {
  const columns: ColumnDef<Article>[] = [
    {
      accessorKey: "title",
      header: "Title",
    },
  ];

  if (onDelete || onEdit) {
    columns.push({
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          {onEdit && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onEdit(row.original.id)}
            >
              Edit
            </Button>
          )}
          {onDelete && (
            <DeleteDialog
              onDelete={() => onDelete(row.original.id)}
              label={`the article ID ${row.original.id}`}
            />
          )}
        </div>
      ),
    });
  }

  return columns;
};

export const CodeColumns = (
  onDelete?: (id: string) => void,
  onEdit?: (id: string) => void
): ColumnDef<CodeMaterial>[] => {
  const columns: ColumnDef<CodeMaterial>[] = [
    {
      accessorKey: "id",
      id: "id",
    },
    {
      accessorKey: "main_title",
      header: "Title",
    },
  ];

  if (onDelete || onEdit) {
    columns.push({
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          {onEdit && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onEdit(row.original.id)}
            >
              Edit
            </Button>
          )}
          {onDelete && (
            <DeleteDialog
              onDelete={() => onDelete(row.original.id)}
              label={`the article ID ${row.original.id}`}
            />
          )}
        </div>
      ),
    });
  }

  return columns;
};

export const LessonColumns = (
  onDelete?: (id: string) => void,
  onEdit?: (id: string) => void
): ColumnDef<Lesson>[] => {
  const columns: ColumnDef<Lesson>[] = [
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
      cell: ({ row }) => (
        <Link to={`/admin/lessons/${row.original.id}`}>
          <Button size="sm">Mapped Materials</Button>
        </Link>
      ),
    },
  ];

  if (onDelete || onEdit) {
    columns.push({
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          {onEdit && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onEdit(row.original.id)}
            >
              Edit
            </Button>
          )}
          {onDelete && (
            <DeleteDialog
              onDelete={() => onDelete(row.original.id)}
              label={`the lesson "${row.original.name}"`}
            />
          )}
        </div>
      ),
    });
  }

  return columns;
};

export function ModuleLessons(
  onDelete?: (id: string) => void,
  onEdit?: (id: string) => void
): ColumnDef<Module>[] {
  const baseColumns: ColumnDef<Module>[] = [
    {
      header: "Title",
      accessorKey: "title",
    },
    {
      header: "Duration",
      accessorKey: "duration",
    },
    {
      header: "Mapped Lessons",
      cell: ({ row }) => (
        <Link to={`/admin/modules/${row.original.id}`}>
          <Button size="sm">Mapped Lessons</Button>
        </Link>
      ),
    },
  ];

  if (onDelete && onEdit) {
    baseColumns.push({
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onEdit?.(row.original.id)}
          >
            Edit
          </Button>
          <DeleteDialog
            onDelete={() => onDelete?.(row.original.id)}
            label={`the module "${row.original.title}"`}
          />
        </div>
      ),
    });
  }

  return baseColumns;
}
