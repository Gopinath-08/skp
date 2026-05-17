import { useEffect, useMemo, useState } from 'react';
import {
  adminService,
  authService,
  certificateService,
  courseService,
  facultyService,
  feeService,
  galleryService,
  inquiryService,
  noticeService,
  studentService,
  batchService,
  testimonialService,
  settingService,
  contentService,
  reportService
} from '../services/api';
import DashboardOverview from './admin/DashboardOverview';
import StudentManager from './admin/StudentManager';
import FeeManager from './admin/FeeManager';
import CourseManager from './admin/CourseManager';
import CertificateManager from './admin/CertificateManager';
import '../styles/pages.css';

const services = {
  courses: courseService,
  batches: batchService,
  notices: noticeService,
  students: studentService,
  inquiries: inquiryService,
  fees: feeService,
  certificates: certificateService,
  faculty: facultyService,
  gallery: galleryService,
  testimonials: testimonialService,
  settings: settingService,
  content: contentService,
};

const schemas = {
  courses: [
    { key: 'name', label: 'Course Name', type: 'text' },
    { key: 'code', label: 'Code', type: 'text' },
    { key: 'category', label: 'Category', type: 'text' },
    { key: 'duration', label: 'Duration', type: 'text' },
    { key: 'fees', label: 'Fees', type: 'number' },
    { key: 'description', label: 'Description', type: 'textarea' },
  ],
  batches: [
    { key: 'name', label: 'Batch Name', type: 'text' },
    { key: 'schedule', label: 'Schedule', type: 'text' },
    { key: 'timing', label: 'Timing', type: 'text' },
    { key: 'capacity', label: 'Capacity', type: 'number' },
    { key: 'courseId', label: 'Course ID', type: 'number' },
    { key: 'facultyId', label: 'Faculty ID', type: 'number' },
  ],
  notices: [
    { key: 'title', label: 'Title', type: 'text' },
    { key: 'type', label: 'Type', type: 'text' },
    { key: 'priority', label: 'Priority', type: 'text' },
    { key: 'content', label: 'Content', type: 'textarea' },
  ],
  students: [
    { key: 'fullName', label: 'Full Name', type: 'text' },
    { key: 'email', label: 'Email', type: 'email' },
    { key: 'mobile', label: 'Mobile', type: 'text' },
    { key: 'status', label: 'Status', type: 'text' },
  ],
  inquiries: [
    { key: 'name', label: 'Name', type: 'text' },
    { key: 'email', label: 'Email', type: 'email' },
    { key: 'phone', label: 'Phone', type: 'text' },
    { key: 'course', label: 'Course', type: 'text' },
    { key: 'status', label: 'Status', type: 'text' },
    { key: 'message', label: 'Message', type: 'textarea' },
  ],
  fees: [
    { key: 'totalFees', label: 'Total Fees', type: 'number' },
    { key: 'paidAmount', label: 'Paid Amount', type: 'number' },
    { key: 'pendingAmount', label: 'Pending Amount', type: 'number' },
  ],
  certificates: [
    { key: 'certificateNumber', label: 'Certificate No.', type: 'text' },
    { key: 'grade', label: 'Grade', type: 'text' },
    { key: 'issueDate', label: 'Issue Date', type: 'date' },
  ],
  faculty: [
    { key: 'name', label: 'Name', type: 'text' },
    { key: 'designation', label: 'Designation', type: 'text' },
    { key: 'email', label: 'Email', type: 'email' },
    { key: 'phone', label: 'Phone', type: 'text' },
    { key: 'experience', label: 'Experience (Years)', type: 'text' },
  ],
  gallery: [
    { key: 'title', label: 'Title', type: 'text' },
    { key: 'category', label: 'Category', type: 'text' },
    { key: 'description', label: 'Description', type: 'textarea' },
  ],
  testimonials: [
    { key: 'name', label: 'Name', type: 'text' },
    { key: 'role', label: 'Role', type: 'text' },
    { key: 'content', label: 'Testimonial', type: 'textarea' },
  ],
  settings: [
    { key: 'key', label: 'Setting Key', type: 'text' },
    { key: 'value', label: 'Setting Value', type: 'text' },
  ],
  content: [
    { key: 'section', label: 'Section (e.g. home, about)', type: 'text' },
  ]
};

const emptyData = {
  stats: null,
  activities: null,
  courses: [],
  batches: [],
  notices: [],
  students: [],
  inquiries: [],
  fees: [],
  certificates: [],
  faculty: [],
  gallery: [],
  testimonials: [],
  settings: [],
  content: [],
  reports: null,
};

