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
import { useRouter } from "next/navigation";
import { reset } from "@/lib/actions/reset";
import { SMTH_WENT_WRONG } from "@/lib/errors";

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

export function ResetForm({ token }: { token: string }) {
  const router = useRouter();
  const onResetSubmit = async (data: { password: string }) => {
    try {
      const result = await reset(data.password, token);
      if (!result.success) {
        toast.error(SMTH_WENT_WRONG);
        form.setError("root", { message: result.message });
        return;
      }
      toast.success(result.message);
      router.push("/");
    } catch {
      form.setError("root", { message: SMTH_WENT_WRONG });
    }
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
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New password</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="password"
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
          {form.formState.isSubmitting ? "Applying..." : "Apply"}
        </Button>
      </form>
    </Form>
  );
}
