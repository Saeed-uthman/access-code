import axios, { AxiosError } from 'axios';

export function extractApiError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const axiosErr = error as AxiosError<{ error?: string; message?: string; detail?: string; [key: string]: unknown }>;
    const data = axiosErr.response?.data;
    if (!data) return 'Network error. Please check your connection.';

    if (typeof data === 'string') return data;
    if (data.error) return data.error;
    if (data.message) return data.message;
    if (data.detail) return data.detail;

    const firstField = Object.keys(data).find((k) => k !== 'non_field_errors');
    if (firstField && Array.isArray(data[firstField])) {
      return `${firstField.replace(/_/g, ' ')}: ${(data[firstField] as string[])[0]}`;
    }

    if (typeof data === 'object' && data.non_field_errors && Array.isArray(data.non_field_errors)) {
      return (data.non_field_errors as string[])[0];
    }

    return 'An unexpected error occurred. Please try again.';
  }
  if (error instanceof Error) return error.message;
  return 'An unexpected error occurred. Please try again.';
}
