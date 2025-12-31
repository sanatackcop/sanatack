import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { GenerationStatus } from "@/lib/types";

type EntityType = "summary" | "flashcards" | "quiz" | "explanation" | "note";

type BaseItem = {
  id: string;
  status: GenerationStatus;
  failureReason?: string | null;
};

interface Options<T extends BaseItem> {
  entity: EntityType;
  getName?: (item: T) => string | null | undefined;
}

const CLEANUP_DELAY_MS = 5_000;

function useGenerationNotifications<T extends BaseItem>(
  items: T[] | undefined,
  options: Options<T>
) {
  const cacheRef = useRef<Map<string, GenerationStatus>>(new Map());
  const initializedRef = useRef(false);
  const cleanupTimerRef = useRef<number | null>(null);
  const getNameRef = useRef<Options<T>["getName"]>(options.getName);
  const { t } = useTranslation();

  useEffect(() => {
    return () => {
      if (cleanupTimerRef.current) {
        window.clearTimeout(cleanupTimerRef.current);
        cleanupTimerRef.current = null;
      }
      cacheRef.current.clear();
    };
  }, []);

  useEffect(() => {
    getNameRef.current = options.getName;
  }, [options.getName]);

  useEffect(() => {
    if (!items) return;

    if (!initializedRef.current) {
      items.forEach((item) => {
        cacheRef.current.set(item.id, item.status);
      });
      initializedRef.current = true;
      return;
    }

    const typeLabel = t(
      `dashboard.generation.notifications.types.${options.entity}`,
      {
        defaultValue: options.entity,
      }
    );
    const fallbackName = t(
      "dashboard.generation.notifications.untitled",
      "Untitled"
    );

    items.forEach((item) => {
      const hasRecord = cacheRef.current.has(item.id);
      const previousStatus = cacheRef.current.get(item.id);

      if (!hasRecord) {
        cacheRef.current.set(item.id, item.status);
        return;
      }

      if (previousStatus === item.status) {
        return;
      }

      cacheRef.current.set(item.id, item.status);

      const rawName = getNameRef.current?.(item);
      const name = rawName?.trim() || fallbackName;

      if (item.status === GenerationStatus.COMPLETED) {
        toast.success(
          t("dashboard.generation.notifications.completed", {
            type: typeLabel,
            name,
          }),
          { closeButton: true }
        );
      } else if (item.status === GenerationStatus.FAILED) {
        toast.error(
          t("dashboard.generation.notifications.failed", {
            type: typeLabel,
            name,
          }) + (item.failureReason ? ` • ${item.failureReason}` : ""),
          { closeButton: true }
        );
      }
    });

    // Clean up cache entries that are no longer present after a short delay
    if (cleanupTimerRef.current) {
      window.clearTimeout(cleanupTimerRef.current);
    }
    cleanupTimerRef.current = window.setTimeout(() => {
      const ids = new Set(items.map((item) => item.id));
      cacheRef.current.forEach((_value, key) => {
        if (!ids.has(key)) {
          cacheRef.current.delete(key);
        }
      });
    }, CLEANUP_DELAY_MS);
  }, [items, options.entity, t]);
}

export default useGenerationNotifications;
