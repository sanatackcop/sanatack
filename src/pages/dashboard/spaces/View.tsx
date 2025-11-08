import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CalendarClock,
  Clock3,
  Grid2x2,
  ImageIcon,
  PencilLine,
  Users,
  Smile,
  Loader2,
  Search,
} from "lucide-react";
import { useParams } from "react-router-dom";
import { getSingleSpaceApi, updateSpaceApi } from "@/utils/_apis/courses-apis";
import { Space } from "@/types/courses";
import WorkspacesList from "../workspaces/WorkspacesList.";
import { formatRelativeDate } from "@/components/utiles";
import EmojiPicker, { EmojiStyle } from "emoji-picker-react";
import { createApi } from "unsplash-js";

type UnsplashPhoto = {
  id: string;
  alt_description?: string | null;
  description?: string | null;
  urls: {
    thumb: string;
    small: string;
    regular: string;
    full: string;
  };
  user?: {
    name?: string;
  };
};

export default function SpaceView() {
  const { t, i18n } = useTranslation();
  const { id: routeId } = useParams();

  const dir = i18n.dir();
  const language = i18n.language as "en" | "ar";

  const [layout, setLayout] = useState<"grid" | "list">("grid");
  const [space, setSpace] = useState<Space | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [openEdit, setOpenEdit] = useState(false);
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
  const [, setOpenDialogEmojiPicker] = useState(false);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editCoverImage, setEditCoverImage] = useState("");
  const [editIcon, setEditIcon] = useState("");
  const [saving, setSaving] = useState(false);
  const unsplashAccessKey = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;
  const unsplashApi = useMemo(
    () =>
      unsplashAccessKey ? createApi({ accessKey: unsplashAccessKey }) : null,
    [unsplashAccessKey]
  );
  const [openCoverPicker, setOpenCoverPicker] = useState(false);
  const [unsplashPhotos, setUnsplashPhotos] = useState<UnsplashPhoto[]>([]);
  const [unsplashLoading, setUnsplashLoading] = useState(false);
  const [unsplashError, setUnsplashError] = useState<string | null>(null);
  const [unsplashQuery, setUnsplashQuery] = useState("");
  const [coverSaving, setCoverSaving] = useState(false);

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

  const handleIconUpdate = async (emoji: string) => {
    if (!space) return;

    const payload = {
      name: space.name,
      description: space.description as string,
      coverImageUrl: space.coverImageUrl as string | null,
      icon: emoji,
    };

    try {
      const res = await updateSpaceApi(space.id, payload);
      const updated: Space = (res?.data ?? res) as Space;

      setSpace((prev: Space | null) =>
        prev
          ? {
              ...prev,
              icon: updated?.icon ?? emoji,
            }
          : prev
      );
      setOpenEmojiPicker(false);
    } catch (e: any) {
      console.error("Failed to update icon:", e);
    }
  };

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
      setOpenDialogEmojiPicker(false);
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

  const loadUnsplashPhotos = useCallback(
    async (query?: string) => {
      if (!unsplashApi) {
        setUnsplashError(
          t(
            "dashboard.spaceView.coverPicker.missingKey",
            "Unsplash access key is missing. Please set VITE_UNSPLASH_ACCESS_KEY."
          )
        );
        setUnsplashPhotos([]);
        return;
      }

      setUnsplashLoading(true);
      setUnsplashError(null);

      try {
        const trimmedQuery = query?.trim();
        const response = trimmedQuery
          ? await unsplashApi.search.getPhotos({
              query: trimmedQuery,
              perPage: 24,
              orientation: "landscape",
            })
          : await unsplashApi.photos.list({
              perPage: 24,
              // orderBy: "latest",
            });

        const payload = Array.isArray(response.response)
          ? response.response
          : response.response?.results ?? [];

        setUnsplashPhotos(
          (payload as UnsplashPhoto[]).filter(
            (photo) => photo?.urls?.regular || photo?.urls?.small
          )
        );
      } catch (e: any) {
        setUnsplashError(
          e?.message ??
            t(
              "dashboard.spaceView.coverPicker.loadError",
              "Failed to load images. Please try again."
            )
        );
      } finally {
        setUnsplashLoading(false);
      }
    },
    [t, unsplashApi]
  );

  const handleUnsplashSearch = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      loadUnsplashPhotos(unsplashQuery || undefined);
    },
    [loadUnsplashPhotos, unsplashQuery]
  );

  const handleCoverSelect = useCallback(
    async (photo: UnsplashPhoto) => {
      if (!space) return;

      const selectedUrl =
        photo?.urls?.regular ??
        photo?.urls?.full ??
        photo?.urls?.small ??
        photo?.urls?.thumb;

      if (!selectedUrl) return;

      const payload = {
        name: space.name,
        description:
          typeof space.description === "string" ? space.description : "",
        coverImageUrl: selectedUrl,
        icon: typeof space.icon === "string" ? space.icon : null,
      };

      try {
        setCoverSaving(true);
        setUnsplashError(null);
        const res = await updateSpaceApi(space.id, payload);
        const updated: Space = (res?.data ?? res) as Space;

        const coverUrl =
          updated?.coverImageUrl ?? payload.coverImageUrl ?? selectedUrl;

        setSpace((prev: Space | null) =>
          prev
            ? {
                ...prev,
                coverImageUrl: coverUrl,
              }
            : prev
        );
        setEditCoverImage(coverUrl ?? "");
        setOpenCoverPicker(false);
      } catch (e: any) {
        setUnsplashError(
          e?.message ??
            t(
              "dashboard.spaceView.coverPicker.applyError",
              "Failed to update the cover. Please try again."
            )
        );
      } finally {
        setCoverSaving(false);
      }
    },
    [space, t]
  );

  useEffect(() => {
    if (openCoverPicker) {
      loadUnsplashPhotos();
    } else {
      setUnsplashError(null);
    }
  }, [loadUnsplashPhotos, openCoverPicker]);

  return (
    <section className="relative min-h-screen w-full" dir={dir} lang={language}>
      {/* Cover */}
      <div className="relative min-h-[18svh] h-[22svh] sm:h-[28svh] md:h-[32svh] w-full overflow-hidden">
        {loading ? (
          <Skeleton className="h-full w-full" />
        ) : space?.coverImageUrl ? (
          <>
            <img
              src={space.coverImageUrl}
              alt={t(
                "dashboard.spaceView.coverAlt",
                "Cover image for this space"
              )}
              className="h-full w-full object-cover"
              loading="eager"
              fetchPriority="high"
            />
            {/* top-to-bottom gradient for legibility */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/10 via-black/0 to-black/30 dark:from-black/30 dark:via-black/10 dark:to-black/50" />
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-zinc-100 via-zinc-50 to-zinc-200 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-800">
            <div className="text-center px-4">
              <ImageIcon className="mx-auto h-14 w-14 text-zinc-300 dark:text-zinc-700" />
              <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
                {t("dashboard.spaceView.noCover", "Click edit to add a cover")}
              </p>
            </div>
          </div>
        )}

        {/* Floating Cover Toolbar (responsive, RTL/LTR aware) */}
        <div
          className={[
            "pointer-events-none absolute inset-x-0 bottom-3 sm:bottom-4",
            "px-3 sm:px-4",
          ].join(" ")}
        >
          <div
            className={[
              "mx-auto flex w-full max-w-6xl",
              dir === "rtl" ? "justify-start" : "justify-end",
            ].join(" ")}
          >
            <div className="pointer-events-auto flex items-center gap-2">
              {/* Edit Space */}
              <Dialog open={openEdit} onOpenChange={setOpenEdit}>
                <DialogTrigger asChild>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="rounded-xl border border-zinc-200/60 bg-white/95 shadow-lg backdrop-blur-md transition-all hover:scale-[1.02] hover:bg-white hover:shadow-xl dark:border-zinc-700/50 dark:bg-zinc-900/95 dark:hover:bg-zinc-900"
                    disabled={loading}
                    title={t("dashboard.spaceView.actions.edit", "Edit space")}
                    aria-label={t(
                      "dashboard.spaceView.actions.edit",
                      "Edit space"
                    )}
                  >
                    <PencilLine className="h-4 w-4" />
                    <span className="hidden xs:inline">
                      {t("dashboard.spaceView.actions.edit", "Edit space")}
                    </span>
                  </Button>
                </DialogTrigger>
                <DialogContent
                  dir={dir}
                  className="max-h-[90vh] overflow-y-auto"
                >
                  <DialogHeader>
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

                  <div className="grid gap-5 py-2">
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
                        className="transition-all focus:ring-2"
                        aria-invalid={!editName.trim()}
                        aria-describedby="spaceName-help"
                      />
                      <span id="spaceName-help" className="sr-only">
                        {t("common.required", "Required")}
                      </span>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="spaceDescription">
                        {t(
                          "dashboard.spaceView.form.description",
                          "Description"
                        )}
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
                        className="resize-none transition-all focus:ring-2"
                      />
                    </div>
                  </div>

                  {error && (
                    <div
                      className="rounded-lg border border-destructive/50 bg-destructive/10 p-3"
                      role="alert"
                    >
                      <p className="text-sm text-destructive">{error}</p>
                    </div>
                  )}

                  <DialogFooter className="gap-2 sm:gap-0">
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setOpenEdit(false);
                        setOpenDialogEmojiPicker(false);
                      }}
                      disabled={saving}
                      className="transition-all"
                    >
                      {t("common.cancel", "Cancel")}
                    </Button>
                    <Button
                      onClick={handleUpdate}
                      disabled={saving || !editName.trim()}
                      className="transition-all"
                    >
                      {saving
                        ? t("dashboard.spaceView.form.saving", "Saving…")
                        : t("dashboard.spaceView.form.save", "Save changes")}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* Change Cover */}
              <Dialog open={openCoverPicker} onOpenChange={setOpenCoverPicker}>
                <DialogTrigger asChild>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="rounded-xl border border-zinc-200/60 bg-white/90 shadow-lg backdrop-blur-md transition-all hover:scale-[1.02] hover:bg-white hover:shadow-xl dark:border-zinc-700/50 dark:bg-zinc-900/90 dark:hover:bg-zinc-900"
                    disabled={loading || coverSaving || !unsplashAccessKey}
                    title={
                      !unsplashAccessKey
                        ? t(
                            "dashboard.spaceView.coverPicker.missingKey",
                            "Unsplash access key is missing. Please set VITE_UNSPLASH_ACCESS_KEY."
                          )
                        : t(
                            "dashboard.spaceView.actions.changeCover",
                            "Change cover"
                          )
                    }
                    aria-label={t(
                      "dashboard.spaceView.actions.changeCover",
                      "Change cover"
                    )}
                  >
                    <ImageIcon className="h-4 w-4" />
                    <span className="hidden xs:inline">
                      {t(
                        "dashboard.spaceView.actions.changeCover",
                        "Change cover"
                      )}
                    </span>
                  </Button>
                </DialogTrigger>

                <DialogContent
                  dir={dir}
                  className="max-h-[90vh] max-w-5xl overflow-y-auto"
                >
                  <DialogHeader>
                    <DialogTitle>
                      {t(
                        "dashboard.spaceView.coverPicker.title",
                        "Pick a cover image"
                      )}
                    </DialogTitle>
                    <DialogDescription>
                      {t(
                        "dashboard.spaceView.coverPicker.description",
                        "Browse curated Unsplash photos or search for a theme to refresh your space."
                      )}
                    </DialogDescription>
                  </DialogHeader>

                  {!unsplashAccessKey ? (
                    <div className="rounded-xl border border-amber-200/60 bg-amber-100/60 p-4 text-sm text-amber-700 dark:border-amber-700/60 dark:bg-amber-900/20 dark:text-amber-200">
                      {t(
                        "dashboard.spaceView.coverPicker.missingKey",
                        "Unsplash access key is missing. Please set VITE_UNSPLASH_ACCESS_KEY."
                      )}
                    </div>
                  ) : (
                    <>
                      <form
                        onSubmit={handleUnsplashSearch}
                        className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white/90 p-2 shadow-sm transition-all focus-within:border-zinc-400 focus-within:shadow-md dark:border-zinc-700 dark:bg-zinc-900"
                        role="search"
                        aria-label={t("common.search", "Search")}
                      >
                        <div className="relative flex-1">
                          <Search className="pointer-events-none absolute top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 dark:text-zinc-500" />
                          <Input
                            value={unsplashQuery}
                            onChange={(e) => setUnsplashQuery(e.target.value)}
                            placeholder={t(
                              "dashboard.spaceView.coverPicker.searchPlaceholder",
                              "Search (e.g. study desk, creative workspace…)"
                            )}
                            aria-label={t("common.search", "Search")}
                          />
                        </div>
                        <Button type="submit" disabled={unsplashLoading}>
                          {unsplashLoading
                            ? t("common.loading", "Loading…")
                            : t("common.search", "Search")}
                        </Button>
                      </form>

                      {unsplashError && (
                        <div className="mt-3 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive dark:border-destructive/30">
                          {unsplashError}
                        </div>
                      )}

                      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                        {unsplashLoading ? (
                          Array.from({ length: 10 }).map((_, idx) => (
                            <Skeleton
                              key={idx}
                              className="h-36 w-full rounded-2xl"
                            />
                          ))
                        ) : unsplashPhotos.length === 0 ? (
                          <div className="col-span-full rounded-xl border border-zinc-200 bg-zinc-50/80 p-6 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900/60 dark:text-zinc-300">
                            {t(
                              "dashboard.spaceView.coverPicker.noResults",
                              "No images found for this search."
                            )}
                          </div>
                        ) : (
                          unsplashPhotos.map((photo) => (
                            <button
                              key={photo.id}
                              type="button"
                              onClick={() => handleCoverSelect(photo)}
                              disabled={coverSaving}
                              className="group relative overflow-hidden rounded-2xl border border-zinc-200/70 bg-white shadow-sm transition-all hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 disabled:opacity-70 dark:border-zinc-700/60 dark:bg-zinc-900 dark:hover:border-zinc-600"
                            >
                              <img
                                src={photo.urls.small}
                                alt={
                                  photo.alt_description ??
                                  photo.description ??
                                  t(
                                    "dashboard.spaceView.coverPicker.imageAlt",
                                    "Unsplash cover option"
                                  )
                                }
                                className="h-36 w-full object-cover transition-transform duration-200 group-hover:scale-105"
                                loading="lazy"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/20 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between px-3 py-2 text-xs text-white">
                                <span className="truncate">
                                  {photo.user?.name ??
                                    t(
                                      "dashboard.spaceView.coverPicker.unsplash",
                                      "Unsplash"
                                    )}
                                </span>
                                <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide">
                                  {coverSaving ? (
                                    <Loader2 className="h-3 w-3 animate-spin" />
                                  ) : (
                                    t("common.select", "Select")
                                  )}
                                </span>
                              </div>
                            </button>
                          ))
                        )}
                      </div>

                      <p className="mt-4 text-[11px] text-zinc-400 dark:text-zinc-500">
                        {t(
                          "dashboard.spaceView.coverPicker.credit",
                          "Photos provided by Unsplash."
                        )}
                      </p>
                    </>
                  )}
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>

      <div className="relative mx-auto max-w-5xl px-6 pb-20 md:px-12 lg:px-20">
        {/* Icon + Title - Floating above cover with z-index and background */}
        <div className={`relative -mt-20 z-10 mb-10 flex items-start gap-5`}>
          {/* Large Icon - Clickable with Emoji Picker */}
          <Popover open={openEmojiPicker} onOpenChange={setOpenEmojiPicker}>
            <PopoverTrigger asChild>
              <button
                className="group relative flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-2xl border-2 border-zinc-200/80 bg-white text-6xl shadow-xl transition-all duration-300 hover:scale-105 hover:border-zinc-300 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-zinc-200 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700 dark:focus:ring-zinc-800"
                disabled={loading}
                aria-label={t(
                  "dashboard.spaceView.actions.changeIcon",
                  "Change icon"
                )}
              >
                {space?.icon ? (
                  <span aria-hidden="true">{space.icon}</span>
                ) : (
                  <Grid2x2 className="h-10 w-10 text-zinc-400 dark:text-zinc-600" />
                )}
                {/* Hover overlay */}
                <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/0 opacity-0 transition-all duration-300 group-hover:bg-black/40 group-hover:opacity-100">
                  <Smile className="h-8 w-8 text-white" />
                </div>
              </button>
            </PopoverTrigger>
            <PopoverContent
              side="bottom"
              align="start"
              className="w-auto border-zinc-200 p-0 shadow-2xl dark:border-zinc-800"
            >
              <EmojiPicker
                onEmojiClick={(e) => handleIconUpdate(e.emoji)}
                autoFocusSearch
                previewConfig={{ showPreview: false }}
                emojiStyle={EmojiStyle.NATIVE}
                searchDisabled={false}
                hiddenEmojis={[
                  "1f3f3-fe0f-200d-1f308",
                  "1f3f3-fe0f-200d-26a7-fe0f",
                  "1f1ee-1f1f1",
                ]}
                style={
                  {
                    "--epr-emoji-size": "24px",
                    "--epr-emoji-gap": "8px",
                    height: "350px",
                  } as React.CSSProperties
                }
              />
            </PopoverContent>
          </Popover>

          {/* Title - Floating with Background */}
          <div className={`min-w-0 flex-1 pt-4`}>
            {loading ? (
              <Skeleton className="h-12 w-80" />
            ) : error ? (
              <p className="text-sm text-destructive">{error}</p>
            ) : (
              <div className="inline-block rounded-2xl border border-zinc-200/80 bg-white/98 px-6 py-3 shadow-xl backdrop-blur-md transition-all duration-300 hover:shadow-2xl dark:border-zinc-800 dark:bg-zinc-900/98">
                <h1 className="text-5xl font-bold tracking-tight text-white dark:text-zinc-100 md:text-6xl">
                  {space?.name ||
                    t("dashboard.spaceView.untitled", "Untitled space")}
                </h1>
              </div>
            )}
          </div>
        </div>

        {/* Description - Notion style */}
        <div className={`mb-10`}>
          {loading ? (
            <div className="space-y-3">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-5/6" />
              <Skeleton className="h-5 w-4/6" />
            </div>
          ) : (
            <p className="whitespace-pre-wrap text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
              {space?.description?.trim() ||
                t(
                  "dashboard.spaceView.noDescription",
                  "No description has been added yet."
                )}
            </p>
          )}
        </div>

        {/* Metadata - Notion style pills */}
        <div className={`mb-14 flex flex-wrap items-center gap-3 text-sm `}>
          <div
            className={`flex items-center gap-2.5 rounded-full bg-zinc-100/80 px-4 py-2 backdrop-blur-sm transition-all duration-200 hover:bg-zinc-200/80 dark:bg-zinc-800/80 dark:hover:bg-zinc-700/80`}
          >
            <CalendarClock className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
            <span className="font-medium text-zinc-700 dark:text-zinc-300">
              {t("dashboard.spaceView.meta.created", "Created {{date}}", {
                date: space?.created_at
                  ? formatRelativeDate(space.created_at, language)
                  : t("dashboard.spaceView.meta.unknown", "recently"),
              })}
            </span>
          </div>

          <div
            className={`flex items-center gap-2.5 rounded-full bg-zinc-100/80 px-4 py-2 backdrop-blur-sm transition-all duration-200 hover:bg-zinc-200/80 dark:bg-zinc-800/80 dark:hover:bg-zinc-700/80`}
          >
            <Clock3 className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
            <span className="font-medium text-zinc-700 dark:text-zinc-300">
              {t("dashboard.spaceView.meta.updated", "Updated {{date}}", {
                date: space?.lastActivity
                  ? formatRelativeDate(space.lastActivity, language)
                  : space?.updated_at
                  ? formatRelativeDate(space.updated_at, language)
                  : t("dashboard.spaceView.meta.unknown", "recently"),
              })}
            </span>
          </div>

          <div
            className={`flex items-center gap-2.5 rounded-full bg-zinc-100/80 px-4 py-2 backdrop-blur-sm transition-all duration-200 hover:bg-zinc-200/80 dark:bg-zinc-800/80 dark:hover:bg-zinc-700/80`}
          >
            <Users className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
            <span className="font-medium text-zinc-700 dark:text-zinc-300">
              {formatNum.format(
                space?.memberCount ?? space?.members?.length ?? 0
              )}{" "}
              {t("dashboard.spaceView.meta.members", {
                count: space?.memberCount ?? space?.members?.length ?? 0,
                defaultValue_one: "member",
                defaultValue_other: "members",
              })}
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="mb-10 h-px w-full bg-gradient-to-r from-transparent via-zinc-200 to-transparent dark:via-zinc-800" />

        {/* Workspaces Section Header */}
        <div className={`mb-8 flex items-center justify-between`}>
          <div className={`flex items-center gap-4`}>
            <h2
              className={`text-2xl font-bold text-zinc-900 dark:text-zinc-100`}
            >
              {t("dashboard.spaceView.workspaces.title", "Workspaces")}
            </h2>
            <span className="rounded-lg bg-zinc-100 px-3 py-1 text-base font-semibold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
              {loading ? (
                <Skeleton className="h-5 w-10" />
              ) : (
                formatNum.format(itemCount)
              )}
            </span>
          </div>

          <Button
            type="button"
            variant={layout === "grid" ? "secondary" : "ghost"}
            size="icon"
            className="rounded-xl transition-all duration-200 hover:scale-105"
            onClick={() => setLayout("grid")}
            aria-label={t("dashboard.spaceView.actions.grid", "Grid view")}
            title={t("dashboard.spaceView.actions.grid", "Grid view")}
            disabled={loading}
          >
            <Grid2x2 className="h-5 w-5" />
          </Button>
        </div>

        <WorkspacesList
          workspaces={space?.workspaces ?? []}
          refreshParentComponent={fetchSpace}
        />
      </div>
    </section>
  );
}
