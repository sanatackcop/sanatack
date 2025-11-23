import { Space } from "@/types/courses";
import { useTranslation } from "react-i18next";
import { Button } from "../../../components/ui/button";
import { Skeleton } from "../../../components/ui/skeleton";
import { FileText, ImageIcon, Loader2, Telescope, Trash2 } from "lucide-react";
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
import { useSidebarRefresh } from "@/context/SidebarRefreshContext";

export default function Spaces({
  setParentRefresh,
  refreshParent,
}: {
  setParentRefresh: any;
  refreshParent: boolean;
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { refreshSpace } = useSidebarRefresh();
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [newSpaceName, setNewSpaceName] = useState("");
  const [description, setDescription] = useState("");
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
  }, [refreshParent]);

  async function handleCreateSpace() {
    if (creating) return;

    try {
      setCreating(true);
      const name =
        newSpaceName.trim() ||
        t("dashboard.spaces.defaultName", { count: spaces.length });

      const { data } = await createSpacesApi({
        name,
        description,
      });
      setSpaces((prev) => [...prev, data]);
      setNewSpaceName("");
      setOpenAdd(false);
      fetchAllSpaces();
      setParentRefresh(!refreshParent);
      await refreshSpace().catch((error) =>
        console.error("Failed to refresh sidebar spaces", error)
      );
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
            className={`text-lg font-semibold text-zinc-900 dark:text-zinc-100`}
          >
            {t("dashboard.spaces.header", "Your Spaces")}
          </h2>
        </div>

        <div className="flex flex-wrap gap-5">
          {loading ? (
            <>
              {Array.from({ length: 6 }).map((_, index) => (
                <SpaceItemSkeleton key={index} />
              ))}
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setOpenAdd(true)}
                disabled={creating}
                className={`group relative flex h-48 w-56  flex-col overflow-hidden rounded-2xl
                   border-2 border-dashed border-zinc-200
                    bg-white text-zinc-700 transition-all duration-200 
                    hover:border-zinc-300 hover:bg-zinc-50/60 focus:outline-none 
                    focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 
                    disabled:cursor-not-allowed disabled:opacity-50 
                    dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300
                     dark:hover:border-zinc-500`}
              >
                <div className="flex flex-1 flex-col items-center justify-center gap-3 p-4 text-center">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-full
                     bg-[#10B981] bg-opacity-25 transition-colors group-hover:bg-white group-hover:text-zinc-600
                    dark:bg-zinc-800 dark:group-hover:bg-zinc-700"
                  >
                    <Telescope
                      className="size-6 transition-transform duration-300 
               text-[#0A8E63] group-hover:text-[#10B981]"
                    />
                  </div>
                  <span className="text-sm font-semibold">
                    {t("dashboard.spaces.newSpace")}
                  </span>
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">
                    {t(
                      "dashboard.spaces.newSpaceHint",
                      "Create a fresh space to organize your work"
                    )}
                  </span>
                </div>
              </button>
              {spaces
                .filter(
                  (space): space is Space => space != null && space.id != null
                )
                .map((space) => (
                  <SpaceItem
                    space={space}
                    key={space.id}
                    onOpen={openSpace}
                    onDeleteRequest={requestDelete}
                  />
                ))}
            </>
          )}
        </div>
      </section>

      <Dialog open={openAdd} onOpenChange={setOpenAdd}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>
              {t("dashboard.dialogs.createSpace.title")}
            </DialogTitle>
            <DialogDescription>
              {t("dashboard.dialogs.createSpace.description")}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className={`grid gap-2 space-y-4`}>
              <Label htmlFor="spaceName">
                {t("dashboard.dialogs.createSpace.nameLabel")}
              </Label>
              <Input
                id="spaceName"
                value={newSpaceName}
                onChange={(e) => setNewSpaceName(e.target.value)}
                placeholder={t("dashboard.dialogs.createSpace.placeholder")}
                disabled={creating}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !creating) {
                    e.preventDefault();
                    handleCreateSpace();
                  }
                }}
              />

              <Label htmlFor="descriptionName">
                {t("dashboard.dialogs.createSpace.description")}
              </Label>
              <Input
                id="descriptionName"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t(
                  "dashboard.dialogs.createSpace.descriptionPlaceholder"
                )}
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
        <DialogContent className="sm:max-w-[460px]">
          <DialogHeader>
            <DialogTitle>
              {t("dashboard.dialogs.deleteSpace.title")}
            </DialogTitle>
            <DialogDescription>
              {t("dashboard.dialogs.deleteSpace.description")}
            </DialogDescription>
          </DialogHeader>
          <div
            className={`bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-xl p-4`}
          >
            <div className="text-sm text-red-800 dark:text-red-200">
              <strong>{t("dashboard.dialogs.deleteSpace.spaceName")}:</strong>{" "}
              <span className="font-medium">{spaceToDelete?.name}</span>
            </div>
            <div className="text-xs text-red-600 dark:text-red-400 mt-1">
              {t("dashboard.dialogs.deleteSpace.itemCount", {
                count: spaceToDelete?.workspaces.length ?? 0,
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

function SpaceItemSkeleton() {
  return (
    <div className="flex h-[220px] flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <Skeleton className="h-28 w-full rounded-none" />
      <div className={`flex flex-1 flex-col gap-4 p-4 `}>
        <div className={`flex items-center gap-3 `}>
          <Skeleton className="h-10 w-10 rounded-xl" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
        <div className={`mt-auto flex items-center justify-between `}>
          <div className={`flex items-center gap-2 `}>
            <div className={`flex -space-x-2`}>
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
            <Skeleton className="h-3 w-20" />
          </div>
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
    </div>
  );
}

function SpaceItem({
  space,
  onOpen,
  onDeleteRequest,
}: {
  space: Space;
  onOpen: (id: string) => void;
  onDeleteRequest: (space: Space) => void;
}) {
  const { t } = useTranslation();
  const id = space.id;
  const name = space.name;

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
      className={`group relative flex  h-48 w-56 cursor-pointer flex-col
         overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm
          transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:shadow-zinc-900/40`}
    >
      <div
        className={`absolute top-3 z-20 opacity-0 transition-opacity duration-200 group-hover:opacity-100 `}
      >
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className="pointer-events-auto h-8 w-8 rounded-full text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20"
          aria-label={t("dashboard.spaces.deleteSpace")}
          onClick={(e) => {
            e.stopPropagation();
            onDeleteRequest(space);
          }}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="relative h-28 w-full overflow-hidden bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900/40 dark:to-zinc-800/40">
        {space.coverImageUrl ? (
          <img
            src={space.coverImageUrl}
            alt={t("dashboard.spaces.coverAlt", {
              defaultValue: "Space cover image",
            })}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-zinc-400 dark:text-zinc-500">
            <ImageIcon className="h-9 w-9" />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col px-5 pb-5 pt-4">
        <div className={`flex items-start gap-3`}>
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-white shadow-sm ring-1 ring-zinc-100 transition-colors group-hover:bg-zinc-50 dark:bg-zinc-800 dark:ring-zinc-700 dark:group-hover:bg-zinc-800/70">
            {space.icon ? (
              <span className="text-lg" aria-hidden="true">
                {space.icon}
              </span>
            ) : (
              <FileText className="h-5 w-5 text-zinc-600 dark:text-zinc-300" />
            )}
          </div>
          <div className="min-w-0">
            <div className="truncate text-[15px] font-semibold text-zinc-900 transition-colors group-hover:text-zinc-950 dark:text-zinc-100 dark:group-hover:text-white">
              {name}
            </div>
            <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              {t("dashboard.spaces.itemCount", {
                count: space.workspaceCount ?? space.workspaces?.length ?? 0,
              })}
            </div>
          </div>
        </div>

        {/* <SpaceCardFooter space={space} isRTL={isRTL} /> */}
      </div>
    </div>
  );
}
