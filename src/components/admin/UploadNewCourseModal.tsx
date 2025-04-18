"use client";

import { useReducer, useRef, FormEvent, useCallback } from "react";
import { nanoid } from "nanoid";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, X } from "lucide-react";
import React from "react";

export type CourseLevel = "beginner" | "intermediate" | "advanced";

interface LessonInput {
  id: string;
  name: string;
  description: string;
  order: number;
  isExisting: boolean;
}

interface ModuleInput {
  id: string;
  title: string;
  description: string;
  lessons: LessonInput[];
  isExisting: boolean;
}

interface CourseForm {
  title: string;
  description: string;
  level: CourseLevel;
  tags: string[];
  isPublish: boolean;
  modules: ModuleInput[];
}

interface Props {
  showDialog: boolean;
  setShowDialog: (open: boolean) => void;
}

const existingModules: { id: string; title: string }[] = [
  { id: "mod‑ready‑1", title: "JavaScript Basics" },
];
const existingLessons: { id: string; name: string }[] = [
  { id: "les‑ready‑1", name: "Variables & Types" },
];

const initialState: CourseForm = {
  title: "",
  description: "",
  level: "beginner",
  tags: [],
  isPublish: false,
  modules: [],
};

type Action =
  | { type: "UPDATE_FIELD"; key: keyof Omit<CourseForm, "modules">; value: any }
  | { type: "ADD_TAG"; tag: string }
  | { type: "REMOVE_TAG"; tag: string }
  | { type: "ADD_MODULE"; module: ModuleInput }
  | { type: "REMOVE_MODULE"; moduleId: string }
  | { type: "UPDATE_MODULE"; moduleId: string; data: Partial<ModuleInput> }
  | { type: "ADD_LESSON"; moduleId: string; lesson: LessonInput }
  | { type: "REMOVE_LESSON"; moduleId: string; lessonId: string }
  | {
      type: "UPDATE_LESSON";
      moduleId: string;
      lessonId: string;
      data: Partial<LessonInput>;
    }
  | { type: "RESET" };

