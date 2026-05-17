import React, { useState } from 'react';

export default function DashboardOverview({ stats, activities }) {
  if (!stats) return <p>Loading overview...</p>;

  return (
    <div className="dashboard-section">
      <div className="stats-grid">
        <StatCard label="Total Students" value={stats.totalStudents} color="#3b82f6" />
        <StatCard label="Active Courses" value={stats.totalCourses} color="#10b981" />
        <StatCard label="Faculty Members" value={stats.totalFaculty || 0} color="#8b5cf6" />
        <StatCard label="Total Batches" value={stats.totalBatches || 0} color="#f59e0b" />
        <StatCard label="Fees Collected" value={`Rs. ${stats.totalRevenue || 0}`} color="#059669" />
        <StatCard label="Pending Fees" value={`Rs. ${stats.pendingFees || 0}`} color="#ef4444" />
        <StatCard label="New Leads" value={stats.newInquiries || 0} color="#ec4899" />
        <StatCard label="Notices" value={stats.totalNotices || 0} color="#64748b" />
      </div>

      <div className="analytics-charts" style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
         <div className="stat-card" style={{minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc'}}>
            <p style={{color: '#94a3b8'}}>Monthly Analytics Chart Placeholder</p>
         </div>
         <div className="stat-card" style={{minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc'}}>
            <p style={{color: '#94a3b8'}}>Admissions Trend Placeholder</p>
         </div>
      </div>

      {activities && (
        <div className="recent-grid" style={{marginTop: '2rem'}}>
          <RecentList title="Recent Admissions" items={activities.recentStudents} fields={['fullName', 'admissionId']} />
          <RecentList title="Recent Inquiries" items={activities.recentInquiries} fields={['name', 'course', 'status']} />
          <RecentList title="Recent Notifications" items={activities.recentNotices} fields={['title', 'type']} />
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, color }) {
  return (
    <div className="stat-card" style={{ borderTop: `4px solid ${color}` }}>
      <h3 style={{ color }}>{value}</h3>
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

function getValue(row, path) {
  return path.split('.').reduce((value, key) => value?.[key], row);
}
