import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
// import User from "../models/userModel";

export const verifyPassword = async (
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(plainPassword, hashedPassword);
};

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 10);
};

export const generateToken = (user: {
  _id: any;
  role: string;
  email: string;
}): string => {
  return jwt.sign(
    { userId: user._id, role: user.role, email: user.email },
    process.env.JWT_SECRET!,
    { expiresIn: "1d" }
  );
};
