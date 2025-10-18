import { useState } from "react";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { AddContentModal } from "@/lib/modal/AddContantModal";
import { Workspace } from "@/lib/types";
import { WorkspaceFolderItem } from "./Index";
import { t } from "i18next";
import Button from "@mui/material/Button";

export default function WorkspacesList({
  workspaces,
  isRTL,
}: {
  workspaces: Workspace[];
  isRTL: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [, setActiveStep] = useState(0);
  const [, setSelectedCard] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleWorkspaceClick = (workspaceId: string) => {
    navigate(`/dashboard/learn/workspace/${workspaceId}`);
  };

  const handleReset = () => {
    setSelectedCard(null);
    setActiveStep(0);
    setOpen(false);
  };
  return (
    <section>
      <div className="flex gap-4 flex-wrap">
        {workspaces.length !== 0 &&
          workspaces.map((workspace) => (
            <WorkspaceFolderItem
              key={workspace.id}
              workspace={workspace}
              onClick={() => handleWorkspaceClick(workspace.id)}
              isRTL={isRTL}
            />
          ))}

        <Card
          onClick={() => setOpen(true)}
          className="
            relative flex flex-col justify-center items-center group rounded-2xl w-[20em]
            border-2 border-dashed border-zinc-300 cursor-pointer h-48
            bg-gradient-to-br from-zinc-50 to-transparent
            hover:border-zinc-400 
            transition-all duration-300 ease-out
            hover:shadow-lg hover:shadow-zinc-100/50
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
              Add New Content
            </span>
          </div>
        </Card>
      </div>

      {workspaces.length > 5 && (
        <div className="mt-4 text-center">
          <Button
            variant="text"
            size="small"
            onClick={() => navigate("/workspaces")}
            className="text-zinc-600 hover:text-zinc-900"
          >
            {t("actions.viewAll", "View All Workspaces")}
          </Button>
        </div>
      )}

      <AddContentModal open={open} onClose={handleReset} />
    </section>
  );
}
