import { useTranslation } from "react-i18next";
import EmptyState from "./EmptyState";
import { useEffect, useState } from "react";
import { getAllWorkSpace } from "@/utils/_apis/learnPlayground-api";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FileText, Play, Clock, MoreHorizontal, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

// Workspace interface
export interface Workspace {
  id: string;
  title?: string;
  youtubeUrl?: string;
  contentType: "youtube" | "pdf";
  pdfUrl?: string;
  createdAt: string;
  updatedAt: string;
  thumbnail?: string;
  duration?: string;
  progress?: number;
}

// Skeleton component for workspace items
const WorkspaceItemSkeleton = () => (
  <Card className="p-4 border border-gray-200 rounded-2xl">
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

// Individual workspace item component
const WorkspaceItem = ({
  workspace,
  onClick,
  isRTL,
}: {
  workspace: Workspace;
  onClick: () => void;
  isRTL: boolean;
}) => {
  const { t } = useTranslation();

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return t("time.today", "Today");
    if (diffDays === 2) return t("time.yesterday", "Yesterday");
    if (diffDays <= 7)
      return t("time.daysAgo", "{{days}} days ago", { days: diffDays - 1 });

    return date.toLocaleDateString();
  };

  // Get content icon
  const getContentIcon = () => {
    return workspace.contentType === "youtube" ? (
      <Play className="w-4 h-4 text-red-500" />
    ) : (
      <FileText className="w-4 h-4 text-blue-500" />
    );
  };

  const getDisplayTitle = () => {
    if (workspace.workspaceName) return workspace.workspaceName;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        className="p-4 border border-gray-200 rounded-2xl hover:border-gray-300 
                   transition-all duration-200 cursor-pointer group"
        onClick={onClick}
      >
        <CardContent className="p-0">
          <div
            className={`flex items-start space-x-3 ${
              isRTL ? "rtl:space-x-reverse" : ""
            }`}
          >
            <div
              className="w-16 h-12 rounded-lg bg-gray-100 flex items-center justify-center 
                           flex-shrink-0 group-hover:bg-gray-200 transition-colors"
            >
              {workspace.thumbnail ? (
                <img
                  src={workspace.thumbnail}
                  alt={getDisplayTitle()}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full">
                  {getContentIcon()}
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 space-y-1 min-w-0">
              <h3 className="font-medium text-gray-900 truncate text-sm group-hover:text-gray-700">
                {getDisplayTitle()}
              </h3>

              <div
                className={`flex items-center space-x-2 text-xs text-gray-500 
                             ${isRTL ? "rtl:space-x-reverse" : ""}`}
              >
                <Clock className="w-3 h-3" />
                <span>{formatDate(workspace.updatedAt)}</span>

                {workspace.contentType === "youtube" && workspace.duration && (
                  <>
                    <span>•</span>
                    <span>{workspace.duration}</span>
                  </>
                )}
              </div>

              {/* Progress bar if exists */}
              {workspace.progress !== undefined && workspace.progress > 0 && (
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-1">
                    <div
                      className="bg-blue-500 h-1 rounded-full transition-all duration-300"
                      style={{ width: `${workspace.progress}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500 mt-1">
                    {Math.round(workspace.progress)}%{" "}
                    {t("progress.complete", "complete")}
                  </span>
                </div>
              )}
            </div>

            {/* More options button */}
            <Button
              variant="ghost"
              size="sm"
              className="w-8 h-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                // Handle more options
              }}
            >
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default function Recent({ isRTL }: { isRTL: boolean }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [workspaces, setWorkspaces] = useState<Workspace[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecent = async () => {
    try {
      setLoading(true);
      setError(null);

      const { workspaces: fetchedWorkspaces } = await getAllWorkSpace();

      // Sort by updatedAt to show most recent first
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

  const handleWorkspaceClick = (workspaceId: string) => {
    navigate(`/dashboard/learn/workspace/${workspaceId}`);
  };

  useEffect(() => {
    fetchRecent();
  }, []);

  // Loading skeleton
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
          <div className="flex items-center space-x-2">
            <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
            <span className="text-xs text-gray-500">
              {t("loading.recent", "Loading...")}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <WorkspaceItemSkeleton key={i} />
          ))}
        </div>
      </section>
    );
  }

  // Error state
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
            variant="outline"
            size="sm"
            onClick={fetchRecent}
            className="text-xs"
          >
            {t("actions.retry", "Try Again")}
          </Button>
        </div>
      </section>
    );
  }

  // Empty state
  if (!workspaces || workspaces.length === 0) {
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
        <EmptyState />
      </section>
    );
  }

  // Main content with workspaces
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
        <span className="text-xs text-gray-500">
          {workspaces.length} {t("workspace.items", "items")}
        </span>
      </div>

      <div className="overflow-y-auto scrollbar-hide grid grid-cols-4 items-center gap-2">
        {workspaces.map((workspace, index) => (
          <WorkspaceItem
            key={workspace.id}
            workspace={workspace}
            onClick={() => handleWorkspaceClick(workspace.id)}
            isRTL={isRTL}
          />
        ))}
      </div>

      {workspaces.length > 5 && (
        <div className="mt-4 text-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/workspaces")}
            className="text-xs text-gray-600 hover:text-gray-900"
          >
            {t("actions.viewAll", "View All Workspaces")}
          </Button>
        </div>
      )}
    </section>
  );
}
