import { useTranslation } from "react-i18next";
import { useEffect, useState, useCallback } from "react";
import { getAllWorkSpace } from "@/utils/_apis/learnPlayground-api";
import { Loader2 } from "lucide-react";
import Button from "@mui/material/Button";
import { Workspace } from "@/lib/types";
import WorkspacesList from "./WorkspacesList.";

export default function Recent({
  spaceId,
  setParentRefresh,
  refreshParent,
}: {
  spaceId?: string;
  setParentRefresh?: any;
  refreshParent?: boolean;
}) {
  const { t, i18n } = useTranslation();
  const [workspaces, setWorkspaces] = useState<Workspace[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isRTL = i18n.language === "ar";

  const fetchRecent = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { workspaces: fetchedWorkspaces }: any = await getAllWorkSpace({
        spaceId,
      });
      setWorkspaces(fetchedWorkspaces);
    } catch (err) {
      console.error("Failed to fetch workspaces:", err);
      setError(t("errors.fetchWorkspaces", "Failed to load recent workspaces"));
      setWorkspaces([]);
    } finally {
      setLoading(false);
    }
  }, [spaceId, t]);

  const refreshComponent = useCallback(() => {
    setRefresh(prev => !prev);
    setParentRefresh?.((prev: boolean) => !prev);
  }, [setParentRefresh]);

  useEffect(() => {
    fetchRecent();
  }, [refresh, spaceId]);

  if (loading) {
    return (
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2
            className={`text-lg font-semibold ${
              isRTL ? "text-right" : "text-left"
            }`}
          >
            {t("sidebar.recent")}
          </h2>
          <div className="flex items-center space-x-2 rtl:space-x-reverse rtl:flex-row-reverse gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-zinc-400" />
            <span className="text-xs text-zinc-500">{t("common.loading")}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-28 bg-zinc-200 dark:bg-zinc-800 rounded-xl animate-pulse"
            />
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2
            className={`text-lg font-semibold ${
              isRTL ? "text-right" : "text-left"
            }`}
          >
            {t("sidebar.recent")}
          </h2>
        </div>

        <div className="text-center py-8">
          <p className="text-red-500 text-sm mb-2">{error}</p>
          <Button
            variant="outlined"
            size="small"
            onClick={fetchRecent}
            className="text-xs"
          >
            {t("actions.retry", "Try Again")}
          </Button>
        </div>
      </section>
    );
  }

  if (!workspaces) return;

  return (
    <WorkspacesList
      workspaces={workspaces}
      refreshParentComponent={refreshComponent}
    />
  );
}
