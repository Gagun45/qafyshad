"use server";

import { Types } from "mongoose";
import { auth } from "./auth";
import { dbConnect } from "./dbconnect";
import { User } from "./models";
import type { ServerSession } from "./next-auth";
import nodemailer from "nodemailer";
import type { Attachment } from "nodemailer/lib/mailer";

export const getServerSession = async (): Promise<ServerSession | null> => {
  const session = await auth();
  if (!session || !session.user || !("id" in session.user)) {
    return null;
  }
  return session as unknown as ServerSession;
};

export const getUserById = async (id: string) => {
  try {
    await dbConnect();
    const user = await User.findById(new Types.ObjectId(id));
    return user;
  } catch {
    return null;
  }
};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_EMAIL,
    pass: process.env.GMAIL_PASS,
  },
});

export const sendForgotLink = async (
  to: string,
  resetPasswordToken: string
) => {
  try {
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetPasswordToken}`;
    await transporter.sendMail({
      from: "Shadcn test",
      to,
      subject: "Reset link",
      html: `Click <a href=${resetUrl}>here</a> to reset your password`,
    });
  } catch {
    throw new Error("Something went wrong");
  }
};

export const sendEmail = async (
  to: string,
  subject: string,
  html: string,
  attachments?: File[]
) => {
  try {
    if (!attachments) {
      await transporter.sendMail({
        from: "ShadCn test",
        to,
        subject,
        html,
      });
    } else {
      const newFiles: Attachment[] = await Promise.all(
        attachments.map(async (file) => ({
          filename: file.name,
          content: Buffer.from(await file.arrayBuffer()),
          encoding: "base64",
        }))
      );
      await transporter.sendMail({
        from: "ShadCn test",
        to,
        subject,
        html,
        attachments: newFiles,
      });
    }
  } catch (e) {
    console.log("Error: ", e);
    throw new Error("Something went wrong");
  }
};
