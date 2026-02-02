'use client';

import { authApi, type LoginDto, type User } from '@/api/autnApi';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

type AuthContextType = {
  token: string | null;
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  login: (dto: LoginDto) => Promise<void>;
  logout: () => Promise<void>;
  setSession: (token: string, user?: User | null) => void;
  refreshMe: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

function safeParse<T>(value: string | null): T | null {
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUserLoading, setIsUserLoading] = useState(false);

  const isAuthenticated = Boolean(token);

  const setSession = useCallback((newToken: string, newUser?: User | null) => {
    setToken(newToken);
    localStorage.setItem(TOKEN_KEY, newToken);

    if (typeof newUser !== 'undefined') {
      setUser(newUser);

      if (newUser) localStorage.setItem(USER_KEY, JSON.stringify(newUser));
      else localStorage.removeItem(USER_KEY);
    }
  }, []);

  const clearSession = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }, []);

  const refreshMe = useCallback(async () => {
    if (!token) return;

    setIsUserLoading(true);
    try {
      const me = await authApi.me(token);
      setSession(token, me);
    } catch (e) {
      clearSession();
      throw e;
    } finally {
      setIsUserLoading(false);
    }
  }, [token, setSession, clearSession]);

  useEffect(() => {
    const savedToken = localStorage.getItem(TOKEN_KEY);
    const savedUser = safeParse<User>(localStorage.getItem(USER_KEY));

    setToken(savedToken);
    setUser(savedUser);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading && token) {
      refreshMe().catch(() => {});
    }
  }, [isLoading, token, refreshMe]);

  const login = useCallback(
    async (dto: LoginDto) => {
      const res = await authApi.login(dto);

      const newToken = res.accessToken;

      setSession(newToken, null);
      const me = await authApi.me(newToken);
      setSession(newToken, me);
    },
    [setSession],
  );

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } finally {
      clearSession();
    }
  }, [clearSession]);

  const value = useMemo<AuthContextType>(
    () => ({
      token,
      user,
      isLoading: isLoading || isUserLoading,
      isAuthenticated,
      login,
      logout,
      setSession,
      refreshMe,
    }),
    [token, user, isLoading, isAuthenticated, isUserLoading, login, logout, setSession, refreshMe],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
