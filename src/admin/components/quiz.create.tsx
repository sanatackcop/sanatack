import { z } from "zod";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormField,
} from "@/components/ui/form";
import { Trash } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { createNewQuiz } from "@/utils/_apis/admin-api";

const singleQuizSchema = z.object({
  question: z.string().min(1, "السؤال مطلوب"),
  options: z.array(z.string().min(1, "الخيار لا يمكن أن يكون فارغًا")).min(2),
  correctAnswer: z.string().min(1, "يرجى اختيار الإجابة الصحيحة"),
  explanation: z.string().optional(),
  order: z.number(),
});

const multiQuizSchema = z.object({
  title: z.string().min(1, "عنوان الاختبار مطلوب"),
  quizzes: z.array(singleQuizSchema).min(1),
});

type MultiQuizFormValues = z.infer<typeof multiQuizSchema>;

export default function QuizDialogCreate({
  open,
  onOpenChange,
  updateTable,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  updateTable: () => void;
}) {
  const form = useForm<MultiQuizFormValues>({
    resolver: zodResolver(multiQuizSchema),
    defaultValues: {
      title: "",
      quizzes: [
        {
          question: "",
          options: ["", "", "", ""],
          correctAnswer: "",
          explanation: "",
          order: 1,
        },
      ],
    },
  });

  const { control, handleSubmit, setValue, watch } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "quizzes",
  });

  const onSubmit = async (data: MultiQuizFormValues) => {
    try {
      await createNewQuiz(data);
      updateTable();
      onOpenChange(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>إنشاء اختبار جديد</DialogTitle>
          <DialogDescription>
            أدخل عنوان الاختبار وأضف الأسئلة المرتبطة به.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Quiz Title */}
            <FormField
              control={control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>عنوان الاختبار</FormLabel>
                  <FormControl>
                    <Input placeholder="مثل: اختبار الوحدة الأولى" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Multiple Quiz Blocks */}
            {fields.map((field, quizIndex) => {
              const quizPath = `quizzes.${quizIndex}` as const;
              const options = watch(`${quizPath}.options`);

              return (
                <div
                  key={field.id}
                  className="border rounded-xl p-4 space-y-4 relative"
                >
                  {/* Delete Quiz Button */}
                  {fields.length > 1 && (
                    <div className="absolute top-2 right-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            type="button"
                            onClick={() => {
                              if (
                                window.confirm(
                                  "هل أنت متأكد من حذف هذا السؤال؟"
                                )
                              ) {
                                remove(quizIndex);
                              }
                            }}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash className="w-5 h-5" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>حذف هذا السؤال</TooltipContent>
                      </Tooltip>
                    </div>
                  )}

                  {/* Question */}
                  <FormField
                    control={control}
                    name={`${quizPath}.question`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>السؤال {quizIndex + 1}</FormLabel>
                        <FormControl>
                          <Input placeholder="اكتب السؤال هنا" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Options + Correct Answer */}
                  <FormField
                    control={control}
                    name={`${quizPath}.correctAnswer`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>الخيارات</FormLabel>
                        <FormControl>
                          <RadioGroup
                            value={field.value}
                            onValueChange={field.onChange}
                            className="space-y-3"
                          >
                            {options.map((opt, i) => (
                              <div key={i} className="flex items-center gap-2">
                                <RadioGroupItem
                                  value={opt}
                                  id={`quiz-${quizIndex}-option-${i}`}
                                />
                                <Input
                                  value={opt}
                                  onChange={(e) => {
                                    const updated = [...options];
                                    updated[i] = e.target.value;
                                    setValue(`${quizPath}.options`, updated);
                                    if (field.value === opt) {
                                      setValue(
                                        `${quizPath}.correctAnswer`,
                                        e.target.value
                                      );
                                    }
                                  }}
                                  placeholder={`الخيار ${i + 1}`}
                                />
                              </div>
                            ))}
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Explanation */}
                  <FormField
                    control={control}
                    name={`${quizPath}.explanation`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>الشرح (اختياري)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="شرح السؤال أو الإجابة"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              );
            })}

            {/* Add Quiz + Submit */}
            <div className="flex justify-between items-center">
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  append({
                    question: "",
                    options: ["", "", "", ""],
                    correctAnswer: "",
                    explanation: "",
                    order: fields.length + 1, // Auto-increment order
                  })
                }
              >
                إضافة سؤال جديد
              </Button>
              <Button type="submit">حفظ الاختبار</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
