/**
 * Configuration de l'application
 */

export const APP_CONFIG = {
  // Noms de l'application
  appName: process.env.NEXT_PUBLIC_APP_NAME || 'M.C CHEQUES',
  
  // URLs
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  
  // Rôles utilisateur
  roles: {
    SUPER_ADMIN: 'super-admin',
    ADMIN: 'admin',
    AGENT: 'agent',
    CLIENT: 'client',
  },
  
  // Routes de redirection par rôle
  roleRoutes: {
    'super-admin': '/super-admin/dashboard',
    'super_admin': '/super-admin/dashboard',
    'admin': '/admin/dashboard',
    'agent': '/agent/dashboard',
    'client': '/client/dashboard',
  },
  
  // Permissions
  permissions: {
    CHEQUE_VIEW: 'cheque.view',
    CHEQUE_CREATE: 'cheque.create',
    CHEQUE_UPDATE: 'cheque.update',
    CHEQUE_DELETE: 'cheque.delete',
    AGENCY_MANAGE: 'agency.manage',
    BANK_MANAGE: 'bank.manage',
    FILE_MANAGE: 'file.manage',
  },
};

/**
 * Récupère la route de redirection basée sur les rôles
 */
export function getRedirectRouteForRoles(roles?: string[]): string {
  if (!roles || roles.length === 0) {
    return APP_CONFIG.roleRoutes['client'];
  }

  // Chercher la première correspondance (ordre de priorité)
  const priorityRoles = ['super-admin', 'super_admin', 'admin', 'agent', 'client'];
  
  for (const role of priorityRoles) {
    if (roles.map(r => r.toLowerCase()).includes(role)) {
      return APP_CONFIG.roleRoutes[role as keyof typeof APP_CONFIG.roleRoutes] 
        || APP_CONFIG.roleRoutes['client'];
    }
  }

  return APP_CONFIG.roleRoutes['client'];
}

/**
 * Vérifie si l'utilisateur a un rôle spécifique
 */
export function hasRole(userRoles?: string[], requiredRole?: string): boolean {
  if (!userRoles || !requiredRole) return false;
  return userRoles.map(r => r.toLowerCase()).includes(requiredRole.toLowerCase());
}

/**
 * Vérifie si l'utilisateur a au moins un des rôles spécifiés
 */
export function hasAnyRole(userRoles?: string[], requiredRoles?: string[]): boolean {
  if (!userRoles || !requiredRoles || requiredRoles.length === 0) return false;
  const normalizedUserRoles = userRoles.map(r => r.toLowerCase());
  return requiredRoles.some(role => normalizedUserRoles.includes(role.toLowerCase()));
}

/**
 * Vérifie si l'utilisateur a une permission spécifique
 */
export function hasPermission(permissions?: string[], requiredPermission?: string): boolean {
  if (!permissions || !requiredPermission) return false;
  return permissions.map(p => p.toLowerCase()).includes(requiredPermission.toLowerCase());
}