export default function Admin() {
  const [data, setData] = useState(emptyData);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [error, setError] = useState('');
  
  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});

  const isLoggedIn = Boolean(localStorage.getItem('authToken'));
  const admin = JSON.parse(localStorage.getItem('admin') || 'null');

  const tabs = useMemo(() => [
    ['dashboard', 'Dashboard'],
    ['students', 'Students'],
    ['courses', 'Courses'],
    ['batches', 'Batches'],
    ['fees', 'Fees'],
    ['certificates', 'Certificates'],
    ['inquiries', 'Inquiries / Leads'],
    ['faculty', 'Faculty'],
    ['notices', 'Notices'],
    ['content', 'Web Content'],
    ['gallery', 'Gallery'],
    ['testimonials', 'Testimonials'],
    ['reports', 'Reports'],
    ['settings', 'Settings'],
  ], []);

  const fetchData = async (silent = false) => {
    if (!silent) setLoading(true);
    setError('');

    const requests = {
      stats: adminService.getStats(),
      activities: adminService.getRecentActivities(),
      courses: courseService.getAll(),
      batches: batchService.getAll(),
      notices: noticeService.getAll(),
      students: studentService.getAll(),
      inquiries: inquiryService.getAll(),
      fees: feeService.getAll(),
      certificates: certificateService.getAll(),
      faculty: facultyService.getAll(),
      gallery: galleryService.getAll(),
      testimonials: testimonialService.getAll(),
      settings: settingService.getAll(),
      content: contentService.getAll(),
      reports: reportService.getReports().catch(() => ({ data: { message: 'Reports disabled or offline' } })),
    };

    const entries = await Promise.allSettled(
      Object.entries(requests).map(async ([key, request]) => [key, (await request).data])
    );

    const nextData = { ...emptyData };
    const failedProtected = [];

    entries.forEach((entry) => {
      if (entry.status === 'fulfilled') {
        const [key, value] = entry.value;
        nextData[key] = value;
        return;
      }
      if (entry.reason?.response?.status === 401) {
        failedProtected.push(entry.reason.config?.url);
      }
    });

    setData(nextData);
    if (failedProtected.length > 0) {
      setError('Login is required to load protected admin endpoints.');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const stats = data.stats || {
    totalCourses: data.courses.length,
    totalNotices: data.notices.length,
    totalStudents: data.students.length,
    totalFaculty: data.faculty.length,
    totalGallery: data.gallery.length,
    totalCertificates: data.certificates.length,
    pendingFees: 0,
    totalRevenue: 0,
    newInquiries: data.inquiries.filter((item) => item.status === 'New').length,
  };

  const handleLogout = () => {
    authService.logout();
    window.location.href = '/login';
  };

  const handleOpenModal = (item = null) => {
    setEditingItem(item);
    if (item) {
      setFormData(item);
    } else {
      setFormData({});
    }
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      await services[activeTab].delete(id);
      await fetchData(true);
    } catch (err) {
      alert('Error deleting item: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingItem && editingItem._id) {
        await services[activeTab].update(editingItem._id, formData);
      } else {
        if (activeTab === 'settings') {
           await services.settings.update(formData);
        } else if (activeTab === 'content') {
           await services.content.update(formData.section, formData);
        } else {
           await services[activeTab].create(formData);
        }
      }
      setModalOpen(false);
      await fetchData(true);
    } catch (err) {
      alert('Error saving item: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="admin-page">
      <section className="admin-header">
        <div>
          <span>Institute management</span>
          <h1>Admin Dashboard</h1>
          <p>Live data from the deployed backend API</p>
        </div>
        {isLoggedIn && (
          <div className="admin-user">
            <span>{admin?.name || admin?.email || 'Admin'}</span>
            <button className="btn btn-secondary btn-small" onClick={handleLogout}>Logout</button>
          </div>
        )}
      </section>

      {!isLoggedIn && (
        <div className="admin-alert">
          Protected endpoints need an admin login. Public data will load, but CRUD operations will fail.
          <a href="/login">Login</a>
        </div>
      )}
      {error && <div className="admin-alert warning" style={{ backgroundColor: '#fee2e2', color: '#991b1b' }}>{error}</div>}

      <section className="admin-container">
        <div className="admin-sidebar">
          <nav className="admin-nav">
            {tabs.map(([key, label]) => (
              <button
                key={key}
                className={`nav-item ${activeTab === key ? 'active' : ''}`}
                onClick={() => setActiveTab(key)}
              >
                {label}
              </button>
            ))}
          </nav>
        </div>

        <div className="admin-content">
          {loading ? (
            <p>Loading admin data...</p>
          ) : (
            <>
              {activeTab === 'dashboard' && (
                <DashboardOverview stats={stats} activities={data.activities} />
              )}
              {activeTab === 'students' && (
                <StudentManager students={data.students} courses={data.courses} batches={data.batches} onRefresh={() => fetchData(true)} />
              )}
              {activeTab === 'fees' && (
                <FeeManager fees={data.fees} students={data.students} courses={data.courses} onRefresh={() => fetchData(true)} />
              )}
              {activeTab === 'courses' && (
                <CourseManager courses={data.courses} faculty={data.faculty} onRefresh={() => fetchData(true)} />
              )}
              {activeTab === 'certificates' && (
                <CertificateManager certificates={data.certificates} students={data.students} courses={data.courses} onRefresh={() => fetchData(true)} />
              )}

              {activeTab === 'reports' && (
                <div className="crud-section">
                  <h2>Analytics & Reports</h2>
                  <div className="stats-grid">
                     <div className="stat-card">
                       <h3>Download</h3>
                       <p>Export all students as CSV</p>
                       <button className="btn btn-secondary btn-small" style={{marginTop: '1rem'}} onClick={() => alert('Download starting...')}>Export Excel</button>
                     </div>
                     <div className="stat-card">
                       <h3>Download</h3>
                       <p>Export all fees reports as PDF</p>
                       <button className="btn btn-secondary btn-small" style={{marginTop: '1rem'}} onClick={() => alert('Download starting...')}>Export PDF</button>
                     </div>
                  </div>
                </div>
              )}

              {activeTab !== 'dashboard' && activeTab !== 'reports' && !['students', 'fees', 'courses', 'certificates'].includes(activeTab) && (
                <div className="crud-section">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h2 style={{textTransform: 'capitalize'}}>{activeTab.replace('-', ' ')}</h2>
                    <button className="btn btn-primary" onClick={() => handleOpenModal()}>
                      + Add New
                    </button>
                  </div>
                  
                  <CrudTable
                    rows={data[activeTab] || []}
                    schema={schemas[activeTab]}
                    onEdit={handleOpenModal}
                    onDelete={handleDelete}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Dynamic Modal */}
      {modalOpen && (
        <div className="modal">
          <div className="modal-content" style={{maxWidth: '500px', padding: '2rem'}}>
            <button className="close" onClick={() => setModalOpen(false)}>×</button>
            <h2 style={{marginBottom: '1.5rem'}}>{editingItem ? 'Edit' : 'Add'} {activeTab.slice(0,-1)}</h2>
            <form onSubmit={handleSave}>
              {schemas[activeTab]?.map((field) => (
                <div className="form-group" key={field.key}>
                  <label>{field.label}</label>
                  {field.type === 'textarea' ? (
                    <textarea 
                      name={field.key} 
                      value={formData[field.key] || ''} 
                      onChange={handleInputChange} 
                      rows="3"
                    />
                  ) : (
                    <input 
                      type={field.type} 
                      name={field.key} 
                      value={formData[field.key] || ''} 
                      onChange={handleInputChange} 
                      required={field.key !== 'description'}
                    />
                  )}
                </div>
              ))}
              <div style={{display: 'flex', gap: '1rem', marginTop: '2rem'}}>
                <button type="submit" className="btn btn-primary">Save Changes</button>
                <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="stat-card">
      <h3>{value}</h3>
      <p>{label}</p>
    </div>
  );
}

function RecentList({ title, items = [], fields }) {
  return (
    <div className="recent-panel">
      <h3>{title}</h3>
      {items.length === 0 ? (
        <p>No recent records</p>
      ) : (
        <ul>
          {items.map((item) => (
            <li key={item._id}>
              {fields.map((field) => getValue(item, field)).filter(Boolean).join(' - ')}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function CrudTable({ rows, schema, onEdit, onDelete }) {
  if (!schema) return <p>No schema defined for this tab.</p>;
  
  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            {schema.slice(0, 4).map((field) => (
              <th key={field.key}>{field.label}</th>
            ))}
            <th style={{textAlign: 'right'}}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={schema.slice(0, 4).length + 1} style={{textAlign: 'center', padding: '2rem'}}>
                No records found. Click 'Add New' to create one.
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={row._id || row.id || row.key || row.section}>
                {schema.slice(0, 4).map((field) => (
                  <td key={field.key}>{formatValue(getValue(row, field.key))}</td>
                ))}
                <td style={{textAlign: 'right'}}>
                  <button className="btn btn-secondary btn-small" onClick={() => onEdit(row)} style={{marginRight: '0.5rem'}}>
                    Edit
                  </button>
                  <button className="btn btn-secondary btn-small" onClick={() => onDelete(row._id || row.id || row.key || row.section)} style={{color: '#ef4444', borderColor: '#fee2e2', backgroundColor: '#fef2f2'}}>
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

function getValue(row, path) {
  return path.split('.').reduce((value, key) => value?.[key], row);
}

function formatValue(value) {
  if (!value) return '-';
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(value)) {
    return new Date(value).toLocaleDateString();
  }
  if (typeof value === 'object') return value.name || value.fullName || value.title || '-';
  return String(value);
}
