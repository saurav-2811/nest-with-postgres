import * as Bcrypt from 'bcryptjs';

export const passwordHasher = async (password: string): Promise<string> => {
  const stringPassword = await Bcrypt.hash(password, 10);
  return stringPassword;
};
