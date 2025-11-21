import Joi from "joi";

export const createUserSchema = Joi.object({
    full_name: Joi.string().min(3).required(),
    phone_number: Joi.string().optional(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    roles: Joi.string().valid('ADMIN', 'DELIVERY_STAFF', 'CUSTOMER').optional(),
});

export const updateUserSchema = Joi.object({
    full_name: Joi.string().min(3).optional(),
    email: Joi.string().email().optional(),
    password: Joi.string().min(6).optional(),
    phone_number: Joi.string().optional(),
});

export const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
})

export const customerValidate = Joi.object({
    full_name: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    phone_number: Joi.string().optional(),
});

export const loginValidate = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
});
