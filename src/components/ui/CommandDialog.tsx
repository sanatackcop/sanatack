import * as React from "react";
import { Search } from "lucide-react";
import {
  Command,
  CommandDialog,
  CommandShortcut,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";

export function CommandMenu() {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <div className=" bg-[#1A1A1A] rounded-md  px-3 flex flex-row-reverse items-center w-[180px] h-[35px] ">
      <Search size={16} className="text-gray-500" />
      <Command className="flex-1 bg-transparent shadow-none">
        <CommandInput
          placeholder="Search"
          className="bg-transparent text-sm px-1 py-2 min-w-[60px] text-gray-500 placeholder-gray-500 focus:outline-none text-left"
        />
      </Command>
      <span className="text-gray-500 text-xs">/⌘ </span>
    </div>
  );
}
