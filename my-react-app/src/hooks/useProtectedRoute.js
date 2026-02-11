import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROUTES } from '../utils/constants';

/**
 * Hook pour protéger une route - redirige vers login si non authentifié
 */
export const useProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate(ROUTES.LOGIN);
    }
  }, [isAuthenticated, loading, navigate]);

  return { isAuthenticated, loading };
};

/**
 * Hook pour protéger une route admin - redirige si non admin
 */
export const useAdminRoute = () => {
  const { isAdmin, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        navigate(ROUTES.LOGIN);
      } else if (!isAdmin) {
        navigate(ROUTES.DASHBOARD);
      }
    }
  }, [isAdmin, isAuthenticated, loading, navigate]);

  return { isAdmin, isAuthenticated, loading };
};

