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
import { register, type RegisterFormDataType } from "@/lib/actions";
import { toast } from "sonner";
import { useTransition, type Dispatch, type SetStateAction } from "react";

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
  const [isPending, startTransition] = useTransition();
  const onRegisterSubmit = async (data: RegisterFormDataType) => {
    startTransition(async () => {
      try {
        await register(data);
        toast.success("Successfully registered");
        setFormType("login");
      } catch (e) {
        if (e instanceof Error) {
          if (e.message === "Email already taken") {
            form.setError("email", { message: e.message });
          } else {
            toast.error('Something went wrong')
            form.setError("root", { message: e.message });
          }
        }
      }
    });
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
        className="space-y-8"
        onSubmit={form.handleSubmit(onRegisterSubmit)}
      >
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

        <FormField
          control={form.control}
          name="passwordConfirm"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password repeat</FormLabel>
              <FormControl>
                <Input {...field} type="password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? "Registering..." : "Register"}
        </Button>
      </form>
      <div>
        Already have an account?{" "}
        <button
          className="underline-offset-1 underline cursor-pointer font-bold"
          onClick={() => setFormType("login")}
        >
          Login
        </button>
      </div>
      <Button
        onClick={() => signIn("google")}
        variant={"default"}
        className="text-background"
      >
        Login via google
      </Button>
    </Form>
  );
}
