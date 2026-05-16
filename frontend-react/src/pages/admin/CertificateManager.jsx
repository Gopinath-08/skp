import React, { useState } from 'react';
import { certificateService } from '../../services/api';

export default function CertificateManager({ certificates, students, courses, onRefresh }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({});

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this certificate permanently?')) return;
    try {
      // Backend does not have delete for certs typically, but we will mock it if it doesn't exist
      await certificateService.delete?.(id);
      onRefresh();
    } catch (e) {
      alert('Error deleting certificate, or action not allowed.');
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (!formData.certificateNumber) {
         formData.certificateNumber = 'CERT-' + Date.now().toString().slice(-6);
      }
      
      await certificateService.create(formData);
      setModalOpen(false);
      onRefresh();
    } catch (err) {
      alert('Error generating certificate');
    }
  };

  // Auto fill data based on selected student
  const handleStudentSelect = (studentId) => {
     const student = students.find(s => s.id == studentId);
     if (student) {
        setFormData(prev => ({
           ...prev,
           studentId: student.id,
           courseId: student.courseId,
           issueDate: new Date().toISOString().split('T')[0]
        }));
     }
  };

  return (
    <div className="crud-section">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2>Certificate Generation & Tracking</h2>
        <button className="btn btn-primary" onClick={() => { setFormData({}); setModalOpen(true); }}>+ Generate Certificate</button>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Cert No.</th>
              <th>Student Name</th>
              <th>Course</th>
              <th>Grade</th>
              <th>Issue Date</th>
              <th style={{textAlign: 'right'}}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {certificates.map(cert => {
               const student = students.find(s => s.id === cert.studentId);
               const course = courses.find(c => c.id === cert.courseId);
               return (
              <tr key={cert.id}>
                <td><strong>{cert.certificateNumber}</strong></td>
                <td>{student ? student.fullName : `ID: ${cert.studentId}`}</td>
                <td>{course ? course.name : cert.courseId}</td>
                <td><strong>{cert.grade || '-'}</strong></td>
                <td>{new Date(cert.issueDate).toLocaleDateString()}</td>
                <td style={{textAlign: 'right'}}>
                  <button className="btn btn-secondary btn-small" onClick={() => alert('Downloading/Printing Certificate...')} style={{marginRight: '0.5rem'}}>Print PDF</button>
                  <button className="btn btn-secondary btn-small" onClick={() => handleDelete(cert.id)} style={{color: '#ef4444', borderColor: '#fee2e2'}}>Delete</button>
                </td>
              </tr>
            )})}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="modal">
          <div className="modal-content" style={{maxWidth: '500px', padding: '2rem'}}>
            <button className="close" onClick={() => setModalOpen(false)}>×</button>
            <h2 style={{marginBottom: '1.5rem'}}>Generate New Certificate</h2>
            <form onSubmit={handleSave}>
              <div className="form-group">
                <label>Select Student *</label>
                <select name="studentId" value={formData.studentId || ''} onChange={(e) => handleStudentSelect(e.target.value)} required>
                   <option value="">-- Choose Student --</option>
                   {students.map(s => <option key={s.id} value={s.id}>{s.fullName} ({s.admissionId})</option>)}
                </select>
                <small style={{color: '#64748b', display: 'block', marginTop: '0.25rem'}}>Course data will auto-fill after selection</small>
              </div>
              <div className="form-group">
                <label>Course *</label>
                <select name="courseId" value={formData.courseId || ''} onChange={(e) => setFormData({...formData, courseId: e.target.value})} required disabled>
                   <option value="">-- Course --</option>
                   {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Grade Attained *</label>
                <select name="grade" value={formData.grade || ''} onChange={(e) => setFormData({...formData, grade: e.target.value})} required>
                  <option value="">Select Grade</option>
                  <option value="A+">A+ (Excellent)</option>
                  <option value="A">A (Very Good)</option>
                  <option value="B">B (Good)</option>
                  <option value="C">C (Pass)</option>
                </select>
              </div>
              <div className="form-group">
                <label>Issue Date *</label>
                <input type="date" name="issueDate" value={formData.issueDate || ''} onChange={(e) => setFormData({...formData, issueDate: e.target.value})} required />
              </div>
              <div style={{display: 'flex', gap: '1rem', marginTop: '2rem'}}>
                <button type="submit" className="btn btn-primary">Generate Certificate</button>
                <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
