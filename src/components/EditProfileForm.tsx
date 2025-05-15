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
import { toast } from "sonner";
import { useSession } from "next-auth/react";

const formSchema = z.object({
  name: z
    .string()
    .max(40, "Name must be at most 40 characters long")
    .regex(/^[a-zA-Z ]*$/, "Name can only contain letters"),
  contact: z.string().max(80, "Password must be at most 80 characters long"),
});

export function EditProfileForm() {
  const { data: session, update } = useSession();
  const onResetSubmit = async (data: { name: string; contact: string }) => {
    try {
      const res = await fetch("/api/profile/editProfile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const response = await res.json();
      if (!res.ok) {
        form.setError("root", { message: response.message });
        toast.error("Something went wrong");
      } else {
        await update();
        toast.success(response.message);
      }
    } catch (e) {
      toast.error("Something went wrong");
      if (e instanceof Error) {
        form.setError("root", { message: e.message });
      }
    }
  };
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: session?.user.name || "",
      contact: session?.user.contact || "",
    },
    mode: "onChange",
  });
  const handleCancel = () => {
    form.reset();
  };
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your name</FormLabel>
              <FormControl>
                <Input {...field} disabled={form.formState.isSubmitting} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="contact"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact Information</FormLabel>
              <FormControl>
                <Input {...field} disabled={form.formState.isSubmitting} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-2">
          <Button
            onClick={handleCancel}
            type="button"
            variant={"secondary"}
            className="flex-1"
            disabled={!form.formState.isDirty || form.formState.isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={!form.formState.isDirty || form.formState.isSubmitting}
            className="flex-1"
          >
            {form.formState.isSubmitting ? "Applying..." : "Apply"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
