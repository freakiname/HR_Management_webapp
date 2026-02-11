import api from './api';
import { API_ENDPOINTS } from '../config/api';

/**
 * Service pour les demandes de congé
 */
export const leaveRequestService = {
  /**
   * Récupérer toutes les demandes de congé (ADMIN uniquement)
   */
  getAll: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.LEAVE_REQUESTS);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la récupération des demandes de congé',
      };
    }
  },

  /**
   * Récupérer les demandes de congé d'un employé
   */
  getByEmployeeId: async (employeeId) => {
    try {
      const response = await api.get(API_ENDPOINTS.LEAVE_REQUESTS_BY_EMPLOYEE(employeeId));
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la récupération des demandes de congé',
      };
    }
  },

  /**
   * Créer une demande de congé
   */
  create: async (employeeId, leaveRequestData) => {
    try {
      const response = await api.post(API_ENDPOINTS.LEAVE_REQUESTS_BY_EMPLOYEE(employeeId), leaveRequestData);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la création de la demande de congé',
      };
    }
  },

  /**
   * Mettre à jour une demande de congé
   */
  update: async (leaveRequestId, leaveRequestData) => {
    try {
      const response = await api.put(API_ENDPOINTS.UPDATE_LEAVE_REQUEST(leaveRequestId), leaveRequestData);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la mise à jour de la demande de congé',
      };
    }
  },
};

