import { useState, useEffect } from 'react';
import { employeeService } from '../../services/employeeService';
import { departmentService } from '../../services/departmentService';
import { useAuth } from '../../context/AuthContext';
import Loading from '../../components/common/Loading';
import Button from '../../components/common/Button';
import { formatDate } from '../../utils/helpers';
import './Employees.css';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const { isAdmin, user } = useAuth();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    hireDate: '',
    position: '',
    departmentId: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError('');
    
    try {
      let empResult;
      if (isAdmin) {
        empResult = await employeeService.getAll();
      } else {
        // Pour les utilisateurs non-admin, récupérer leur propre employé
        empResult = await employeeService.getCurrentEmployee();
        if (empResult.success) {
          empResult.data = [empResult.data]; // Convertir en tableau pour la cohérence
        }
      }

      const deptResult = await departmentService.getAll();

      if (empResult.success) {
        setEmployees(Array.isArray(empResult.data) ? empResult.data : [empResult.data]);
      } else {
        setError(empResult.error);
      }

      if (deptResult.success) {
        setDepartments(deptResult.data);
      }
    } catch (err) {
      setError('Erreur lors du chargement des données');
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

    const employeeData = {
      ...formData,
      hireDate: formData.hireDate,
      departmentId: formData.departmentId,
    };

    let result;
    if (editingEmployee) {
      // Mise à jour
      const updateData = {
        firstName: employeeData.firstName,
        lastName: employeeData.lastName,
        phone: employeeData.phone,
        position: employeeData.position,
      };
      result = await employeeService.update(editingEmployee.id, updateData);
    } else {
      // Création
      result = await employeeService.create(employeeData);
    }

    if (result.success) {
      setShowModal(false);
      setEditingEmployee(null);
      resetForm();
      loadData();
    } else {
      setError(result.error);
    }
  };

  const handleEdit = (employee) => {
    setEditingEmployee(employee);
    setFormData({
      firstName: employee.firstName || '',
      lastName: employee.lastName || '',
      email: employee.email || '',
      phone: employee.phone || '',
      hireDate: employee.hireDate ? employee.hireDate.split('T')[0] : '',
      position: employee.position || '',
      departmentId: employee.department || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet employé ?')) {
      return;
    }

    const result = await employeeService.delete(id);
    if (result.success) {
      loadData();
    } else {
      setError(result.error);
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      hireDate: '',
      position: '',
      departmentId: '',
    });
  };

  const openCreateModal = () => {
    setEditingEmployee(null);
    resetForm();
    setShowModal(true);
  };

  const getDepartmentName = (employee) => {
    if (!employee) {
      return 'N/A';
    }
    
    // Cas 1: L'API retourne directement un objet department avec un nom
    if (employee.department && typeof employee.department === 'object') {
      if (employee.department.name) {
        return employee.department.name;
      }
      // Si c'est un objet avec un id, utiliser l'id pour chercher
      if (employee.department.id) {
        const dept = departments.find(d => d.id?.toString() === employee.department.id?.toString());
        return dept ? dept.name : 'N/A';
      }
    }
    
    // Cas 2: L'API retourne department_id (UUID string) ou department (UUID string)
    const departmentId = employee.department_id || employee.department;
    
    if (!departmentId) {
      return 'N/A';
    }
    
    // Chercher le département dans la liste chargée
    const dept = departments.find(d => {
      // Comparer les IDs en les convertissant en string pour éviter les problèmes de type
      const deptIdStr = d.id?.toString()?.toLowerCase();
      const searchIdStr = departmentId?.toString()?.toLowerCase();
      return deptIdStr === searchIdStr;
    });
    
    return dept ? dept.name : 'N/A';
  };

  if (loading) {
    return <Loading message="Chargement des employés..." />;
  }

  return (
    <div className="employees">
      <div className="employees-header">
        <h1>{isAdmin ? 'Employés' : 'Mon Profil'}</h1>
        {isAdmin && (
          <Button variant="primary" onClick={openCreateModal}>
            + Ajouter un employé
          </Button>
        )}
      </div>

      {error && <div className="error-alert">{error}</div>}

      <div className="employees-list">
        {employees.length === 0 ? (
          <div className="empty-state">
            <p>Aucun employé trouvé</p>
          </div>
        ) : (
          <table className="employees-table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Email</th>
                <th>Téléphone</th>
                <th>Poste</th>
                <th>Département</th>
                <th>Date d'embauche</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp.id}>
                  <td>{emp.firstName} {emp.lastName}</td>
                  <td>{emp.email}</td>
                  <td>{emp.phone || '-'}</td>
                  <td>{emp.position}</td>
                  <td>{getDepartmentName(emp)}</td>
                  <td>{formatDate(emp.hireDate)}</td>
                  <td>
                    <Button 
                      variant="secondary" 
                      className="action-btn"
                      onClick={() => handleEdit(emp)}
                    >
                      Modifier
                    </Button>
                    {isAdmin && (
                      <Button 
                        variant="danger" 
                        className="action-btn"
                        onClick={() => handleDelete(emp.id)}
                      >
                        Supprimer
                      </Button>
                    )}
                  </td>
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
              <h2>{editingEmployee ? 'Modifier l\'employé' : 'Créer un employé'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit} className="employee-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Prénom *</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Nom *</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              {!editingEmployee && (
                <>
                  <div className="form-group">
                    <label>Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      disabled={!!editingEmployee}
                    />
                  </div>
                  <div className="form-group">
                    <label>Date d'embauche *</label>
                    <input
                      type="date"
                      name="hireDate"
                      value={formData.hireDate}
                      onChange={handleInputChange}
                      required
                      disabled={!!editingEmployee}
                    />
                  </div>
                  <div className="form-group">
                    <label>Département *</label>
                    <select
                      name="departmentId"
                      value={formData.departmentId}
                      onChange={handleInputChange}
                      required
                      disabled={!!editingEmployee}
                    >
                      <option value="">Sélectionner un département</option>
                      {departments.map(dept => (
                        <option key={dept.id} value={dept.id}>
                          {dept.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              <div className="form-group">
                <label>Téléphone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Poste *</label>
                <input
                  type="text"
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-actions">
                <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>
                  Annuler
                </Button>
                <Button type="submit" variant="primary">
                  {editingEmployee ? 'Modifier' : 'Créer'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Employees;

