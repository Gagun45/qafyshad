"use client";

import { useSession } from "next-auth/react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Separator } from "./ui/separator";
import { SidebarMenuButton } from "./ui/sidebar";
import { UserCircleIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export default function Profile() {
  const { data: session } = useSession();
  return (
    <Tooltip>
      <Popover>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            <SidebarMenuButton className="cursor-pointer">
              <UserCircleIcon />
              <span>Profile</span>
            </SidebarMenuButton>
          </PopoverTrigger>
        </TooltipTrigger>
        {session && (
          <PopoverContent className="w-fit flex flex-col gap-2" side="top">
            <div>
              <span>Email: {session?.user.email}</span>
              <Separator />
            </div>

            <div>
              <span>Role: {session?.user.isAdmin ? "Admin" : "User"}</span>
              <Separator />
            </div>
          </PopoverContent>
        )}
      </Popover>
      <TooltipContent side="right">Profile</TooltipContent>
    </Tooltip>
  );
}
