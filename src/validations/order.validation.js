import { z } from "zod";

export const createOrderSchema = z.object({
    product_link: z
        .string()
        .trim()
        .url("Mahsulot linki noto'g'ri formatda")
        .nonempty("Mahsulot linki majburiy"),

    quantity: z
        .number()
        .int("Quantity butun son bo'lishi kerak")
        .positive("Quantity manfiy bo'lishi mumkin emas"),

    current_price: z
        .number()
        .positive("Narx 0 dan katta bo‘lishi kerak"),

    currency_type: z.enum(["UZS", "USD", "EUR"], {
        invalid_type_error: "Valyuta turi noto‘g‘ri",
    }),

    truck: z.string().trim().optional(),

    description: z.string().trim().optional(),
});

export const updateOrderSchema = z.object({
    product_link: z.string().trim().url().optional(),
    quantity: z.number().int().positive().optional(),
    current_price: z.number().positive().optional(),
    currency_type: z.enum(["UZS", "USD", "EUR"]).optional(),
    truck: z.string().trim().optional(),
    description: z.string().trim().optional(),
})
    .refine(data => Object.keys(data).length > 0, {
        message: "Yangilash uchun kamida 1 ta maydon bo'lishi kerak",
    });

export const updateStatusSchema = z.object({
    status: z.enum(["accepted", "in_progres", "delivered"], {
        invalid_type_error: "Status noto'g'ri",
    }),
});
