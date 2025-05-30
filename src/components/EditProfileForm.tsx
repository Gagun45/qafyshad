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
import { editProfile } from "@/lib/actions/editProfile";
import { EditProfileMessages, SMTH_WENT_WRONG } from "@/lib/errors";

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
      const result = await editProfile(
        data.name,
        data.contact,
        session?.user.id
      );
      await update();
      if (!result.success) {
        toast.error(SMTH_WENT_WRONG);
        form.setError("root", { message: result.message });
        form.reset();
        return;
      }
      toast.success(EditProfileMessages.SUCCESS_EDIT_PROFILE);
    } catch {
      toast.error(SMTH_WENT_WRONG);
      form.setError("root", { message: SMTH_WENT_WRONG });
    } finally {
      setIsDirty(false);
    }
  };
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      contact: "",
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
  }, [session?.user, form.reset, form]);
  useEffect(() => {
    setIsDirty(form.formState.isDirty);
  }, [form.formState, setIsDirty]);
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
                    autoFocus
                    {...field}
                    placeholder={field.value ? field.value : "Enter your name"}
                    disabled={form.formState.isSubmitting}
                  />
                  {form.formState.dirtyFields.name && (
                    <Button
                      variant={"clearInput"}
                      type="button"
                      onClick={() => form.resetField("name")}
                      disabled={form.formState.isSubmitting}
                    >
                      <Redo2Icon className="group-hover:scale-[1.3] duration-150 transition-all" />
                    </Button>
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
                <div className="relative">
                  <Input
                    {...field}
                    disabled={form.formState.isSubmitting}
                    placeholder={
                      field.value ? field.value : "Enter your contact"
                    }
                  />
                  {form.formState.dirtyFields.contact && (
                    <Button
                      variant={"clearInput"}
                      type="button"
                      onClick={() => form.resetField("contact")}
                      disabled={form.formState.isSubmitting}
                    >
                      <Redo2Icon className="group-hover:scale-[1.3] duration-150 transition-all" />
                    </Button>
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
