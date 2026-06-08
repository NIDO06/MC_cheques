/**
 * Services pour interagir avec les ressources API
 */

import { apiClient } from './api';

// Service pour les chèques
export const chequeService = {
  async getAll() {
    return apiClient.getCheques();
  },

  async getById(id: number) {
    return apiClient.getCheque(id);
  },

  async create(data: any) {
    return apiClient.createCheque(data);
  },

  async update(id: number, data: any) {
    return apiClient.updateCheque(id, data);
  },

  async delete(id: number) {
    return apiClient.deleteCheque(id);
  },
};

// Service pour les agences
export const agencyService = {
  async getAll() {
    return apiClient.getAgencies();
  },

  async getById(id: number) {
    const response = await apiClient['request']?.(`/agencies/${id}`) || 
      { data: null };
    return response.data;
  },

  async create(data: any) {
    const response = await apiClient['request']?.('/agencies', {
      method: 'POST',
      body: JSON.stringify(data),
    }) || { data: null };
    return response.data;
  },

  async update(id: number, data: any) {
    const response = await apiClient['request']?.(`/agencies/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }) || { data: null };
    return response.data;
  },

  async delete(id: number) {
    return apiClient['request']?.(`/agencies/${id}`, {
      method: 'DELETE',
    });
  },
};

// Service pour les banques
export const bankService = {
  async getAll() {
    return apiClient.getBanks();
  },

  async getById(id: number) {
    const response = await apiClient['request']?.(`/banks/${id}`) || 
      { data: null };
    return response.data;
  },

  async create(data: any) {
    const response = await apiClient['request']?.('/banks', {
      method: 'POST',
      body: JSON.stringify(data),
    }) || { data: null };
    return response.data;
  },

  async update(id: number, data: any) {
    const response = await apiClient['request']?.(`/banks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }) || { data: null };
    return response.data;
  },

  async delete(id: number) {
    return apiClient['request']?.(`/banks/${id}`, {
      method: 'DELETE',
    });
  },
};

// Service pour les clients
export const clientService = {
  async getAll() {
    return apiClient.getClients();
  },
};

// Service pour les statuts
export const statutService = {
  async getAll() {
    return apiClient.getStatuts();
  },

  async getById(id: number) {
    const response = await apiClient['request']?.(`/statuts/${id}`) || 
      { data: null };
    return response.data;
  },
};

// Service d'authentification
export const authService = {
  async login(email: string, password: string) {
    return apiClient.login({ email, password });
  },

  async logout() {
    return apiClient.logout();
  },

  async getCurrentUser() {
    return apiClient.getCurrentUser();
  },
};
