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
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { type Dispatch, type SetStateAction } from "react";
import { register } from "@/lib/actions/register";
import type { RegisterFormDataType } from "@/lib/types";
import { RegisterMessages, SMTH_WENT_WRONG } from "@/lib/errors";

const formSchema = z
  .object({
    email: z.string().email("Invalid email"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .max(24, "Password must be at most 24 characters long")
      .regex(
        /^[a-zA-Z0-9!@#$%^&*()_+\-=]+$/,
        "Password can only contain letters, digits and !@#$%^&*()_+-="
      ),
    passwordConfirm: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Passwords do not match",
    path: ["passwordConfirm"],
  });

export function RegisterForm({
  setFormType,
}: {
  setFormType: Dispatch<SetStateAction<"login" | "register" | "forgot">>;
}) {
  const onRegisterSubmit = async (data: RegisterFormDataType) => {
    try {
      const result = await register(data);
      if (!result.success) {
        toast.error(SMTH_WENT_WRONG);
        form.setError("root", { message: result.message });
        return;
      }
      toast.success(RegisterMessages.SUCCESS_REGISTER);
      setFormType("login");
    } catch {
      toast.error(SMTH_WENT_WRONG);
      form.setError("root", { message: SMTH_WENT_WRONG });
    }
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      passwordConfirm: "",
    },
    mode: "onChange",
  });
  return (
    <Form {...form}>
      <form
        className="space-y-8 px-2 pb-80 overflow-auto"
        onSubmit={form.handleSubmit(onRegisterSubmit)}
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

        <FormField
          control={form.control}
          name="passwordConfirm"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password repeat</FormLabel>
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
          disabled={form.formState.isSubmitting || !form.formState.isValid}
          className="w-full"
        >
          {form.formState.isSubmitting ? "Registering..." : "Register"}
        </Button>

        <div className="text-center">
          Already have an account?{" "}
          <Button
            type="button"
            variant={"formLink"}
            onClick={() => setFormType("login")}
            disabled={form.formState.isSubmitting}
          >
            Login
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