function reducer(state: CourseForm, action: Action): CourseForm {
  switch (action.type) {
    case "UPDATE_FIELD":
      return { ...state, [action.key]: action.value } as CourseForm;
    case "ADD_TAG":
      if (!action.tag.trim() || state.tags.includes(action.tag)) return state;
      return { ...state, tags: [...state.tags, action.tag] };
    case "REMOVE_TAG":
      return {
        ...state,
        tags: state.tags.filter((t) => t !== action.tag),
      };
    case "ADD_MODULE":
      return { ...state, modules: [...state.modules, action.module] };
    case "REMOVE_MODULE":
      return {
        ...state,
        modules: state.modules.filter((m) => m.id !== action.moduleId),
      };
    case "UPDATE_MODULE":
      return {
        ...state,
        modules: state.modules.map((m) =>
          m.id === action.moduleId ? { ...m, ...action.data } : m
        ),
      };
    case "ADD_LESSON":
      return {
        ...state,
        modules: state.modules.map((m) =>
          m.id === action.moduleId
            ? { ...m, lessons: [...m.lessons, action.lesson] }
            : m
        ),
      };
    case "REMOVE_LESSON":
      return {
        ...state,
        modules: state.modules.map((m) =>
          m.id === action.moduleId
            ? {
                ...m,
                lessons: m.lessons.filter((l) => l.id !== action.lessonId),
              }
            : m
        ),
      };
    case "UPDATE_LESSON":
      return {
        ...state,
        modules: state.modules.map((m) =>
          m.id === action.moduleId
            ? {
                ...m,
                lessons: m.lessons.map((l) =>
                  l.id === action.lessonId ? { ...l, ...action.data } : l
                ),
              }
            : m
        ),
      };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

const createEmptyModule = (): ModuleInput => ({
  id: nanoid(),
  title: "",
  description: "",
  lessons: [],
  isExisting: false,
});

const createEmptyLesson = (order: number): LessonInput => ({
  id: nanoid(),
  name: "",
  description: "",
  order,
  isExisting: false,
});

const TagList = React.memo<{
  tags: string[];
  onRemove: (tag: string) => void;
}>(({ tags, onRemove }) => (
  <div className="flex flex-wrap gap-2 pt-2">
    {tags.map((tag) => (
      <Badge
        key={tag}
        className="pr-1 pl-2 py-1 cursor-pointer"
        onClick={() => onRemove(tag)}
      >
        {tag} <X size={14} className="ml-1" />
      </Badge>
    ))}
  </div>
));
TagList.displayName = "TagList";

const LessonEditor = React.memo<{
  lesson: LessonInput;
  index: number;
  onUpdate: (data: Partial<LessonInput>) => void;
  onRemove: () => void;
}>(({ lesson, index, onUpdate, onRemove }) => (
  <li className="rounded-md bg-background p-3 flex flex-col gap-2 border">
    <div className="flex items-start justify-between">
      <span className="text-sm font-medium">
        {index + 1}.{" "}
        {lesson.isExisting ? (
          lesson.name
        ) : (
          <Input
            placeholder="Lesson name"
            value={lesson.name}
            onChange={(e) => onUpdate({ name: e.target.value })}
            className="h-8"
          />
        )}
      </span>
      <Button size="icon" variant="ghost" type="button" onClick={onRemove}>
        <X size={16} />
      </Button>
    </div>
    {!lesson.isExisting && (
      <Textarea
        placeholder="Lesson description"
        value={lesson.description}
        onChange={(e) => onUpdate({ description: e.target.value })}
        rows={2}
      />
    )}
  </li>
));
LessonEditor.displayName = "LessonEditor";

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
        name: selected.name,
        description: "",
        order: module.lessons.length + 1,
        isExisting: true,
      },
    });
  };

  return (
    <li className="rounded-lg border p-4 space-y-4 bg-muted">
      <div className="flex items-start justify-between">
        <p className="font-medium">
          {index + 1}.{" "}
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
              className="h-9"
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

      {/* Lessons */}
      <div className="space-y-2">
        <header className="flex items-center justify-between">
          <p className="font-semibold text-sm">Lessons</p>
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
                      {l.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
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

/* ------------------------------------------------------------------
 Main component
-------------------------------------------------------------------*/
export default function CourseModal({ showDialog, setShowDialog }: Props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [submitting, setSubmitting] = React.useState(false);
  const tagInputRef = useRef<HTMLInputElement>(null);

  /* ------------------------- Tag helpers ------------------------ */
  const handleTagKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        dispatch({ type: "ADD_TAG", tag: e.currentTarget.value.trim() });
        e.currentTarget.value = "";
      }
    },
    []
  );

  /* ------------------------- Module helpers --------------------- */
  const addNewModule = useCallback(() => {
    dispatch({ type: "ADD_MODULE", module: createEmptyModule() });
  }, []);

  const assignExistingModule = useCallback((moduleId: string) => {
    const selected = existingModules.find((m) => m.id === moduleId);
    if (!selected) return;
    dispatch({
      type: "ADD_MODULE",
      module: {
        id: selected.id,
        title: selected.title,
        description: "",
        lessons: [],
        isExisting: true,
      },
    });
  }, []);

  /* ------------------------- Submit handler --------------------- */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      // TODO: call API with `state` payload
      dispatch({ type: "RESET" });
      setShowDialog(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-black dark:text-white">
            Upload New Course
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 text-left">
          {/* --------------------------------------------------------------------
              Course meta
            --------------------------------------------------------------------*/}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title">Course Title</Label>
              <Input
                id="title"
                value={state.title}
                onChange={(e) =>
                  dispatch({
                    type: "UPDATE_FIELD",
                    key: "title",
                    value: e.target.value,
                  })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Level</Label>
              <Select
                value={state.level}
                onValueChange={(v: CourseLevel) =>
                  dispatch({ type: "UPDATE_FIELD", key: "level", value: v })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={state.description}
                onChange={(e) =>
                  dispatch({
                    type: "UPDATE_FIELD",
                    key: "description",
                    value: e.target.value,
                  })
                }
                required
                rows={3}
              />
            </div>
          </div>

          {/* --------------------------------------------------------------------
              Tags
            --------------------------------------------------------------------*/}
          <div className="space-y-2">
            <Label>Tags</Label>
            <Input
              placeholder="Press Enter to add tag"
              ref={tagInputRef}
              onKeyDown={handleTagKeyDown}
            />
            <TagList
              tags={state.tags}
              onRemove={(tag) => dispatch({ type: "REMOVE_TAG", tag })}
            />
          </div>

          {/* --------------------------------------------------------------------
              Publish switch
            --------------------------------------------------------------------*/}
          <div className="flex items-center gap-4">
            <Label htmlFor="publish">Publish immediately?</Label>
            <Switch
              id="publish"
              checked={state.isPublish}
              onCheckedChange={(v) =>
                dispatch({ type: "UPDATE_FIELD", key: "isPublish", value: v })
              }
            />
          </div>

          {/* --------------------------------------------------------------------
              Modules
            --------------------------------------------------------------------*/}
          <section className="space-y-4">
            <header className="flex items-center justify-between">
              <Label className="text-lg font-semibold">Modules</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={addNewModule}
                >
                  <Plus size={18} className="mr-1" /> New Module
                </Button>

                {existingModules.length > 0 && (
                  <Select onValueChange={assignExistingModule}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Assign Module" />
                    </SelectTrigger>
                    <SelectContent>
                      {existingModules.map((m) => (
                        <SelectItem key={m.id} value={m.id}>
                          {m.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            </header>

            {state.modules.length > 0 && (
              <ul className="space-y-6 max-h-96 overflow-y-auto pr-1">
                {state.modules.map((mod, mi) => (
                  <ModuleEditor
                    key={mod.id}
                    module={mod}
                    index={mi}
                    dispatch={dispatch}
                  />
                ))}
              </ul>
            )}
          </section>

          {/* --------------------------------------------------------------------
              Submit button
            --------------------------------------------------------------------*/}
          <Button type="submit" disabled={submitting} className="w-full">
            {submitting && <Loader2 className="animate-spin w-4 h-4 mr-2" />}{" "}
            Submit
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
