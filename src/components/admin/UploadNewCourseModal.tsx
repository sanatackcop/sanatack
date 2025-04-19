import { useReducer, useRef, useCallback, useState } from "react";
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
import { Loader2, Plus } from "lucide-react";
import React from "react";
import {
  Action,
  CourseForm,
  Level,
  ModuleInput,
} from "@/utils/types/adminTypes";
import ModuleEditor from "./ModuleEditor";
import TagList from "./TagList";
import { createNewCourseApi } from "@/utils/_apis/admin-api";

interface Props {
  showDialog: boolean;
  setShowDialog: (open: boolean) => void;
}

const initialState: CourseForm = {
  title: "",
  description: "",
  level: "BEGINNER",
  tags: [],
  isPublish: false,
  modules: [],
};

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

export default function CourseModal({ showDialog, setShowDialog }: Props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [submitting, setSubmitting] = React.useState(false);
  const tagInputRef = useRef<HTMLInputElement>(null);
  const existingModules = useState<any>([]);
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

  const addNewModule = useCallback(() => {
    dispatch({ type: "ADD_MODULE", module: createEmptyModule() });
  }, []);

  const assignExistingModule = useCallback((moduleId: string) => {
    const selected = existingModules.find((m: any) => m.id === moduleId);
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

  const handleSubmit = async () => {
    try {
      if (state) {
        await createNewCourseApi({
          title: state.title,
          level: state.level,
          description: state.description,
          tags: state.tags,
          isPublish: state.isPublish,
          modules: state.modules,
        });
      }
      dispatch({ type: "RESET" });
      setShowDialog(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogContent className="max-w-7xl max-h-screen">
        <DialogHeader>
          <DialogTitle className="text-black">Upload New Course</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 text-left text-black"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title">Course Title</Label>
              <Input
                id="title"
                className="text-left"
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
                onValueChange={(v: Level) =>
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

          <div className="flex items-center gap-4 text-left">
            <Label htmlFor="publish">Publish immediately</Label>
            <Switch
              id="publish"
              checked={state.isPublish}
              onCheckedChange={(v) =>
                dispatch({ type: "UPDATE_FIELD", key: "isPublish", value: v })
              }
            />
          </div>

          <section className="space-y-4">
            <header className="flex items-center justify-between">
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
                      {existingModules.map((m: any) => (
                        <SelectItem key={m.id} value={m.id}>
                          {m.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
              <Label className="text-lg font-semibold">Modules</Label>
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

          <Button
            type="submit"
            disabled={submitting}
            onClick={handleSubmit}
            className="w-full"
          >
            {submitting && <Loader2 className="animate-spin w-4 h-4 mr-2" />}{" "}
            Submit
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
