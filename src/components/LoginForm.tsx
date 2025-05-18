"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signIn, useSession } from "next-auth/react";
import { type Dispatch, type SetStateAction } from "react";
import { toast } from "sonner";
import type { LoginFormDataType } from "@/lib/types";
import { login } from "@/lib/actions/login";
import { SMTH_WENT_WRONG } from "@/lib/errors";

const formSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(24, "Password must be at most 24 characters long")
    .regex(
      /^[a-zA-Z0-9!@#$%^&*()_+\-=]+$/,
      "Password can only contain letters, digits and !@#$%^&*()_+-="
    ),
});

export function LoginForm({
  setFormType,
  setIsOpen,
}: {
  setFormType: Dispatch<SetStateAction<"login" | "register" | "forgot">>;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  const { update } = useSession();

  const onLoginSubmit = async (data: LoginFormDataType) => {
    try {
      const result = await login(data);
      if (!result.success) {
        toast.error(SMTH_WENT_WRONG);
        form.setError("root", { message: result.message });
        return;
      }
      await update();
      setIsOpen(false);
      toast.success(result.message);
    } catch {
      form.setError("root", { message: SMTH_WENT_WRONG });
    }
  };
  return (
    <Form {...form}>
      <form
        className="space-y-8 px-2 pb-80 overflow-auto"
        onSubmit={form.handleSubmit(onLoginSubmit)}
      >
        {form.formState.errors.root && (
          <div className="text-destructive">
            {form.formState.errors.root.message}
          </div>
        )}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  autoFocus
                  disabled={form.formState.isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="password"
                  disabled={form.formState.isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full"
          disabled={form.formState.isSubmitting || !form.formState.isValid}
        >
          {form.formState.isSubmitting ? "Logging in..." : "Login"}
        </Button>

        <Button
          type="button"
          variant="formLink"
          className="!flex !mx-auto underline"
          onClick={() => setFormType("forgot")}
          disabled={form.formState.isSubmitting}
        >
          Forgot password?
        </Button>
        <div className="text-center">
          No account yet?{" "}
          <Button
            variant="formLink"
            onClick={() => setFormType("register")}
            disabled={form.formState.isSubmitting}
          >
            Register
          </Button>
        </div>
        <Button
          type="button"
          onClick={() => signIn("google")}
          variant={"default"}
          className="flex mx-auto"
          disabled={form.formState.isSubmitting}
        >
          Login via google
        </Button>
      </form>
    </Form>
  );
}
