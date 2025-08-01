import { z } from "zod";

export const userSchema = z.object({
  username: z.string().min(1, "Insert username"),
  role: z
  .enum(["admin-seller", "seller", "supplier", "customer"], {
    errorMap: () => ({ message: "please select a valid role" }),
  })
  .default("seller"),
  email: z.string().email("Insert email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type UserInput = z.infer<typeof userSchema>;
