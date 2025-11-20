export interface RegisterDto {
  email: string;
  password: string;
  name: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface ForgotPasswordDto {
  email: string;
}

export interface ResetPasswordDto {
  token: string;
  newPassword: string;
}

export interface ChangePasswordDto {
  email: string;
  oldPassword: string;
  newPassword: string;
}

export interface CreateItemDto {
  itemName: string;
  description?: string;
  quantity: number;
  unitPrice: string;
  tax?: string;
}

export interface CreateQuotationDto {
  clientName: string;
  clientEmail: string;
  validityDate?: string;
  items: CreateItemDto[];
}

export interface UpdateQuotationDto {
  validityDate?: string;
  items?: CreateItemDto[];
}

export interface ClientActionDto {
  status: "APPROVED" | "REJECTED";
  comment?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
}
