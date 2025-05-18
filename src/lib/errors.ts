export const SMTH_WENT_WRONG = "Something went wrong";

export enum RegisterCodes {
  EmailInvalid = "EMAIL_INVALID",
  EmailTaken = "EMAIL_TAKEN",
  PasswordInvalid = "PASSWORD_INVALID",
  Success = "SUCCESS_REGISTER",
}
export const RegisterMessages: Record<RegisterCodes, string> = {
  [RegisterCodes.EmailInvalid]: "Invalid email",
  [RegisterCodes.EmailTaken]: "The email is already taken",
  [RegisterCodes.PasswordInvalid]: "Invalid password",
  [RegisterCodes.Success]: "User registered successfully",
};

export enum LoginCodes {
  EmailInvalid = "EMAIL_INVALID",
  PasswordInvalid = "PASSWORD_INVALID",
  WrongEmail = "WRONG_EMAIL",
  WrongPassword = "WRONG_PASSWORD",
  Success = "SUCCESS_LOGIN",
}

export const LoginMessages: Record<LoginCodes, string> = {
  [LoginCodes.EmailInvalid]: "Invalid email",
  [LoginCodes.PasswordInvalid]: "Invalid password",
  [LoginCodes.WrongEmail]: "Wrong email",
  [LoginCodes.WrongPassword]: "Wrong password",
  [LoginCodes.Success]: "Logged in successfully",
};

export enum ForgotCodes {
  EmailInvalid = "EMAIL_INVALID",
  WrongEmail = "WRONG_EMAIL",
  Success = "SUCCESS_FORGOT_PASSWORD",
}

export const ForgotMessages: Record<ForgotCodes, string> = {
  [ForgotCodes.EmailInvalid]: "Invalid email",
  [ForgotCodes.WrongEmail]: "Wrong email",
  [ForgotCodes.Success]: "Reset link successfully sent",
};

export enum ResetCodes {
  PasswordInvalid = "PASSWORD_INVALID",
  ResetTokenInvalid = "RESET_TOKEN_INVALID",
  Success = "SUCCESS_RESET_PASSWORD",
}

export const ResetMessages: Record<ResetCodes, string> = {
  [ResetCodes.PasswordInvalid]: "Invalid password",
  [ResetCodes.ResetTokenInvalid]: "Invalid token",
  [ResetCodes.Success]: "Password has been successfully reset",
};

export enum RequestCodes {
  DataInvalid = "DATA_INVALID",
  SizeLimitExceed = "SIZE_LIMIT_EXCEED",
  Success = "SUCCESS_REQUEST",
}

export const RequestMessages: Record<RequestCodes, string> = {
  [RequestCodes.DataInvalid]: "Invalid data",
  [RequestCodes.SizeLimitExceed]: "Overall size limit exceeding",
  [RequestCodes.Success]: "Request has been successfully sent",
};

export enum EditPasswordCodes {
  OldPasswordInvalid = "OLD_PASSWORD_INVALID",
  NewPasswordInvalid = "NEW_PASSWORD_INVALID",
  OldPasswordWrong = "OLD_PASSWORD_WRONG",
  AccessDenied = "ACCESS_DENIED",
  UserNotFOund = "USER_NOT_FOUND",
  PasswordsMatch = "PASSWORDS_MATCH",
  Success = "SUCCESS_EDIT_PASSWORD",
}

export const EditPasswordMessages: Record<EditPasswordCodes, string> = {
  [EditPasswordCodes.OldPasswordInvalid]: "Old password invalid",
  [EditPasswordCodes.NewPasswordInvalid]: "New password invalid",
  [EditPasswordCodes.OldPasswordWrong]: "Wrong old password",
  [EditPasswordCodes.PasswordsMatch]: "Passwords must differ",
  [EditPasswordCodes.UserNotFOund]: "User not found",
  [EditPasswordCodes.AccessDenied]: "Access denied",
  [EditPasswordCodes.Success]: "New password has been successfully set",
};

export enum EditProfileCodes {
  AccessDenied = "ACCESS_DENIED",
  DataInvalid = "INVALID_DATA",
  UserNotFOund = "USER_NOT_FOUND",
  Success = "SUCCESS_EDIT_PROFILE",
}

export const EditProfileMessages: Record<EditProfileCodes, string> = {
  [EditProfileCodes.AccessDenied]: "Access denied",
  [EditProfileCodes.DataInvalid]: "Invalid data",
  [EditProfileCodes.UserNotFOund]: "User not found",
  [EditProfileCodes.Success]: "Data has been successfully edited",
};
