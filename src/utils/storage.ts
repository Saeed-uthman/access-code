export const storageKeys = {
  ACCESS_TOKEN: 'acs_access_token',
  REFRESH_TOKEN: 'acs_refresh_token',
  THEME: 'acs_theme',
  SIDEBAR: 'acs_sidebar',
} as const;

export function getItem<T>(key: string): T | null {
  try {
    const value = localStorage.getItem(key);
    if (value === null) return null;
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

export function setItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Failed to set item in localStorage: ${key}`, error);
  }
}

export function removeItem(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Failed to remove item from localStorage: ${key}`, error);
  }
}

export function getString(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function setString(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    console.error(`Failed to set string in localStorage: ${key}`, error);
  }
}
