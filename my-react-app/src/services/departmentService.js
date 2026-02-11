import api from './api';
import { API_ENDPOINTS } from '../config/api';

/**
 * Service pour les départements
 */
export const departmentService = {
  /**
   * Récupérer tous les départements
   */
  getAll: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.DEPARTMENTS + '/list-departments');
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la récupération des départements',
      };
    }
  },

  /**
   * Récupérer un département par ID
   */
  getById: async (id) => {
    try {
      const response = await api.get(API_ENDPOINTS.DEPARTMENT_BY_ID(id));
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la récupération du département',
      };
    }
  },

  /**
   * Créer un département
   */
  create: async (departmentData) => {
    try {
      const response = await api.post(API_ENDPOINTS.CREATE_DEPARTMENT, departmentData);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la création du département',
      };
    }
  },

  /**
   * Mettre à jour un département
   */
  update: async (id, departmentData) => {
    try {
      const response = await api.put(API_ENDPOINTS.UPDATE_DEPARTMENT(id), departmentData);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la mise à jour du département',
      };
    }
  },

  /**
   * Supprimer un département
   */
  delete: async (id) => {
    try {
      await api.delete(API_ENDPOINTS.DELETE_DEPARTMENT(id));
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la suppression du département',
      };
    }
  },
};

