import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { CoursesContext } from "@/utils/types";

import {
  createSpacesApi,
  deleteSpacesApi,
  getAllCoursesApi,
  getAllSpacesApi,
} from "@/utils/_apis/courses-apis";
import { Plus, Boxes, Trash2 } from "lucide-react";
import AppLayout from "@/components/layout/Applayout";
import { useNavigate } from "react-router-dom";
import AiCardActions from "@/shared/ai/AiCardActions";
import { Space } from "@/types/courses";

export default function LearningDashboard() {
  const navigate = useNavigate();

  const [openAdd, setOpenAdd] = useState(false);
  const [newSpaceName, setNewSpaceName] = useState("");
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [spaceToDelete, setSpaceToDelete] = useState<Space | null>(null);

  const [, setCourses] = useState<CoursesContext[]>([]);
  const [, setLoading] = useState(true);
  const [spaceRef, setSpaceRef] = useState(false);
  const [, setError] = useState("");

  const fetchAllCourses = async () => {
    try {
      const res = await getAllCoursesApi();
      setCourses(res);
    } catch (err) {
      setError("حدث خطأ أثناء تحميل الدورات. الرجاء المحاولة لاحقاً.");
      console.error("Error fetching courses:", err);
    }
  };

  const fetchAllSpaces = async () => {
    try {
      const { data } = await getAllSpacesApi();
      setSpaces(data);
    } catch (error) {}
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchAllCourses(), fetchAllSpaces()]);
      setLoading(false);
    };
    fetchData();
  }, [spaceRef]);

  async function handleCreateSpace() {
    try {
      const name = newSpaceName.trim() || `مساحة بدون عنوان (${spaces.length})`;
      createSpacesApi({ name });
      setOpenAdd(false);
      setSpaceRef(!spaceRef);
    } catch (error) {}
  }

  function requestDelete(space: Space) {
    setSpaceToDelete(space);
    setDeleteOpen(true);
  }

  async function confirmDelete() {
    if (!spaceToDelete) return;
    await deleteSpacesApi(spaceToDelete.id);
    setDeleteOpen(false);
    setSpaceRef(!spaceRef);
  }

  function openSpace(id: string) {
    navigate(`/dashboard/spaces/${id}`);
  }

  return (
    <AppLayout className="mb-20">
      <main className="px-24">
        <AiCardActions />

        <section className="mt-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-right">المساحات</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 text-right">
            {spaces.map((s) => (
              <SpaceItem
                key={s.id}
                id={s.id}
                name={s.name}
                count={s.contents || 0}
                onOpen={openSpace}
                onDeleteRequest={requestDelete}
              />
            ))}
            <button
              type="button"
              onClick={() => setOpenAdd(true)}
              className="h-[80px] rounded-2xl border border-dashed border-gray-300 flex items-center justify-center pr-4 hover:border-blue-300 bg-gray-100 dark:bg-gray-900"
            >
              <Plus className="h-6 w-6 ml-2" />
              <span>مساحة جديدة</span>
            </button>
          </div>
        </section>

        {/* <section className="mt-12" dir="rtl">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-right">مؤخرًا</h2>
            {loading && (
              <span className="text-sm text-gray-500">جاري التحميل…</span>
            )}
          </div>

          {!loading && enrolledCourses.length === 0 ? (
            <EmptyState
              title="لا توجد دورات حالية"
              description="ابدأ رحلتك التعليمية بإنشاء دورة مخصصة باستخدام الذكاء الاصطناعي أو اختر من مكتبة الدورات"
            />
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {enrolledCourses.map((course) => (
                <CourseCardNew key={(course as any).id} course={course} />
              ))}
            </div>
          )}
        </section> */}
      </main>

      {/* Create Space Dialog */}
      <Dialog open={openAdd} onOpenChange={setOpenAdd}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle className="text-right">إنشاء مساحة جديدة</DialogTitle>
            <DialogDescription className="text-right">
              أضف اسمًا لمساحتك لتنظيم الملفات والدروس المرتبطة بها.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2 text-right">
              <Label htmlFor="spaceName" className="mr-1">
                اسم المساحة
              </Label>
              <Input
                id="spaceName"
                dir="rtl"
                value={newSpaceName}
                onChange={(e) => setNewSpaceName(e.target.value)}
                placeholder="مثال: مساحة الرياضيات"
                className="text-right"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleCreateSpace();
                  }
                }}
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button onClick={handleCreateSpace} className="rounded-full">
              إنشاء
            </Button>
            <Button
              variant="outline"
              onClick={() => setOpenAdd(false)}
              className="rounded-full"
            >
              إلغاء
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Space Dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-[460px]" dir="rtl">
          <DialogHeader>
            <DialogTitle>حذف المساحة</DialogTitle>
            <DialogDescription>
              هل أنت متأكد أنك تريد حذف هذه المساحة؟ هذا الإجراء لا يمكن التراجع
              عنه وقد يؤدي إلى حذف كل المحتويات المرتبطة.
            </DialogDescription>
          </DialogHeader>
          <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-3 text-right">
            <div className="text-sm text-gray-700 dark:text-gray-300">
              المساحة:{" "}
              <span className="font-semibold">{spaceToDelete?.name}</span>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              عدد العناصر: {spaceToDelete?.contents ?? 0}
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              onClick={confirmDelete}
              variant="destructive"
              className="rounded-full"
            >
              نعم، احذف
            </Button>
            <Button
              onClick={() => setDeleteOpen(false)}
              variant="outline"
              className="rounded-full"
            >
              إلغاء
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}

function SpaceItem({
  id,
  name,
  count,
  onOpen,
  onDeleteRequest,
}: {
  id: string;
  name: string;
  count: number;
  onOpen: (id: string) => void;
  onDeleteRequest: (space: {
    id: string;
    name: string;
    contents: number;
  }) => void;
}) {
  const space: Space = { id, name, contents: count };
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onOpen(id)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onOpen(id);
      }}
      className="group relative flex h-[80px] items-center rounded-2xl border border-gray-200 bg-white pr-5 pl-4 shadow-sm hover:shadow-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:border-gray-800"
    >
      <div className="absolute left-2 top-2 opacity-0 transition-opacity group-hover:opacity-100">
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className="h-8 w-8 rounded-full"
          aria-label="حذف المساحة"
          onClick={(e) => {
            e.stopPropagation();
            onDeleteRequest(space);
          }}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="ml-3 grid h-8 w-8 place-items-center rounded-md bg-gray-100 text-gray-700 group-hover:bg-blue-100 dark:bg-gray-800 dark:text-gray-200">
        <Boxes className="h-4 w-4" />
      </div>
      <div className="min-w-0 text-right flex-1">
        <div className="truncate text-[15px] font-medium">{name}</div>
        <div className="text-[13px] text-gray-500">{count} عناصر</div>
      </div>
      <span className="pointer-events-none absolute inset-0 rounded-2xl ring-0 group-hover:ring-1 group-hover:ring-blue-300" />
    </div>
  );
}
