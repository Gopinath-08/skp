import React, { useState } from 'react';
import { studentService } from '../../services/api';

export default function StudentManager({ students, courses, batches, onRefresh }) {
  const [search, setSearch] = useState('');
  const [filterCourse, setFilterCourse] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({});

  const filteredStudents = students.filter(s => {
    const matchSearch = (s.fullName || '').toLowerCase().includes(search.toLowerCase()) || 
                        (s.admissionId || '').toLowerCase().includes(search.toLowerCase());
    const matchCourse = filterCourse ? s.courseId == filterCourse : true;
    return matchSearch && matchCourse;
  });

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this student permanently?')) return;
    try {
      await studentService.delete(id);
      onRefresh();
    } catch (e) {
      alert('Error deleting student');
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (!formData.admissionId) {
         formData.admissionId = 'ICE' + Date.now().toString().slice(-6);
      }
      
      if (formData.id) {
        await studentService.update(formData.id, formData);
      } else {
        await studentService.create(formData);
      }
      setModalOpen(false);
      onRefresh();
    } catch (err) {
      alert('Error saving student');
    }
  };

  return (
    <div className="crud-section">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2>Student Management</h2>
        <div style={{display: 'flex', gap: '1rem'}}>
           <button className="btn btn-secondary" onClick={() => alert('Downloading CSV...')}>Export Excel</button>
           <button className="btn btn-primary" onClick={() => { setFormData({}); setModalOpen(true); }}>+ Add Student</button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        <input 
          type="text" 
          placeholder="Search by name or admission ID..." 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
          style={{ maxWidth: '300px' }}
        />
        <select value={filterCourse} onChange={(e) => setFilterCourse(e.target.value)} style={{ maxWidth: '200px' }}>
          <option value="">All Courses</option>
          {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Photo</th>
              <th>Name</th>
              <th>Contact</th>
              <th>Course</th>
              <th>Status</th>
              <th style={{textAlign: 'right'}}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map(student => (
              <tr key={student.id}>
                <td><strong>{student.admissionId}</strong></td>
                <td>
                   <div style={{width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px'}}>
                      {student.photo ? 'IMG' : 'N/A'}
                   </div>
                </td>
                <td>
                  <div>{student.fullName}</div>
                  <div style={{fontSize: '0.75rem', color: '#64748b'}}>D/O, S/O: {student.parentsName}</div>
                </td>
                <td>{student.mobile}</td>
                <td>{courses.find(c => c.id === student.courseId)?.name || student.courseId}</td>
                <td><span className={`status-badge ${student.status?.toLowerCase()}`}>{student.status || 'Active'}</span></td>
                <td style={{textAlign: 'right'}}>
                  <button className="btn btn-secondary btn-small" onClick={() => { setFormData(student); setModalOpen(true); }} style={{marginRight: '0.5rem'}}>Edit</button>
                  <button className="btn btn-secondary btn-small" onClick={() => handleDelete(student.id)} style={{color: '#ef4444', borderColor: '#fee2e2'}}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="modal">
          <div className="modal-content" style={{maxWidth: '800px', padding: '2rem'}}>
            <button className="close" onClick={() => setModalOpen(false)}>×</button>
            <h2 style={{marginBottom: '1.5rem'}}>{formData.id ? 'Edit Student Profile' : 'Add New Student'}</h2>
            
            <form onSubmit={handleSave}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Full Name *</label>
                  <input type="text" name="fullName" value={formData.fullName || ''} onChange={(e) => setFormData({...formData, fullName: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Father's Name *</label>
                  <input type="text" name="parentsName" value={formData.parentsName || ''} onChange={(e) => setFormData({...formData, parentsName: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Date of Birth *</label>
                  <input type="date" name="dob" value={formData.dob ? formData.dob.split('T')[0] : ''} onChange={(e) => setFormData({...formData, dob: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Gender *</label>
                  <select name="gender" value={formData.gender || ''} onChange={(e) => setFormData({...formData, gender: e.target.value})} required>
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Contact Number *</label>
                  <input type="text" name="mobile" value={formData.mobile || ''} onChange={(e) => setFormData({...formData, mobile: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Email Address *</label>
                  <input type="email" name="email" value={formData.email || ''} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Aadhaar Number *</label>
                  <input type="text" name="aadhaar" value={formData.aadhaar || ''} onChange={(e) => setFormData({...formData, aadhaar: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Qualification *</label>
                  <input type="text" name="qualification" value={formData.qualification || ''} onChange={(e) => setFormData({...formData, qualification: e.target.value})} required />
                </div>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>Address *</label>
                  <textarea name="address" value={formData.address || ''} onChange={(e) => setFormData({...formData, address: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Assign Course *</label>
                  <select name="courseId" value={formData.courseId || ''} onChange={(e) => setFormData({...formData, courseId: e.target.value})} required>
                    <option value="">Select Course</option>
                    {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Assign Batch</label>
                  <select name="batchId" value={formData.batchId || ''} onChange={(e) => setFormData({...formData, batchId: e.target.value})}>
                    <option value="">Select Batch</option>
                    {batches.map(b => <option key={b.id} value={b.id}>{b.name} - {b.timing}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select name="status" value={formData.status || 'Active'} onChange={(e) => setFormData({...formData, status: e.target.value})}>
                    <option value="Active">Active</option>
                    <option value="Completed">Completed</option>
                    <option value="Dropped">Dropped</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Admission Date</label>
                  <input type="date" name="admissionDate" value={formData.admissionDate ? formData.admissionDate.split('T')[0] : ''} onChange={(e) => setFormData({...formData, admissionDate: e.target.value})} />
                </div>
              </div>
              <div style={{display: 'flex', gap: '1rem', marginTop: '2rem', borderTop: '1px solid #e2e8f0', paddingTop: '1rem'}}>
                <button type="submit" className="btn btn-primary">Save Student Details</button>
                <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
