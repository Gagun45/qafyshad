import { Badge } from "@/components/ui/badge";

const ITEMS = [
  "Diagnostics — 0-15 €",
  "Display replacement (smartphone) — from 50 €",
  "Repair after flooding — from 60 €",
  "Battery replacement — from 40 €",
  "Laptop cleaning — 30-45 €",
  "Flashing — from 25 €",
];

export default function PricesPage() {
  return (
    <main className="text-justify text-lg sm:text-2xl">
      <header className="mb-4">
        <h1 className="pageHeading mb-0">Prices</h1>
        <h2 className="pageSubHeading text-muted-foreground italic text-sm font-bold">
          <span className="text-red-500">*</span>To clarify the price — contact
          us or leave a request
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
