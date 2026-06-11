import { z } from "zod";

export const addressSchema = z.object({
  label: z.string().min(1, "Label required").max(50, "Too long"),
  full_name: z.string().min(2, "Name required").max(100, "Too long"),
  phone: z
    .string()
    .refine(
      (val) => /^(\+91[\s-]?)?[6-9]\d{9}$/.test(val),
      "Enter a valid Indian phone number"
    ),
  address_line_1: z.string().min(5, "Address required").max(200, "Too long"),
  address_line_2: z.string().max(200, "Too long").optional().or(z.literal("")),
  city: z.string().min(2, "City required").max(100, "Too long"),
  state: z.string().min(2, "State required").max(100, "Too long"),
  postal_code: z
    .string()
    .regex(/^\d{6}$/, "Enter a valid 6-digit PIN code"),
  country: z.string().default("India"),
  is_default: z.boolean().default(false),
});

export type AddressFormData = z.infer<typeof addressSchema>;
