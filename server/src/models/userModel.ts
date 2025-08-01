import mongoose, { Document } from "mongoose";
import { IUser } from "../types/userTypes";
import bcrypt from "bcrypt";

const userModel = new mongoose.Schema<IUser>({
  username: { type: String, required: true },
  role: {
    type: String,
    enum: ["admin-seller", "seller", "supplier", "customer"],
    required: true,
    default: "seller",
  },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// 🔐 Hash password only if not already hashed
userModel.pre("save", async function (next) {
  const user = this as IUser & Document;

  if (!user.isModified("password")) return next();

  // Avoid double hashing (only hash if it’s not already hashed)
  const isAlreadyHashed = user.password.startsWith("$2b$");
  if (isAlreadyHashed) return next();

  user.password = await bcrypt.hash(user.password, 10);
  next();
});

export default mongoose.model<IUser>("User", userModel);
