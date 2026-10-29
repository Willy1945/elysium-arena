import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { authService } from '../api/authService';

const AuthContext = createContext(null);

function normalizeUser(rawUser) {
  if (!rawUser) return null;
  return {
    ...rawUser,
    role: rawUser.role?.name || rawUser.role,
  };
}

export function AuthProvider({ children }) {
  const [user, setRawUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? normalizeUser(JSON.parse(stored)) : null;
  });

  const setUser = useCallback((rawUser) => {
    const normalized = normalizeUser(rawUser);
    if (normalized) {
      localStorage.setItem('user', JSON.stringify(normalized));
    } else {
      localStorage.removeItem('user');
    }
    setRawUser(normalized);
  }, []);

  const login = useCallback(async (credentials) => {
    const { data } = await authService.login(credentials);
    localStorage.setItem('token', data.token);
    setUser(data.user);
    return normalizeUser(data.user);
  }, [setUser]);

  const register = useCallback(async (payload) => {
    const { data } = await authService.register(payload);
    localStorage.setItem('token', data.token);
    setUser(data.user);
    return normalizeUser(data.user);
  }, [setUser]);

  const loginWithToken = useCallback((userData, token) => {
    localStorage.setItem('token', token);
    const normalized = normalizeUser(userData);
    if (normalized) {
      localStorage.setItem('user', JSON.stringify(normalized));
    }
    setRawUser(normalized);
    return normalized;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (e) {
    }
    localStorage.removeItem('token');
    setUser(null);
  }, [setUser]);

  const value = useMemo(() => ({
    user,
    setUser,
    login,
    register,
    logout,
    loginWithToken,
  }), [user, setUser, login, register, logout, loginWithToken]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth harus dipakai di dalam AuthProvider');
  }
  return context;
}
