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
import { useTransition, type Dispatch, type SetStateAction } from "react";
import { login, type LoginFormDataType } from "@/lib/actions";
import { toast } from "sonner";

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

  const [isPending, startTransition] = useTransition();

  const { update } = useSession();

  const onLoginSubmit = async (data: LoginFormDataType) => {
    startTransition(async () => {
      try {
        await login(data);
        await update();
        toast.success("You logged in successfully");
        setIsOpen(false);
      } catch (e) {
        if (e instanceof Error) {
          if (e.message === "No such user") {
            form.setError("email", { message: e.message });
          } else if (e.message === "Wrong password") {
            form.setError("password", { message: e.message });
          } else {
            toast.error("Something went wrong");
            form.setError("root", { message: e.message });
          }
        }
      }
    });
  };
  return (
    <Form {...form}>
      <form className="space-y-8" onSubmit={form.handleSubmit(onLoginSubmit)}>
        {form.formState.errors.root && (
          <div className="text-red-500">
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
                <Input {...field} />
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
                <Input {...field} type="password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Logging in..." : "Login"}
        </Button>
      </form>
      <button
        className="underline-offset-1 underline cursor-pointer font-bold"
        onClick={() => setFormType("forgot")}
      >
        Forgot password?
      </button>
      <div className="text-center">
        No account yet?{" "}
        <button
          className="underline-offset-1 underline cursor-pointer font-bold"
          onClick={() => setFormType("register")}
        >
          Register
        </button>
      </div>
      <Button onClick={() => signIn("google")} variant={"default"}>
        Login via google
      </Button>
    </Form>
  );
}
