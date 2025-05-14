import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex flex-col gap-8 text-4xl">   
      <span>Page not found</span>
      <Button asChild className="w-fit" size={"lg"}>
        <Link href="/">Homepage</Link>
      </Button>
    </main>
  );
}
