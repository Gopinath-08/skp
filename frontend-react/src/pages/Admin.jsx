import { useEffect, useMemo, useState } from 'react';
import {
  adminService,
  certificateService,
  courseService,
  facultyService,
  feeService,
  galleryService,
  inquiryService,
  noticeService,
  studentService,
} from '../services/api';
import '../styles/pages.css';

const emptyData = {
  stats: null,
  activities: null,
  courses: [],
  notices: [],
  students: [],
  inquiries: [],
  fees: [],
  certificates: [],
  faculty: [],
  gallery: [],
};

export default function Admin() {
  const [data, setData] = useState(emptyData);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [error, setError] = useState('');
  const isLoggedIn = Boolean(localStorage.getItem('authToken'));

  const tabs = useMemo(() => [
    ['dashboard', 'Dashboard'],
    ['courses', 'Courses'],
    ['notices', 'Notices'],
    ['students', 'Students'],
    ['inquiries', 'Inquiries'],
    ['fees', 'Fees'],
    ['certificates', 'Certificates'],
    ['faculty', 'Faculty'],
    ['gallery', 'Gallery'],
  ], []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');

      const requests = {
        stats: adminService.getStats(),
        activities: adminService.getRecentActivities(),
        courses: courseService.getAll(),
        notices: noticeService.getAll(),
        students: studentService.getAll(),
        inquiries: inquiryService.getAll(),
        fees: feeService.getAll(),
        certificates: certificateService.getAll(),
        faculty: facultyService.getAll(),
        gallery: galleryService.getAll(),
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

  return (
    <div className="admin-page">
      <section className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Live data from the deployed backend API</p>
      </section>

      {!isLoggedIn && (
        <div className="admin-alert">
          Protected endpoints need an admin login. Public courses, notices, faculty, and gallery can still load.
          <a href="/login">Login</a>
        </div>
      )}
      {error && <div className="admin-alert warning">{error}</div>}

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
                <div className="dashboard-section">
                  <h2>Dashboard Overview</h2>
                  <div className="stats-grid">
                    <StatCard label="Students" value={stats.totalStudents} />
                    <StatCard label="Courses" value={stats.totalCourses} />
                    <StatCard label="Faculty" value={stats.totalFaculty} />
                    <StatCard label="Notices" value={stats.totalNotices} />
                    <StatCard label="Gallery Items" value={stats.totalGallery} />
                    <StatCard label="Certificates" value={stats.totalCertificates} />
                    <StatCard label="Pending Fees" value={`Rs. ${stats.pendingFees}`} />
                    <StatCard label="Revenue" value={`Rs. ${stats.totalRevenue}`} />
                    <StatCard label="New Inquiries" value={stats.newInquiries} />
                  </div>
                  {data.activities && (
                    <div className="recent-grid">
                      <RecentList title="Recent Students" items={data.activities.recentStudents} fields={['fullName', 'admissionId']} />
                      <RecentList title="Recent Inquiries" items={data.activities.recentInquiries} fields={['name', 'course', 'status']} />
                      <RecentList title="Recent Notices" items={data.activities.recentNotices} fields={['title', 'type']} />
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'courses' && (
                <SimpleTable
                  title="Courses"
                  rows={data.courses}
                  columns={[
                    ['name', 'Course Name'],
                    ['code', 'Code'],
                    ['category', 'Category'],
                    ['duration', 'Duration'],
                    ['fees', 'Fees'],
                  ]}
                />
              )}

              {activeTab === 'notices' && (
                <SimpleTable
                  title="Notices"
                  rows={data.notices}
                  columns={[
                    ['title', 'Title'],
                    ['type', 'Type'],
                    ['priority', 'Priority'],
                    ['createdAt', 'Created'],
                  ]}
                />
              )}

              {activeTab === 'students' && (
                <SimpleTable
                  title="Students"
                  rows={data.students}
                  columns={[
                    ['fullName', 'Name'],
                    ['admissionId', 'Admission ID'],
                    ['email', 'Email'],
                    ['mobile', 'Mobile'],
                    ['status', 'Status'],
                  ]}
                />
              )}

              {activeTab === 'inquiries' && (
                <SimpleTable
                  title="Inquiries"
                  rows={data.inquiries}
                  columns={[
                    ['name', 'Name'],
                    ['email', 'Email'],
                    ['phone', 'Phone'],
                    ['course', 'Course'],
                    ['status', 'Status'],
                  ]}
                />
              )}

              {activeTab === 'fees' && (
                <SimpleTable
                  title="Fees"
                  rows={data.fees}
                  columns={[
                    ['student.fullName', 'Student'],
                    ['course.name', 'Course'],
                    ['totalFees', 'Total'],
                    ['paidAmount', 'Paid'],
                    ['pendingAmount', 'Pending'],
                  ]}
                />
              )}

              {activeTab === 'certificates' && (
                <SimpleTable
                  title="Certificates"
                  rows={data.certificates}
                  columns={[
                    ['certificateNumber', 'Certificate No.'],
                    ['student.fullName', 'Student'],
                    ['course.name', 'Course'],
                    ['grade', 'Grade'],
                    ['issueDate', 'Issue Date'],
                  ]}
                />
              )}

              {activeTab === 'faculty' && (
                <SimpleTable
                  title="Faculty"
                  rows={data.faculty}
                  columns={[
                    ['name', 'Name'],
                    ['designation', 'Designation'],
                    ['email', 'Email'],
                    ['phone', 'Phone'],
                    ['experience', 'Experience'],
                  ]}
                />
              )}

              {activeTab === 'gallery' && (
                <SimpleTable
                  title="Gallery"
                  rows={data.gallery}
                  columns={[
                    ['title', 'Title'],
                    ['category', 'Category'],
                    ['description', 'Description'],
                    ['uploadedAt', 'Uploaded'],
                  ]}
                />
              )}
            </>
          )}
        </div>
      </section>
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

function SimpleTable({ title, rows, columns }) {
  return (
    <div>
      <h2>{title}</h2>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              {columns.map(([, label]) => (
                <th key={label}>{label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length}>No records found</td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row._id}>
                  {columns.map(([field, label]) => (
                    <td key={label}>{formatValue(getValue(row, field))}</td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function getValue(row, path) {
  return path.split('.').reduce((value, key) => value?.[key], row);
}

function formatValue(value) {
  if (!value) return 'N/A';
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(value)) {
    return new Date(value).toLocaleDateString();
  }
  if (typeof value === 'object') return value.name || value.fullName || value.title || 'N/A';
  return value;
}
