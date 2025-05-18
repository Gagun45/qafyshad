import bcrypt from "bcrypt";

export const hashPassword = (password: string) => {
  const saltRounds = 10;
  const hashedPassword = bcrypt.hashSync(password, saltRounds);
  return hashedPassword;
};

export const verifyPassword = (plain: string, hashed: string) => {
  const isMatch = bcrypt.compareSync(plain, hashed);
  return isMatch;
};
