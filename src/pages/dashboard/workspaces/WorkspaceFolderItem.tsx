import { useEffect, useState, useCallback, memo } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import {
  Boxes,
  EllipsisVertical,
  FileQuestionIcon,
  FileTextIcon,
  Loader2Icon,
  Move,
  PlayIcon,
  Trash2,
} from "lucide-react";
import { Document, Page } from "react-pdf";
import {
  deleteWorkspace,
  getAllSpaces,
  linkWorkspaceToSpace,
  unlinkWorkspaceFromSpace,
} from "@/utils/_apis/courses-apis";
import { Workspace } from "@/lib/types";
import { getErrorMessage } from "../utils";
import { formatRelativeDate } from "@/lib/utils";

type WorkspaceFolderItemProps = {
  workspace: Workspace;
  onClick: () => void;
  refreshParentComponent: () => void;
};

type Space = { id: string; name: string };

function WorkspaceFolderItem({
  workspace,
  onClick,
  refreshParentComponent,
}: WorkspaceFolderItemProps) {
  const { t, i18n } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [spaces, setSpaces] = useState<Space[]>([]);
  const { video, workspaceName, createdAt, type, documentUrl } = workspace;

  const currentDir = i18n.dir();
  const isRTLMode = currentDir === "rtl";

  function renderBanner() {
    if (type === "video" && video?.url) {
      const url = video?.url;
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
          className="w-full h-28 object-cover rounded-t-2xl"
        />
      ) : (
        <div className="flex items-center justify-center min-h-28 rounded-t-2xl bg-gray-100 border-b border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700">
          <PlayIcon className="h-12 w-12 text-zinc-400 dark:text-zinc-500" />
        </div>
      );
    }

    if (type === "document") {
      return (
        <div className="w-full h-28 overflow-hidden rounded-t-2xl border-b border-zinc-200 dark:border-zinc-700 flex items-center justify-center bg-gray-50 dark:bg-zinc-800">
          <Document
            file={documentUrl}
            loading={
              <Loader2Icon className="h-6 w-6 animate-spin text-zinc-400" />
            }
            error={
              <div className="flex flex-col items-center gap-1 text-zinc-500 text-xs">
                <FileTextIcon className="h-6 w-6" />
                <span>
                  {t(
                    "dashboard.workspaces.errors.previewUnavailable",
                    "Preview unavailable"
                  )}
                </span>
              </div>
            }
            onLoadError={(err) =>
              console.error("Failed to load PDF preview:", err)
            }
          >
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
      <div className="flex items-center justify-center min-h-28 rounded-t-2xl border-b border-zinc-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800">
        <FileQuestionIcon className="h-12 w-12 text-zinc-400 dark:text-zinc-500" />
      </div>
    );
  }

  const fetchSpaces = useCallback(async () => {
    try {
      const spaces = await getAllSpaces();
      setSpaces(spaces);
    } catch (err) {
      const fallbackMessage = t("dashboard.workspaces.errors.loadSpaces");
      const msg = getErrorMessage(err, fallbackMessage);
      toast.error(msg, {
        closeButton: true,
      });
      console.error("Error fetching available spaces:", err);
    }
  }, [t]);

  const handleLinkWorkspaceToSpace = useCallback(async (
    space_id: string,
    workspace_id: string
  ) => {
    try {
      await linkWorkspaceToSpace(space_id, workspace_id);
      toast.success(t("dashboard.workspaces.success.moved"), {
        closeButton: true,
      });
      refreshParentComponent();
    } catch (err) {
      const fallbackMessage = t("dashboard.workspaces.errors.linkWorkspace");
      const msg = getErrorMessage(err, fallbackMessage);
      toast.error(msg, { closeButton: true });
      console.error("Error linking workspace to space:", err);
    } finally {
      setMenuOpen(false);
    }
  }, [t, refreshParentComponent]);

  const handleUnlinkWorkspacefromSpace = useCallback(async (workspace_id: string) => {
    try {
      await unlinkWorkspaceFromSpace(workspace_id);
      toast.success(t("dashboard.workspaces.success.unlinked"), {
        closeButton: true,
      });
      refreshParentComponent();
    } catch (err) {
      const fallbackMessage = t("dashboard.workspaces.errors.linkWorkspace");
      const msg = getErrorMessage(err, fallbackMessage);
      toast.error(msg, { closeButton: true });
      console.error("Error unlinking workspace from space:", err);
    } finally {
      setMenuOpen(false);
    }
  }, [t, refreshParentComponent]);

  const handleWorkspaceDeletion = useCallback(async (workspace_id: string) => {
    try {
      await deleteWorkspace(workspace_id);
      toast.success(t("dashboard.workspaces.success.deleted"), {
        closeButton: true,
      });
      refreshParentComponent();
    } catch (err) {
      const fallbackMessage = t("dashboard.workspaces.errors.deleteWorkspace");
      const msg = getErrorMessage(err, fallbackMessage);
      toast.error(msg, { closeButton: true });
      console.error("Error deleting workspace:", err);
    } finally {
      setMenuOpen(false);
    }
  }, [t, refreshParentComponent]);

  useEffect(() => {
    fetchSpaces();
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
    >
      <Card
        onClick={onClick}
        className="relative flex flex-col group rounded-2xl
       h-[calc(theme(spacing.28)+theme(spacing.20))] dark:bg-zinc-900 dark:border-zinc-800"
      >
        {renderBanner()}

        <CardContent className="flex flex-1 items-center justify-start gap-4 p-5 pb-4">
          <div className="flex items-center justify-center w-6 h-6">
            {type === "video" && (
              <PlayIcon className="h-4 w-4 text-zinc-700 dark:text-zinc-300" />
            )}
            {type === "document" && (
              <FileTextIcon className="h-4 w-4 text-zinc-700 dark:text-zinc-300" />
            )}
          </div>

          <div className={`min-w-0 ${isRTLMode ? "text-right" : "text-left"}`}>
            <h3 className="w-full max-w-[210px] truncate select-none text-sm font-medium text-zinc-900 dark:text-white transition-colors group-hover:text-primary">
              {workspaceName}
            </h3>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              {formatRelativeDate(createdAt, isRTLMode ? "ar" : "en")}
            </p>
          </div>
        </CardContent>

        <div
          className={[
            "absolute top-1 z-10 transition-opacity",
            isRTLMode ? "left-1" : "right-1",
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
                aria-label={t("dashboard.workspaces.moreActions")}
                className="
                  flex items-center justify-center
                  rounded-xl p-2
                  text-white transition
                  group-hover:bg-zinc-100 group-hover:text-zinc-700
                  dark:group-hover:bg-zinc-800 dark:group-hover:text-zinc-300
                  focus:outline-none focus:ring-2 focus:ring-primary
                "
              >
                <EllipsisVertical className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              onClick={(e) => e.stopPropagation()}
              className="w-56 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-lg p-1"
            >
              <DropdownMenuSub>
                <DropdownMenuSubTrigger
                  className="
                    flex items-center gap-2
                    px-3 py-2 rounded-md
                    text-sm text-zinc-700 dark:text-zinc-300
                    data-[state=open]:bg-zinc-100 dark:data-[state=open]:bg-zinc-800
                    hover:bg-zinc-100 hover:text-zinc-900
                    dark:hover:bg-zinc-800 dark:hover:text-zinc-100
                  "
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={(e) => e.stopPropagation()}
                >
                  <Move className="h-4 w-4 text-zinc-700 dark:text-zinc-300" />
                  <span>{t("dashboard.workspaces.moveTo")}</span>
                </DropdownMenuSubTrigger>

                <DropdownMenuSubContent
                  sideOffset={8}
                  alignOffset={-4}
                  className="w-64 p-0 dark:bg-zinc-900 dark:border-zinc-700"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="max-h-64 overflow-y-auto py-1 [&>*]:m-2">
                    {spaces.length === 0 ? (
                      <div className="px-3 py-2 text-xs text-zinc-500 dark:text-zinc-400">
                        {t("dashboard.workspaces.noSpaces")}
                      </div>
                    ) : (
                      spaces.map((space) =>
                        space.id !== workspace.spaceId ? (
                          <DropdownMenuItem
                            key={space.id}
                            className="
                              flex items-center gap-2
                              px-3 py-2 rounded-md
                              text-sm text-zinc-700 dark:text-zinc-300
                              hover:bg-zinc-100 hover:text-zinc-900
                              dark:hover:bg-zinc-800 dark:hover:text-zinc-100
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
                            <Boxes className="h-4 w-4 text-zinc-700 dark:text-zinc-300" />
                            <span className="truncate">{space.name}</span>
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem
                            key={space.id}
                            className="
                              flex items-center gap-2
                              px-3 py-2 rounded-md
                              text-sm text-zinc-700 dark:text-zinc-300
                              opacity-70 bg-slate-200 dark:bg-slate-700
                              hover:bg-zinc-100 hover:text-zinc-900
                              dark:hover:bg-zinc-800 dark:hover:text-zinc-100
                              cursor-pointer
                            "
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUnlinkWorkspacefromSpace(workspace.id);
                            }}
                          >
                            <Boxes className="h-4 w-4 text-zinc-700 dark:text-zinc-300" />
                            <span className="truncate">{space.name}</span>
                          </DropdownMenuItem>
                        )
                      )
                    )}
                  </div>
                </DropdownMenuSubContent>
              </DropdownMenuSub>

              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  handleWorkspaceDeletion(workspace.id);
                  setMenuOpen(false);
                }}
                className="
                  flex items-center gap-2
                  px-3 py-2 rounded-md
                  text-sm group/trash duration-200 transition-all ease-linear
                  hover:!bg-red-100 hover:!text-red-700 
                  dark:hover:!bg-red-900/30 dark:hover:!text-red-400
                  cursor-pointer
                "
              >
                <Trash2 className="h-4 w-4 group-hover/trash:text-red-500 duration-200 transition-all ease-linear" />
                <span>{t("common.delete")}</span>
              </DropdownMenuItem>
              </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </Card>
    </motion.div>
  );
}

export default memo(WorkspaceFolderItem);
