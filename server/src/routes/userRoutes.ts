import express from "express";
import {
  authorizeRoles,
  authenticateToken,
} from "../middlewares/authMiddleware";
import {
  loginUser,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/userControllers";

const router = express.Router();

router.post("/register", createUser);
router.post("/login", loginUser);

router.get(
  "/",
  authenticateToken,
  authorizeRoles("admin-seller", "seller"),
  getUsers
); // Only admins
router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles("admin-seller"),
  deleteUser
); // Only admins
router.put(
  "/:id",
  authenticateToken,
  authorizeRoles("seller", "admin-seller"),
  updateUser
); // User or Admin

export default router;
