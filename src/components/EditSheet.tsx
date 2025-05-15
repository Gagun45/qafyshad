import { EditPasswordForm } from "./EditPasswordForm";
import { EditProfileForm } from "./EditProfileForm";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

export default function EditSheet() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>Edit Profile</Button>
      </SheetTrigger>
      <SheetContent side="top" className="h-1/2 items-center overflow-auto">
        <SheetTitle>Edit Profile</SheetTitle>
        <Tabs defaultValue="account" className="w-full items-center">
          <TabsList className="flex justify-center gap-2">
            <TabsTrigger value="account" className="cursor-pointer">
              Account
            </TabsTrigger>
            <TabsTrigger value="password" className="cursor-pointer">
              Password
            </TabsTrigger>
          </TabsList>
          <TabsContent value="account" className="w-full">
            <EditProfileForm />
          </TabsContent>
          <TabsContent value="password" asChild>
            <EditPasswordForm />
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
