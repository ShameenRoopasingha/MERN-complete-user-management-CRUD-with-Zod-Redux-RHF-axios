import z from "zod";

export const userSchema = z.object({
  username: z.string().min(1, "Insert username"),
  role: z.enum(["admin-seller", "seller", "supplier", "customer"], {
    required_error: "Select a role",
  }),
  email: z.string().email("Insert email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type UserFormValues = z.infer<typeof userSchema>;
