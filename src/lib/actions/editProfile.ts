'use server'

import { dbConnect } from "../dbconnect";
import {
  EditPasswordMessages,
  EditProfileMessages,
  SMTH_WENT_WRONG,
} from "../errors";
import { User } from "../models";
import type { AuthResult } from "../types";

export const editProfile = async (
  name: string,
  contact: string,
  userID?: string
): Promise<AuthResult> => {
  try {
    if (!userID)
      return { success: false, message: EditProfileMessages.ACCESS_DENIED };
    if (name.length > 120 || contact.length > 120)
      return { success: false, message: EditProfileMessages.INVALID_DATA };

    await dbConnect();
    const user = await User.findById(userID);
    if (!user)
      return { success: false, message: EditPasswordMessages.USER_NOT_FOUND };

    user.name = name;
    user.contact = contact;
    await user.save();
    return {
      success: true,
      message: EditProfileMessages.SUCCESS_EDIT_PROFILE,
    };
  } catch (e) {
    console.log("Edit profile error: ", e);
    return { success: false, message: SMTH_WENT_WRONG };
  }
};
