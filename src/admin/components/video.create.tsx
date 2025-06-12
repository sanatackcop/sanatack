import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormField,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { createNewVideo } from "@/utils/_apis/admin-api";

function extractYouTubeId(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (parsed.hostname === "youtu.be") {
      return parsed.pathname.slice(1);
    }

    const idFromQuery = parsed.searchParams.get("v");
    if (idFromQuery) return idFromQuery;

    const match = parsed.pathname.match(/\/embed\/([a-zA-Z0-9_-]{11})/);
    return match?.[1] ?? null;
  } catch {
    return null;
  }
}

// Zod schema for validation
const videoSchema = z.object({
  title: z.string().min(1, "العنوان مطلوب"),
  youtubeId: z
    .string()
    .min(1, "رابط الفيديو مطلوب")
    .url("رابط غير صالح")
    .refine((val) => extractYouTubeId(val) !== null, {
      message: "الرابط لا يحتوي على معرف YouTube صالح",
    }),
  description: z.string(),
  duration: z
    .number({ invalid_type_error: "المدة يجب أن تكون رقمًا" })
    .min(0, "المدة يجب أن تكون رقمًا موجبًا"),
});

type VideoFormValues = z.infer<typeof videoSchema>;

export default function VideoDialogCreate({
  open,
  onOpenChange,
  updateTable,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  updateTable: () => void;
}) {
  const form = useForm<VideoFormValues>({
    resolver: zodResolver(videoSchema),
    defaultValues: {
      title: "",
      youtubeId: "",
      description: "",
      duration: undefined,
    },
  });
  const onSubmit = async (data: VideoFormValues) => {
    try {
      await createNewVideo(data);
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
          <DialogTitle>إنشاء مورد فيديو</DialogTitle>
          <DialogDescription>
            أدخل بيانات الفيديو الخاصة بك لربطها بالمورد.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>العنوان</FormLabel>
                  <FormControl>
                    <Input placeholder="عنوان الفيديو" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* YouTube ID */}
            <FormField
              control={form.control}
              name="youtubeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>معرف YouTube</FormLabel>
                  <FormControl>
                    <Input placeholder="مثال: dQw4w9WgXcQ" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الوصف (اختياري)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="وصف للفيديو..." {...field} />
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

            {/* Submit */}
            <Button type="submit" className="w-full">
              حفظ الفيديو
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
