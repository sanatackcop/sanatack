import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export type PanelProps<T> = {
  data: T | null;
  isLoading: boolean;
  error?: string | null;
};

export function PanelHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3 rtl:flex-row-reverse">
      <div className="space-y-1 rtl:text-right">
        <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-50">
          {title}
        </h3>
        {description ? (
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            {description}
          </p>
        ) : null}
      </div>
      {action}
    </div>
  );
}

export function PanelCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "space-y-4 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-950 rtl:text-right",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function PanelSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-6 w-48" />
      <Skeleton className="h-4 w-64" />
      <Skeleton className="h-9 w-full" />
      <Skeleton className="h-9 w-5/6" />
      <Skeleton className="h-24 w-full" />
    </div>
  );
}
