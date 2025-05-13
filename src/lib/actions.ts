"use server";

import type { Attachment } from "nodemailer/lib/mailer";
import { signIn } from "./auth";
import { dbConnect } from "./dbconnect";
import { User } from "./models";
import crypto from "crypto";
import nodemailer from "nodemailer";

// const BODY_SIZE_LIMIT = "10mb"; // NEXT.CONFIG.TS value !!! //

const WORK_EMAIL = "selyanchyn45@gmail.com";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_EMAIL,
    pass: process.env.GMAIL_PASS,
  },
});

export type RegisterFormDataType = {
  email: string;
  password: string;
  passwordConfirm: string;
};

export type LoginFormDataType = {
  email: string;
  password: string;
};

export type AttachmentType = {
  file: File;
  url: string;
};

export type RequestDataType = {
  name: string;
  contact: string;
  device: string;
  images?: AttachmentType[];
};

export const register = async (data: RegisterFormDataType) => {
  try {
    const { email, password } = data;
    dbConnect();
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error("Email already taken");
    }

    await User.create({
      email,
      password,
    });
  } catch (e) {
    if (e instanceof Error) {
      if (e.message === "Email already taken") {
        throw new Error(e.message);
      }
    }
    throw new Error("Something went wrong");
  }
};

export const login = async (data: LoginFormDataType) => {
  try {
    const { email, password } = data;
    await dbConnect();

    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("No such user");
    }

    if (password !== user.password) {
      throw new Error("Wrong password");
    }
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
  } catch (e) {
    if (e instanceof Error) {
      if (e.message === "No such user" || e.message === "Wrong password") {
        throw new Error(e.message);
      }
    }
    throw new Error("Something went wrong");
  }
};

export const forgot = async (email: string) => {
  try {
    await dbConnect();
    const user = await User.findOne({ email });
    if (!user) throw new Error("No such user");
    const newToken = crypto.randomBytes(32).toString("hex");
    const expiryDate = new Date(Date.now() + 3600000);
    user.resetPasswordToken = newToken;
    user.resetPasswordTokenExpiry = expiryDate;
    await user.save();
    await sendForgotLink(email, newToken);
  } catch (e) {
    if (e instanceof Error) {
      if (e.message === "No such user") throw new Error(e.message);
    }
    throw new Error("Something went wrong");
  }
};

const sendForgotLink = async (to: string, resetPasswordToken: string) => {
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

export const reset = async (password: string, resetPasswordToken: string) => {
  try {
    await dbConnect();
    const user = await User.findOne({ resetPasswordToken });
    if (!user) throw new Error("Invalid token");
    user.password = password;
    user.resetPasswordToken = null;
    user.resetPasswordTokenExpiry = null;
    await user.save();
  } catch (e) {
    if (e instanceof Error) {
      if (e.message === "Invalid token") {
        throw new Error(e.message);
      } else {
        throw new Error("Something went wrong");
      }
    }
  }
};

const sendEmail = async (
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
  } catch {
    throw new Error("Something went wrong");
  }
};

export const request = async (data: RequestDataType) => {
  try {
    const { name, contact, device, images } = data;
    const subject = "New request";
    const html = `New request has been submitted!<br/>
    ----------------------------<br/>
    Information:<br/>
    Name: ${name}<br/>
    Contact: ${contact}<br/>
    Device: ${device}<br/>
    ----------------------------<br/>
    `;
    const attachments = images?.map((image) => image.file);
    await sendEmail(WORK_EMAIL, subject, html, attachments);
  } catch {
    throw new Error("Something went wrong");
  }
};
