import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lesson } from "@/utils/types";
import { fetchAllLesson, linkModuleLesson } from "@/utils/_apis/admin-api";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { LessonColumns } from "../columns";

export default function MappedLessonsCreate({ id }: { id: string }) {
  const [order, setOrder] = useState<number | "">("");
  const [lessons, setLessons] = useState<Lesson[]>([]);

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

  const LessonColumnsLink: ColumnDef<Lesson>[] = [
    ...LessonColumns(),
    {
      header: "Link",
      cell: ({ row }) => {
        return (
          <Button
            onClick={async () =>
              await linkModuleLesson(
                {
                  lesson_id: row.original.id,
                  order: order || 0,
                },
                id ?? ""
              )
            }
          >
            Link
          </Button>
        );
      },
    },
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Link A Lesson</Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Link A New Lesson</DialogTitle>
        </DialogHeader>
        <div className="w-full flex flex-col  items-end">
          <Label>Set Counter</Label>
          <Input
            type="number"
            value={order}
            onChange={(e) => {
              const value = e.target.value;
              setOrder(value === "" ? "" : Number(value));
            }}
            className="w-20 mb-5"
          />
          <Button onClick={() => setOrder(order == "" ? 0 : order + 1)}>
            Increment Order
          </Button>
          <p>Current Order: {order || 0}</p>
        </div>
        <DataTable data={lessons} columns={LessonColumnsLink} />
      </DialogContent>
    </Dialog>
  );
}
