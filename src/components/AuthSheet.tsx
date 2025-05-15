import { useState, type Dispatch, type SetStateAction } from "react";
import { LoginForm } from "./LoginForm";
import { SheetContent, SheetHeader, SheetTitle } from "./ui/sheet";
import { RegisterForm } from "./RegisterForm";
import { ForgotForm } from "./ForgotForm";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";

export default function AuthSheet({
  setIsOpen,
}: {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const [formType, setFormType] = useState<"login" | "register" | "forgot">(
    "login"
  );

  return (
    <SheetContent className="flex flex-col">
      <SheetHeader>
        <SheetTitle>
          {formType === "login"
            ? "Login"
            : formType === "register"
            ? "Register"
            : formType === "forgot"
            ? "Forgot password"
            : null}
        </SheetTitle>
      </SheetHeader>
      <Separator />
      <ScrollArea className="overflow-auto flex-1">
        {formType === "login" ? (
          <LoginForm setFormType={setFormType} setIsOpen={setIsOpen} />
        ) : formType === "register" ? (
          <RegisterForm setFormType={setFormType} />
        ) : formType === "forgot" ? (
          <ForgotForm setFormType={setFormType} setIsOpen={setIsOpen} />
        ) : null}
      </ScrollArea>
    </SheetContent>
  );
}
