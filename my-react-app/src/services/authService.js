import api from './api';
import { API_ENDPOINTS } from '../config/api';
import { setToken, removeToken } from '../utils/helpers';

/**
 * Service d'authentification
 */
export const authService = {
  /**
   * Connexion
   */
  login: async (username, password) => {
    try {
      const response = await api.post(API_ENDPOINTS.LOGIN, {
        username,
        password,
      });
      
      const token = response.data;
      setToken(token);
      
      return { success: true, token };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur de connexion',
      };
    }
  },

  /**
   * Inscription
   */
  signup: async (signupData, token) => {
    try {
      await api.post(`${API_ENDPOINTS.SIGNUP}?token=${token}`, signupData);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de l\'inscription',
      };
    }
  },

  /**
   * Déconnexion
   */
  logout: () => {
    removeToken();
  },
};

