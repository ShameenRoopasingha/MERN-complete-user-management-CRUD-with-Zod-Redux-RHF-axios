import { Response } from "express";

export const validatePasswordChange = (
  newPassword: string | undefined,
  confirmNewPassword: string | undefined,
  res: Response
): boolean => {
  if (newPassword && newPassword !== confirmNewPassword) {
    res
      .status(400)
      .json({ message: "New password and confirmation do not match" });
    return false;
  }
  return true;
};
