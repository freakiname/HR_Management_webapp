import { useState, useEffect } from 'react';
import { leaveRequestService } from '../../services/leaveRequestService';
import { employeeService } from '../../services/employeeService';
import { useAuth } from '../../context/AuthContext';
import Loading from '../../components/common/Loading';
import Button from '../../components/common/Button';
import { formatDate } from '../../utils/helpers';
import './LeaveRequests.css';

const LeaveRequests = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [currentEmployee, setCurrentEmployee] = useState(null); // Pour récupérer l'ID de l'employé
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingLeaveRequest, setEditingLeaveRequest] = useState(null);
  const { isAdmin, user } = useAuth();

  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    reason: '',
    status: 'PENDING',
    employeeId: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError('');

    try {
      if (isAdmin) {
        // Pour l'admin, charger tous les employés et leurs demandes
        const empResult = await employeeService.getAll();
        if (empResult.success) {
          setEmployees(empResult.data);
          // Charger les demandes pour chaque employé
          const allRequests = [];
          for (const emp of empResult.data) {
            const reqResult = await leaveRequestService.getByEmployeeId(emp.id);
            if (reqResult.success && reqResult.data) {
              allRequests.push(...reqResult.data.map(req => ({
                ...req,
                employeeName: `${emp.firstName} ${emp.lastName}`,
              })));
            }
          }
          setLeaveRequests(allRequests);
        }
      } else {
        // Pour l'utilisateur, charger ses informations et ses demandes
        const empResult = await employeeService.getCurrentEmployee();
        if (empResult.success) {
          setCurrentEmployee(empResult.data);
          // Récupérer l'ID de l'employé (pas le userId du UserAccount)
          const employeeId = empResult.data.id;
          const reqResult = await leaveRequestService.getByEmployeeId(employeeId);
          if (reqResult.success) {
            setLeaveRequests(reqResult.data || []);
          } else {
            setError(reqResult.error);
          }
        } else {
          setError(empResult.error);
        }
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

    if (editingLeaveRequest) {
      // Mise à jour
      let requestData = {
        startDate: formData.startDate,
        endDate: formData.endDate,
        reason: formData.reason,
      };
      
      // Seuls les ADMIN peuvent modifier le statut
      if (isAdmin && formData.status) {
        requestData.status = formData.status;
      }
      
      const result = await leaveRequestService.update(editingLeaveRequest.id, requestData);
      
      if (result.success) {
        setShowModal(false);
        setEditingLeaveRequest(null);
        resetForm();
        loadData();
      } else {
        setError(result.error);
      }
    } else {
      // Création
      let employeeId;
      let requestData = { ...formData };
      
      if (isAdmin) {
        employeeId = formData.employeeId;
        // Admin peut définir le statut
      } else {
        // Pour les USER, utiliser l'ID de l'employé et ne pas envoyer le statut
        if (!currentEmployee?.id) {
          setError('Informations employé manquantes');
          return;
        }
        employeeId = currentEmployee.id;
        // Ne pas envoyer le statut pour les USER (sera défini à "PENDING" par défaut)
        delete requestData.status;
      }

      if (!employeeId) {
        setError('ID employé manquant');
        return;
      }

      const result = await leaveRequestService.create(employeeId, requestData);

      if (result.success) {
        setShowModal(false);
        resetForm();
        loadData();
      } else {
        setError(result.error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      startDate: '',
      endDate: '',
      reason: '',
      status: 'PENDING',
      employeeId: '',
    });
  };

  const openCreateModal = () => {
    setEditingLeaveRequest(null);
    resetForm();
    setShowModal(true);
  };

  const handleEdit = (request) => {
    setEditingLeaveRequest(request);
    setFormData({
      startDate: request.startDate ? request.startDate.split('T')[0] : '',
      endDate: request.endDate ? request.endDate.split('T')[0] : '',
      reason: request.reason || '',
      status: request.status || 'PENDING',
      employeeId: request.employee || '',
    });
    setShowModal(true);
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      PENDING: { label: 'En attente', class: 'status-pending' },
      APPROVED: { label: 'Approuvé', class: 'status-approved' },
      REJECTED: { label: 'Rejeté', class: 'status-rejected' },
    };
    const statusInfo = statusMap[status] || { label: status, class: 'status-unknown' };
    return <span className={`status-badge ${statusInfo.class}`}>{statusInfo.label}</span>;
  };

  if (loading) {
    return <Loading message="Chargement des demandes de congé..." />;
  }

  return (
    <div className="leave-requests">
      <div className="leave-requests-header">
        <h1>Demandes de congé</h1>
        <Button variant="primary" onClick={openCreateModal}>
          + Nouvelle demande
        </Button>
      </div>

      {error && <div className="error-alert">{error}</div>}

      <div className="leave-requests-list">
        {leaveRequests.length === 0 ? (
          <div className="empty-state">
            <p>Aucune demande de congé trouvée</p>
          </div>
        ) : (
          <table className="leave-requests-table">
            <thead>
              <tr>
                {isAdmin && <th>Employé</th>}
                <th>Date de début</th>
                <th>Date de fin</th>
                <th>Raison</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {leaveRequests.map((request) => (
                <tr key={request.id}>
                  {isAdmin && (
                    <td>{request.employeeName || `Employé ${request.employee}`}</td>
                  )}
                  <td>{formatDate(request.startDate)}</td>
                  <td>{formatDate(request.endDate)}</td>
                  <td>{request.reason}</td>
                  <td>{getStatusBadge(request.status)}</td>
                  <td>
                    <Button 
                      variant="secondary" 
                      className="action-btn"
                      onClick={() => handleEdit(request)}
                    >
                      Modifier
                    </Button>
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
              <h2>{editingLeaveRequest ? 'Modifier la demande de congé' : 'Nouvelle demande de congé'}</h2>
              <button className="modal-close" onClick={() => {
                setShowModal(false);
                setEditingLeaveRequest(null);
                resetForm();
              }}>×</button>
            </div>
            <form onSubmit={handleSubmit} className="leave-request-form">
              {isAdmin && !editingLeaveRequest && (
                <div className="form-group">
                  <label>Employé *</label>
                  <select
                    name="employeeId"
                    value={formData.employeeId}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Sélectionner un employé</option>
                    {employees.map(emp => (
                      <option key={emp.id} value={emp.id}>
                        {emp.firstName} {emp.lastName}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="form-row">
                <div className="form-group">
                  <label>Date de début *</label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Date de fin *</label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Raison *</label>
                <input
                  type="text"
                  name="reason"
                  value={formData.reason}
                  onChange={handleInputChange}
                  required
                  maxLength={50}
                />
              </div>

              {/* Seuls les ADMIN peuvent définir le statut */}
              {isAdmin && (
                <div className="form-group">
                  <label>Statut *</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="PENDING">En attente</option>
                    <option value="APPROVED">Approuvé</option>
                    <option value="REJECTED">Rejeté</option>
                  </select>
                </div>
              )}

              <div className="form-actions">
                <Button type="button" variant="secondary" onClick={() => {
                  setShowModal(false);
                  setEditingLeaveRequest(null);
                  resetForm();
                }}>
                  Annuler
                </Button>
                <Button type="submit" variant="primary">
                  {editingLeaveRequest ? 'Modifier' : 'Créer'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveRequests;

