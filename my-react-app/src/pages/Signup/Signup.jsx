import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { authService } from '../../services/authService';
import { ROUTES } from '../../utils/constants';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import './Signup.css';

const Signup = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Validation
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (password.length < 2) {
      setError('Le mot de passe doit contenir au moins 2 caractères');
      return;
    }

    if (!token) {
      setError('Token d\'activation manquant');
      return;
    }

    setLoading(true);

    const result = await authService.signup(
      { username, password },
      token
    );
    
    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        navigate(ROUTES.LOGIN);
      }, 2000);
    } else {
      setError(result.error || 'Erreur lors de l\'inscription');
    }
    
    setLoading(false);
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h1>Créer un compte</h1>
        {success ? (
          <div className="success-message">
            <p>✅ Compte créé avec succès !</p>
            <p>Redirection vers la page de connexion...</p>
          </div>
        ) : !token ? (
          <div>
            <div className="error-alert">
              <strong>Token d'activation manquant</strong>
              <p>Veuillez utiliser le lien reçu par email pour créer votre compte.</p>
              <p>Si vous n'avez pas reçu d'email, contactez votre administrateur.</p>
            </div>
            <div className="signup-footer">
              <p>
                Déjà un compte ?{' '}
                <Link to={ROUTES.LOGIN} className="login-link">
                  Se connecter
                </Link>
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <Input
              label="Nom d'utilisateur"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              minLength={2}
              maxLength={50}
            />
            
            <Input
              label="Mot de passe"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={2}
              maxLength={50}
            />
            
            <Input
              label="Confirmer le mot de passe"
              name="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            
            {error && <div className="error-alert">{error}</div>}
            
            <Button 
              type="submit" 
              disabled={loading} 
              className="signup-button"
            >
              {loading ? 'Création...' : 'Créer le compte'}
            </Button>
            
            <div className="signup-footer">
              <p>
                Déjà un compte ?{' '}
                <Link to={ROUTES.LOGIN} className="login-link">
                  Se connecter
                </Link>
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Signup;

