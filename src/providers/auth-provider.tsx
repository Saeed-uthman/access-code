import { createContext, useContext, useEffect, useState } from 'react';
import { useAuthStore } from '@/store/auth-store';
import { get } from '@/lib/api-client';
import type { User } from '@/types/models';
import type { TokenPair } from '@/types/api';

interface AuthContextValue {
  isLoading: boolean;
  isInitialized: boolean;
}

const AuthContext = createContext<AuthContextValue>({
  isLoading: true,
  isInitialized: false,
});

export function useAuthContext() {
  return useContext(AuthContext);
}

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const { user, tokens, isAuthenticated, setUser, setTokens, logout } =
    useAuthStore();

  useEffect(() => {
    const initAuth = async () => {
      if (!tokens?.access) {
        setIsLoading(false);
        setIsInitialized(true);
        return;
      }

      try {
        const profile = await get<User>('/auth/profile/');
        setUser(profile);
      } catch {
        const refreshToken = tokens?.refresh;
        if (refreshToken) {
          try {
            const response = await fetch('/api/v1/auth/token/refresh/', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ refresh: refreshToken }),
            });

            if (response.ok) {
              const data: { access: string; refresh?: string } =
                await response.json();
              const newTokens: TokenPair = {
                access: data.access,
                refresh: data.refresh ?? refreshToken,
              };
              setTokens(newTokens);

              const profile = await get<User>('/auth/profile/');
              setUser(profile);
            } else {
              logout();
            }
          } catch {
            logout();
          }
        } else {
          logout();
        }
      } finally {
        setIsLoading(false);
        setIsInitialized(true);
      }
    };

    if (isAuthenticated && !user) {
      initAuth();
    } else {
      setIsLoading(false);
      setIsInitialized(true);
    }
  }, [isAuthenticated, user, tokens, setUser, setTokens, logout]);

  return (
    <AuthContext.Provider value={{ isLoading, isInitialized }}>
      {children}
    </AuthContext.Provider>
  );
}
