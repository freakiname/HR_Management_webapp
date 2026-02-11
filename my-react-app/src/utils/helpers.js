// Fonctions utilitaires

/**
 * Stocke le token dans le localStorage
 */
export const setToken = (token) => {
  localStorage.setItem('auth_token', token);
};

/**
 * Récupère le token du localStorage
 */
export const getToken = () => {
  return localStorage.getItem('auth_token');
};

/**
 * Supprime le token du localStorage
 */
export const removeToken = () => {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user_data');
};

/**
 * Vérifie si l'utilisateur est authentifié
 */
export const isAuthenticated = () => {
  return !!getToken();
};

/**
 * Formate une date
 */
export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Gère les erreurs API
 */
export const handleApiError = (error) => {
  if (error.response) {
    // Erreur de réponse du serveur
    return error.response.data?.message || error.response.statusText || 'Une erreur est survenue';
  } else if (error.request) {
    // Pas de réponse du serveur
    return 'Impossible de contacter le serveur';
  } else {
    // Erreur lors de la configuration de la requête
    return error.message || 'Une erreur est survenue';
  }
};

