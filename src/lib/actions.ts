"use server";

import { signIn } from "./auth";
import { dbConnect } from "./dbconnect";
import { User } from "./models";

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
