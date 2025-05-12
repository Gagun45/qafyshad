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
import type { Dispatch, SetStateAction } from "react";

const formSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(2, "Password must be at least 2 characters"),
});

export function LoginForm({
  setFormType,
}: {
  setFormType: Dispatch<SetStateAction<"login" | "register" | "forgot">>;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  });
  return (
    <Form {...form}>
      <form className="space-y-8">
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
        <Button type="submit" className="w-full">
          Login
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
