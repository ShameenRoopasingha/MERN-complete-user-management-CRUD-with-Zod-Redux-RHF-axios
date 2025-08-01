import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("A valid email required"),
  password: z.string().min(1, "password required"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;