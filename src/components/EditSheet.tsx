"use client";

import { useState } from "react";
import { EditPasswordForm } from "./EditPasswordForm";
import { EditProfileForm } from "./EditProfileForm";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";

export default function EditSheet() {
  const changesDialog = () => {
    return (
      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Save changes</AlertDialogTitle>
            <AlertDialogDescription>
              There are unsaved changes
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setPendingTab("");
                setShowDialog(false);
              }}
            >
              Back
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (pendingTab) {
                  setCurrentTab(pendingTab);
                } else {
                  setSheetIsOpen(false);
                }
              }}
            >
              {pendingTab ? "Continue" : "Close"} without saving
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  };
  const [currentTab, setCurrentTab] = useState("account");
  const [pendingTab, setPendingTab] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [sheetIsOpen, setSheetIsOpen] = useState(false);

  const onTabChange = (tab: string) => {
    setPendingTab(tab);
    if (isDirty) {
      setShowDialog(true);
    } else {
      setCurrentTab(tab);
      setPendingTab("");
    }
  };

  const onSheetClose = (b: boolean) => {
    if (b) {
      setSheetIsOpen(true);
    } else {
      if (isDirty) {
        setShowDialog(true);
      } else {
        setSheetIsOpen(false);
      }
    }
  };
  return (
    <Sheet open={sheetIsOpen} onOpenChange={onSheetClose}>
      {showDialog && changesDialog()}
      <SheetTrigger asChild>
        <Button>Edit Profile</Button>
      </SheetTrigger>
      <SheetContent side="top" className="h-1/2 items-center overflow-auto">
        <SheetTitle>Edit Profile</SheetTitle>
        <Tabs
          value={currentTab}
          defaultValue="account"
          className="w-full items-center"
          onValueChange={onTabChange}
        >
          <TabsList className="flex justify-center gap-2 mb-4">
            <TabsTrigger value="account" className="cursor-pointer">
              Account
            </TabsTrigger>
            <TabsTrigger value="password" className="cursor-pointer">
              Password
            </TabsTrigger>
          </TabsList>
          <TabsContent value="account" className="w-full">
            <EditProfileForm setIsDirty={setIsDirty} />
          </TabsContent>
          <TabsContent value="password" asChild>
            <EditPasswordForm setIsDirty={setIsDirty} />
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
