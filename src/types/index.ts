import { z } from "zod"

export const SignUpSchema = z
  .object({
    username: z.string().min(2).max(50),
    email: z.string().email().max(255),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" }),
    confirmPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
export type SignupInput = z.infer<typeof SignUpSchema>;

export const SignInSchema = z.object({
  username: z.string().min(2).max(50),
  email: z.string().email().max(255),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
})
export type LoginInput = z.infer<typeof SignInSchema>;
