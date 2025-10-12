import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next"; // i18n hook
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
import { Grid2x2, PencilLine } from "lucide-react";
import { useParams } from "react-router-dom";
import { getSingleSpaceApi, updateSpaceApi } from "@/utils/_apis/courses-apis";
import Recent from "@/components/Recent";

type Space = {
  id: string;
  name: string;
  description?: string | null;
  items?: Array<unknown> | null;
};

export default function SpaceView() {
  const { t, i18n } = useTranslation();
  const { id: routeId } = useParams();

  // Get direction dynamically from i18n
  const direction = i18n.dir(); // returns 'rtl' or 'ltr'
  const language = i18n.language; // current language code like 'ar' or 'en'

  const [layout, setLayout] = useState<"grid" | "list">("grid");
  const [space, setSpace] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [openEdit, setOpenEdit] = useState(false);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [saving, setSaving] = useState(false);

  const itemCount = space?.items?.length ?? 0;
  const formatNum = useMemo(
    () => new Intl.NumberFormat(language === "ar" ? "ar" : "en"),
    [language]
  );

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
        setError(e?.message ?? t("errorLoadSpace", "Failed to load the space"));
      } finally {
        setLoading(false);
      }
    };
    fetchSpace();
  }, [routeId, t]);

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
      setSpace((prev: any) => ({
        ...prev,
        name: updated?.name ?? payload.name ?? "",
        description: updated?.description ?? payload.description ?? "",
      }));
      setOpenEdit(false);
    } catch (e: any) {
      setError(e?.message ?? t("errorSaveSpace", "Failed to save changes"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <section
      className="px-20 mx-auto w-full mt-10"
      dir={direction}
      lang={language}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0" style={{ textAlign: "left" }}>
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
                {space?.description ||
                  t("noDescription", "No description available")}
              </p>
            </>
          )}
        </div>

        <div
          className={`flex items-center gap-2 ${
            direction === "rtl" ? "flex-row-reverse" : "flex-row"
          }`}
        >
          <Dialog open={openEdit} onOpenChange={setOpenEdit}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className={`rounded-full px-4 py-2 flex gap-2 ${
                  direction === "rtl" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <PencilLine className="h-4 w-4" />
                <span>{t("editSpace", "Edit Space")}</span>
              </Button>
            </DialogTrigger>
            <DialogContent dir={direction}>
              <DialogHeader>
                <DialogTitle>
                  {t("editSpaceData", "Edit Space Data")}
                </DialogTitle>
                <DialogDescription>
                  {t(
                    "updateSpaceDesc",
                    "Update space name and description and save changes."
                  )}
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-2">
                <div className="grid gap-2">
                  <Label htmlFor="name">{t("spaceName", "Space Name")}</Label>
                  <Input
                    id="name"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder={t("enterSpaceName", "Enter space name")}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="desc">
                    {t("description", "Description")}
                  </Label>
                  <Textarea
                    id="desc"
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    placeholder={t(
                      "enterShortDesc",
                      "Enter a short description"
                    )}
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
                  {t("cancel", "Cancel")}
                </Button>
                <Button
                  onClick={handleUpdate}
                  disabled={saving || !editName.trim()}
                >
                  {saving ? t("saving", "Saving...") : t("save", "Save")}
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
            aria-label={t("gridView", "Grid view")}
            title={t("gridView", "Grid view")}
            disabled={loading}
          >
            <Grid2x2 className="h-5 w-5" />
          </Button>
        </div>
        <div className="text-sm text-muted-foreground">
          {loading ? (
            <Skeleton className="h-4 w-20" />
          ) : (
            <>
              {formatNum.format(itemCount)} {t("items", "items")}
            </>
          )}
        </div>
      </div>

      {/* Content */}

      <Recent isRTL={false} />
    </section>
  );
}
