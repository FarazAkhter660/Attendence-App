import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type {AuthUser} from '../types';
import {initializeDatabase} from '../database/database';
import * as authService from '../services/authService';
import {toUserMessage} from '../utils/errors';

interface AuthContextValue {
  user: AuthUser | null;
  ready: boolean;
  login: (employeeId: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({children}: {children: React.ReactNode}) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        await initializeDatabase();
        const session = await authService.getSession();
        setUser(session);
      } catch (error) {
        console.warn('Failed to initialize app', toUserMessage(error));
      } finally {
        setReady(true);
      }
    };
    bootstrap();
  }, []);

  const login = useCallback(async (employeeId: string, password: string) => {
    const nextUser = await authService.login(employeeId, password);
    setUser(nextUser);
  }, []);

  const logout = useCallback(async () => {
    await authService.clearSession();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({user, ready, login, logout}),
    [user, ready, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
