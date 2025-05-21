import { Search } from "lucide-react";
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
    <div className="bg-[#d3d1d1] dark:bg-[#1A1A1A] dark:opacity-50 rounded-md px-3 flex items-center justify-between w-[300px] h-[30px]">
      <span className="text-gray-500 text-xs">/⌘</span>
      <div className="flex items-center">
        <span className="text-sm text-gray-500">Search</span>
        <Search size={16} className="text-gray-500 mr-2" />
      </div>
    </div>
  );
}
