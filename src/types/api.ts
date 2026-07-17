export interface PaginationParams {
  page?: number;
  page_size?: number;
  search?: string;
  ordering?: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: 'success' | 'error';
}

export interface ApiError {
  detail?: string;
  message?: string;
  errors?: Record<string, string[] | string>;
  status_code?: number;
}

export interface TokenPair {
  access: string;
  refresh: string;
}

export interface LoginResponse {
  user: import('./models').User;
  tokens: TokenPair;
}

export interface RegisterPayload {
  email: string;
  username: string;
  full_name: string;
  password: string;
  password_confirm: string;
  phone_number?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface VerifyOtpPayload {
  email: string;
  otp: string;
}

export interface ResendOtpPayload {
  email: string;
}

export interface PasswordResetPayload {
  email: string;
}

export interface PasswordResetConfirmPayload {
  uid: string;
  token: string;
  new_password: string;
  new_password_confirm: string;
}

export interface ChangePasswordPayload {
  old_password: string;
  new_password: string;
  new_password_confirm: string;
}

export interface UpdateProfilePayload {
  full_name?: string;
  phone_number?: string;
  address?: string;
  date_of_birth?: string;
}
