import React, { useReducer, useRef, useState, useCallback } from "react";
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

import {
  CourseForm,
  Action,
  Level,
  ModuleInput,
} from "@/utils/types/adminTypes";
import { createNewCourseApi } from "@/utils/_apis/admin-api";
import ModuleEditor from "./ModuleEditor";
import TagList from "./TagList";

// Initial Course State
const initialState: CourseForm = {
  title: "",
  description: "",
  level: "BEGINNER",
  tags: [],
  isPublish: false,
  modules: [],
};

// Reducer Logic
function reducer(state: CourseForm, action: Action): CourseForm {
  switch (action.type) {
    case "UPDATE_FIELD":
      return { ...state, [action.key]: action.value };
    case "ADD_TAG":
      return action.tag.trim() && !state.tags.includes(action.tag)
        ? { ...state, tags: [...state.tags, action.tag] }
        : state;
    case "REMOVE_TAG":
      return { ...state, tags: state.tags.filter((t) => t !== action.tag) };
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
    case "REMOVE_LESSON":
    case "UPDATE_LESSON":
      return {
        ...state,
        modules: state.modules.map((m) => {
          if (m.id !== action.moduleId) return m;
          let lessons = [...m.lessons];
          if (action.type === "ADD_LESSON") {
            lessons.push(action.lesson);
          } else if (action.type === "REMOVE_LESSON") {
            lessons = lessons.filter((l) => l.id !== action.lessonId);
          } else if (action.type === "UPDATE_LESSON") {
            lessons = lessons.map((l) =>
              l.id === action.lessonId ? { ...l, ...action.data } : l
            );
          }
          return { ...m, lessons };
        }),
      };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

// Helpers
const createEmptyModule = (): ModuleInput => ({
  id: nanoid(),
  title: "",
  description: "",
  lessons: [],
  isExisting: false,
});

interface Props {
  showDialog: boolean;
  setShowDialog: (open: boolean) => void;
}

export default function CourseModal({ showDialog, setShowDialog }: Props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [submitting, setSubmitting] = useState(false);
  const tagInputRef = useRef<HTMLInputElement>(null);
  const [existingModules] = useState<ModuleInput[]>([]);

  // Tag Handling
  const handleTagKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        const tag = e.currentTarget.value.trim();
        if (tag) {
          dispatch({ type: "ADD_TAG", tag });
          e.currentTarget.value = "";
        }
      }
    },
    []
  );

  const addNewModule = useCallback(() => {
    dispatch({ type: "ADD_MODULE", module: createEmptyModule() });
  }, []);

  const assignExistingModule = useCallback(
    (moduleId: string) => {
      const selected = existingModules.find((m) => m.id === moduleId);
      if (selected) {
        dispatch({
          type: "ADD_MODULE",
          module: { ...selected, isExisting: true },
        });
      }
    },
    [existingModules]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      await createNewCourseApi(state);
      dispatch({ type: "RESET" });
      setShowDialog(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogContent className="max-w-7xl max-h-screen overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Upload New Course</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 text-black">
          {/* Title and Level */}
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
                onValueChange={(v: Level) =>
                  dispatch({ type: "UPDATE_FIELD", key: "level", value: v })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  {["BEGINNER", "INTERMEDIATE", "ADVANCED"].map((lvl) => (
                    <SelectItem key={lvl} value={lvl}>
                      {lvl.charAt(0) + lvl.slice(1).toLowerCase()}
                    </SelectItem>
                  ))}
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
                rows={3}
                required
              />
            </div>
          </div>

          {/* Tags */}
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

          {/* Publish Switch */}
          <div className="flex items-center gap-4">
            <Label htmlFor="publish">Publish immediately</Label>
            <Switch
              id="publish"
              checked={state.isPublish}
              onCheckedChange={(v) =>
                dispatch({ type: "UPDATE_FIELD", key: "isPublish", value: v })
              }
            />
          </div>

          {/* Modules Section */}
          <section className="space-y-4">
            <header className="flex items-center justify-between">
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={addNewModule}
                >
                  <Plus size={18} className="mr-1" />
                  New Module
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

          {/* Submit Button */}
          <Button type="submit" disabled={submitting} className="w-full">
            {submitting && <Loader2 className="animate-spin w-4 h-4 mr-2" />}
            Submit
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
