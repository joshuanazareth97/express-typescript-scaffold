import * as bcrypt from "bcryptjs";

export const transformPassword = (password: string) => {
  return bcrypt.hashSync(password, 10);
};

export const verifyPassword = (
  enteredPassword: string,
  existingPassword: string
) => {
  return bcrypt.compareSync(enteredPassword, existingPassword);
};
