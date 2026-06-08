/**
 * Hook personnalisé pour gérer l'authentification
 * Fournit l'accès à l'utilisateur et aux fonctions d'authentification
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiClient, type User } from '@/lib/api';

export interface UseAuthReturn {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  refetchUser: () => Promise<User | null>;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Récupérer l'utilisateur lors du montage du composant
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const currentUser = await apiClient.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Erreur lors de l\'initialisation de l\'authentification:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = useCallback(
    async (email: string, password: string): Promise<User> => {
      setIsLoading(true);
      try {
        const { user: loggedInUser } = await apiClient.login({
          email,
          password,
        });
        setUser(loggedInUser);
        return loggedInUser;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await apiClient.logout();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refetchUser = useCallback(async () => {
    try {
      const currentUser = await apiClient.getCurrentUser();
      setUser(currentUser);
      return currentUser;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur:', error);
      return null;
    }
  }, []);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    refetchUser,
  };
}
