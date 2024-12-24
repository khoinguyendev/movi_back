import * as bcrypt from 'bcrypt';
const saltRounds = 10;

export const hashPassword = (password: string) => {
  try {
    return bcrypt.hashSync(password, saltRounds);
  } catch (e) {
    console.log(e);
  }
};

export const comparePassword = (
  plainPassword: string,
  hashPassword: string,
) => {
  try {
    return bcrypt.compareSync(plainPassword, hashPassword);
  } catch (e) {
    console.log(e);
  }
};
export const generateRandomSixDigits = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};
