import api from './api';
import { API_ENDPOINTS } from '../config/api';

/**
 * Service pour les employés
 */
export const employeeService = {
  /**
   * Récupérer tous les employés
   */
  getAll: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.EMPLOYEES);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la récupération des employés',
      };
    }
  },

  /**
   * Récupérer un employé par ID
   */
  getById: async (id) => {
    try {
      const response = await api.get(API_ENDPOINTS.EMPLOYEE_BY_ID(id));
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la récupération de l\'employé',
      };
    }
  },

  /**
   * Récupérer l'employé de l'utilisateur connecté
   */
  getCurrentEmployee: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.CURRENT_EMPLOYEE);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la récupération de votre profil',
      };
    }
  },

  /**
   * Créer un employé
   */
  create: async (employeeData) => {
    try {
      const response = await api.post(API_ENDPOINTS.EMPLOYEES, employeeData);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la création de l\'employé',
      };
    }
  },

  /**
   * Mettre à jour un employé
   */
  update: async (id, employeeData) => {
    try {
      const response = await api.put(API_ENDPOINTS.EMPLOYEE_BY_ID(id), employeeData);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la mise à jour de l\'employé',
      };
    }
  },

  /**
   * Supprimer un employé
   */
  delete: async (id) => {
    try {
      await api.delete(API_ENDPOINTS.EMPLOYEE_BY_ID(id));
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la suppression de l\'employé',
      };
    }
  },
};

