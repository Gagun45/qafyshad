"use client";

import { FaInstagram, FaTelegram, FaWhatsapp } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import type { IconType } from "react-icons/lib";
import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { CopyIcon, MapPin } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";

interface ContactInterface {
  label: string;
  contact: string;
  link: string;
  icon: IconType;
}

const ITEMS: ContactInterface[] = [
  {
    label: "Telegram",
    contact: "Qafy_mobile",
    link: "tg://resolve?domain=Qafy_mobile",
    icon: FaTelegram,
  },
  {
    label: "Whatsapp",
    contact: "+49 1514 0164020",
    link: "https://wa.me/+4915140164020",
    icon: FaWhatsapp,
  },
  {
    label: "Instagram",
    contact: "qafy.mobile",
    link: "https://www.instagram.com/qafy.mobile",
    icon: FaInstagram,
  },
];

export default function Contacts() {
  const [isNaviAvailable, setIsNaviAvailable] = useState(false);
  useEffect(() => {
    if (navigator.clipboard) {
      setIsNaviAvailable(true);
    }
  }, []);
  return (
    <main className="text-lg sm:text-2xl">
      <header>
        <h1 className="pageHeading">Contacts</h1>
        <h2 className="pageSubHeading text-muted-foreground italic text-sm">
          You can only contact me via correspondence or in person
        </h2>
        <h2 className="pageSubHeading font-bold text-sm">No answer to calls</h2>
      </header>
      <div className="flex flex-col gap-12 mx-auto max-w-lg ">
        <div className="grid grid-cols-[40%_60%] items-center gap-6">
          <div className="self-start flex items-center gap-2 flex-wrap">
            <MapPin className="size-5 md:size-8 flex-shrink-0" />
            <span>Address:</span>
          </div>
          <Sheet>
            <Tooltip>
              <TooltipTrigger asChild>
                <SheetTrigger className="cursor-pointer text-left">
                  <span className="underline underline-offset-2">
                    Waldstraße 37, 93161 Sinzing, Deutschland
                  </span>
                </SheetTrigger>
              </TooltipTrigger>
              <TooltipContent>View on google maps</TooltipContent>
            </Tooltip>
            <SheetContent side="bottom" className="p-2">
              <SheetTitle>Google Map Location</SheetTitle>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2618.1591128944633!2d12.024330899999999!3d48.9885294!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x479fc16245fd3555%3A0x37f531228e11ac2!2sQafy-Mobile!5e0!3m2!1suk!2sua!4v1747244741528!5m2!1suk!2sua"
                height="450"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full"
              ></iframe>
            </SheetContent>
          </Sheet>
        </div>
        {ITEMS.map((item) => (
          <div key={item.label} className="grid grid-cols-[40%_60%] gap-6">
            <div className="flex items-center gap-2 flex-wrap">
              <item.icon className="size-5 md:size-8 flex-shrink-0" />
              <span>{item.label}:</span>
            </div>

            <Link href={item.link} className="underline underline-offset-2">
              {item.contact}
            </Link>
          </div>
        ))}
        <div className="grid grid-cols-[40%_60%] gap-6">
          <div className="flex items-center gap-2 flex-wrap">
            <MdEmail className="size-5 md:size-8 flex-shrink-0" />
            <span>Email:</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="text-base">qafy42@gmail.com</Badge>
            <Tooltip>
              <TooltipTrigger className="cursor-pointer">
                {isNaviAvailable && (
                  <CopyIcon
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText("qafy42@gmail.com");
                        toast.success("Email copied!", { duration: 1000 });
                      } catch {
                        toast.error("Failed to copy", { duration: 1000 });
                      }
                    }}
                    size={16}
                  />
                )}
              </TooltipTrigger>
              <TooltipContent>Copy</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </main>
  );
}
