import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  ArrowUpRight,
  LayoutGrid,
  Library,
  Loader2,
  Search,
  Sparkles,
} from "lucide-react";
import { searchSpacesApi } from "@/utils/_apis/courses-apis";
import { getAllWorkSpace } from "@/utils/_apis/learnPlayground-api";
import { Workspace } from "@/lib/types";
import clsx from "clsx";

type SidebarSpace = {
  id: string;
  title: string;
  url: string;
};

type WorkspaceResult = {
  id: string;
  title: string;
  type?: Workspace["type"];
  updatedAt?: string;
};

export function SearchCommand({
  open,
  setOpen,
  spaces = [],
  workspaces = [],
  onNavigate,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  spaces?: SidebarSpace[];
  workspaces?: Workspace[] | null;
  onNavigate?: (path: string) => void;
}) {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<{
    workspaces: WorkspaceResult[];
    spaces: SidebarSpace[];
  }>({ workspaces: [], spaces: [] });

  const isRTL = i18n.dir() === "rtl";

  const goTo = useCallback(
    (path: string) => {
      if (onNavigate) {
        onNavigate(path);
      } else {
        navigate(path);
      }
      setOpen(false);
      setQuery("");
    },
    [navigate, onNavigate, setOpen]
  );

  const workspaceTitle = useCallback(
    (workspace?: Workspace) =>
      workspace?.workspaceName ||
      workspace?.title ||
      t("workspace.untitled", "Untitled"),
    [t]
  );

  const mappedLocalWorkspaces = useMemo(
    () =>
      (workspaces ?? []).map((workspace) => ({
        id: workspace.id,
        title: workspaceTitle(workspace),
        type: workspace.type,
        updatedAt: workspace.updatedAt,
      })),
    [workspaces, workspaceTitle]
  );

  const mappedLocalSpaces = useMemo(() => spaces ?? [], [spaces]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(!open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [setOpen]);

  useEffect(() => {
    if (open) {
      setResults({
        workspaces: mappedLocalWorkspaces.slice(0, 6),
        spaces: mappedLocalSpaces.slice(0, 6),
      });
      setError(null);
    } else {
      setQuery("");
    }
  }, [open, mappedLocalWorkspaces, mappedLocalSpaces]);

  const buildFallbackResults = useCallback(
    (term: string) => {
      const searchValue = term.toLowerCase();
      return {
        workspaces: mappedLocalWorkspaces.filter((workspace) =>
          workspace.title.toLowerCase().includes(searchValue)
        ),
        spaces: mappedLocalSpaces.filter((space) =>
          space.title.toLowerCase().includes(searchValue)
        ),
      };
    },
    [mappedLocalSpaces, mappedLocalWorkspaces]
  );

  useEffect(() => {
    if (!open) return;

    const trimmed = query.trim();
    if (!trimmed) {
      setIsSearching(false);
      setError(null);
      setResults({
        workspaces: mappedLocalWorkspaces.slice(0, 6),
        spaces: mappedLocalSpaces.slice(0, 6),
      });
      return;
    }

    const handle = setTimeout(async () => {
      setIsSearching(true);
      setError(null);

      try {
        const [spaceRes, workspaceRes] = await Promise.all([
          searchSpacesApi(trimmed),
          getAllWorkSpace({ search: trimmed }),
        ]);

        const remoteSpaces: SidebarSpace[] =
          ((spaceRes?.data ?? spaceRes) as any[])?.map((space: any) => ({
            id: space.id,
            title: space.name || space.title || space.displayName || trimmed,
            url: `/dashboard/spaces/${space.id}`,
          })) ?? [];

        const remoteWorkspaces: WorkspaceResult[] =
          (
            ((workspaceRes as any)?.workspaces ?? workspaceRes) as Workspace[]
          )?.map((workspace) => ({
            id: workspace.id,
            title: workspaceTitle(workspace),
            type: workspace.type,
            updatedAt: workspace.updatedAt,
          })) ?? [];

        const hasRemoteResults =
          remoteSpaces.length > 0 || remoteWorkspaces.length > 0;

        setResults(
          hasRemoteResults
            ? {
                workspaces: remoteWorkspaces,
                spaces: remoteSpaces,
              }
            : buildFallbackResults(trimmed)
        );
      } catch (err) {
        console.error("Search command failed:", err);
        setError(
          t(
            "searchDialog.error",
            "Unable to search right now. Showing recent items instead."
          )
        );
        setResults(buildFallbackResults(trimmed));
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(handle);
  }, [
    buildFallbackResults,
    mappedLocalSpaces,
    mappedLocalWorkspaces,
    open,
    query,
    t,
    workspaceTitle,
  ]);

  const WorkspacesGroup = () => {
    if (!results.workspaces.length) return null;

    return (
      <CommandGroup heading={t("searchDialog.groups.workspaces", "Workspaces")}>
        {results.workspaces.map((workspace) => (
          <CommandItem
            key={`workspace-${workspace.id}`}
            value={`${workspace.title} workspace`}
            onSelect={() => goTo(`/dashboard/learn/workspace/${workspace.id}`)}
          >
            <div className="flex items-center gap-3 w-full">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200">
                <Library className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-neutral-900 dark:text-neutral-50 truncate">
                  {workspace.title}
                </p>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 flex items-center gap-2">
                  <span>{t("searchDialog.labels.workspace", "Workspace")}</span>
                  {workspace.type && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-200">
                      {workspace.type === "video"
                        ? t("searchDialog.labels.video", "Video")
                        : t("searchDialog.labels.document", "Document")}
                    </span>
                  )}
                </p>
              </div>
              <ArrowUpRight className="h-4 w-4 text-neutral-400" />
            </div>
          </CommandItem>
        ))}
      </CommandGroup>
    );
  };

  const SpacesGroup = () => {
    if (!results.spaces.length) return null;

    return (
      <CommandGroup heading={t("searchDialog.groups.spaces", "Spaces")}>
        {results.spaces.map((space) => (
          <CommandItem
            key={`space-${space.id}`}
            value={`${space.title} space`}
            onSelect={() => goTo(space.url)}
          >
            <div className="flex items-center gap-3 w-full">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-200">
                <LayoutGrid className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-neutral-900 dark:text-neutral-50 truncate">
                  {space.title}
                </p>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 flex items-center gap-1">
                  <span>{t("searchDialog.labels.space", "Space")}</span>
                </p>
              </div>
              <ArrowUpRight className="h-4 w-4 text-neutral-400" />
            </div>
          </CommandItem>
        ))}
      </CommandGroup>
    );
  };

  const showEmpty =
    !results.workspaces.length &&
    !results.spaces.length &&
    !isSearching &&
    !query.trim().length;

  return (
    <CommandDialog
      open={open}
      onOpenChange={setOpen}
      aria-label={t("searchDialog.title", "Search")}
    >
      <Command
        className={clsx(isRTL && "rtl")}
        shouldFilter={false}
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40 px-3 py-2">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-neutral-400" />
            <CommandInput
              value={query}
              onValueChange={setQuery}
              placeholder={t(
                "searchDialog.placeholder",
                "Search spaces or workspaces..."
              )}
              className="flex-1 bg-transparent text-sm placeholder:text-neutral-400 dark:placeholder:text-neutral-500"
            />
            <div className="hidden sm:flex items-center gap-1 text-[11px] text-neutral-400">
              <kbd className="px-1.5 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800">
                ⌘
              </kbd>
              <span>+</span>
              <kbd className="px-1.5 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800">
                K
              </kbd>
            </div>
          </div>
          <div className="flex items-center gap-2 pt-1 text-[12px] text-neutral-500 dark:text-neutral-400">
            <Sparkles className="h-4 w-4" />
            <span>
              {t(
                "searchDialog.subtitle",
                "Jump to a space or workspace without leaving the sidebar."
              )}
            </span>
          </div>
        </div>

        <CommandList className="p-2">
          {!results.workspaces.length && !results.spaces.length && (
            <CommandEmpty className="py-8 text-sm text-neutral-500 dark:text-neutral-400">
              {isSearching
                ? t("searchDialog.loading", "Searching...")
                : t(
                    "searchDialog.empty",
                    "No matches yet. Try another keyword."
                  )}
            </CommandEmpty>
          )}

          {isSearching && (
            <div className="flex items-center gap-2 px-3 py-2 text-xs text-neutral-500 dark:text-neutral-400">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>{t("searchDialog.loading", "Searching...")}</span>
            </div>
          )}

          {error && (
            <div className="px-3 py-2 text-xs rounded-md bg-amber-50 text-amber-700 border border-amber-100 dark:bg-amber-900/20 dark:text-amber-200 dark:border-amber-900/40">
              {error}
            </div>
          )}

          <WorkspacesGroup />
          {results.workspaces.length > 0 && results.spaces.length > 0 && (
            <CommandSeparator />
          )}
          <SpacesGroup />

          {showEmpty && (
            <div className="px-3 py-3 text-sm text-neutral-500 dark:text-neutral-400">
              {t(
                "searchDialog.suggestion",
                "Start typing to search across spaces and workspaces."
              )}
            </div>
          )}
        </CommandList>
      </Command>
    </CommandDialog>
  );
}
