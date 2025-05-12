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

const formSchema = z.object({
  email: z.string().email("Invalid email"),
});

export function ForgotForm({
  setFormType,
}: {
  setFormType: Dispatch<SetStateAction<"login" | "register" | "forgot">>;
}) {
  const [isPending, startTransition] = useTransition();
  const onRegisterSubmit = async (data: RegisterFormDataType) => {
    start
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
      <form className="space-y-8">
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
          Send
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
