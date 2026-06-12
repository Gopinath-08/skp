import { useCallback, useEffect, useMemo, useState } from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
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
    { key: 'type', label: 'Type', type: 'select', options: ['General', 'Admission', 'Exam', 'Holiday', 'Result', 'Urgent'] },
    { key: 'priority', label: 'Priority', type: 'select', options: ['Low', 'Medium', 'High', 'Urgent'] },
    { key: 'expiryDate', label: 'Expiry Date', type: 'date', required: false },
    { key: 'content', label: 'Content', type: 'textarea' },
    { key: 'isActive', label: 'Show on Website', type: 'checkbox', required: false },
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
    { key: 'qualification', label: 'Qualification', type: 'text' },
    { key: 'experience', label: 'Experience', type: 'text' },
    { key: 'email', label: 'Email', type: 'email' },
    { key: 'phone', label: 'Phone', type: 'text' },
    { key: 'photo', label: 'Profile Photo', type: 'file', required: false },
  ],
  gallery: [
    { key: 'title', label: 'Title', type: 'text' },
    { key: 'category', label: 'Category', type: 'select', options: ['Campus', 'Events', 'Students', 'Faculty', 'Achievements', 'Infrastructure'] },
    { key: 'description', label: 'Description', type: 'textarea' },
    { key: 'image', label: 'Gallery Photo', type: 'file' },
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
    ['inquiries', 'Inquiries / Leads'],
    ['students', 'Students'],
    ['courses', 'Courses'],
    ['batches', 'Batches'],
    ['fees', 'Fees'],
    ['certificates', 'Certificates'],
    ['faculty', 'Faculty'],
    ['notices', 'Notices'],
    ['content', 'Web Content'],
    ['gallery', 'Gallery'],
    ['testimonials', 'Testimonials'],
    ['reports', 'Reports'],
    ['settings', 'Settings'],
  ], []);

  const fetchData = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    setError('');

    const requests = {
      stats: adminService.getStats(),
      activities: adminService.getRecentActivities(),
      courses: courseService.getAll(),
      batches: batchService.getAll(),
      notices: isLoggedIn ? noticeService.getAdminAll() : noticeService.getAll(),
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
  }, [isLoggedIn]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchData]);

  const feeStats = getFeeStats(data.fees);
  const stats = data.stats || {
    totalStudents: data.students.length,
    newInquiries: data.inquiries.filter((item) => item.status === 'New').length,
    totalCourses: data.courses.length,
    totalCertificates: data.certificates.length,
    totalRevenue: feeStats.totalRevenue,
    pendingFees: feeStats.pendingFees,
    todayPayments: feeStats.todayPayments,
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
      setFormData(getInitialFormData(activeTab));
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
      let payload = activeTab === 'notices'
        ? { ...formData, expiryDate: formData.expiryDate || null, isActive: formData.isActive !== false }
        : formData;
      if (Object.values(formData).some((value) => value instanceof File)) {
        payload = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
          if (value === undefined || value === null || value === '') return;
          if (['photo', 'image'].includes(key) && !(value instanceof File)) return;
          if (Array.isArray(value)) {
            payload.append(key, JSON.stringify(value));
            return;
          }
          if (typeof value === 'object' && !(value instanceof File)) return;
          payload.append(key, value);
        });
      }
      const itemId = editingItem?._id || editingItem?.id || editingItem?.key || editingItem?.section;
      if (editingItem && itemId) {
        await services[activeTab].update(itemId, payload);
      } else {
        if (activeTab === 'settings') {
           await services.settings.update(payload);
        } else if (activeTab === 'content') {
           await services.content.update(payload.section, payload);
        } else {
           await services[activeTab].create(payload);
        }
      }
      setModalOpen(false);
      await fetchData(true);
    } catch (err) {
      alert('Error saving item: ' + getApiErrorMessage(err));
    }
  };

  const handleInputChange = (e) => {
    const { name, type, checked, value, files } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : type === 'file' ? files?.[0] || prev[name] : value }));
  };

  return (
    <div className="admin-page">
      <section className="admin-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <h1 style={{ margin: 0 }}>
            Admin Dashboard
          </h1>
          <div style={{ width: '1px', height: '20px', background: 'var(--border-color)' }}></div>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.65rem', padding: '0.2rem 0.6rem', background: '#dcfce7', color: '#166534', borderRadius: 'var(--radius-full)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 600 }}>
              <span style={{ width: '6px', height: '6px', background: '#166534', borderRadius: '50%', display: 'inline-block' }}></span>
              System Online
            </span>
            <span style={{ color: 'var(--text-secondary)', textTransform: 'capitalize', fontSize: '0.85rem' }}>{activeTab.replace('-', ' ')}</span>
          </span>
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
                       <button className="btn btn-secondary btn-small" style={{marginTop: '1rem'}} onClick={() => {
                          if (!data.reports || !data.reports.studentsReport) return alert('No students data');
                          const rows = data.reports.studentsReport;
                          const headers = ['ID', 'Name', 'Phone', 'Email', 'Course', 'Batch', 'Status'];
                          const fields = ['id', 'fullName', 'phone', 'email', 'Course.name', 'Batch.name', 'status'];
                          let csvContent = headers.join(',') + '\n';
                          rows.forEach(r => {
                            const values = fields.map(f => {
                              const v = f.split('.').reduce((o, i) => (o ? o[i] : null), r) || '';
                              return `"${String(v).replace(/"/g, '""')}"`;
                            });
                            csvContent += values.join(',') + '\n';
                          });
                          const blob = new Blob([csvContent], { type: 'text/csv' });
                          const url = window.URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = 'students_report.csv';
                          a.click();
                       }}>Export Excel</button>
                     </div>
                     <div className="stat-card">
                       <h3>Download</h3>
                       <p>Export all fees reports as PDF</p>
                       <button className="btn btn-secondary btn-small" style={{marginTop: '1rem'}} onClick={() => {
                          if (!data.reports || !data.reports.feesReport) return alert('No fees data');
                          const doc = new jsPDF();
                          doc.text('Fees Report', 14, 15);
                          const headers = ['Fee ID', 'Student', 'Amount', 'Date', 'Status'];
                          const tableData = data.reports.feesReport.map(fee => [
                             fee.id,
                             fee.Student?.fullName || 'N/A',
                             `Rs. ${fee.amountPaid}`,
                             new Date(fee.paymentDate).toLocaleDateString(),
                             fee.status
                          ]);
                          autoTable(doc, {
                            head: [headers],
                            body: tableData,
                            startY: 20,
                          });
                          doc.save('fees_report.pdf');
                       }}>Export PDF</button>
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
          <div className="modal-content" style={{maxWidth: '500px'}}>
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
                  ) : field.type === 'select' ? (
                    <select
                      name={field.key}
                      value={formData[field.key] || field.options?.[0] || ''}
                      onChange={handleInputChange}
                      required={field.required !== false}
                    >
                      {field.options?.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  ) : field.type === 'checkbox' ? (
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontWeight: 600 }}>
                      <input
                        type="checkbox"
                        name={field.key}
                        checked={Boolean(formData[field.key])}
                        onChange={handleInputChange}
                        style={{ width: 'auto' }}
                      />
                      Active
                    </label>
                  ) : field.type === 'file' ? (
                    <>
                      <input
                        type="file"
                        name={field.key}
                        accept="image/jpeg,image/png,image/gif"
                        onChange={handleInputChange}
                        required={!editingItem && field.required !== false}
                      />
                      {typeof formData[field.key] === 'string' && formData[field.key] && (
                        <small style={{color: '#64748b', display: 'block', marginTop: '0.35rem'}}>Current file saved</small>
                      )}
                    </>
                  ) : (
                    <input 
                      type={field.type} 
                      name={field.key} 
                      value={formatInputValue(formData[field.key], field.type)} 
                      onChange={handleInputChange} 
                      required={field.required !== false && field.key !== 'description'}
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
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(value)) {
    return new Date(value).toLocaleDateString();
  }
  if (typeof value === 'object') return value.name || value.fullName || value.title || '-';
  return String(value);
}

