import { Request } from "express";

interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: string;
  };
}

/**
 * Checks and updates role only if requester is admin.
 * Returns an error message string if not allowed, else null.
 */
export const updateRoleIfAdmin = (
  req: AuthenticatedRequest,
  userToUpdate: any,
  newRole?: string
): string | null => {
  if (!newRole || newRole === userToUpdate.role) return null;

  const isAdmin = req.user?.role === "admin-seller";

  if (!isAdmin) return "Only admin can change user roles";

  userToUpdate.role = newRole;
  return null;
};
