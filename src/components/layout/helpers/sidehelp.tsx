import { useId } from "react";
import { NavLink } from "react-router-dom";
import { Play, ChevronDownIcon, FileTextIcon } from "lucide-react";
import clsx from "clsx";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { t } from "i18next";
import FeedbackMenuEntry from "./FeedbackModal";

type MenuItem =
  | {
      title: string;
      icon: any;
      comingSoon?: boolean;
      url: string;
      type?: "link";
      onClick?: any;
    }
  | {
      title: string;
      icon: any;
      type: "feedback";
    };

type LinkMenuItem = Extract<MenuItem, { url: string }>;
export type FeedbackMenuItem = Extract<MenuItem, { type: "feedback" }>;

type MenuGroup = {
  id: string;
  groupTitle: string;
  menuItems: Array<LinkMenuItem | FeedbackMenuItem>;
};

interface Workspace {
  id: string;
  title?: string;
  workspaceName?: string;
  type: "video" | "docuemnt";
  updatedAt: string;
}

const getWorkspaceTitle = (workspace: Workspace) => {
  if (workspace.workspaceName) return workspace.workspaceName;
  return workspace.title || t("workspace.untitled", "Untitled");
};

const isWorkspaceActive = (workspaceId: string) => {
  return location.pathname === `/dashboard/learn/workspace/${workspaceId}`;
};

export const MenuEntry = ({ item }: { item: LinkMenuItem }) => {
  const ItemIcon = item.icon;
  const currentPathname = location.pathname;
  const isActive = item.url === currentPathname;

  const onClick = (e: any) => {
    if (item.onClick) {
      e.preventDefault();
      e.stopPropagation();
      item.onClick();
      return;
    }
    if (item.comingSoon) {
      e.preventDefault();
    }
  };

  const to = !item.onClick ? (item.comingSoon ? "#" : item.url) : "#";
  const content = (
    <NavLink
      to={to}
      onClick={onClick}
      className={clsx(
        "w-full flex items-center gap-2.5 px-2 py-1.5 rounded-md transition-colors duration-150 group relative",
        item.comingSoon && "opacity-60",
        !item.comingSoon &&
          (isActive
            ? "bg-sidebar-accent text-sidebar-accent-foreground"
            : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground")
      )}
      target={
        !item.comingSoon && item.url.startsWith("http") ? "_blank" : undefined
      }
      rel={
        !item.comingSoon && item.url.startsWith("http")
          ? "noopener noreferrer"
          : undefined
      }
    >
      <ItemIcon
        size={16}
        strokeWidth={1.75}
        className={clsx(
          "flex-shrink-0 transition-colors",
          !item.comingSoon &&
            (isActive
              ? "text-sidebar-accent-foreground"
              : "text-sidebar-foreground/60 group-hover:text-sidebar-accent-foreground")
        )}
      />
      <span className={"text-[13px] font-normal flex-1"}>{item.title}</span>
      {item.comingSoon && (
        <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 font-medium border border-amber-200 dark:border-amber-800/50">
          {t("common.comingSoon")}
        </span>
      )}
    </NavLink>
  );

  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
      </Tooltip>
    </TooltipProvider>
  );
};

export const MenuGroupEntry = ({
  group,
  open,
  isRTL,
  onToggle,
}: {
  group: MenuGroup;
  open: boolean;
  isRTL: boolean;
  onToggle: () => void;
}) => {
  const panelId = useId();

  return (
    <div className="space-y-0.5">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={onToggle}
        className={clsx(
          `flex w-full items-center justify-between px-2 py-1.5 text-[11px]
           text-sidebar-foreground/50 capitalize tracking-wider select-none
           hover:text-sidebar-foreground transition-colors`
        )}
      >
        <span>{group.groupTitle}</span>
        <ChevronDownIcon
          className={clsx(
            "h-3 w-3 shrink-0 transition-transform duration-200",
            open ? "rotate-0" : "-rotate-90"
          )}
          aria-hidden="true"
        />
      </button>

      <div
        id={panelId}
        role="region"
        className={clsx(
          "overflow-hidden transition-[grid-template-rows] duration-200 grid",
          open ? "[grid-template-rows:1fr]" : "[grid-template-rows:0fr]"
        )}
      >
        <div className="min-h-0 space-y-0.5">
          {group.menuItems.map((item: any) =>
            item.type === "feedback" ? (
              <FeedbackMenuEntry key={item.title} item={item} isRTL={isRTL} />
            ) : (
              <MenuEntry key={item.url} item={item} />
            )
          )}
        </div>
      </div>
    </div>
  );
};

export const RecentWorkspaceEntry = ({
  workspace,
}: {
  workspace: Workspace;
}) => {
  const isActive = isWorkspaceActive(workspace.id);
  const workspaceUrl = `/dashboard/learn/workspace/${workspace.id}`;

  return (
    <NavLink
      to={workspaceUrl}
      className={clsx(
        "w-full flex items-center gap-2 px-2 py-1.5 rounded-md transition-colors duration-150 group",
        isActive
          ? "bg-sidebar-accent text-sidebar-accent-foreground"
          : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
      )}
    >
      <div className="relative flex-shrink-0">
        {isActive ? (
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
        ) : (
          <>
            {workspace.type === "video" ? (
              <Play
                className="h-4 w-4 text-sidebar-foreground/60 group-hover:text-sidebar-accent-foreground"
                strokeWidth={1.75}
              />
            ) : (
              <FileTextIcon
                className="h-4 w-4 text-sidebar-foreground/60 group-hover:text-sidebar-accent-foreground"
                strokeWidth={1.75}
              />
            )}
          </>
        )}
      </div>
      <span className={"text-[13px] font-normal flex-1 truncate"}>
        {getWorkspaceTitle(workspace)}
      </span>
    </NavLink>
  );
};

export const SectionHeader = ({
  title,
  action,
}: {
  title: string;
  action?: React.ReactNode;
}) => (
  <div className="flex items-center justify-between mb-1">
    <div
      className={`flex items-center px-2 py-1.5 text-[11px] text-sidebar-foreground/50 
           capitalize tracking-wider select-none`}
    >
      <span>{title}</span>
    </div>

    {action}
  </div>
);
