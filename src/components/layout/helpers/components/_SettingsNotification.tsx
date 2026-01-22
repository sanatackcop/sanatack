import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

type SettingsNotificationProps = {
  title: string;
  description?: string;
  variant?: "default" | "destructive";
  className?: string;
};

export default function SettingsNotification({
  title,
  description,
  variant = "default",
  className,
}: SettingsNotificationProps) {
  return (
    <Alert variant={variant} className={cn("border", className)}>
      <AlertTitle>{title}</AlertTitle>
      {description ? <AlertDescription>{description}</AlertDescription> : null}
    </Alert>
  );
}
