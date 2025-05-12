"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Computer, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

const themeOptions = [
  {
    mode: "light",
    legend: "Light",
    icon: Sun,
  },
  {
    mode: "dark",
    legend: "Dark",
    icon: Moon,
  },
  {
    mode: "system",
    legend: "System",
    icon: Computer,
  },
];

export default function ThemeToggle() {
  const { setTheme } = useTheme();
  return (
    <TooltipProvider>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="size-8">
            <Sun className="h-[20px] w-[20px] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[20px] w-[20px] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent side="right" className="h-8 flex gap-2 min-w-0">
          {themeOptions.map((option) => (
            <Tooltip key={option.mode}>
              <TooltipTrigger asChild>
                <DropdownMenuItem
                  onClick={() => setTheme(option.mode)}
                  className="!p-1 cursor-pointer"
                >
                  <Button variant={"ghost"} className="h-2 !px-0">
                    <option.icon className="size-4" />
                  </Button>
                </DropdownMenuItem>
              </TooltipTrigger>
              <TooltipContent side="top">{option.legend}</TooltipContent>
            </Tooltip>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </TooltipProvider>
  );
}
