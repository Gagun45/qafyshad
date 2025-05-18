"use server";

import { dbConnect } from "../dbconnect";
import { ResetMessages, SMTH_WENT_WRONG } from "../errors";
import { hashPassword } from "../hashPassword";
import { User } from "../models";
import type { AuthResult } from "../types";

export const reset = async (
  password: string,
  resetPasswordToken: string
): Promise<AuthResult> => {
  try {
    if (password.length < 8 || password.length > 24)
      return { success: false, message: ResetMessages.PASSWORD_INVALID };
    await dbConnect();
    const user = await User.findOne({ resetPasswordToken });
    if (!user)
      return { success: false, message: ResetMessages.RESET_TOKEN_INVALID };
    user.password = hashPassword(password);
    user.resetPasswordToken = null;
    user.resetPasswordTokenExpiry = null;
    await user.save();
    return { success: true, message: ResetMessages.SUCCESS_RESET_PASSWORD };
  } catch {
    return { success: false, message: SMTH_WENT_WRONG };
  }
};
