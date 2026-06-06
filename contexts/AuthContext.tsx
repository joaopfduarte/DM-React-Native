import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { deleteToken, getToken, saveToken } from '@/services/auth.service';
import {
  clearUserProfile,
  getUserProfile,
  setUserProfile,
  StoredUserProfile,
} from '@/services/storage.service';
import { login as loginRequest, register as registerRequest } from '@/services/userService';
import { CreateUserPayload, LoginPayload, LoginResponse } from '@/types/user';

interface AuthContextValue {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: StoredUserProfile | null;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: CreateUserPayload) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<StoredUserProfile | null>(null);

  useEffect(() => {
    async function bootstrapAuth() {
      try {
        const token = await getToken();
        const profile = await getUserProfile();

        if (token && profile) {
          setIsAuthenticated(true);
          setUser(profile);
        }
      } finally {
        setIsLoading(false);
      }
    }

    bootstrapAuth();
  }, []);

  const login = useCallback(async (payload: LoginPayload) => {
    const response: LoginResponse = await loginRequest(payload);
    await saveToken(response.access_token);

    const existing = await getUserProfile();
    const profile: StoredUserProfile = {
      email: payload.email.trim(),
      name:
        existing?.email === payload.email.trim()
          ? existing.name
          : payload.email.split('@')[0],
    };

    await setUserProfile(profile);
    setUser(profile);
    setIsAuthenticated(true);
  }, []);

  const register = useCallback(async (payload: CreateUserPayload) => {
    await registerRequest(payload);

    const profile: StoredUserProfile = {
      name: payload.name.trim(),
      email: payload.email.trim(),
    };

    await setUserProfile(profile);
    setUser(profile);
    setIsAuthenticated(false);
  }, []);

  const logout = useCallback(async () => {
    await deleteToken();
    await clearUserProfile();
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const value = useMemo(
    () => ({ isAuthenticated, isLoading, user, login, register, logout }),
    [isAuthenticated, isLoading, user, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
}
