"use client";

import { useContext } from "react";
import UserContext from "@/context/UserContext";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function NavUser() {
  const userContext = useContext(UserContext);
  if (!userContext || !userContext.auth?.user) {
    return null;
  }
  const user = userContext.auth.user;

  const fullName = `${user.firstName} ${user.lastName}`.trim();

  const avatarUrl =
    user.avatar && user.avatar.length > 0
      ? user.avatar
      : `https://ui-avatars.com/api/?name=${encodeURIComponent(
          fullName
        )}&background=random&color=fff`;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="cursor-pointer">
          <Avatar className="h-8 w-8 rounded-full">
            <AvatarImage src={avatarUrl} alt={fullName} />
          </Avatar>
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="m-2 items-center" align="end">
        <DropdownMenuItem className="w-full justify-center text-center">
          Account
        </DropdownMenuItem>
        <DropdownMenuItem className="w-full justify-center text-center">
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
