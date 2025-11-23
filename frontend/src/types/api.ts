import { z } from "zod";

const priceString = z
  .string()
  .regex(/^\d+(\.\d{1,2})?$/, {
    message: "Price must be a numeric string, optional 2 decimal places",
  });

const isoDateString = z
  .string()
  .refine((s) => !Number.isNaN(Date.parse(s)), { message: "Must be a valid date string" });


export const RegisterDtoSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(1, "Name is required"),
});
export type RegisterDto = z.infer<typeof RegisterDtoSchema>;

export const LoginDtoSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});
export type LoginDto = z.infer<typeof LoginDtoSchema>;

export const ForgotPasswordDtoSchema = z.object({
  email: z.string().email(),
});
export type ForgotPasswordDto = z.infer<typeof ForgotPasswordDtoSchema>;

export const ResetPasswordDtoSchema = z.object({
  token: z.string().min(1),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
});
export type ResetPasswordDto = z.infer<typeof ResetPasswordDtoSchema>;

export const ChangePasswordDtoSchema = z.object({
  email: z.string().email(),
  oldPassword: z.string().min(1),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
});
export type ChangePasswordDto = z.infer<typeof ChangePasswordDtoSchema>;

export const CreateItemDtoSchema = z.object({
  itemName: z.string().min(1, "Item name is required"),
  description: z.string().optional(),
  quantity: z.number().int().positive(),
  unitPrice: priceString,
  tax: priceString.optional(),
});
export type CreateItemDto = z.infer<typeof CreateItemDtoSchema>;

export const CreateQuotationDtoSchema = z.object({
  clientName: z.string().min(1, "Client name required"),
  clientEmail: z.string().email(),
  validityDate: isoDateString.optional(),
  items: z.array(CreateItemDtoSchema).min(1, "At least one item is required"),
});
export type CreateQuotationDto = z.infer<typeof CreateQuotationDtoSchema>;

export const UpdateQuotationDtoSchema = z.object({
  validityDate: isoDateString.optional(),
  items: z.array(CreateItemDtoSchema).optional(),
});
export type UpdateQuotationDto = z.infer<typeof UpdateQuotationDtoSchema>;

export const ClientActionDtoSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED"]),
  comment: z.string().optional(),
});
export type ClientActionDto = z.infer<typeof ClientActionDtoSchema>;

export const UserProfileSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string(),
});
export type UserProfile = z.infer<typeof UserProfileSchema>;
