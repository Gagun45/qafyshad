"use server";

import { dbConnect } from "../dbconnect";
import { RegisterMessages, SMTH_WENT_WRONG } from "../errors";
import { hashPassword } from "../hashPassword";
import { User } from "../models";
import type { AuthResult, RegisterFormDataType } from "../types";
import validator from "validator";

export const register = async (
  data: RegisterFormDataType
): Promise<AuthResult> => {
  try {
    const { email, password } = data;
    if (!validator.isEmail(email))
      return { success: false, message: RegisterMessages.EMAIL_INVALID };

    if (password.length < 8 || password.length > 24)
      return {
        success: false,
        message: RegisterMessages.PASSWORD_INVALID,
      };
    await dbConnect();
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return { success: false, message: RegisterMessages.EMAIL_TAKEN };

    const hashedPassword = hashPassword(password);

    await User.create({
      email,
      password: hashedPassword,
    });
    return { success: true, message: RegisterMessages.SUCCESS_REGISTER };
  } catch {
    return {
      success: false,
      message: SMTH_WENT_WRONG,
    };
  }
};
