import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout/Layout';
import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup';
import Dashboard from './pages/Dashboard/Dashboard';
import Departments from './pages/Departments/Departments';
import Employees from './pages/Employees/Employees';
import LeaveRequests from './pages/LeaveRequests/LeaveRequests';
import { ROUTES } from './utils/constants';
import { useProtectedRoute } from './hooks/useProtectedRoute';
import './App.css';

// Composant pour protéger les routes
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useProtectedRoute();
  
  if (loading) {
    return <div>Chargement...</div>;
  }
  
  return isAuthenticated ? children : <Navigate to={ROUTES.LOGIN} />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path={ROUTES.LOGIN} element={<Login />} />
          <Route path={ROUTES.SIGNUP} element={<Signup />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
            <Route path={ROUTES.DEPARTMENTS} element={<Departments />} />
            <Route path={ROUTES.EMPLOYEES} element={<Employees />} />
            <Route path={ROUTES.LEAVE_REQUESTS} element={<LeaveRequests />} />
          </Route>
          <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
