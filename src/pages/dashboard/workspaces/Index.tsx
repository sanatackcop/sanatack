import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { getAllWorkSpace } from "@/utils/_apis/learnPlayground-api";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  Loader2,
  PlayIcon,
  EllipsisVertical,
  Trash2,
  Move,
  Boxes,
  FileQuestionIcon,
  FileTextIcon,
  Loader2Icon,
} from "lucide-react";
import Button from "@mui/material/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import {
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { Space } from "@/types/courses";
import {
  getAllSpaces,
  linkWorkspaceToSpace,
  unlinkWorkspaceFromSpace,
} from "@/utils/_apis/courses-apis";
import { formatRelativeDate } from "../../../components/utiles";
import { Document, Page } from "react-pdf";
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

export type WorkspaceFolderItemProps = {
  workspace: Workspace;
  onClick: () => void;
  isRTL: boolean;
};

export const WorkspaceFolderItem = ({
  workspace,
  onClick,
  isRTL,
}: WorkspaceFolderItemProps) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const { youtubeVideo, workspaceName, createdAt, workspaceType, documentUrl } =
    workspace;

  function renderBanner() {
    if (workspaceType === "youtube" && youtubeVideo?.transcribe.data.url) {
      if (workspaceType === "youtube" && youtubeVideo?.transcribe?.data?.url) {
        const url = youtubeVideo.transcribe.data.url;
        const match = url.match(
          /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|embed)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
        );
        const videoID = match ? match[1] : null;
        const thumbnailUrl = videoID
          ? `https://img.youtube.com/vi/${videoID}/hqdefault.jpg`
          : null;

        return videoID ? (
          <img
            src={String(thumbnailUrl)}
            alt="YouTube thumbnail"
            className="w-full h-28 object-cover rounded-t-2xl"
          />
        ) : (
          <div className="flex items-center justify-center min-h-28 rounded-t-2xl bg-gray-100 border-b border-zinc-200">
            <PlayIcon className="h-12 w-12 text-zinc-400" />
          </div>
        );
      } else {
        return (
          <div className="flex items-center justify-center min-h-28 rounded-t-2xl bg-gray-100 border-b border-zinc-200">
            <PlayIcon className="h-12 w-12 text-zinc-400" />
          </div>
        );
      }
    }

    if (workspaceType === "document" && documentUrl) {
      return (
        <div className="w-full h-28 overflow-hidden rounded-t-2xl border-b border-zinc-200 flex items-center justify-center bg-gray-50">
          <Document file={documentUrl} loading={<Loader2Icon />}>
            <Page
              pageNumber={1}
              scale={0.5}
              renderAnnotationLayer={false}
              renderTextLayer={false}
            />
          </Document>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-center min-h-28 rounded-t-2xl border-b border-zinc-200 bg-gray-50">
        <FileQuestionIcon className="h-12 w-12 text-zinc-400" />
      </div>
    );
  }

  const [spaces, setSpaces] = useState<Space[]>([]);

  const fetchAllCourses = async () => {
    try {
      const spaces = await getAllSpaces();
      setSpaces(spaces);
    } catch (err) {
      // setError(t("dashboard.errors.loadCourses"));
      console.error("Error fetching courses:", err);
    }
  };

  const handleLinkWorkspaceToSpace = async (
    space_id: string,
    workspace_id: string
  ) => {
    try {
      await linkWorkspaceToSpace(space_id, workspace_id);
    } catch (err) {
      // setError(t("dashboard.errors.loadCourses"));
      console.error("Error fetching courses:", err);
    } finally {
      setMenuOpen(false);
    }
  };

  const handleUnlinkWorkspacefromSpace = async (workspace_id: string) => {
    try {
      await unlinkWorkspaceFromSpace(workspace_id);
    } catch (err) {
      // setError(t("dashboard.errors.loadCourses"));
      console.error("Error fetching courses:", err);
    } finally {
      setMenuOpen(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([fetchAllCourses()]);
    };
    fetchData();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-[var(--ws-card-w,15rem)] cursor-pointer"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onClick();
      }}
      aria-label={`Open workspace ${workspaceName}`}
    >
      <Card
        onClick={onClick}
        className="relative flex flex-col group rounded-2xl
       h-[calc(theme(spacing.28)+theme(spacing.20))]"
      >
        {renderBanner()}

        <CardContent className="flex flex-1 items-center justify-start gap-4 p-5 pb-4">
          <div className="flex items-center justify-center w-6 h-6">
            {workspaceType === "youtube" && (
              <PlayIcon className="h-4 w-4 text-zinc-700" />
            )}
            {workspaceType === "document" && (
              <FileTextIcon className="h-4 w-4 text-zinc-700" />
            )}
          </div>

          <div className={`min-w-0 ${isRTL ? "text-right" : "text-left"}`}>
            <h3 className="w-full max-w-[210px] truncate select-none text-sm font-medium text-zinc-900 transition-colors group-hover:text-primary">
              {workspaceName}
            </h3>
            <p className="mt-1 text-xs text-zinc-500">
              {formatRelativeDate(createdAt)}
            </p>
          </div>
        </CardContent>
        <div
          className={[
            "absolute right-1 top-1 z-10 transition-opacity",
            "opacity-0 pointer-events-none",
            "group-hover:opacity-100 group-hover:pointer-events-auto",
            menuOpen ? "opacity-100 pointer-events-auto" : "",
          ].join(" ")}
        >
          <DropdownMenu
            open={menuOpen}
            onOpenChange={setMenuOpen}
            modal={false}
          >
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => e.stopPropagation()}
                aria-label="More actions"
                className="
        flex items-center justify-center
        rounded-xl p-2
        text-white transition
        group-hover:bg-zinc-100 group-hover:text-zinc-700
        focus:outline-none focus:ring-2 focus:ring-primary
      "
              >
                <EllipsisVertical className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              onClick={(e) => e.stopPropagation()}
              className="w-56 rounded-lg border border-zinc-200 bg-white shadow-lg p-1"
            >
              <DropdownMenuSub>
                <DropdownMenuSubTrigger
                  className="
          flex items-center gap-2
          px-3 py-2 rounded-md
          text-sm text-zinc-700
          data-[state=open]:bg-zinc-100
          hover:bg-zinc-100 hover:text-zinc-900
        "
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={(e) => e.stopPropagation()}
                >
                  <Move className="h-4 w-4 text-zinc-700" />
                  <span>Move to</span>
                </DropdownMenuSubTrigger>

                <DropdownMenuSubContent
                  sideOffset={8}
                  alignOffset={-4}
                  className="w-64 p-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="max-h-64 overflow-y-auto py-1 [&>*]:m-2">
                    {spaces.length === 0 ? (
                      <div className="px-3 py-2 text-xs text-zinc-500">
                        No spaces available. Create a space first.
                      </div>
                    ) : (
                      spaces.map((space) => {
                        return space.id != workspace.spaceId ? (
                          <DropdownMenuItem
                            key={space.id}
                            className="
                  flex items-center gap-2
                  px-3 py-2 rounded-md
                  text-sm text-zinc-700
                  hover:bg-zinc-100 hover:text-zinc-900
                  cursor-pointer
                "
                            onClick={(e) => {
                              e.stopPropagation();
                              handleLinkWorkspaceToSpace(
                                space.id,
                                workspace.id
                              );
                            }}
                          >
                            <Boxes className="h-4 w-4 text-zinc-700" />
                            <span className="truncate">{space.name}</span>
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem
                            key={space.id}
                            className="
                  flex items-center gap-2
                  px-3 py-2 rounded-md
                  text-sm text-zinc-700
                  opacity-70 bg-slate-200
                  hover:bg-zinc-100 hover:text-zinc-900
                  cursor-pointer
                "
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUnlinkWorkspacefromSpace(workspace.id);
                            }}
                          >
                            <Boxes className="h-4 w-4 text-zinc-700" />
                            <span className="truncate">{space.name}</span>
                          </DropdownMenuItem>
                        );
                      })
                    )}
                  </div>
                </DropdownMenuSubContent>
              </DropdownMenuSub>

              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  alert(`Delete ${workspace.workspaceName}`);
                  setMenuOpen(false);
                }}
                className="
        flex items-center gap-2
        px-3 py-2 rounded-md
        text-sm group/trash duration-200 transition-all ease-linear
        hover:!bg-red-100 hover:!text-red-700 cursor-pointer
      "
              >
                <Trash2 className="h-4 w-4 group-hover/trash:text-red-500 duration-200 transition-all ease-linear" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </Card>
    </motion.div>
  );
};

export default function Recent({ isRTL }: { isRTL: boolean }) {
  const { t } = useTranslation();
  const [workspaces, setWorkspaces] = useState<Workspace[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    fetchRecent();
  }, []);

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
          {[1, 2, 3, 4, 5].map((i) => (
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
  return <WorkspacesList workspaces={workspaces} isRTL={isRTL} />;
}
