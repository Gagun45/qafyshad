"use server";

import { signIn } from "../auth";
import { dbConnect } from "../dbconnect";
import { LoginMessages, SMTH_WENT_WRONG } from "../errors";
import { verifyPassword } from "../hashPassword";
import { User } from "../models";
import type { AuthResult, LoginFormDataType } from "../types";
import validator from "validator";

export const login = async (data: LoginFormDataType): Promise<AuthResult> => {
  try {
    const { email, password } = data;
    if (!validator.isEmail(email))
      return { success: false, message: LoginMessages.EMAIL_INVALID };
    if (password.length < 8 || password.length > 24)
      return { success: false, message: LoginMessages.PASSWORD_INVALID };
    await dbConnect();

    const user = await User.findOne({ email });

    if (!user) return { success: false, message: LoginMessages.WRONG_EMAIL };

    if (!verifyPassword(password, user.password))
      return { success: false, message: LoginMessages.WRONG_PASSWORD };
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    return { success: true, message: LoginMessages.SUCCESS_LOGIN };
  } catch {
    return { success: false, message: SMTH_WENT_WRONG };
  }
};
