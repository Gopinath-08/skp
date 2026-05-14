import axios from 'axios';

const DEPLOYED_BACKEND_URL = 'https://skp-lh6r.onrender.com';
const API_BASE_URL = import.meta.env.VITE_API_URL || `${DEPLOYED_BACKEND_URL}/api`;
const ASSET_BASE_URL = API_BASE_URL.replace(/\/api\/?$/, '');

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (!(config.data instanceof FormData)) {
    config.headers['Content-Type'] = 'application/json';
  }
  return config;
});

export const getAssetUrl = (path) => {
  if (!path) return '';
  if (/^https?:\/\//i.test(path)) return path;
  const normalizedPath = path.replace(/\\/g, '/').replace(/^\/+/, '');
  return `${ASSET_BASE_URL}/${normalizedPath}`;
};

export const courseService = {
  getAll: () => api.get('/courses'),
  getById: (id) => api.get(`/courses/${id}`),
  create: (data) => api.post('/courses', data),
  update: (id, data) => api.put(`/courses/${id}`, data),
  delete: (id) => api.delete(`/courses/${id}`),
};

export const studentService = {
  getAll: () => api.get('/students'),
  getById: (id) => api.get(`/students/${id}`),
  create: (data) => api.post('/students', data),
  register: (data) => api.post('/students', data),
  update: (id, data) => api.put(`/students/${id}`, data),
  delete: (id) => api.delete(`/students/${id}`),
  verify: (admissionId) => api.get(`/students/verify/${admissionId}`),
};

export const facultyService = {
  getAll: () => api.get('/faculty'),
  getById: (id) => api.get(`/faculty/${id}`),
  create: (data) => api.post('/faculty', data),
  update: (id, data) => api.put(`/faculty/${id}`, data),
  delete: (id) => api.delete(`/faculty/${id}`),
};

export const galleryService = {
  getAll: (params) => api.get('/gallery', { params }),
  getById: (id) => api.get(`/gallery/${id}`),
  getCategories: () => api.get('/gallery/categories/list'),
  create: (formData) => api.post('/gallery', formData),
  upload: (formData) => api.post('/gallery', formData),
  update: (id, data) => api.put(`/gallery/${id}`, data),
  delete: (id) => api.delete(`/gallery/${id}`),
};

export const noticeService = {
  getAll: () => api.get('/notices'),
  getById: (id) => api.get(`/notices/${id}`),
  getByType: (type) => api.get(`/notices/type/${type}`),
  create: (data) => api.post('/notices', data),
  update: (id, data) => api.put(`/notices/${id}`, data),
  delete: (id) => api.delete(`/notices/${id}`),
};

export const inquiryService = {
  getAll: () => api.get('/inquiries'),
  getById: (id) => api.get(`/inquiries/${id}`),
  create: (data) => api.post('/inquiries', data),
  updateStatus: (id, status) => api.put(`/inquiries/${id}/status`, { status }),
  delete: (id) => api.delete(`/inquiries/${id}`),
};

export const feeService = {
  getAll: () => api.get('/fees'),
  getById: (id) => api.get(`/fees/${id}`),
  getByStudent: (studentId) => api.get(`/fees/student/${studentId}`),
  addInstallment: (id, data) => api.post(`/fees/${id}/installment`, data),
  payInstallment: (id, installmentId) => api.put(`/fees/${id}/installment/${installmentId}/pay`),
  update: (id, data) => api.put(`/fees/${id}`, data),
};

export const certificateService = {
  getAll: () => api.get('/certificates'),
  getById: (id) => api.get(`/certificates/${id}`),
  verify: (certificateNumber) => api.get(`/certificates/verify/${certificateNumber}`),
  create: (data) => api.post('/certificates', data),
  download: (id) => api.get(`/certificates/${id}/download`, { responseType: 'blob' }),
};

export const adminService = {
  getStats: () => api.get('/admin/stats'),
  getRecentActivities: () => api.get('/admin/recent-activities'),
  seed: () => api.post('/admin/seed'),
};

export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  me: () => api.get('/auth/me'),
  changePassword: (data) => api.put('/auth/change-password', data),
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('admin');
  },
};

export default api;
