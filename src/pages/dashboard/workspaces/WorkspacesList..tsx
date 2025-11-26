import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FolderPlusIcon } from "lucide-react";
import { AddContentModal } from "@/lib/modal/AddContantModal";
import { Workspace } from "@/lib/types";
import { useTranslation } from "react-i18next";
import WorkspaceFolderItem from "./WorkspaceFolderItem";
import { useSidebarRefresh } from "@/context/SidebarRefreshContext";

export default function WorkspacesList({
  workspaces,
  refreshParentComponent,
}: {
  workspaces: Workspace[];
  refreshParentComponent: () => void;
}) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { refreshWorkspace } = useSidebarRefresh();

  const handleWorkspaceClick = (workspaceId: string) => {
    navigate(`/dashboard/learn/workspace/${workspaceId}`);
  };

  const refreshComponent = () => {
    refreshParentComponent();
  };

  const handleReset = async (update?: boolean) => {
    setOpen(false);
    if (update) {
      refreshComponent();
      await refreshWorkspace().catch((error) => {
        console.error("Failed to refresh sidebar workspaces", error);
      });
    }
  };

  return (
    <>
      <div className="flex flex-wrap gap-5">
        <button
          type="button"
          onClick={() => setOpen(true)}
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
                   transition-colors 
                    bg-[#10B981] bg-opacity-25 group-hover:bg-white
                    dark:bg-zinc-800 dark:group-hover:bg-zinc-700"
            >
              <FolderPlusIcon
                className="size-6 transition-transform duration-300 
               text-[#0A8E63] group-hover:text-[#10B981]"
              />
            </div>
            <span className="text-sm font-semibold">{t("common.add")}</span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {t("dashboard.spaces.newWorkSpace")}
            </span>
          </div>
        </button>

        {workspaces.length !== 0 &&
          workspaces.map((workspace) => (
            <WorkspaceFolderItem
              refreshParentComponent={refreshComponent}
              key={workspace.id}
              workspace={workspace}
              onClick={() => handleWorkspaceClick(workspace.id)}
            />
          ))}
      </div>

      <AddContentModal open={open} onClose={handleReset} />
    </>
  );
}
