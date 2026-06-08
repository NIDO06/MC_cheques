/**
 * Contexte d'authentification globale
 * Permet de partager l'état utilisateur dans toute l'application
 */

'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useAuth, type UseAuthReturn } from '@/lib/useAuth';

interface AuthContextType extends UseAuthReturn {}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuth();

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export function useAuthContext(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext doit être utilisé dans un AuthProvider');
  }
  return context;
}
