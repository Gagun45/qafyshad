import { EditForm } from "./EditForm";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "./ui/sheet";

export default function EditSheet() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>Edit Profile</Button>
      </SheetTrigger>
      <SheetContent side="top" className="min-h-1/2">
        <SheetTitle>Edit Profile</SheetTitle>
        <Separator />
        <ScrollArea className="overflow-auto flex-1">
          <EditForm />
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
