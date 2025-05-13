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
import {
  useEffect,
  useRef,
  useState,
  useTransition,
  type ChangeEvent,
} from "react";
import { Trash2Icon, XIcon, ZoomInIcon } from "lucide-react";
import Image from "next/image";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import {
  request,
  type AttachmentType,
  type RequestDataType,
} from "@/lib/actions";
import { toast } from "sonner";
const formSchema = z.object({
  name: z.string().min(1, "Fill in please").max(40),
  contact: z.string().min(1, "Fill in please").max(40),
  device: z.string().min(1, "Fill in please").max(40),
  images: z.any(),
});

export function RequestForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      contact: "",
      device: "",
      images: undefined,
    },
    mode: "onChange",
  });
  const [isPending, startTransition] = useTransition();
  const imageRef = useRef<HTMLInputElement>(null);
  const [attached, setAttached] = useState<AttachmentType[]>([]);
  const [zoomed, setZoomed] = useState<AttachmentType | null>();
  const [overallSize, setOverallSize] = useState(0);

  const buttonClick = () => {
    imageRef.current?.click();
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    form.setError("images", { message: "" });
    const files = Array.from(e.target.files || []);
    if (files.length == 0) return;

    const imagesOnly = files.filter((file) => file.type.startsWith("image/"));

    if (imagesOnly.length !== files.length)
      form.setError("images", { message: "Some files were not included" });

    const newAttachments: AttachmentType[] = imagesOnly.map((file) => ({
      file: file,
      url: URL.createObjectURL(file),
    }));
    const filteredAttachments = newAttachments.filter(
      (item) => !attached.some((file) => file.file.name === item.file.name)
    );
    setAttached((prev) => [...prev, ...filteredAttachments]);
  };
  useEffect(() => {
    form.setValue("images", attached);
    setOverallSize(
      attached.reduce(
        (acc, item) =>
          acc + parseFloat((item.file.size / (1024 * 1024)).toFixed(2)),
        0
      )
    );
  }, [attached]);

  const onResetSubmit = async (data: RequestDataType) => {
    startTransition(async () => {
      try {
        await request(data);
        toast("Request has been submitted!");
        form.reset();
        setAttached([]);
      } catch {
        form.setError("root", { message: "Something went wrong" });
      }
    });
  };

  type TextFieldKeys = Extract<
    keyof typeof formSchema.shape,
    "name" | "contact" | "device"
  >;

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
        {(["name", "contact", "device"] as TextFieldKeys[]).map((item) => (
          <FormField
            key={item}
            control={form.control}
            name={item}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input {...field} type="text" className="pr-12" />
                    <Button
                      variant={"clearInput"}
                      type="button"
                      onClick={() => form.resetField(item)}
                      hidden={form.getValues(item).length == 0}
                    >
                      <XIcon className="group-hover:scale-[1.3] duration-150 transition-all" />
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}

        <FormField
          control={form.control}
          name="images"
          render={() => (
            <FormItem className="flex items-center flex-wrap">
              <FormControl>
                <Input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  ref={imageRef}
                />
              </FormControl>
              <Button
                type="button"
                variant={"secondary"}
                onClick={buttonClick}
                className="w-fit"
              >
                Attach Images
              </Button>
              {attached.length > 0 && (
                <Button
                  variant={"destructive"}
                  onClick={() => {
                    setAttached([]);
                  }}
                >
                  Detach all images
                </Button>
              )}
              <FormMessage className="!w-full" />
              {overallSize > 10 && (
                <span className="text-destructive text-sm">
                  Overall size {overallSize.toFixed(2)}MB is exceeding the limit
                  of 10MB
                </span>
              )}
            </FormItem>
          )}
        />

        {attached.length > 0 && (
          <div className="grid grid-cols-3 w-full gap-2">
            {attached.map((attachment) => (
              <div
                key={attachment.url}
                className="w-full h-24 flex flex-col outline-1 relative"
              >
                <div className="w-full h-24 group cursor-pointer relative ">
                  <Image
                    src={attachment.url}
                    alt="image"
                    className="w-full h-full object-contain"
                    fill
                    onClick={() => setZoomed(attachment)}
                  />
                  <ZoomInIcon className="absolute opacity-0 transition-opacity duration-300 pointer-events-none group-hover:opacity-100 inset-0 bg-black/85 p-6 w-full h-full flex justify-center items-center" />
                </div>
                <span className="text-sm">
                  {(attachment.file.size / (1024 * 1024)).toFixed(2)}MB
                </span>

                <Button
                  variant={"destructive"}
                  className="absolute group !bg-transparent !p-0 top-0 right-0 cursor-pointer size-4 z-10"
                  onClick={() => {
                    form.setError("images", { message: "" });
                    setAttached((prev) =>
                      prev.filter((item) => item.url !== attachment.url)
                    );
                  }}
                >
                  <Trash2Icon className="group-hover:text-red-500" />
                </Button>
              </div>
            ))}
          </div>
        )}

        <Button
          type="submit"
          disabled={isPending || overallSize > 10}
          className="w-full"
        >
          {isPending ? "Sending..." : "Send"}
        </Button>
      </form>
      {zoomed && (
        <Dialog open={!!zoomed} onOpenChange={() => setZoomed(null)}>
          <DialogContent
            onClick={() => setZoomed(null)}
            className="!h-full !w-full !max-w-none flex flex-col rounded-none"
          >
            <DialogTitle className="text-center">
              {zoomed.file.name}
            </DialogTitle>
            <div className="w-full h-full relative">
              <Image
                src={zoomed.url}
                alt="image"
                fill
                className="object-contain"
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </Form>
  );
}
