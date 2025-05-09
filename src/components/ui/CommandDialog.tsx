import { Search } from "lucide-react";
import { Command, CommandInput } from "@/components/ui/command";
import { useEffect, useState } from "react";

export function CommandMenu() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(!open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <div className=" bg-[#d3d1d1] dark:bg-[#1A1A1A] rounded-md  px-3 flex flex-row-reverse items-center w-[180px] h-[35px] ">
      <Search size={16} className="text-gray-500" />
      <Command className="flex-1 bg-transparent shadow-none">
        <CommandInput
          placeholder="Search"
          className="bg-transparent text-sm px-1 py-2 min-w-[60px] text-gray-500 placeholder-gray-500 focus:outline-none text-left"
        />
      </Command>
      <span className="text-gray-500 text-blacktext-xs">/⌘ </span>
    </div>
  );
}
