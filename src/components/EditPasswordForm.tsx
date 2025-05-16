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
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useEffect, type Dispatch, type SetStateAction } from "react";

const formSchema = z
  .object({
    currentPassword: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .max(24, "Password must be at most 24 characters long")
      .regex(
        /^[a-zA-Z0-9!@#$%^&*()_+\-=]+$/,
        "Password can only contain letters, digits and !@#$%^&*()_+-="
      ),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .max(24, "Password must be at most 24 characters long")
      .regex(
        /^[a-zA-Z0-9!@#$%^&*()_+\-=]+$/,
        "Password can only contain letters, digits and !@#$%^&*()_+-="
      ),
  })
  .refine((data) => data.currentPassword !== data.password, {
    message: "Passwords must differ",
    path: ["password"],
  });

export function EditPasswordForm({
  setIsDirty,
}: {
  setIsDirty: Dispatch<SetStateAction<boolean>>;
}) {
  const onResetSubmit = async (data: {
    password: string;
    currentPassword: string;
  }) => {
    try {
      const res = await fetch("/api/profile/editPassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const response = await res.json();
      form.reset();
      if (!res.ok) {
        form.setError("root", { message: response.message });
        toast.error("Something went wrong");
      } else {
        toast.success(response.message);
      }
    } catch (e) {
      toast.error("Something went wrong");
      if (e instanceof Error) {
        form.setError("root", { message: e.message });
      }
    } finally {
      setIsDirty(false);
    }
  };
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentPassword: "",
      password: "",
    },
    mode: "onChange",
  });
  useEffect(() => {
    setIsDirty(form.formState.isDirty);
  }, [form.formState]);
  return (
    <Form {...form}>
      <form
        className="space-y-8 mx-auto max-w-112 w-4/5"
        onSubmit={form.handleSubmit(onResetSubmit)}
      >
        {form.formState.errors.root && (
          <div className="text-destructive">
            {form.formState.errors.root.message}
          </div>
        )}
        <FormField
          control={form.control}
          name="currentPassword"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  {...field}
                  type="password"
                  disabled={form.formState.isSubmitting}
                  placeholder="Current password"
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
              <FormControl>
                <Input
                  {...field}
                  type="password"
                  disabled={form.formState.isSubmitting}
                  placeholder="New password"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-2 flex-wrap">
          <Button
            type="button"
            variant={"secondary"}
            disabled={form.formState.isSubmitting || !form.formState.isDirty}
            className="flex-1"
            onClick={() => form.reset()}
          >
            Reset
          </Button>
          <Button
            type="submit"
            disabled={form.formState.isSubmitting || !form.formState.isValid}
            className="flex-1"
          >
            {form.formState.isSubmitting ? "Applying..." : "Apply"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
