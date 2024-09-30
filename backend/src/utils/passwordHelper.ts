import bcrypt from "bcrypt";

export const hashPassword = async (
  orignalPassword: string
): Promise<string> => {
  const hashedPassword = await bcrypt.hash(orignalPassword, 16);
  return hashedPassword;
};
