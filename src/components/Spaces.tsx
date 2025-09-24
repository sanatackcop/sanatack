import { Space } from "@/types/courses";
import { useTranslation } from "react-i18next";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
import { Boxes, Plus, Trash2, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import {
  createSpacesApi,
  deleteSpacesApi,
  getAllSpacesApi,
} from "@/utils/_apis/courses-apis";
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
import { useNavigate } from "react-router-dom";

export default function Spaces({ isRTL }: { isRTL: boolean }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [spaces, setSpaces] = useState<Space[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [newSpaceName, setNewSpaceName] = useState("");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [spaceToDelete, setSpaceToDelete] = useState<Space | null>(null);

  const fetchAllSpaces = async () => {
    try {
      const { data } = await getAllSpacesApi();
      const validSpaces = data.filter(
        (space: any) =>
          space && space.id && typeof space.id === "string" && space.name
      );
      setSpaces(validSpaces);
    } catch (error) {
      console.error("Failed to fetch spaces:", error);
      setSpaces([]);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchAllSpaces()]);
      setLoading(false);
    };
    fetchData();
  }, []);

  async function handleCreateSpace() {
    if (creating) return;

    try {
      setCreating(true);
      const name =
        newSpaceName.trim() ||
        t("dashboard.spaces.defaultName", { count: spaces.length });

      const { data } = await createSpacesApi({ name });
      setSpaces((prev) => [...prev, data]);
      setNewSpaceName("");
      setOpenAdd(false);
      fetchAllSpaces();
    } catch (error) {
      console.error("Failed to create space:", error);
    } finally {
      setCreating(false);
    }
  }

  function requestDelete(space: Space) {
    setSpaceToDelete(space);
    setDeleteOpen(true);
  }

  async function confirmDelete() {
    if (!spaceToDelete || deleting) return;

    try {
      setDeleting(true);
      await deleteSpacesApi(spaceToDelete.id);
      setSpaces((prev) => prev.filter((s) => s.id !== spaceToDelete.id));
      setSpaceToDelete(null);
      setDeleteOpen(false);
    } catch (error) {
      console.error("Failed to delete space:", error);
    } finally {
      setDeleting(false);
    }
  }

  function openSpace(id: string) {
    navigate(`/dashboard/spaces/${id}`);
  }

  return (
    <>
      <section className="mt-8">
        <div className="flex items-center justify-between mb-6">
          <h2
            className={`text-lg font-semibold text-gray-900 dark:text-gray-100 ${
              isRTL ? "text-right" : "text-left"
            }`}
          >
            {t("dashboard.spaces.title")}
          </h2>
        </div>

        <div
          className={`grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ${
            isRTL ? "text-right" : "text-left"
          }`}
        >
          {loading ? (
            // Skeleton loading state
            <>
              {Array.from({ length: 6 }).map((_, index) => (
                <SpaceItemSkeleton key={index} isRTL={isRTL} />
              ))}
            </>
          ) : (
            <>
              {spaces
                .filter(
                  (space): space is Space => space != null && space.id != null
                )
                .map((space) => (
                  <SpaceItem
                    key={space.id}
                    id={space.id}
                    name={space.name}
                    count={space.contents || 0}
                    onOpen={openSpace}
                    onDeleteRequest={requestDelete}
                  />
                ))}

              {/* Add New Space Button */}
              <button
                type="button"
                onClick={() => setOpenAdd(true)}
                disabled={creating}
                className={`group relative h-[88px] rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 flex flex-col items-center justify-center gap-2 transition-all duration-200 hover:border-gray-300 hover:bg-gray-50/50 dark:hover:border-gray-500 dark:hover:bg-gray-900/20 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                  isRTL ? "text-right" : "text-left"
                }`}
              >
                <div className="h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center transition-colors group-hover:bg-gray-100 dark:group-hover:bg-gray-800">
                  <Plus className="h-5 w-5 text-gray-600 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-400" />
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-700 dark:group-hover:text-gray-300">
                  {t("dashboard.spaces.newSpace")}
                </span>
              </button>
            </>
          )}
        </div>
      </section>

      {/* Create Space Dialog */}
      <Dialog open={openAdd} onOpenChange={setOpenAdd}>
        <DialogContent className="sm:max-w-[480px]" dir={isRTL ? "rtl" : "ltr"}>
          <DialogHeader className={isRTL ? "text-right" : "text-left"}>
            <DialogTitle>
              {t("dashboard.dialogs.createSpace.title")}
            </DialogTitle>
            <DialogDescription>
              {t("dashboard.dialogs.createSpace.description")}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className={`grid gap-2 ${isRTL ? "text-right" : "text-left"}`}>
              <Label htmlFor="spaceName" className={isRTL ? "mr-1" : "ml-1"}>
                {t("dashboard.dialogs.createSpace.nameLabel")}
              </Label>
              <Input
                id="spaceName"
                dir={isRTL ? "rtl" : "ltr"}
                value={newSpaceName}
                onChange={(e) => setNewSpaceName(e.target.value)}
                placeholder={t("dashboard.dialogs.createSpace.placeholder")}
                className={isRTL ? "text-right" : "text-left"}
                disabled={creating}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !creating) {
                    e.preventDefault();
                    handleCreateSpace();
                  }
                }}
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              onClick={handleCreateSpace}
              disabled={creating}
              className="rounded-full min-w-[100px]"
            >
              {creating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {t("common.creating")}
                </>
              ) : (
                t("dashboard.dialogs.createSpace.create")
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => setOpenAdd(false)}
              disabled={creating}
              className="rounded-full"
            >
              {t("common.cancel")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-[460px]" dir={isRTL ? "rtl" : "ltr"}>
          <DialogHeader className={isRTL ? "text-right" : "text-left"}>
            <DialogTitle>
              {t("dashboard.dialogs.deleteSpace.title")}
            </DialogTitle>
            <DialogDescription>
              {t("dashboard.dialogs.deleteSpace.description")}
            </DialogDescription>
          </DialogHeader>
          <div
            className={`bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-xl p-4 ${
              isRTL ? "text-right" : "text-left"
            }`}
          >
            <div className="text-sm text-red-800 dark:text-red-200">
              <strong>{t("dashboard.dialogs.deleteSpace.spaceName")}:</strong>{" "}
              <span className="font-medium">{spaceToDelete?.name}</span>
            </div>
            <div className="text-xs text-red-600 dark:text-red-400 mt-1">
              {t("dashboard.dialogs.deleteSpace.itemCount", {
                count: spaceToDelete?.contents ?? 0,
              })}
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              onClick={confirmDelete}
              variant="destructive"
              disabled={deleting}
              className="rounded-full min-w-[100px]"
            >
              {deleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {t("common.deleting")}
                </>
              ) : (
                t("dashboard.dialogs.deleteSpace.confirmDelete")
              )}
            </Button>
            <Button
              onClick={() => setDeleteOpen(false)}
              variant="outline"
              disabled={deleting}
              className="rounded-full"
            >
              {t("common.cancel")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function SpaceItemSkeleton({ isRTL }: { isRTL: boolean }) {
  return (
    <div
      className={`h-[88px] rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 flex items-center shadow-sm ${
        isRTL ? "pr-5 pl-4" : "pl-5 pr-4"
      }`}
    >
      <div
        className={`grid h-10 w-10 place-items-center rounded-lg ${
          isRTL ? "ml-3" : "mr-3"
        }`}
      >
        <Skeleton className="h-10 w-10 rounded-lg" />
      </div>
      <div className={`min-w-0 flex-1 ${isRTL ? "text-right" : "text-left"}`}>
        <Skeleton className="h-4 w-[140px] mb-2" />
        <Skeleton className="h-3 w-[80px]" />
      </div>
    </div>
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
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const space: Space = { id, name, contents: count };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onOpen(id)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen(id);
        }
      }}
      className={`group relative flex h-[88px] items-center rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm transition-all duration-200 hover:shadow-md hover:border-gray-200 dark:hover:border-gray-700 hover:-translate-y-0.5 cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 ${
        isRTL ? "pr-5 pl-4" : "pl-5 pr-4"
      }`}
    >
      <div
        className={`absolute top-2 opacity-0 transition-all duration-200 group-hover:opacity-100 ${
          isRTL ? "left-2" : "right-2"
        }`}
      >
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className="h-8 w-8 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          aria-label={t("dashboard.spaces.deleteSpace")}
          onClick={(e) => {
            e.stopPropagation();
            onDeleteRequest(space);
          }}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Icon */}
      <div
        className={`grid h-10 w-10 place-items-center rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/30 dark:to-gray-800/30 text-gray-600 dark:text-gray-400 group-hover:from-gray-100 group-hover:to-gray-200 dark:group-hover:from-gray-800/40 dark:group-hover:to-gray-700/40 transition-all duration-200 ${
          isRTL ? "ml-4" : "mr-4"
        }`}
      >
        <Boxes className="h-5 w-5" />
      </div>

      {/* Content */}
      <div className={`min-w-0 flex-1 ${isRTL ? "text-right" : "text-left"}`}>
        <div className="truncate text-[15px] font-semibold text-gray-900 dark:text-gray-100 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors">
          {name}
        </div>
        <div className="text-[13px] text-gray-500 dark:text-gray-400">
          {t("dashboard.spaces.itemCount", { count })}
        </div>
      </div>

      {/* Hover Ring Effect */}
      <span className="pointer-events-none absolute inset-0 rounded-xl ring-0 group-hover:ring-1 group-hover:ring-gray-200 dark:group-hover:ring-gray-700/50 transition-all duration-200" />
    </div>
  );
}
