import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CalendarClock,
  Clock3,
  Grid2x2,
  ImageIcon,
  PencilLine,
  Users,
} from "lucide-react";
import { useParams } from "react-router-dom";
import { getSingleSpaceApi, updateSpaceApi } from "@/utils/_apis/courses-apis";
import { Space } from "@/types/courses";
import WorkspacesList from "../workspaces/WorkspacesList.";
import { formatRelativeDate } from "@/components/utiles";

export default function SpaceView() {
  const { t, i18n } = useTranslation();
  const { id: routeId } = useParams();

  const dir = i18n.dir();
  const isRTL = dir === "rtl";
  const language = i18n.language;

  const [layout, setLayout] = useState<"grid" | "list">("grid");
  const [space, setSpace] = useState<Space | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [openEdit, setOpenEdit] = useState(false);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editCoverImage, setEditCoverImage] = useState("");
  const [editIcon, setEditIcon] = useState("");
  const [saving, setSaving] = useState(false);

  const itemCount = space?.workspaces?.length ?? 0;
  const formatNum = useMemo(
    () => new Intl.NumberFormat(language === "ar" ? "ar" : "en"),
    [language]
  );

  const fetchSpace = useCallback(async () => {
    if (!routeId) return;
    setLoading(true);
    setError(null);

    try {
      const res = await getSingleSpaceApi(routeId as string);
      const data: Space = (res?.data ?? res) as Space;
      setSpace(data);
      setEditName(data?.name ?? "");
      setEditDescription((data?.description as string) ?? "");
      setEditCoverImage((data?.coverImageUrl as string) ?? "");
      setEditIcon((data?.icon as string) ?? "");
    } catch (e: any) {
      setError(
        e?.message ??
          t("dashboard.spaceView.errors.load", "Failed to load the space")
      );
    } finally {
      setLoading(false);
    }
  }, [routeId, t]);

  useEffect(() => {
    fetchSpace();
  }, [fetchSpace]);

  const handleUpdate = async () => {
    if (!space) return;
    setSaving(true);
    setError(null);

    try {
      const payload = {
        name: editName.trim(),
        description: editDescription.trim(),
        coverImageUrl: editCoverImage.trim() || null,
        icon: editIcon.trim() || null,
      };

      const res = await updateSpaceApi(space.id, payload);
      const updated: Space = (res?.data ?? res) as Space;

      setSpace((prev: Space | null) =>
        prev
          ? {
              ...prev,
              name: updated?.name ?? payload.name ?? "",
              description:
                updated?.description ?? (payload.description as string),
              coverImageUrl:
                updated?.coverImageUrl ??
                (payload.coverImageUrl as string | null) ??
                null,
              icon:
                updated?.icon ?? (payload.icon as string | null) ?? prev.icon,
            }
          : prev
      );

      setOpenEdit(false);
    } catch (e: any) {
      setError(
        e?.message ??
          t(
            "dashboard.spaceView.errors.save",
            "Failed to save the latest changes."
          )
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <section
      className="mx-auto mt-10 w-full px-6 pb-10 md:px-12 lg:px-20"
      dir={dir}
      lang={language}
    >
      <div className="grid gap-8 lg:grid-cols-[minmax(0,360px),minmax(0,1fr)]">
        <div
          className="relative overflow-hidden rounded-3xl border border-zinc-200 bg-gradient-to-br
         from-zinc-50 to-zinc-100 shadow-sm dark:border-zinc-800 dark:from-zinc-900/50 dark:to-zinc-900"
        >
          {loading ? (
            <Skeleton className="aspect-[4/3] w-full rounded-3xl" />
          ) : space?.coverImageUrl ? (
            <img
              src={space.coverImageUrl}
              alt={t(
                "dashboard.spaceView.coverAlt",
                "Cover image for this space"
              )}
              className="aspect-[4/3] w-full object-cover"
            />
          ) : (
            <div className="flex aspect-[4/3] w-full flex-col items-center justify-center gap-3 text-center text-muted-foreground">
              <ImageIcon className="h-10 w-10" />
              <p className="text-sm font-medium">
                {t(
                  "dashboard.spaceView.coverPlaceholder",
                  "Add a cover image to bring this space to life."
                )}
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-6">
          <div
            className={`flex items-start justify-between gap-4 ${
              isRTL ? "flex-row-reverse" : "flex-row"
            }`}
          >
            <div
              className={`flex flex-1 items-start gap-4 ${
                isRTL ? "flex-row-reverse text-right" : "text-left"
              }`}
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-zinc-200 bg-white text-2xl shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                {space?.icon ? (
                  <span aria-hidden="true">{space.icon}</span>
                ) : (
                  <Grid2x2 className="h-6 w-6 text-zinc-500 dark:text-zinc-400" />
                )}
              </div>
              <div className="min-w-0 space-y-1">
                {loading ? (
                  <>
                    <Skeleton className="h-7 w-48" />
                    <Skeleton className="h-4 w-32" />
                  </>
                ) : error ? (
                  <p className="text-sm text-destructive">{error}</p>
                ) : (
                  <>
                    <h2 className="truncate text-3xl font-semibold tracking-tight">
                      {space?.name ||
                        t("dashboard.spaceView.untitled", "Untitled space")}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {/* {t("dashboard.spaceView.itemCount", "{{count}} items", {
                        count: formatNum.format(itemCount),
                      })} */}
                    </p>
                  </>
                )}
              </div>
            </div>

            <Dialog open={openEdit} onOpenChange={setOpenEdit}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className={`rounded-full px-4 py-2 transition-colors ${
                    isRTL ? "flex-row-reverse" : ""
                  }`}
                  disabled={loading}
                >
                  <PencilLine className="h-4 w-4" />
                  <span className={isRTL ? "mr-2" : "ml-2"}>
                    {t("dashboard.spaceView.actions.edit", "Edit space")}
                  </span>
                </Button>
              </DialogTrigger>
              <DialogContent dir={dir}>
                <DialogHeader className={isRTL ? "text-right" : "text-left"}>
                  <DialogTitle>
                    {t(
                      "dashboard.spaceView.edit.title",
                      "Update space details"
                    )}
                  </DialogTitle>
                  <DialogDescription>
                    {t(
                      "dashboard.spaceView.edit.description",
                      "Tweak the name, description, icon, or cover to personalize this space."
                    )}
                  </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-2">
                  <div className="grid gap-2">
                    <Label htmlFor="spaceName">
                      {t("dashboard.spaceView.form.name", "Space name")}
                    </Label>
                    <Input
                      id="spaceName"
                      value={editName}
                      dir={dir}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder={t(
                        "dashboard.spaceView.form.namePlaceholder",
                        "Enter a descriptive name"
                      )}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="spaceIcon">
                      {t("dashboard.spaceView.form.icon", "Icon")}
                    </Label>
                    <Input
                      id="spaceIcon"
                      value={editIcon}
                      dir={dir}
                      maxLength={12}
                      onChange={(e) => setEditIcon(e.target.value)}
                      placeholder={t(
                        "dashboard.spaceView.form.iconPlaceholder",
                        "Use an emoji or short label"
                      )}
                    />
                    <p className="text-xs text-muted-foreground">
                      {t(
                        "dashboard.spaceView.form.iconHelper",
                        "Example: 🚀, 📚, أو أي رمز قصير."
                      )}
                    </p>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="spaceCover">
                      {t("dashboard.spaceView.form.cover", "Cover image URL")}
                    </Label>
                    <Input
                      id="spaceCover"
                      value={editCoverImage}
                      dir="ltr"
                      onChange={(e) => setEditCoverImage(e.target.value)}
                      placeholder={t(
                        "dashboard.spaceView.form.coverPlaceholder",
                        "Paste an image link (https://...)"
                      )}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="spaceDescription">
                      {t("dashboard.spaceView.form.description", "Description")}
                    </Label>
                    <Textarea
                      id="spaceDescription"
                      value={editDescription}
                      dir={dir}
                      onChange={(e) => setEditDescription(e.target.value)}
                      placeholder={t(
                        "dashboard.spaceView.form.descriptionPlaceholder",
                        "Summarize the purpose of this space"
                      )}
                      rows={5}
                    />
                  </div>
                </div>

                {error && (
                  <p className="text-sm text-destructive" role="alert">
                    {error}
                  </p>
                )}

                <DialogFooter
                  className={`gap-2 sm:gap-0 ${
                    isRTL ? "flex-row-reverse" : ""
                  }`}
                >
                  <Button
                    variant="ghost"
                    onClick={() => setOpenEdit(false)}
                    disabled={saving}
                  >
                    {t("common.cancel", "Cancel")}
                  </Button>
                  <Button
                    onClick={handleUpdate}
                    disabled={saving || !editName.trim()}
                  >
                    {saving
                      ? t("dashboard.spaceView.form.saving", "Saving…")
                      : t("dashboard.spaceView.form.save", "Save changes")}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className={`space-y-3 ${isRTL ? "text-right" : "text-left"}`}>
            {loading ? (
              <>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </>
            ) : (
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                {space?.description?.trim() ||
                  t(
                    "dashboard.spaceView.noDescription",
                    "No description has been added yet."
                  )}
              </p>
            )}

            <div
              className={`flex flex-wrap items-center gap-4 text-sm text-muted-foreground ${
                isRTL ? "flex-row-reverse" : ""
              }`}
            >
              <div className="flex items-center gap-2">
                <CalendarClock className="h-4 w-4" />
                <span>
                  {t("dashboard.spaceView.meta.created", "Created {{date}}", {
                    date: space?.created_at
                      ? formatRelativeDate(space.created_at)
                      : t("dashboard.spaceView.meta.unknown", "recently"),
                  })}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Clock3 className="h-4 w-4" />
                <span>
                  {t("dashboard.spaceView.meta.updated", "Updated {{date}}", {
                    date: space?.lastActivity
                      ? formatRelativeDate(space.lastActivity)
                      : space?.updated_at
                      ? formatRelativeDate(space.updated_at)
                      : t("dashboard.spaceView.meta.unknown", "recently"),
                  })}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>
                  {formatNum.format(
                    space?.memberCount ?? space?.members?.length ?? 0
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`mt-10 mb-4 flex items-center justify-between ${
          isRTL ? "flex-row-reverse" : ""
        }`}
      >
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant={layout === "grid" ? "secondary" : "ghost"}
            size="icon"
            className="rounded-full"
            onClick={() => setLayout("grid")}
            aria-label={t("dashboard.spaceView.actions.grid", "Grid view")}
            title={t("dashboard.spaceView.actions.grid", "Grid view")}
            disabled={loading}
          >
            <Grid2x2 className="h-5 w-5" />
          </Button>
        </div>
        <div className="text-sm text-muted-foreground">
          {loading ? (
            <Skeleton className="h-4 w-20" />
          ) : (
            formatNum.format(itemCount)
          )}
        </div>
      </div>

      <WorkspacesList
        workspaces={space?.workspaces ?? []}
        isRTL={isRTL}
        refreshParentComponent={fetchSpace}
      />
    </section>
  );
}
