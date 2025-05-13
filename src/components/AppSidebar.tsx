"use client";

import {
  Contact2,
  DollarSign,
  Home,
  ListChecksIcon,
  MailQuestion,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from "./ui/sidebar";
import Link from "next/link";
import Image from "next/image";
import ThemeToggle from "./ThemeToggle";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import Auth from "./Auth";
import Profile from "./Profile";
import { useSession } from "next-auth/react";

const items = [
  { title: "Home", url: "/", icon: Home },
  { title: "Services", url: "/services", icon: ListChecksIcon },
  { title: "Request", url: "/request", icon: MailQuestion },
  { title: "Prices", url: "/prices", icon: DollarSign },
  { title: "Contacts", url: "/contacts", icon: Contact2 },
];

export default function AppSidebar() {
  const { isMobile, state, setOpen, setOpenMobile } = useSidebar();
  const { data: session } = useSession();
  return (
    <TooltipProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader className="py-2 h-16 items-center justify-center">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link
                  href="/"
                  className="h-12"
                  onClick={() => {
                    setOpenMobile(false);
                    setOpen(false);
                  }}
                >
                  <Image
                    src="/qafyLogo.png"
                    alt="logo"
                    width={48}
                    height={48}
                  />
                  <span>QAFY MOBILE</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarSeparator className="mx-0 md:!w-[100vw]" />

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <Tooltip
                      open={
                        isMobile
                          ? false
                          : state === "collapsed"
                          ? undefined
                          : false
                      }
                    >
                      <TooltipTrigger asChild>
                        <SidebarMenuButton asChild>
                          <Link
                            href={item.url}
                            onClick={() => {
                              setOpenMobile(false);
                              setOpen(false);
                            }}
                          >
                            <item.icon className="size-4" />

                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </TooltipTrigger>
                      <TooltipContent side="right">{item.title}</TooltipContent>
                    </Tooltip>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarSeparator className="mx-0" />

          <SidebarGroup>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <ThemeToggle />
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem className="space-y-2">
              {session && <Profile />}
              <Auth />
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
    </TooltipProvider>
  );
}
