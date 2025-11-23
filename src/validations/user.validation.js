import { z } from "zod";

export const updateUserSchema = z.object({
    email: z.string().email().optional(),
    full_name: z.string().min(2).optional(),
    role: z.enum(["admin", "client", "supplier"]).optional(),
}).refine(
    (data) => Object.keys(data).length > 0,
    { message: "Kamida bitta maydon o'zgartirilishi kerak" }
);
