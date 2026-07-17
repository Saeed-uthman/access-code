import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/types/models';
import type { TokenPair } from '@/types/api';
import { storageKeys } from '@/utils/storage';

interface AuthState {
  user: User | null;
  tokens: TokenPair | null;
  isAuthenticated: boolean;
  login: (user: User, tokens: TokenPair) => void;
  logout: () => void;
  setUser: (user: User) => void;
  setTokens: (tokens: TokenPair) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      tokens: null,
      isAuthenticated: false,
      login: (user: User, tokens: TokenPair) => {
        localStorage.setItem(storageKeys.ACCESS_TOKEN, tokens.access);
        localStorage.setItem(storageKeys.REFRESH_TOKEN, tokens.refresh);
        set({ user, tokens, isAuthenticated: true });
      },
      logout: () => {
        localStorage.removeItem(storageKeys.ACCESS_TOKEN);
        localStorage.removeItem(storageKeys.REFRESH_TOKEN);
        set({ user: null, tokens: null, isAuthenticated: false });
      },
      setUser: (user: User) => {
        set({ user });
      },
      setTokens: (tokens: TokenPair) => {
        localStorage.setItem(storageKeys.ACCESS_TOKEN, tokens.access);
        localStorage.setItem(storageKeys.REFRESH_TOKEN, tokens.refresh);
        set({ tokens });
      },
    }),
    {
      name: 'acs-auth',
      partialize: (state) => ({
        user: state.user,
        tokens: state.tokens,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
