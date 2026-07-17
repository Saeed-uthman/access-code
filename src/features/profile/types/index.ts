export interface ProfileUpdateRequest {
  full_name?: string;
  phone_number?: string;
  address?: string;
  date_of_birth?: string;
}

export interface ChangePasswordRequest {
  old_password: string;
  new_password: string;
  new_password_confirm: string;
}
