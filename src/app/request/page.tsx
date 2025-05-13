import { RequestForm } from "@/components/RequestForm";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { PopoverClose } from "@radix-ui/react-popover";
import { Circle, XIcon } from "lucide-react";

const items = [
  "Create a request on the website",
  "We contact you to clarify the details",
  "Send the device or come in person",
  "We diagnose and confirm the cost",
  "After approval - we carry out the repair",
  "Get the finished device and a guarantee",
];

export default function RequestPage() {
  return (
    <div className="flex w-full h-full flex-col items-center gap-4">
      <div className="flex flex-col items-center gap-0">
        <h1 className="text-4xl font-bold">Request</h1>
        <h2 className="font-semibold">
          Create a request and we will contact you
        </h2>
        <Popover>
          <PopoverTrigger className="underline underline-offset-2 cursor-pointer">
            How it works?
          </PopoverTrigger>

          <PopoverContent className="relative flex flex-col w-fit max-w-screen gap-10 md:gap-12 text-justify py-4 md:py-8 px-4 md:px-8">
            {items.map((item) => (
              <div key={item} className="flex gap-2 items-center">
                <Circle className="size-3 rounded-full bg-foreground" />
                <p className="text-base md:text-lg">{item}</p>
              </div>
            ))}
            <Button asChild variant={"ghost"} className="!p-0 h-auto">
              <PopoverClose className=" absolute top-2 right-2 cursor-pointer">
                <XIcon className="size-7" />
              </PopoverClose>
            </Button>
          </PopoverContent>
        </Popover>
      </div>
      <RequestForm />
    </div>
  );
}
