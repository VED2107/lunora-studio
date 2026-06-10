import { z } from "zod";

export const profileSchema = z.object({
  full_name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name too long"),
  phone_number: z
    .string()
    .refine(
      (val) =>
        val === "" || /^(\+91[\s-]?)?[6-9]\d{9}$/.test(val),
      "Enter a valid Indian phone number"
    ),
});

export type ProfileFormData = z.infer<typeof profileSchema>;
