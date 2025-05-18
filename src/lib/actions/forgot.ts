'use server'

import { dbConnect } from "../dbconnect";
import { User } from "../models";
import crypto from "crypto";
import type { AuthResult } from "../types";
import { ForgotMessages, SMTH_WENT_WRONG } from "../errors";
import validator from "validator";
import { sendForgotLink } from "../helper";

export const forgot = async (email: string): Promise<AuthResult> => {
  try {
    if (!validator.isEmail(email))
      return { success: false, message: ForgotMessages.EMAIL_INVALID };
    await dbConnect();
    const user = await User.findOne({ email });
    if (!user) return { success: false, message: ForgotMessages.WRONG_EMAIL };
    const newToken = crypto.randomBytes(32).toString("hex");
    const expiryDate = new Date(Date.now() + 3600000);
    user.resetPasswordToken = newToken;
    user.resetPasswordTokenExpiry = expiryDate;
    await user.save();
    await sendForgotLink(email, newToken);
    return { success: true, message: ForgotMessages.SUCCESS_FORGOT_PASSWORD };
  } catch {
    return { success: false, message: SMTH_WENT_WRONG };
  }
};
