import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { createNewLesson } from "@/utils/_apis/admin-api";
import { useState } from "react";

// Zod schema based on Quiz entity
const quizSchema = z.object({
  name: z.string().min(1, "الاسم مطلوب"),
  description: z.string().min(1, "شرح مطلوب"),
});

type QuizFormValues = z.infer<typeof quizSchema>;

export default function LessonCreate() {
  const form = useForm<QuizFormValues>({
    resolver: zodResolver(quizSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const { control, handleSubmit } = form;
  const [open, setOpen] = useState(false);

  const onSubmit = async (data: QuizFormValues) => {
    try {
      await createNewLesson(data);
      setOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setOpen(!open)} variant="outline">
          ماده
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>إنشاء اختبار</DialogTitle>
          <DialogDescription>
            أدخل سؤالًا مع خيارات متعددة وحدد الإجابة الصحيحة.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={control}
              name="name"
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

            {/* Submit Button */}
            <Button type="submit" className="w-full">
              حفظ السؤال
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
