import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../utils/constants';
import './Navigation.css';

const Navigation = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  return (
    <nav className="navigation">
      <div className="nav-container">
        <Link to={ROUTES.DASHBOARD} className="nav-logo">
          HR Management
        </Link>
        
        <div className="nav-links">
          {user && (
            <>
              <Link to={ROUTES.DASHBOARD}>Dashboard</Link>
              {isAdmin && (
                <>
                  <Link to={ROUTES.DEPARTMENTS}>Départements</Link>
                  <Link to={ROUTES.EMPLOYEES}>Employés</Link>
                </>
              )}
              <Link to={ROUTES.LEAVE_REQUESTS}>Demandes de congé</Link>
            </>
          )}
        </div>

        <div className="nav-user">
          {user ? (
            <>
              <span className="user-info">
                {user.username} ({user.role})
              </span>
              <button onClick={handleLogout} className="logout-btn">
                Déconnexion
              </button>
            </>
          ) : (
            <Link to={ROUTES.LOGIN}>Connexion</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;

