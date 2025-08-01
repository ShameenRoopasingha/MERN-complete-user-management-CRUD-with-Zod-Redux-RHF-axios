import { ZodSchema } from "zod";

export const validateWithZod = <T>(schema: ZodSchema<T>, data: unknown) => {
  const result = schema.safeParse(data);

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    throw {
      status: 400,
      message: "validation failed",
      errors,
    };
  }
  return result.data;
};
