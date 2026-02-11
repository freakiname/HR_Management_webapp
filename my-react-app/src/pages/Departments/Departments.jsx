import { useState, useEffect } from 'react';
import { departmentService } from '../../services/departmentService';
import { useAuth } from '../../context/AuthContext';
import Loading from '../../components/common/Loading';
import Button from '../../components/common/Button';
import './Departments.css';

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const { isAdmin } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
  });

  useEffect(() => {
    loadDepartments();
  }, []);

  const loadDepartments = async () => {
    setLoading(true);
    setError('');
    const result = await departmentService.getAll();
    
    if (result.success) {
      setDepartments(result.data);
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    let result;
    if (editingDepartment) {
      // Mise à jour
      result = await departmentService.update(editingDepartment.id, formData);
    } else {
      // Création
      result = await departmentService.create(formData);
    }

    if (result.success) {
      setShowModal(false);
      setEditingDepartment(null);
      resetForm();
      loadDepartments();
    } else {
      setError(result.error);
    }
  };

  const handleEdit = (department) => {
    setEditingDepartment(department);
    setFormData({
      name: department.name || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce département ? Cette action est irréversible.')) {
      return;
    }

    const result = await departmentService.delete(id);
    if (result.success) {
      loadDepartments();
    } else {
      setError(result.error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
    });
  };

  const openCreateModal = () => {
    setEditingDepartment(null);
    resetForm();
    setShowModal(true);
  };

  if (loading) {
    return <Loading message="Chargement des départements..." />;
  }

  return (
    <div className="departments">
      <div className="departments-header">
        <h1>Départements</h1>
        {isAdmin && (
          <Button variant="primary" onClick={openCreateModal}>
            + Ajouter un département
          </Button>
        )}
      </div>

      {error && <div className="error-alert">{error}</div>}

      <div className="departments-list">
        {departments.length === 0 ? (
          <div className="empty-state">
            <p>Aucun département trouvé</p>
          </div>
        ) : (
          <table className="departments-table">
            <thead>
              <tr>
                <th>Nom</th>
                {isAdmin && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {departments.map((dept) => (
                <tr key={dept.id}>
                  <td>{dept.name}</td>
                  {isAdmin && (
                    <td>
                      <Button 
                        variant="secondary" 
                        className="action-btn"
                        onClick={() => handleEdit(dept)}
                      >
                        Modifier
                      </Button>
                      <Button 
                        variant="danger" 
                        className="action-btn"
                        onClick={() => handleDelete(dept.id)}
                      >
                        Supprimer
                      </Button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingDepartment ? 'Modifier le département' : 'Créer un département'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit} className="department-form">
              <div className="form-group">
                <label>Nom du département *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Ex: Ressources Humaines"
                  required
                  minLength={2}
                  maxLength={50}
                />
              </div>

              <div className="form-actions">
                <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>
                  Annuler
                </Button>
                <Button type="submit" variant="primary">
                  {editingDepartment ? 'Modifier' : 'Créer'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Departments;

