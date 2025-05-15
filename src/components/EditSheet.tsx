import { EditForm } from "./EditForm";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "./ui/sheet";

export default function EditSheet() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>Edit Profile</Button>
      </SheetTrigger>
      <SheetContent side="top" className="min-h-1/2 items-center">
        <SheetTitle>Edit Profile</SheetTitle>
        <EditForm/>
      </SheetContent>
    </Sheet>
  );
}
