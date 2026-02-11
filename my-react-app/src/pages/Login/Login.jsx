import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../utils/constants';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(username, password);
    
    if (result.success) {
      navigate(ROUTES.DASHBOARD);
    } else {
      setError(result.error || 'Erreur de connexion');
    }
    
    setLoading(false);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Connexion</h1>
        <form onSubmit={handleSubmit}>
          <Input
            label="Nom d'utilisateur"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            error={error}
          />
          <Input
            label="Mot de passe"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <div className="error-alert">{error}</div>}
          <Button type="submit" disabled={loading} className="login-button">
            {loading ? 'Connexion...' : 'Se connecter'}
          </Button>
        </form>
        <div className="login-footer">
          <p>
            Pas encore de compte ?{' '}
            <Link to={ROUTES.SIGNUP} className="signup-link">
              Créer un compte
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

