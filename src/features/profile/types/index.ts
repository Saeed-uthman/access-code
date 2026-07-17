export interface ProfileUpdateRequest {
  full_name?: string;
  phone_number?: string;
}

export interface ProfileDetailsUpdateRequest {
  address?: string;
  date_of_birth?: string;
}

export interface ChangePasswordRequest {
  old_password: string;
  new_password: string;
  confirm_new_password: string;
}
