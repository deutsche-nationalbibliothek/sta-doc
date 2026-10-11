import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  AuthUser,
  AppRole,
  fetchMe,
  hasRole,
  login as apiLogin,
  logout as apiLogout,
} from '@/lib/api/editor-client';
import { isEditorEnabled } from '@/lib/sta-editor-features';

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<string | undefined>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
  canEdit: boolean;
  hasRole: (role: AppRole) => boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const editorEnabled = isEditorEnabled();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(editorEnabled);

  const refresh = useCallback(async () => {
    if (!editorEnabled) {
      return;
    }
    const result = await fetchMe();
    setUser(result.data ?? null);
  }, [editorEnabled]);

  useEffect(() => {
    if (!editorEnabled) {
      setUser(null);
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const result = await fetchMe();
        if (!cancelled) {
          setUser(result.data ?? null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [editorEnabled]);

  const login = useCallback(async (username: string, password: string) => {
    if (!editorEnabled) {
      return 'Editor ist deaktiviert';
    }
    const result = await apiLogin(username, password);
    if (result.error || !result.data) {
      return result.error?.message || 'Login fehlgeschlagen';
    }
    setUser(result.data);
    return undefined;
  }, [editorEnabled]);

  const logout = useCallback(async () => {
    if (!editorEnabled) {
      return;
    }
    await apiLogout();
    setUser(null);
  }, [editorEnabled]);

  const value: AuthContextValue = {
    user,
    loading,
    login,
    logout,
    refresh,
    canEdit: editorEnabled && hasRole(user, 'EDITOR'),
    hasRole: (role) => editorEnabled && hasRole(user, role),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
