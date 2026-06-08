/**
 * Client API pour communiquer avec le backend Laravel
 * Gère l'authentification, les en-têtes et les erreurs
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export interface ApiResponse<T = any> {
  message?: string;
  data?: T;
  user?: any;
  errors?: Record<string, string[]>;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  is_active?: boolean;
  roles?: string[];
  permissions?: string[];
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * Effectue une requête HTTP générique
   */
  private async request<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const headers = new Headers({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });

    if (options.headers) {
      if (options.headers instanceof Headers) {
        options.headers.forEach((value, key) => headers.set(key, value));
      } else if (Array.isArray(options.headers)) {
        options.headers.forEach(([key, value]) => headers.set(key, value));
      } else {
        Object.entries(options.headers).forEach(([key, value]) => {
          if (value !== undefined) headers.set(key, String(value));
        });
      }
    }

    // Ajouter le token CSRF si disponible (pour Laravel)
    const csrfToken = this.getCsrfToken();
    if (csrfToken) {
      headers.set('X-CSRF-TOKEN', csrfToken);
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        credentials: 'include', // Inclure les cookies pour les sessions
      });

      // Essayer de parser le JSON
      let data;
      try {
        data = await response.json();
      } catch {
        // Si pas de JSON, créer une réponse générique
        data = { message: response.statusText };
      }

      if (Array.isArray(data)) {
        return { data } as ApiResponse<T>;
      }

      if (!response.ok) {
        const error = new Error(data.message || 'Erreur serveur') as any;
        error.status = response.status;
        error.errors = data.errors;
        error.message = data.message || 'Erreur serveur';
        throw error;
      }

      return data as ApiResponse<T>;
    } catch (error: any) {
      console.error(`API Error [${endpoint}]:`, error);
      throw error;
    }
  }

  /**
   * Récupère le token CSRF depuis les cookies ou le localStorage
   */
  private getCsrfToken(): string | null {
    if (typeof document === 'undefined') return null;
    
    // Chercher dans les cookies
    const name = 'XSRF-TOKEN';
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    
    return null;
  }

  /**
   * Authentifie un utilisateur
   */
  async login(payload: LoginPayload): Promise<{ user: User; message: string }> {
    const response = await this.request<User>('/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    if (response.user) {
      // Stocker les informations de l'utilisateur localement
      this.storeUserSession(response.user);
    }

    return {
      user: response.user || ({} as User),
      message: response.message || 'Connexion réussie',
    };
  }

  /**
   * Déconnecte l'utilisateur
   */
  async logout(): Promise<{ message: string }> {
    const response = await this.request<{ message: string }>('/logout', {
      method: 'POST',
    });

    // Nettoyer la session locale
    this.clearUserSession();

    return {
      message: response.message || 'Déconnexion réussie',
    };
  }

  /**
   * Récupère l'utilisateur actuellement connecté
   */
  async getCurrentUser(): Promise<User | null> {
    const stored = this.getUserSession();
    if (stored) return stored;

    try {
      const response = await this.request<User>('/user');
      if (response.data) {
        this.storeUserSession(response.data);
        return response.data;
      }
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur:', error);
    }

    return null;
  }

  /**
   * Récupère tous les chèques
   */
  async getCheques<T = any>(): Promise<T[]> {
    const response = await this.request<T[]>('/cheques');
    return response.data || [];
  }

  /**
   * Crée un nouveau chèque
   */
  async createCheque(data: any): Promise<any> {
    const response = await this.request('/cheques', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.data;
  }

  /**
   * Récupère un chèque par ID
   */
  async getCheque(id: number): Promise<any> {
    const response = await this.request(`/cheques/${id}`);
    return response.data;
  }

  /**
   * Met à jour un chèque
   */
  async updateCheque(id: number, data: any): Promise<any> {
    const response = await this.request(`/cheques/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response.data;
  }

  /**
   * Supprime un chèque
   */
  async deleteCheque(id: number): Promise<void> {
    await this.request(`/cheques/${id}`, {
      method: 'DELETE',
    });
  }

  /**
   * Récupère tous les statuts
   */
  async getStatuts(): Promise<any[]> {
    const response = await this.request('/statuts');
    return response.data || [];
  }

  /**
   * Récupère les agences
   */
  async getAgencies(): Promise<any[]> {
    const response = await this.request('/agencies');
    return response.data || [];
  }

  /**
   * Récupère les banques
   */
  async getBanks<T = any>(): Promise<T[]> {
    const response = await this.request<T[]>('/banks');
    return response.data || [];
  }

  async getClients<T = any>(): Promise<T[]> {
    const response = await this.request<T[]>('/clients');
    return response.data || [];
  }

  /**
   * Stocke la session utilisateur localement
   */
  private storeUserSession(user: User): void {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('user', JSON.stringify(user));
    }
  }

  /**
   * Récupère la session utilisateur stockée
   */
  private getUserSession(): User | null {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('user');
      return stored ? JSON.parse(stored) : null;
    }
    return null;
  }

  /**
   * Efface la session utilisateur
   */
  private clearUserSession(): void {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('user');
    }
  }

  /**
   * Détermine le rôle de l'utilisateur pour le routage
   */
  static getUserRole(user: User): string {
    if (user.roles?.includes('super-admin')) return 'super-admin';
    if (user.roles?.includes('admin')) return 'admin';
    if (user.roles?.includes('agent')) return 'agent';
    return 'client';
  }
}

// Exporter une instance unique
export const apiClient = new ApiClient();

export default apiClient;
