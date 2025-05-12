import { useState } from "react";
import { LoginForm } from "./LoginForm";
import {
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet";
import { RegisterForm } from "./RegisterForm";
import { ForgotForm } from "./ForgotForm";

export default function AuthSheet() {
  const [formType, setFormType] = useState<"login" | "register" | "forgot">(
    "login"
  );

  return (
    <SheetContent>
      <SheetHeader className="space-y-4">
        <SheetTitle className="text-2xl">
          {formType === "login"
            ? "Login"
            : formType === "register"
            ? "Register"
            : formType === "forgot"
            ? "Forgot password"
            : null}
        </SheetTitle>
        <SheetDescription asChild>
          {formType === "login" ? (
            <LoginForm setFormType={setFormType} />
          ) : formType === "register" ? (
            <RegisterForm setFormType={setFormType} />
          ) : formType === "forgot" ? (
            <ForgotForm setFormType={setFormType} />
          ) : null}
        </SheetDescription>
      </SheetHeader>
    </SheetContent>
  );
}
