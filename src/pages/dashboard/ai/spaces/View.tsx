import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, Grid2x2, List, PencilLine } from "lucide-react";
import AppLayout from "@/components/layout/Applayout";
import { useParams } from "react-router-dom";
import { getSingleSpaceApi, updateSpaceApi } from "@/utils/_apis/courses-apis";
import EmptySpaceCTA from "@/components/EmptyState";
import AiCardActions from "@/shared/ai/LearnPlayground/AiCardActions";

type Space = {
  id: string;
  name: string;
  description?: string | null;
  items?: Array<unknown> | null;
};

export default function SpaceView() {
  const { id: routeId } = useParams();
  const [layout, setLayout] = useState<"grid" | "list">("grid");
  const [space, setSpace] = useState<Space | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [openEdit, setOpenEdit] = useState(false);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [saving, setSaving] = useState(false);

  const itemCount = space?.items?.length ?? 0;

  const formatNum = useMemo(() => new Intl.NumberFormat("ar"), []);

  useEffect(() => {
    const fetchSpace = async () => {
      if (!routeId) return;
      setLoading(true);
      setError(null);
      try {
        const res = await getSingleSpaceApi(routeId as string);
        const data: Space = (res?.data ?? res) as Space;
        setSpace(data);
        setEditName(data?.name ?? "");
        setEditDescription((data?.description as string) ?? "");
      } catch (e: any) {
        setError(e?.message ?? "تعذّر تحميل المساحة");
      } finally {
        setLoading(false);
      }
    };

    fetchSpace();
  }, [routeId]);

  const handleUpdate = async () => {
    if (!space) return;
    setSaving(true);
    setError(null);
    try {
      const payload = {
        name: editName?.trim(),
        description: editDescription?.trim(),
      };
      const res = await updateSpaceApi(space.id, payload);
      const updated: Space = (res?.data ?? res) as Space;

      setSpace((prev) => ({
        id: prev?.id ?? updated.id,
        name: updated?.name ?? payload.name ?? prev?.name ?? "",
        description:
          updated?.description ??
          payload.description ??
          prev?.description ??
          "",
        items: prev?.items ?? null,
      }));
      setOpenEdit(false);
    } catch (e: any) {
      setError(e?.message ?? "تعذّر حفظ التعديلات");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppLayout>
      {/* Force RTL + Arabic */}
      <main dir="rtl" lang="ar" className="px-24">
        <AiCardActions />
      </main>

      <section className="px-20 mx-auto w-full mb-10" dir="rtl" lang="ar">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="text-right flex-1 min-w-0">
            {loading ? (
              <div className="space-y-2">
                <Skeleton className="h-8 w-72 ml-auto" />
                <Skeleton className="h-5 w-full" />
              </div>
            ) : error ? (
              <p className="text-destructive">{error}</p>
            ) : (
              <>
                <h2 className="text-3xl font-semibold tracking-tight truncate">
                  {space?.name}
                </h2>
                <p className="text-muted-foreground mt-1 whitespace-pre-wrap">
                  {space?.description || "لا توجد وصف للمساحة بعد."}
                </p>
              </>
            )}
          </div>

          <div className="flex items-center gap-2 rtl:flex-row">
            <Button className="rounded-full px-4 py-2 flex gap-2 rtl:flex-row-reverse">
              <FileText className="h-4 w-4" />
              <span>إنشاء اختبار</span>
            </Button>

            {/* Edit Space */}
            <Dialog open={openEdit} onOpenChange={setOpenEdit}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="rounded-full px-4 py-2 flex gap-2 rtl:flex-row-reverse"
                >
                  <PencilLine className="h-4 w-4" />
                  <span>تعديل المساحة</span>
                </Button>
              </DialogTrigger>
              <DialogContent dir="rtl">
                <DialogHeader>
                  <DialogTitle>تعديل بيانات المساحة</DialogTitle>
                  <DialogDescription>
                    حدّث اسم المساحة ووصفها ثم احفظ التغييرات.
                  </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-2">
                  <div className="grid gap-2">
                    <Label htmlFor="name">اسم المساحة</Label>
                    <Input
                      id="name"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="أدخل اسم المساحة"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="desc">الوصف</Label>
                    <Textarea
                      id="desc"
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      placeholder="أدخل وصفًا مختصرًا للمساحة"
                      rows={5}
                    />
                  </div>
                </div>

                {error && <p className="text-sm text-destructive">{error}</p>}

                <DialogFooter className="gap-2 sm:gap-0">
                  <Button
                    variant="ghost"
                    onClick={() => setOpenEdit(false)}
                    disabled={saving}
                  >
                    إلغاء
                  </Button>
                  <Button
                    onClick={handleUpdate}
                    disabled={saving || !editName.trim()}
                  >
                    {saving ? "جارِ الحفظ…" : "حفظ"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between mt-6 mb-4">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant={layout === "grid" ? "secondary" : "ghost"}
              size="icon"
              className="rounded-full"
              onClick={() => setLayout("grid")}
              aria-label="عرض شبكي"
              title="عرض شبكي"
              disabled={loading}
            >
              <Grid2x2 className="h-5 w-5" />
            </Button>
            <Button
              type="button"
              variant={layout === "list" ? "secondary" : "ghost"}
              size="icon"
              className="rounded-full"
              onClick={() => setLayout("list")}
              aria-label="عرض قائمة"
              title="عرض قائمة"
              disabled={loading}
            >
              <List className="h-5 w-5" />
            </Button>
          </div>
          <div className="text-sm text-muted-foreground">
            {loading ? (
              <Skeleton className="h-4 w-20" />
            ) : (
              <>{formatNum.format(itemCount)} عناصر</>
            )}
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
        ) : itemCount === 0 ? (
          <EmptySpaceCTA />
        ) : (
          <div
            className={
              layout === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                : "space-y-3"
            }
          >
            {/* TODO: Render actual items from space.items */}
            {/* Example placeholder: */}
            {(space?.items as any[])?.map((item: any, idx: number) => (
              <div
                key={item?.id ?? idx}
                className="border rounded-2xl p-4 bg-muted/20"
              >
                <div className="font-medium">
                  {item?.title ?? `عنصر ${formatNum.format(idx + 1)}`}
                </div>
                <div className="text-sm text-muted-foreground mt-1 truncate">
                  {item?.description ?? "—"}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </AppLayout>
  );
}
