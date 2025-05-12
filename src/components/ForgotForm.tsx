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
import { forgot } from "@/lib/actions";
import { useTransition, type Dispatch, type SetStateAction } from "react";
import { toast } from "sonner";

const formSchema = z.object({
  email: z.string().email("Invalid email"),
});

export function ForgotForm({
  setFormType,
  setIsOpen,
}: {
  setFormType: Dispatch<SetStateAction<"login" | "register" | "forgot">>;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const [isPending, startTransition] = useTransition();
  const onForgotSubmit = async (data: { email: string }) => {
    startTransition(async () => {
      try {
        await forgot(data.email);
        toast(`Link successfully sent to ${data.email}`);
        setIsOpen(false);
      } catch (e) {
        if (e instanceof Error) {
          if (e.message === "No such user") {
            form.setError("email", { message: e.message });
          } else {
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
    },
    mode: "onChange",
  });
  return (
    <Form {...form}>
      <form className="space-y-8" onSubmit={form.handleSubmit(onForgotSubmit)}>
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

        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? "Sending..." : "Send"}
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
        disabled={isPending}
      >
        Login via google
      </Button>
    </Form>
  );
}
