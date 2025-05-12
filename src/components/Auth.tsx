"use client";

import { signOut, useSession } from "next-auth/react";
import { Sheet, SheetTrigger } from "./ui/sheet";
import { LogInIcon, LogOutIcon } from "lucide-react";
import { SidebarMenuButton, useSidebar } from "./ui/sidebar";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { toast } from "sonner";
import AuthSheet from "./AuthSheet";

export default function Auth() {
  const { data: session } = useSession();
  const { isMobile, state, setOpen } = useSidebar();
  return (
    <Tooltip
      open={isMobile ? false : state === "collapsed" ? undefined : false}
    >
      {session ? (
        <SidebarMenuButton
          onClick={async () => {
            await signOut({ redirect: false });
            setOpen(false);
            toast("You logged out successfully.", { duration: 2000 });
          }}
          asChild
          className="cursor-pointer"
        >
          <TooltipTrigger>
            <LogOutIcon className="size-4" />
            <span>Logout</span>
          </TooltipTrigger>
        </SidebarMenuButton>
      ) : (
        <Sheet>
          <SheetTrigger asChild>
            <SidebarMenuButton asChild>
              <TooltipTrigger className="cursor-pointer">
                <LogInIcon className="size-4" />
                <span>Login</span>
              </TooltipTrigger>
            </SidebarMenuButton>
          </SheetTrigger>
          <AuthSheet />
        </Sheet>
      )}
      <TooltipContent side="right">
        {session ? "Logout" : "Login"}
      </TooltipContent>
    </Tooltip>
  );
}
