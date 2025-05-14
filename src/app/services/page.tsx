import { Badge } from "@/components/ui/badge";

const ITEMS = [
  "Device diagnostics",
  "Display and sensor replacement",
  "Board repair (soldering, water recovery)",
  "PC/laptop cleaning and maintenance",
  "Device flashing and unlocking",
  "Battery replacement",
  "Software installation",
  "Game console repair (PS5, Xbox, Nintendo)",
];

export default function ServicesPage() {
  return (
    <main className="text-justify text-lg sm:text-2xl">
      <header className="mb-4">
        <h1 className="pageHeading">Our services</h1>
        <h2 className="pageSubHeading text-muted-foreground">
          We offer a wide range of repair and maintenance services to keep your
          devices running smoothly:
        </h2>
      </header>
      <div className="grid grid-cols-1 gap-8">
        {ITEMS.map((item) => (
          <div key={item} className="flex justify-center">
            <Badge
            variant={"outline"}
              className="!text-lg border-muted-foreground text-center min-w-fit w-full max-w-xl py-2 !text-wrap"
            >
              {item}
            </Badge>
          </div>
        ))}
      </div>
    </main>
  );
}
