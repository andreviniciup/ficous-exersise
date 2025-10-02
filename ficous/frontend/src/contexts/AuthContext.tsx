/**
 * Contexto de autenticação para Ficous
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '../services/api';

interface User {
  id: string;
  email?: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user?: User) => void;
  logout: () => void;
  setUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Verificar se há token válido no localStorage
  useEffect(() => {
    const token = localStorage.getItem('ficous_token');
    if (token) {
      // Verificar se o token é válido fazendo uma requisição de teste
      // Por enquanto, vamos assumir que se há token, o usuário está autenticado
      // Em um ambiente real, você faria uma requisição para validar o token
      setUser({ id: 'default-user' });
      api.setToken(token);
    }
    setIsLoading(false);
  }, []);

  const login = (token: string, userData?: User) => {
    api.setToken(token);
    if (userData) {
      setUser(userData);
    } else {
      // Se não fornecido, criar usuário padrão
      setUser({ id: 'default-user' });
    }
  };

  const logout = () => {
    api.clearToken();
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    setUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}

// Hook para verificar se o usuário está autenticado
export function useRequireAuth() {
  const { isAuthenticated, isLoading } = useAuth();
  
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Redirecionar para login ou mostrar modal de login
      console.log('Usuário não autenticado');
    }
  }, [isAuthenticated, isLoading]);

  return { isAuthenticated, isLoading };
}
