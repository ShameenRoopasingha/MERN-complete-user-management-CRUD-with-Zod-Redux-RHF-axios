import { Request, Response } from "express";
import User from "../models/userModel";
import { userSchema } from "../schemas/userSchema";
import { validateWithZod } from "../utils/validateWithZod";
import {
  verifyPassword,
  hashPassword,
  generateToken,
} from "../helpers/authHelpers";
import { updateRoleIfAdmin } from "../helpers/roleHelpers";
import { validatePasswordChange } from "../helpers/validationHelpers";

// Extend Express Request interface to include user info
interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: string;
  };
}

// ✅ LOGIN
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  const isMatch = await verifyPassword(password, user.password);
  if (!isMatch) {
    res.status(401).json({ message: "Invalid credentials" });
    return;
  }

  const token = generateToken(user);

  res.json({
    _id: user._id,
    role: user.role,
    username: user.username,
    email: user.email,
    token,
  });
};

// ✅ REGISTER
export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const data = validateWithZod(userSchema, req.body);
    const userExist = await User.findOne({ email: data.email });
    if (userExist) {
      res.status(409).json({ message: "Email already exists" });
      return;
    }
    const newUser = await User.create(data);
    res.status(201).json(newUser);
  } catch (e: any) {
    res
      .status(e.status ?? 500)
      .json({ message: e.message || "Something went wrong" });
  }
};

// ✅ GET ALL USERS
export const getUsers = async (req: Request, res: Response): Promise<void> => {
  const users = await User.find().lean();
  res.json(users);
};

// ✅ UPDATE USER
export const updateUser = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const {
      username,
      email,
      role,
      currentPassword,
      newPassword,
      confirmNewPassword,
    } = req.body;

    const userToUpdate = await User.findById(req.params.id);
    if (!userToUpdate) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const isSelfUpdate = req.user?.userId === userToUpdate._id.toString();
    const isAdmin = req.user?.role === "admin-seller";

    if (
      !validateAdminPermissions({
        req,
        res,
        userToUpdate,
        isSelfUpdate,
        isAdmin,
        hasRestrictedFields: !!(username || email || newPassword),
      })
    ) {
      return;
    }

    if (
      !(await validatePasswordRequirements(
        req,
        res,
        userToUpdate,
        currentPassword,
        newPassword,
        confirmNewPassword,
        role
      ))
    ) {
      return;
    }

    await updateUserFields(userToUpdate, username, email, newPassword, role);

    await userToUpdate.save();

    const token = generateToken(userToUpdate);

    res.json({
      _id: userToUpdate._id,
      username: userToUpdate.username,
      email: userToUpdate.email,
      role: userToUpdate.role,
      token,
      message: "User updated successfully",
    });
  } catch (e: any) {
    res.status(500).json({ message: e.message ?? "Something went wrong" });
  }
};

// ✅ DELETE USER
export const deleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }
  res.json({ message: "User deleted" });
};

// 🧩 Helper: Admin permissions validator
const validateAdminPermissions = ({
  req,
  res,
  userToUpdate,
  isSelfUpdate,
  isAdmin,
  hasRestrictedFields,
}: {
  req: AuthenticatedRequest;
  res: Response;
  userToUpdate: any;
  isSelfUpdate: boolean;
  isAdmin: boolean;
  hasRestrictedFields: boolean;
}): boolean => {
  if (userToUpdate.role === "admin-seller" && !isSelfUpdate) {
    res.status(403).json({ message: "Cannot update other admin user details" });
    return false;
  }

  if (isAdmin && !isSelfUpdate && hasRestrictedFields) {
    res.status(403).json({
      message: "Admin cannot change username, email, or password of other users",
    });
    return false;
  }

  return true;
};

// 🧩 Helper: Password + Role requirements validator
const validatePasswordRequirements = async (
  req: AuthenticatedRequest,
  res: Response,
  userToUpdate: any,
  currentPassword?: string,
  newPassword?: string,
  confirmNewPassword?: string,
  role?: string
): Promise<boolean> => {
  if ((newPassword || role) && !currentPassword) {
    res.status(400).json({ message: "Current password required for this update" });
    return false;
  }

  if (currentPassword) {
    const isMatch = await verifyPassword(currentPassword, userToUpdate.password);
    if (!isMatch) {
      res.status(400).json({ message: "Current password is incorrect" });
      return false;
    }
  }

  if (newPassword && !validatePasswordChange(newPassword, confirmNewPassword, res)) {
    return false;
  }

  const roleError = updateRoleIfAdmin(req, userToUpdate, role);
  if (roleError) {
    res.status(403).json({ message: roleError });
    return false;
  }

  if (req.user?.role !== "admin-seller" && role && role !== userToUpdate.role) {
    res.status(403).json({ message: "You cannot change your role" });
    return false;
  }

  return true;
};

// 🧩 Helper: Apply field updates
const updateUserFields = async (
  userToUpdate: any,
  username?: string,
  email?: string,
  newPassword?: string,
  role?: string
): Promise<void> => {
  if (username) userToUpdate.username = username;
  if (email) userToUpdate.email = email;
  if (newPassword) userToUpdate.password = await hashPassword(newPassword); // ✅ FIXED HERE
  if (role) userToUpdate.role = role;
};
