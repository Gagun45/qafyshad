"use server";

import { signIn } from "./auth";
import { dbConnect } from "./dbconnect";
import { User } from "./models";
import crypto from "crypto";

export type RegisterFormDataType = {
  email: string;
  password: string;
  passwordConfirm: string;
};

export type LoginFormDataType = {
  email: string;
  password: string;
};

export const register = async (data: RegisterFormDataType) => {
  try {
    const email = data.email;
    const password = data.password;
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
    const email = data.email;
    const password = data.password;
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
  } catch (e) {
    if (e instanceof Error) {
      if (e.message === "No such user") throw new Error(e.message);
    }
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
