import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { getToken, isAuthenticated } from '../utils/helpers';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà authentifié au chargement
    const token = getToken();
    if (token && isAuthenticated()) {
      try {
        const decoded = jwtDecode(token);
        setUser({
          username: decoded.sub,
          role: decoded.role,
          userId: decoded.userId,
        });
      } catch (error) {
        console.error('Error decoding token:', error);
        authService.logout();
      }
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    const result = await authService.login(username, password);
    if (result.success) {
      try {
        const decoded = jwtDecode(result.token);
        setUser({
          username: decoded.sub,
          role: decoded.role,
          userId: decoded.userId,
        });
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
    return result;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'ADMIN',
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

