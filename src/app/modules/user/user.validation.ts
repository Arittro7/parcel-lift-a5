
import z from "zod";
import { Divisions, Role } from "./user.interface";

export const createUserZodSchema = z.object({
  name: z.string({ error: "name must be string" }),
  email: z.email({ error: "invalid email type" }),
 password: z
    .string({error: "Password must be string" })
    .min(8, { message: "Password must be at least 8 characters long." })
    .regex(/^(?=.*[A-Z])/, {
      message: "Password must contain at least 1 uppercase letter.",
    })
    .regex(/^(?=.*[!@#$%^&*])/, {
      message: "Password must contain at least 1 special character.",
    })
    .regex(/^(?=.*\d)/, {
      message: "Password must contain at least 1 number.",
    }).optional(),
  picture: z.url().optional(),
  phone: z
    .string({ error: "Phone number must be a string" })
    .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
      message:
        "Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX",
    })
    .optional(),
  role: z.enum(Object.values(Role)),
  address: z
    .object({
      division: z.enum(Object.values(Divisions)),
      city: z.string({ error: "city should be string" }),
      zip: z
        .number({ error: "zip code must be in number" })
        .min(4, { message: "zip code must be of 4 digits" })
        .max(4, { message: "zip code cannot be larger than 4 digits" }),
      street: z.string({ error: "street should be string" }),
    })
    .optional(),
});

export const updateUserZodSchema = z.object({
  name: z.string({ error: "name must be a string" }).optional(),
  email: z.email({ error: "email is not valid" }).optional(),
  picture: z.url({ error: "Invalid url" }).optional(),
  address: z
    .object({
      division: z.enum(Object.values(Divisions)),
      city: z.string({ error: "city should be string" }),
      zip: z
        .number({ error: "zip code must be in number" })
        .min(1000, { message: "zip code must be of 4 digits" })
        .max(9999, { message: "zip code cannot be larger than 4 digits" }),
      street: z.string({ error: "street should be string" }),
    })
    .optional(),
  phone: z
    .string({ error: "Phone number must be a string" })
    .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
      message:
        "Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX",
    })
    .optional(),
});