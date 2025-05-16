"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { useEffect, type Dispatch, type SetStateAction } from "react";
import { Redo2Icon } from "lucide-react";

const formSchema = z.object({
  name: z
    .string()
    .max(40, "Name must be at most 40 characters long")
    .regex(/^[a-zA-Z ]*$/, "Name can only contain letters"),
  contact: z.string().max(80, "Password must be at most 80 characters long"),
});

export function EditProfileForm({
  setIsDirty,
}: {
  setIsDirty: Dispatch<SetStateAction<boolean>>;
}) {
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
        toast.success(response.message);
      }
    } catch (e) {
      toast.error("Something went wrong");
      if (e instanceof Error) {
        form.setError("root", { message: e.message });
      }
    } finally {
      await update();
      setIsDirty(false);
    }
  };
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: session?.user.name ?? "",
      contact: session?.user.contact ?? "",
    },
    mode: "onChange",
  });
  const handleCancel = () => {
    form.reset();
  };
  useEffect(() => {
    if (session?.user) {
      form.reset({ name: session.user.name, contact: session.user.contact });
    }
  }, [session?.user, form.reset]);
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your name</FormLabel>
              <FormControl>
                <div className="relative ">
                  <Input
                    {...field}
                    placeholder={field.value ? field.value : "Enter your name"}
                    disabled={form.formState.isSubmitting}
                  />
                  {form.formState.dirtyFields.name && (
                    <Redo2Icon
                      onClick={() => form.resetField("name")}
                      className="absolute right-1 size-4 bottom-1/2 translate-y-1/2"
                    />
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="contact"
          render={({ field }) => (
            <FormItem className="mb-2">
              <FormLabel>Contact Information</FormLabel>
              <FormControl>
                <div className="relative ">
                  <Input
                    {...field}
                    disabled={form.formState.isSubmitting}
                    placeholder={
                      field.value ? field.value : "Enter your contact"
                    }
                  />
                  {form.formState.dirtyFields.contact && (
                    <Redo2Icon
                      onClick={() => form.resetField("contact")}
                      className="absolute right-1 size-4 bottom-1/2 translate-y-1/2"
                    />
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormDescription>
          This information will be used to autocomplete the request form
        </FormDescription>

        <div className="flex gap-2 flex-wrap">
          <Button
            onClick={handleCancel}
            type="button"
            variant={"secondary"}
            className="flex-1"
            disabled={!form.formState.isDirty || form.formState.isSubmitting}
          >
            Reset
          </Button>
          <Button
            type="submit"
            disabled={!form.formState.isDirty || form.formState.isSubmitting}
            className="flex-1"
          >
            {form.formState.isSubmitting ? "Applying..." : "Apply"}
          </Button>
        </div>
        {form.formState.isDirty && (
          <FormDescription>There are unsaved changes</FormDescription>
        )}
      </form>
    </Form>
  );
}
