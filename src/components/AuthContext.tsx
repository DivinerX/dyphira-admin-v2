import React, { createContext, useContext, useState } from 'react';
import { AuthState } from '../types';

const AuthContext = createContext<{
  auth: AuthState;
  login: (email: string, password: string) => void;
  logout: () => void;
} | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [auth, setAuth] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
  });

  const login = (email: string, password: string) => {
    // Simulate authentication
    setAuth({
      isAuthenticated: true,
      user: { email },
    });
  };

  const logout = () => {
    setAuth({
      isAuthenticated: false,
      user: null,
    });
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};