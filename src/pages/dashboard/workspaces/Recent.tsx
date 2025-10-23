import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { getAllWorkSpace } from "@/utils/_apis/learnPlayground-api";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import Button from "@mui/material/Button";
import { Workspace } from "@/lib/types";
import WorkspacesList from "./WorkspacesList.";

const WorkspaceItemSkeleton = () => (
  <Card className="p-4 border border-zinc-300 rounded-2xl bg-zinc-50">
    <CardContent className="p-0">
      <div className="flex items-start space-x-3 rtl:space-x-reverse">
        <Skeleton className="w-16 h-12 rounded-lg flex-shrink-0" />
        <div className="flex-1 space-y-2 min-w-0">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <Skeleton className="h-3 w-12" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
        <Skeleton className="w-8 h-8 rounded-full" />
      </div>
    </CardContent>
  </Card>
);

export default function Recent() {
  const { t, i18n } = useTranslation();
  const [workspaces, setWorkspaces] = useState<Workspace[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isRTL = i18n.language === "ar";

  const fetchRecent = async () => {
    try {
      setLoading(true);
      setError(null);

      const { workspaces: fetchedWorkspaces }: any = await getAllWorkSpace();

      const sortedWorkspaces =
        fetchedWorkspaces?.sort(
          (a: Workspace, b: Workspace) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        ) || [];

      setWorkspaces(sortedWorkspaces);
    } catch (err) {
      console.error("Failed to fetch workspaces:", err);
      setError(t("errors.fetchWorkspaces", "Failed to load recent workspaces"));
      setWorkspaces([]);
    } finally {
      setLoading(false);
    }
  };

  const refreshComponent = () => {
    setRefresh(!refresh);
  };

  useEffect(() => {
    fetchRecent();
  }, [refresh]);

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
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <Loader2 className="w-4 h-4 animate-spin text-zinc-400" />
            <span className="text-xs text-zinc-500">
              {t("loading.recent", "Loading...")}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <WorkspaceItemSkeleton key={i} />
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
      isRTL={isRTL}
    />
  );
}
