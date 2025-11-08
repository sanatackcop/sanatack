import { useState } from "react";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { AddContentModal } from "@/lib/modal/AddContantModal";
import { Workspace } from "@/lib/types";
import WorkspaceFolderItem from "./WorkspaceFolderItem";
import { useTranslation } from "react-i18next";

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

  const handleWorkspaceClick = (workspaceId: string) => {
    navigate(`/dashboard/learn/workspace/${workspaceId}`);
  };

  const refreshComponent = () => {
    refreshParentComponent();
  };

  const handleReset = () => {
    setOpen(false);
    refreshComponent();
  };

  return (
    <>
      <div className="flex flex-wrap gap-5">
        <Card
          onClick={() => setOpen(true)}
          className="
              relative flex flex-col justify-center items-center group rounded-2xl
              border-2 border-dashed border-zinc-300 cursor-pointer h-48 w-48 
              hover:border-zinc-400 
              transition-all duration-300 ease-out
            "
          role="button"
          tabIndex={0}
          aria-label="Add New Workspace"
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") setOpen(true);
          }}
        >
          <div className="flex flex-col justify-center items-center gap-3 text-zinc-400 group-hover:text-zinc-600 transition-colors duration-300">
            <div
              className="
                relative flex items-center justify-center
                w-12 h-12 rounded-full 
                bg-zinc-100 group-hover:bg-zinc-200
                transition-all duration-300
                group-hover:scale-110
              "
            >
              <Plus className="h-6 w-6 transition-transform duration-300 group-hover:rotate-90" />
            </div>
            <span className="text-sm font-medium select-none">
              {t("common.add")}
            </span>
          </div>
        </Card>

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
