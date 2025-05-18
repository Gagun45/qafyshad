"use server";

import { dbConnect } from "../dbconnect";
import { EditPasswordMessages, SMTH_WENT_WRONG } from "../errors";
import { hashPassword, verifyPassword } from "../hashPassword";
import { User } from "../models";
import type { AuthResult } from "../types";

export const editPassword = async (
  oldPassword: string,
  newPassword: string,
  userID?: string,
): Promise<AuthResult> => {
  try {
    if (oldPassword.length < 8 || oldPassword.length > 24)
      return {
        success: false,
        message: EditPasswordMessages.OLD_PASSWORD_INVALID,
      };
    if (newPassword.length < 8 || newPassword.length > 24)
      return {
        success: false,
        message: EditPasswordMessages.NEW_PASSWORD_INVALID,
      };

    if (oldPassword === newPassword)
      return {
        success: false,
        message: EditPasswordMessages.PASSWORDS_MATCH,
      };

    if (!userID)
      return { success: false, message: EditPasswordMessages.ACCESS_DENIED };
    await dbConnect();
    const user = await User.findById(userID);
    if (!user)
      return { success: false, message: EditPasswordMessages.USER_NOT_FOUND };

    if (!verifyPassword(oldPassword, user.password))
      return {
        success: false,
        message: EditPasswordMessages.OLD_PASSWORD_WRONG,
      };

    const hashedPassword = hashPassword(newPassword);
    user.password = hashedPassword;
    await user.save();

    return {
      success: true,
      message: EditPasswordMessages.SUCCESS_EDIT_PASSWORD,
    };
  } catch (e) {
    console.log("Edit password error: ", e);
    return { success: false, message: SMTH_WENT_WRONG };
  }
};
