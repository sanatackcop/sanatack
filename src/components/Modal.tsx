import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type ModalVariant = "default" | "danger" | "success" | "info";

export interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Optional heading for the modal */
  title?: React.ReactNode;
  /** Optional subtext under the title */
  description?: React.ReactNode;
  /** Visual treatment for the primary action */
  variant?: ModalVariant;
  /** Primary action label */
  confirmLabel?: React.ReactNode;
  /** Secondary action label */
  cancelLabel?: React.ReactNode;
  /** Called when user confirms. Can be async. */
  onConfirm?: () => void | Promise<void>;
  /** Called when user cancels/closes */
  onCancel?: () => void;
  /** Show a spinner state on confirm button */
  isConfirmLoading?: boolean;
  /** Hide/show cancel button */
  showCancel?: boolean;
  /** Prevent closing on backdrop click / Esc */
  disableBackdropClose?: boolean;
  /** Custom classes for DialogContent */
  className?: string;
  /** Modal body */
  children?: React.ReactNode;
}

const variantClasses: Record<ModalVariant, string> = {
  default: "bg-blue-600 hover:bg-blue-700 text-white",
  danger: "bg-red-600 hover:bg-red-700 text-white",
  success: "bg-green-600 hover:bg-green-700 text-white",
  info: "bg-gray-700 hover:bg-gray-800 text-white",
};

/**
 * Generic, extensible Modal component.
 * - Controlled via `open` and `onOpenChange`.
 * - Supports title, description, variants, loading, and disabling backdrop close.
 * - Place arbitrary JSX in the body via `children`.
 */
export const Modal: React.FC<ModalProps> = ({
  open,
  onOpenChange,
  title,
  description,
  variant = "default",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  isConfirmLoading = false,
  showCancel = true,
  disableBackdropClose = false,
  className,
  children,
}) => {
  const handleClose = React.useCallback(
    (nextOpen: boolean) => {
      if (nextOpen === false) {
        onCancel?.();
      }
      onOpenChange(nextOpen);
    },
    [onCancel, onOpenChange]
  );

  const preventIfDisabled = React.useCallback(
    (e: Event) => {
      if (disableBackdropClose) {
        e.preventDefault();
      }
    },
    [disableBackdropClose]
  );

  const handleConfirm = async () => {
    if (!onConfirm) {
      handleClose(false);
      return;
    }
    const maybePromise = onConfirm();
    if (maybePromise instanceof Promise) {
      try {
        await maybePromise;
        handleClose(false);
      } catch {
        // swallow: parent can surface errors
      }
    } else {
      handleClose(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className={cn("sm:max-w-lg", className)}
        onInteractOutside={preventIfDisabled}
        onEscapeKeyDown={preventIfDisabled}
      >
        <DialogHeader>
          {title ? (
            <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white">
              {title}
            </DialogTitle>
          ) : null}
          {description ? (
            <DialogDescription className="text-gray-600 text-sm">
              {description}
            </DialogDescription>
          ) : null}
        </DialogHeader>

        {children ? <div className="mt-4">{children}</div> : null}

        <DialogFooter className="flex justify-end gap-3 mt-6">
          {showCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={() => handleClose(false)}
              disabled={isConfirmLoading}
            >
              {cancelLabel}
            </Button>
          )}
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={isConfirmLoading}
            className={cn(
              "transition-all duration-200 rounded-lg",
              variantClasses[variant]
            )}
          >
            {isConfirmLoading ? (
              <span className="inline-flex items-center gap-2">
                <svg
                  className="h-4 w-4 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
                Processing...
              </span>
            ) : (
              confirmLabel
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
