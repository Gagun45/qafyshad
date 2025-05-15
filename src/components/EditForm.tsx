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
import { useTransition } from "react";
import { toast } from "sonner";

const formSchema = z.object({
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(24, "Password must be at most 24 characters long")
    .regex(
      /^[a-zA-Z0-9!@#$%^&*()_+\-=]+$/,
      "Password can only contain letters, digits and !@#$%^&*()_+-="
    ),
});

export function EditForm() {
  const [isPending, startTransition] = useTransition();
  const onResetSubmit = async (data: { password: string }) => {
    startTransition(async () => {
      try {
        const res = await fetch("/api/profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        const response = await res.json();
        if (!res.ok) {
          throw new Error(response.message);
        }
        toast.success(response.message);
        form.reset();
      } catch (e) {
        toast.error("Something went wrong");
        if (e instanceof Error) {
          form.setError("root", { message: e.message });
        }
      }
    });
  };
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
    },
    mode: "onChange",
  });
  return (
    <Form {...form}>
      <form
        className="space-y-8 max-w-112 w-4/5"
        onSubmit={form.handleSubmit(onResetSubmit)}
      >
        {form.formState.errors.root && (
          <div className="text-red-500">
            {form.formState.errors.root.message}
          </div>
        )}

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New password</FormLabel>
              <FormControl>
                <Input {...field} type="password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? "Applying..." : "Apply"}
        </Button>
      </form>
    </Form>
  );
}
