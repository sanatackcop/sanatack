import { z } from "zod";
import { useForm } from "react-hook-form";
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
import { createNewQuiz } from "@/utils/_apis/admin-api";

// Zod schema based on Quiz entity
const quizSchema = z.object({
  question: z.string().min(1, "السؤال مطلوب"),
  options: z
    .array(z.string().min(1, "الخيار لا يمكن أن يكون فارغًا"))
    .min(2, "يجب أن يكون هناك خياران على الأقل"),
  correctAnswer: z.string().min(1, "يرجى اختيار الإجابة الصحيحة"),
  explanation: z.string().optional(),
  duration: z
    .number({ invalid_type_error: "المدة يجب أن تكون رقمًا" })
    .min(0, "المدة يجب أن تكون رقمًا موجبًا"),
});

type QuizFormValues = z.infer<typeof quizSchema>;

export default function QuizDialogCreate({
  open,
  onOpenChange,
  updateTable,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  updateTable: () => void;
}) {
  const form = useForm<QuizFormValues>({
    resolver: zodResolver(quizSchema),
    defaultValues: {
      question: "",
      options: ["", "", "", ""],
      correctAnswer: "",
      explanation: "",
      duration: 0,
    },
  });

  const { control, handleSubmit, watch, setValue } = form;

  const options = watch("options");

  const onSubmit = async (data: QuizFormValues) => {
    try {
      await createNewQuiz(data);
      updateTable();
      onOpenChange(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>إنشاء اختبار</DialogTitle>
          <DialogDescription>
            أدخل سؤالًا مع خيارات متعددة وحدد الإجابة الصحيحة.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Question Field */}
            <FormField
              control={control}
              name="question"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>السؤال</FormLabel>
                  <FormControl>
                    <Input placeholder="اكتب السؤال هنا" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="correctAnswer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الخيارات</FormLabel>
                  <FormControl>
                    <RadioGroup
                      value={field.value}
                      onValueChange={(val) => field.onChange(val)}
                      className="space-y-3"
                    >
                      {options.map((opt, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <RadioGroupItem value={opt} id={`option-${index}`} />
                          <Input
                            value={opt}
                            onChange={(e) => {
                              const updated = [...options];
                              updated[index] = e.target.value;
                              setValue("options", updated);

                              // sync correctAnswer if edited
                              if (field.value === opt) {
                                setValue("correctAnswer", e.target.value);
                              }
                            }}
                            placeholder={`الخيار ${index + 1}`}
                          />
                        </div>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>المدة (بالثواني)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="مثال: 120"
                      value={field.value ?? ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === ""
                            ? undefined
                            : e.target.valueAsNumber
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Explanation (Optional) */}
            <FormField
              control={control}
              name="explanation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الشرح (اختياري)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="شرح السؤال أو الإجابة" {...field} />
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
