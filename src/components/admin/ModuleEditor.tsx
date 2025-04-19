import { X, Plus } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Action, LessonInput, ModuleInput } from "@/utils/types/adminTypes";
import { nanoid } from "nanoid";
import LessonEditor from "./LessonEditor";

const existingLessons: { id: string; title: string }[] = [
  { id: "les-ready-1", title: "Variables & Types" },
];

const createEmptyLesson = (order: number): LessonInput => ({
  id: nanoid(),
  name: "",
  description: "",
  order,
  isExisting: false,
  videos: [],
  resources: [],
  quizzes: [],
});

const ModuleEditor = React.memo<{
  module: ModuleInput;
  index: number;
  dispatch: React.Dispatch<Action>;
}>(({ module, index, dispatch }) => {
  const addLesson = () =>
    dispatch({
      type: "ADD_LESSON",
      moduleId: module.id,
      lesson: createEmptyLesson(module.lessons.length + 1),
    });

  const assignExistingLesson = (lessonId: string) => {
    const selected = existingLessons.find((l) => l.id === lessonId);
    if (!selected) return;
    dispatch({
      type: "ADD_LESSON",
      moduleId: module.id,
      lesson: {
        id: selected.id,
        name: selected.title,
        description: "",
        order: module.lessons.length + 1,
        isExisting: true,
        videos: [],
        resources: [],
        quizzes: [],
      },
    });
  };

  return (
    <li className="rounded-lg border p-4 space-y-4 bg-muted !text-left">
      <div className="flex items-start justify-between">
        <p className="font-medium text-right">
          {index + 1}
          {module.isExisting ? (
            <span>{module.title}</span>
          ) : (
            <Input
              placeholder="Module title"
              value={module.title}
              onChange={(e) =>
                dispatch({
                  type: "UPDATE_MODULE",
                  moduleId: module.id,
                  data: { title: e.target.value },
                })
              }
              className="h-9 text-left"
            />
          )}
        </p>
        <Button
          size="icon"
          type="button"
          variant="ghost"
          onClick={() =>
            dispatch({ type: "REMOVE_MODULE", moduleId: module.id })
          }
        >
          <X size={18} />
        </Button>
      </div>

      {!module.isExisting && (
        <Textarea
          placeholder="Module description"
          value={module.description}
          onChange={(e) =>
            dispatch({
              type: "UPDATE_MODULE",
              moduleId: module.id,
              data: { description: e.target.value },
            })
          }
          rows={2}
        />
      )}

      <div className="space-y-2">
        <header className="flex items-center justify-between">
          <div className="flex gap-2">
            <Button
              size="sm"
              type="button"
              variant="outline"
              onClick={addLesson}
            >
              <Plus size={14} className="mr-1" /> New Lesson
            </Button>
            {existingLessons.length > 0 && (
              <Select onValueChange={assignExistingLesson}>
                <SelectTrigger className="w-40 h-8">
                  <SelectValue placeholder="Assign Lesson" />
                </SelectTrigger>
                <SelectContent>
                  {existingLessons.map((l) => (
                    <SelectItem key={l.id} value={l.id}>
                      {l.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
          <p className="font-semibold text-sm">Lessons</p>
        </header>

        {module.lessons.length > 0 && (
          <ul className="space-y-3 max-h-56 overflow-y-auto pr-1">
            {module.lessons.map((les, li) => (
              <LessonEditor
                key={les.id}
                lesson={les}
                index={li}
                onUpdate={(data) =>
                  dispatch({
                    type: "UPDATE_LESSON",
                    moduleId: module.id,
                    lessonId: les.id,
                    data,
                  })
                }
                onRemove={() =>
                  dispatch({
                    type: "REMOVE_LESSON",
                    moduleId: module.id,
                    lessonId: les.id,
                  })
                }
              />
            ))}
          </ul>
        )}
      </div>
    </li>
  );
});
ModuleEditor.displayName = "ModuleEditor";
export default ModuleEditor;
