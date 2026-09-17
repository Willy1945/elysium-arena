import { createContext, useContext, useState, useEffect } from 'react';
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

  // Setiap kali user diubah dari manapun, WAJIB lewat sini — role selalu dinormalisasi otomatis
  const setUser = (rawUser) => {
    const normalized = normalizeUser(rawUser);
    if (normalized) {
      localStorage.setItem('user', JSON.stringify(normalized));
    } else {
      localStorage.removeItem('user');
    }
    setRawUser(normalized);
  };

  const login = async (credentials) => {
    const { data } = await authService.login(credentials);
    localStorage.setItem('token', data.token);
    setUser(data.user);
    return normalizeUser(data.user);
  };

  const register = async (payload) => {
    const { data } = await authService.register(payload);
    localStorage.setItem('token', data.token);
    setUser(data.user);
    return normalizeUser(data.user);
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (e) {
    }
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, register, logout }}>
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