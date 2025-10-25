import { useEffect } from "react";
import { CommandDialog } from "@/components/ui/command";

export function SearchCommand({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: any;
}) {
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open: boolean) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <CommandDialog open={open} onOpenChange={setOpen}></CommandDialog>
    </>
  );
}
