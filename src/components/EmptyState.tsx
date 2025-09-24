import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

interface EmptyStateAction {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  variant?:
    | "default"
    | "outline"
    | "ghost"
    | "destructive"
    | "secondary"
    | "link";
}

interface EmptyStateProps {
  title?: string;
  description?: string;
  actions?: EmptyStateAction[];
  supportedFormats?: string;
  className?: string;
  titleKey?: any;
  descriptionKey?: any;
  supportedFormatsKey?: any;
}

export default function EmptyState({
  title,
  description,
  actions = [],
  supportedFormats,
  className = "",
  titleKey = "emptyState.title",
  descriptionKey = "emptyState.description",
  supportedFormatsKey = "emptyState.supportedFormats",
}: EmptyStateProps) {
  const { t } = useTranslation();

  return (
    <div
      className={`text-center py-16 bg-muted/30 rounded-2xl border border-dashed ${className}`}
    >
      <h3 className="text-lg font-semibold">{title || t(titleKey)}</h3>
      <p className="text-muted-foreground max-w-xl mx-auto mt-2 leading-relaxed">
        {description || t(descriptionKey)}
      </p>

      {actions.length > 0 && (
        <div className="mt-6 flex items-center justify-center gap-2 flex-wrap">
          {actions.map((action, index) => {
            const IconComponent = action.icon;
            return (
              <Button
                key={index}
                variant={action.variant || "outline"}
                className="rounded-full px-4 py-2 flex gap-2 rtl:flex-row-reverse"
                onClick={action.onClick}
              >
                <IconComponent className="h-4 w-4" />
                <span>{action.label}</span>
              </Button>
            );
          })}
        </div>
      )}

      {(supportedFormats || supportedFormatsKey) && (
        <p className="text-xs text-muted-foreground mt-4">
          {supportedFormats || t(supportedFormatsKey)}
        </p>
      )}
    </div>
  );
}
