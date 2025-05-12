"use server";

import { dbConnect } from "./dbconnect";
import { User } from "./models";

export type RegisterFormDataType = {
  email: string;
  password: string;
  passwordConfirm: string;
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
