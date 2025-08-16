import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { UploadCloud, Link2, Mic, FileText, Grid2x2, List } from "lucide-react";
import AppLayout from "@/components/layout/Applayout";
import { useParams } from "react-router-dom";
import AiCardActions from "@/shared/ai/AiCardActions";

export default function SpaceView() {
  const { id: routeId } = useParams();
  const spaceId = routeId ?? "1";

  const [layout, setLayout] = useState<"grid" | "list">("grid");
  const [space] = useState({
    id: Number(spaceId) || 1,
    name: "مساحة أسامة",
    description: "لا يوجد وصف",
  });
  const [itemCount] = useState<number>(0);

  // Localize numbers to Arabic digits
  const formatNum = useMemo(() => new Intl.NumberFormat("ar"), []);

  return (
    <AppLayout>
      {/* Force RTL + Arabic */}
      <main dir="rtl" lang="ar" className="px-24">
        <AiCardActions />
      </main>
      <section className="px-20 mx-auto w-full mb-10">
        <div className="flex items-start justify-between gap-4">
          <div className="text-right">
            <h2 className="text-3xl font-semibold tracking-tight">
              {space.name}
            </h2>
            <p className="text-muted-foreground mt-1">{space.description}</p>
          </div>

          <div className="flex items-center gap-2 rtl:flex-row">
            <Button className="rounded-full px-4 py-2 flex gap-2 rtl:flex-row-reverse">
              <FileText className="h-4 w-4" />
              <span>إنشاء اختبار</span>
            </Button>
          </div>
        </div>

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
            >
              <List className="h-5 w-5" />
            </Button>
          </div>
          <div className="text-sm text-muted-foreground">
            {formatNum.format(itemCount)} عناصر
          </div>
        </div>

        <EmptySpaceCTA />
      </section>
    </AppLayout>
  );
}

function EmptySpaceCTA() {
  return (
    <div className="text-center py-16 bg-muted/30 rounded-2xl border border-dashed">
      <h3 className="text-lg font-semibold">أضف محتوى إلى هذه المساحة</h3>
      <p className="text-muted-foreground max-w-xl mx-auto mt-2 leading-relaxed">
        تعلم بذكاء وخصِّص تجربتك مع صنعتك.
      </p>

      <div className="mt-6 flex items-center justify-center gap-2 flex-wrap">
        <Button
          variant="outline"
          className="rounded-full px-4 py-2 flex gap-2 rtl:flex-row-reverse"
        >
          <UploadCloud className="h-4 w-4" />
          <span>رفع ملف</span>
        </Button>
        <Button
          variant="outline"
          className="rounded-full px-4 py-2 flex gap-2 rtl:flex-row-reverse"
        >
          <Link2 className="h-4 w-4" />
          <span>لصق رابط</span>
        </Button>
        <Button className="rounded-full px-4 py-2 flex gap-2 rtl:flex-row-reverse">
          <Mic className="h-4 w-4" />
          <span>تسجيل</span>
        </Button>
      </div>

      <p className="text-xs text-muted-foreground mt-4">
        الصيغ المدعومة: PDF, DOCX, روابط المقالات، والملاحظات الصوتية.
      </p>
    </div>
  );
}
