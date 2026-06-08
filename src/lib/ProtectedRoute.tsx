/**
 * Composant pour protéger les routes authentifiées
 * Redirige vers la connexion si l'utilisateur n'est pas authentifié
 */

'use client';

import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/useAuth';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRoles?: string[];
  fallback?: ReactNode;
}

export function ProtectedRoute({
  children,
  requiredRoles = [],
  fallback = <div className="min-h-screen flex items-center justify-center">Chargement...</div>,
}: ProtectedRouteProps) {
  const router = useRouter();
  const { user, isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return fallback;
  }

  if (!isAuthenticated) {
    router.push('/client/connexion');
    return null;
  }

  // Vérifier si l'utilisateur a les rôles requis
  if (requiredRoles.length > 0) {
    const hasRequiredRole = requiredRoles.some(role =>
      user?.roles?.includes(role)
    );

    if (!hasRequiredRole) {
      router.push('/client/accueil');
      return null;
    }
  }

  return <>{children}</>;
}
