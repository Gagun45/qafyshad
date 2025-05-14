import Link from "next/link";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { SidebarTrigger } from "./ui/sidebar";

export default function Navbar() {
  return (
    <nav className="p-2 h-16 flex items-center justify-start sticky top-0 bg-background z-10">
      <div className="w-24">
        <SidebarTrigger />
        <span className="sr-only">Toggle sidebar</span>
      </div>
      <div className="flex justify-center mx-auto">
        <Link href="/" className="text-3xl font-sans font-bold">
          <span style={{ color: "blue" }}>Qafy</span>{" "}
          <span style={{ color: "yellow" }}>Mobile</span>
        </Link>
      </div>
      <div className="w-24 flex justify-end ">
        <Button asChild size={"sm"}>
          <Link href="/request">Request</Link>
        </Button>
      </div>
      <Separator className="md:hidden absolute -bottom-[1px] left-0 w-full" />
    </nav>
  );
}
