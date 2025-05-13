import { Separator } from "./ui/separator";
import { SidebarTrigger } from "./ui/sidebar";

export default function Navbar() {
  return (
    <nav className="p-2 h-16 flex items-center justify-between sticky top-0 bg-background z-10">
      <SidebarTrigger />
      <span>Qafy Mobile</span>
      <Separator className="md:hidden absolute -bottom-[1px] left-0 w-full" />
    </nav>
  );
}
