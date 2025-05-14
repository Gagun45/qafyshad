import Link from "next/link";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { SidebarTrigger } from "./ui/sidebar";

export default function Navbar() {
  return (
    <nav className="p-2 h-16 flex items-center justify-start sticky top-0 bg-background z-10">
      <div className="w-1/3">
        <SidebarTrigger />
        <span className="sr-only">Toggle sidebar</span>
      </div>
      <div className="w-1/3 flex justify-center">
        <Button asChild>
          <Link href="/request">Request</Link>
        </Button>
      </div>
      <Link href="/" className="w-1/3 text-end">
        Home
      </Link>
      <Separator className="md:hidden absolute -bottom-[1px] left-0 w-full" />
    </nav>
  );
}
