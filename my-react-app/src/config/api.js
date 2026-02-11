// Configuration de l'API
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  SIGNUP: '/auth/signup',
  
  // Departments
  DEPARTMENTS: '/departments',
  CREATE_DEPARTMENT: '/departments/create-department',
  DEPARTMENT_BY_ID: (id) => `/departments/view/${id}`,
  UPDATE_DEPARTMENT: (id) => `/departments/edit/${id}`,
  DELETE_DEPARTMENT: (id) => `/departments/${id}`,
  
  // Employees
  EMPLOYEES: '/employees',
  EMPLOYEE_BY_ID: (id) => `/employees/${id}`,
  CURRENT_EMPLOYEE: '/employees/me',
  
  // Leave Requests
  LEAVE_REQUESTS: '/leaveRequests',
  LEAVE_REQUESTS_BY_EMPLOYEE: (employeeId) => `/leaveRequests/${employeeId}`,
  UPDATE_LEAVE_REQUEST: (id) => `/leaveRequests/${id}`,
};

export default API_BASE_URL;

