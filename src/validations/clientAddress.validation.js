import { z } from "zod"

export const createAddressSchema = z.object({
    title: z.string().min(1, "Title is required"),
    region: z.string().min(1, "Region is required"),
    district: z.string().min(1, "District is required"),
    street: z.string().min(1, "Street is required"),
    house_number: z.string().min(1, "House number is required"),
    landmark: z.string().optional(),
    is_default: z.boolean().optional(),
})

export const updateAddressSchema = z.object({
    title: z.string().min(1).optional(),
    region: z.string().min(1).optional(),
    district: z.string().min(1).optional(),
    street: z.string().min(1).optional(),
    house_number: z.string().min(1).optional(),
    landmark: z.string().optional(),
    is_default: z.boolean().optional(),
})
