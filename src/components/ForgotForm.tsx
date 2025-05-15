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
import { type Dispatch, type SetStateAction } from "react";
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
  const onForgotSubmit = async (data: { email: string }) => {
    try {
      await forgot(data.email);
      toast.success(`Link successfully sent to ${data.email}`);
      setIsOpen(false);
      setFormType("login");
    } catch (e) {
      if (e instanceof Error) {
        if (e.message === "No such user") {
          form.setError("email", { message: e.message });
        } else {
          toast.error("Something went wrong");
          form.setError("root", { message: e.message });
        }
      }
    }
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
      <form
        className="space-y-8 px-2 pb-80 overflow-auto"
        onSubmit={form.handleSubmit(onForgotSubmit)}
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

        <Button
          type="submit"
          disabled={form.formState.isSubmitting || !form.formState.isValid}
          className="w-full"
        >
          {form.formState.isSubmitting ? "Sending..." : "Send"}
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
          disabled={form.formState.isSubmitting}
          className="flex mx-auto"
        >
          Login via google
        </Button>
      </form>
    </Form>
  );
}
