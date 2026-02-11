import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { departmentService } from '../../services/departmentService';
import { employeeService } from '../../services/employeeService';
import { ROUTES } from '../../utils/constants';
import Loading from '../../components/common/Loading';
import './Dashboard.css';

const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState({
    departments: 0,
    employees: 0,
    loading: true,
  });
  const [currentEmployee, setCurrentEmployee] = useState(null);
  const [loadingEmployee, setLoadingEmployee] = useState(false);

  useEffect(() => {
    loadStats();
    if (!isAdmin) {
      loadCurrentEmployee();
    }
  }, []);

  const loadStats = async () => {
    try {
      const [deptResult, empResult] = await Promise.all([
        departmentService.getAll(),
        isAdmin ? employeeService.getAll() : Promise.resolve({ success: false }),
      ]);

      setStats({
        departments: deptResult.success ? deptResult.data.length : 0,
        employees: empResult.success ? empResult.data.length : 0,
        loading: false,
      });
    } catch (error) {
      setStats({ ...stats, loading: false });
    }
  };

  const loadCurrentEmployee = async () => {
    setLoadingEmployee(true);
    try {
      const result = await employeeService.getCurrentEmployee();
      if (result.success) {
        setCurrentEmployee(result.data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des informations employé:', error);
    } finally {
      setLoadingEmployee(false);
    }
  };

  if (stats.loading) {
    return <Loading message="Chargement des statistiques..." />;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Tableau de bord</h1>
        <div className="welcome-section">
          <h2>Bienvenue, {user?.username}!</h2>
          <p className="user-role">Rôle: <span className="role-badge">{user?.role}</span></p>
        </div>
      </div>

      {/* Afficher les informations de l'utilisateur pour les USER */}
      {!isAdmin && currentEmployee && (
        <div className="user-info-card">
          <h2>Mes Informations</h2>
          <div className="user-info-grid">
            <div className="info-item">
              <span className="info-label">Nom complet</span>
              <span className="info-value">{currentEmployee.firstName} {currentEmployee.lastName}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Email</span>
              <span className="info-value">{currentEmployee.email}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Téléphone</span>
              <span className="info-value">{currentEmployee.phone || 'N/A'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Poste</span>
              <span className="info-value">{currentEmployee.position}</span>
            </div>
          </div>
        </div>
      )}

      {isAdmin && (
        <div className="stats-grid">
          <div className="stat-card stat-departments">
            <div className="stat-icon">🏢</div>
            <div className="stat-content">
              <h3>{stats.departments}</h3>
              <p>Départements</p>
              <Link to={ROUTES.DEPARTMENTS} className="stat-link">
                Voir tous →
              </Link>
            </div>
          </div>

          <div className="stat-card stat-employees">
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <h3>{stats.employees}</h3>
              <p>Employés</p>
              <Link to={ROUTES.EMPLOYEES} className="stat-link">
                Voir tous →
              </Link>
            </div>
          </div>

          <div className="stat-card stat-requests">
            <div className="stat-icon">📋</div>
            <div className="stat-content">
              <h3>-</h3>
              <p>Demandes de congé</p>
              <Link to={ROUTES.LEAVE_REQUESTS} className="stat-link">
                Voir toutes →
              </Link>
            </div>
          </div>
        </div>
      )}

      <div className="quick-actions">
        <h2>Actions rapides</h2>
        <div className="actions-grid">
          {isAdmin && (
            <>
              <Link to={ROUTES.DEPARTMENTS} className="action-card">
                <div className="action-icon">🏢</div>
                <h3>Gérer les départements</h3>
                <p>Créer, modifier ou supprimer des départements</p>
              </Link>

              <Link to={ROUTES.EMPLOYEES} className="action-card">
                <div className="action-icon">👥</div>
                <h3>Gérer les employés</h3>
                <p>Ajouter, modifier ou supprimer des employés</p>
              </Link>
            </>
          )}

          <Link to={ROUTES.LEAVE_REQUESTS} className="action-card">
            <div className="action-icon">📋</div>
            <h3>Demandes de congé</h3>
            <p>Consulter et gérer les demandes de congé</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