function formatInputValue(value, type) {
  if (!value) return '';
  if (type === 'date' && typeof value === 'string') return value.split('T')[0];
  return value;
}

function getInitialFormData(tab) {
  const defaults = {};

  schemas[tab]?.forEach((field) => {
    if (field.type === 'select' && field.options?.length) {
      defaults[field.key] = field.options[0];
    }
    if (field.type === 'checkbox') {
      defaults[field.key] = Boolean(field.defaultValue);
    }
  });

  if (tab === 'notices') {
    return { ...defaults, type: 'General', priority: 'Medium', isActive: true };
  }

  return defaults;
}

function getLocalDateKey(date = new Date()) {
  const value = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(value.getTime())) return '';
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, '0');
  const day = String(value.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getPaymentDateKey(paidDate) {
  if (!paidDate) return '';
  if (typeof paidDate === 'string' && /^\d{4}-\d{2}-\d{2}/.test(paidDate)) return paidDate.slice(0, 10);
  return getLocalDateKey(paidDate);
}

function getFeeStats(fees = []) {
  const todayKey = getLocalDateKey();

  return fees.reduce((stats, fee) => {
    const installments = Array.isArray(fee.installments) ? fee.installments : [];
    return {
      totalRevenue: stats.totalRevenue + Number(fee.paidAmount || 0),
      pendingFees: stats.pendingFees + Number(fee.pendingAmount || 0),
      todayPayments: stats.todayPayments + installments.reduce((sum, payment) => (
        getPaymentDateKey(payment.paidDate) === todayKey
          ? sum + Number(payment.amount || 0)
          : sum
      ), 0),
    };
  }, { totalRevenue: 0, pendingFees: 0, todayPayments: 0 });
}

function getApiErrorMessage(err) {
  const responseData = err.response?.data;

  if (responseData?.message) return responseData.message;
  if (Array.isArray(responseData?.errors) && responseData.errors.length > 0) {
    return responseData.errors
      .map((error) => `${error.path || error.param || 'field'}: ${error.msg}`)
      .join(', ');
  }

  return err.message;
}
