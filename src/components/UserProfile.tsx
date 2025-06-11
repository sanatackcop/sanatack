import { User, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import UserContext, { UserContextType } from "@/context/UserContext";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";

export default function UserProfileMenu() {
  const { logout } = useContext(UserContext) as unknown as UserContextType;
  const nav = useNavigate();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 dark:from-blue-500 dark:to-blue-700 flex items-center justify-center">
              <User size={16} className="text-white" />
            </div>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-62 ml-5 dark:bg-gray-900 dark:border-gray-700"
        >
          <div>
            <DropdownMenuItem className="gap-2 cursor-pointer dark:hover:!bg-blue-900/20">
              <button
                onClick={() => nav("/dashboard/profile")}
                className="w-full flex items-center gap-2 p-2 rounded-md transition-colors duration-200"
              >
                <User size={16} />
                <span className="text-sm">الملف الشخصي</span>
              </button>
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2 cursor-pointer  hover:!bg-red-50 dark:hover:!bg-red-900/20 text-red-600 dark:text-red-400 hover:!text-red-700 dark:hover:!text-red-300 transition-colors duration-200">
              <button
                onClick={() => logout()}
                className="w-full flex items-center gap-2 p-2 rounded-md"
              >
                <LogOut size={16} />
                <span className="text-sm">تسجيل الخروج</span>
              </button>
            </DropdownMenuItem>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
