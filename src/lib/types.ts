export type RegisterFormDataType = {
  email: string;
  password: string;
  passwordConfirm: string;
};

export type LoginFormDataType = {
  email: string;
  password: string;
};

export type AttachmentType = {
  file: File;
  url: string;
};

export type RequestDataType = {
  name: string;
  contact: string;
  device?: string;
  images?: AttachmentType[];
};

export type AuthResult = {
  success: boolean;
  message: string;
};

