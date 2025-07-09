"use client";

import { z } from "zod";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormField,
} from "@/components/ui/form";
import { createNewCourse } from "@/utils/_apis/admin-api";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { LevelArray, LevelEnum } from "@/types/courses";
import { CourseTopic, CourseTopicArray } from "@/utils/types";

const courseSchema = z.object({
  title: z.string().min(5),
  description: z.string().min(5),
  topic: z.enum([CourseTopicArray[0], ...CourseTopicArray]),
  level: z.enum([LevelArray[0], ...LevelArray]),
  tags: z.array(z.object({ value: z.string().min(1) })),
  new_skills_result: z.array(z.object({ value: z.string().min(1) })),
  prerequisites: z.array(z.object({ value: z.string().min(1) })),
  learning_outcome: z.array(z.object({ key: z.string(), value: z.number() })),
  isPublish: z.boolean().default(false),
});

type CourseFormValues = z.infer<typeof courseSchema>;

export default function CourseCreate({
  updateTable,
}: {
  updateTable: () => void;
}) {
  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: "",
      description: "",
      topic: "BACKEND",
      level: "BEGINNER",
      tags: [{ value: "" }],
      new_skills_result: [{ value: "" }],
      prerequisites: [{ value: "" }],
      learning_outcome: [{ key: "Outcome 1", value: 0 }],
      isPublish: false,
    },
  });

  const { control, handleSubmit, register } = form;
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");

  const {
    fields: tagFields,
    append: appendTag,
    remove: removeTag,
  } = useFieldArray({ control, name: "tags" });
  const {
    fields: skillFields,
    append: appendSkill,
    remove: removeSkill,
  } = useFieldArray({ control, name: "new_skills_result" });
  const {
    fields: prereqFields,
    append: appendPrereq,
    remove: removePrereq,
  } = useFieldArray({ control, name: "prerequisites" });
  const {
    fields: outcomeFields,
    append: appendOutcome,
    remove: removeOutcome,
  } = useFieldArray({ control, name: "learning_outcome" });

  const onSubmit = async (data: CourseFormValues) => {
    try {
      const outcomeObject = data.learning_outcome.reduce((acc, curr) => {
        acc[curr.key] = curr.value;
        return acc;
      }, {} as Record<string, number>);

      // Only send the fields that match your backend DTO
      await createNewCourse({
        title: data.title,
        description: data.description,
        topic: data.topic as CourseTopic,
        level: data.level as LevelEnum,
        isPublish: data.isPublish,
        course_info: {
          tags: data.tags.map((t) => t.value),
          new_skills_result: data.new_skills_result.map((s) => s.value),
          learning_outcome: outcomeObject,
          prerequisites: data.prerequisites.map((p) => p.value),
        },
      });

      updateTable();
      setOpen(false);
    } catch (error) {
      setError("Failed to save course. Please try again.");
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setOpen(!open)} variant="outline">
          Create new Course
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Course</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter course title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter course description"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="topic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Topic</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Topic" />
                      </SelectTrigger>
                      <SelectContent>
                        {CourseTopicArray.map((lvl) => (
                          <SelectItem key={lvl} value={lvl}>
                            {lvl}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="level"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Level</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        {LevelArray.map((lvl) => (
                          <SelectItem key={lvl} value={lvl}>
                            {lvl}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Tags */}
            <div>
              <FormLabel>Tags</FormLabel>
              {tagFields.map((field, index) => (
                <div
                  key={field.id}
                  className="flex items-center space-x-2 mt-2"
                >
                  <Input {...register(`tags.${index}.value`)} />
                  <Button
                    type="button"
                    onClick={() => removeTag(index)}
                    size="sm"
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <Button type="button" onClick={() => appendTag({ value: "" })}>
                + Add Tag
              </Button>
            </div>

            {/* Skills */}
            <div>
              <FormLabel>Skills You Will Gain</FormLabel>
              {skillFields.map((field, index) => (
                <div
                  key={field.id}
                  className="flex items-center space-x-2 mt-2"
                >
                  <Input {...register(`new_skills_result.${index}.value`)} />
                  <Button
                    type="button"
                    onClick={() => removeSkill(index)}
                    size="sm"
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <Button type="button" onClick={() => appendSkill({ value: "" })}>
                + Add Skill
              </Button>
            </div>

            {/* Prerequisites */}
            <div>
              <FormLabel>Prerequisites</FormLabel>
              {prereqFields.map((field, index) => (
                <div
                  key={field.id}
                  className="flex items-center space-x-2 mt-2"
                >
                  <Input {...register(`prerequisites.${index}.value`)} />
                  <Button
                    type="button"
                    onClick={() => removePrereq(index)}
                    size="sm"
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <Button type="button" onClick={() => appendPrereq({ value: "" })}>
                + Add Prerequisite
              </Button>
            </div>

            {/* Learning Outcomes */}
            <div>
              <FormLabel>Learning Outcomes</FormLabel>
              {outcomeFields.map((field, index) => (
                <div
                  key={field.id}
                  className="flex items-center space-x-2 mt-2"
                >
                  <Input
                    {...register(`learning_outcome.${index}.key`)}
                    placeholder="Outcome name"
                  />
                  <Input
                    type="number"
                    {...register(`learning_outcome.${index}.value`, {
                      valueAsNumber: true,
                    })}
                    placeholder="Value"
                  />
                  <Button
                    type="button"
                    onClick={() => removeOutcome(index)}
                    size="sm"
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                onClick={() => appendOutcome({ key: "", value: 0 })}
              >
                + Add Learning Outcome
              </Button>
            </div>

            <FormField
              control={control}
              name="isPublish"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Publish Course</FormLabel>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      ref={field.ref}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              Save Course
            </Button>
          </form>
        </Form>

        {error && <div className="text-red-500 mt-4">{error}</div>}
      </DialogContent>
    </Dialog>
  );
}
