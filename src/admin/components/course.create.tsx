import { z } from "zod";
import { useForm } from "react-hook-form";
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
import { createNewCourse, createNewModule } from "@/utils/_apis/admin-api";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

const LEVEL_VALUES = ["BEGINNER", "INTERMEDIATE", "ADVANCED"] as const;
export const Level = LEVEL_VALUES;

const courseSchema = z.object({
  title: z.string().min(5),
  description: z.string().min(5),
  level: z.enum(Level),
  course_info: z.object({
    durationHours: z.preprocess((val) => Number(val), z.number().min(1)),
  }),
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
      level: "BEGINNER",
      course_info: {
        durationHours: 1,
      },
    },
  });

  const { control, handleSubmit } = form;
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (data: CourseFormValues) => {
    try {
      await createNewCourse(data);
      updateTable();
      setOpen(false);
    } catch (error) {
      setError("فشل حفظ الدورة، حاول مرة أخرى");
      console.log(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setOpen(!open)} variant="outline">
          Create new Course
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
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
                  <FormLabel>الاسم</FormLabel>
                  <FormControl>
                    <Input placeholder="اكتب الاسم هنا" {...field} />
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
                  <FormLabel>الشرح</FormLabel>
                  <FormControl>
                    <Input placeholder="اكتب الشرح هنا" {...field} />
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
                  <FormLabel>المستوى</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="اختر المستوى" />
                      </SelectTrigger>
                      <SelectContent>
                        {Level.map((lvl) => (
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
              name="course_info.durationHours"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>عدد الساعات</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      placeholder="مثلاً: 10"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <FormField
                control={control}
                name="isPublish"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>يجب نشرها</FormLabel>
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
            </div>

            <Button type="submit" className="w-full">
              حفظ الدورة
            </Button>
          </form>
        </Form>
        {error && <div className="text-red-500">{error}</div>}
      </DialogContent>
    </Dialog>
  );
}
