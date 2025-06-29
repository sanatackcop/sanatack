import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Lesson } from "@/utils/types";
import { fetchAllLesson, linkModuleLesson } from "@/utils/_apis/admin-api";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { LessonColumns } from "../columns";
import { X } from "lucide-react";

interface LinkedLesson {
  id: string;
}

export default function MappedLessonsCreate({ id }: { id: string }) {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [linkedLessons, setLinkedLessons] = useState<LinkedLesson[]>([]);

  async function fetchLessons() {
    try {
      const lessons = await fetchAllLesson<Lesson[]>();
      if (lessons && lessons.length) setLessons(lessons);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    fetchLessons();
  }, []);

  const addLesson = (id: string) => {
    if (!linkedLessons.find((l) => l.id === id)) {
      setLinkedLessons((prev) => [...prev, { id }]);
    }
  };

  const removeLesson = (id: string) => {
    setLinkedLessons((prev) => prev.filter((l) => l.id !== id));
  };

  const handleSubmit = async () => {
    try {
      const payload = linkedLessons.map((lesson, index) => ({
        lesson_id: lesson.id,
        order: index,
      }));
      await Promise.all(payload.map((p) => linkModuleLesson(p, id)));
      setLinkedLessons([]);
    } catch (err) {
      console.error("Failed to patch lessons", err);
    }
  };

  const LessonColumnsLink: ColumnDef<Lesson>[] = [
    ...LessonColumns(),
    {
      header: "Link",
      cell: ({ row }) => {
        const alreadyLinked = linkedLessons.some(
          (l) => l.id === row.original.id
        );
        return (
          <Button
            variant="secondary"
            onClick={() => addLesson(row.original.id)}
            disabled={alreadyLinked}
          >
            {alreadyLinked ? "Linked" : "Link"}
          </Button>
        );
      },
    },
  ];

  const renderChips = () => (
    <div className="flex flex-wrap gap-2 mb-4">
      {linkedLessons.map((item, index) => (
        <div
          key={item.id}
          className="flex items-center bg-muted px-3 py-1 rounded-full text-sm"
        >
          <span className="mr-2">Lesson #{index + 1}</span>
          <button
            onClick={() => removeLesson(item.id)}
            className="text-red-600 hover:text-red-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Link A Lesson</Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Link A New Lesson</DialogTitle>
        </DialogHeader>

        {renderChips()}

        <DataTable data={lessons} columns={LessonColumnsLink} />

        <div className="flex justify-end mt-6">
          <Button onClick={handleSubmit} disabled={linkedLessons.length === 0}>
            Submit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
