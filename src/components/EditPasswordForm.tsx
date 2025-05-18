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
import { useSession } from "next-auth/react";
import { editPassword } from "@/lib/actions/editPassword";
import { EditPasswordMessages, SMTH_WENT_WRONG } from "@/lib/errors";

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
  const { data: session } = useSession();
  const onResetSubmit = async (data: {
    password: string;
    currentPassword: string;
  }) => {
    try {
      const result = await editPassword(
        data.currentPassword,
        data.password,
        session?.user.id
      );
      if (!result.success) {
        form.reset();
        form.setError("root", { message: result.message });
        toast.error(SMTH_WENT_WRONG);
        return;
      }
      form.reset();
      toast.success(EditPasswordMessages.SUCCESS_EDIT_PASSWORD);
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
      currentPassword: "",
      password: "",
    },
    mode: "onChange",
  });
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
        <h2 className="text-center font-bold text-lg">Change password</h2>
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
