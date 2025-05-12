import { SidebarTrigger } from "./ui/sidebar";

export default function Navbar() {
  return (
    <nav className="p-2 h-16 flex items-center justify-between sticky top-0 bg-background z-10">
      <SidebarTrigger />
      <span>Qafy Mobile</span>
    </nav>
  );
}
