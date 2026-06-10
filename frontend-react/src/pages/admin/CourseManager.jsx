import { useState } from 'react';
import { courseService, getAssetUrl } from '../../services/api';

export default function CourseManager({ courses, faculty, onRefresh }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({});

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this course permanently?')) return;
    try {
      await courseService.delete(id);
      onRefresh();
    } catch {
      alert('Error deleting course');
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const payload = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value === undefined || value === null || value === '') return;
        if (key === 'image' && !(value instanceof File)) return;
        if (typeof value === 'object' && !(value instanceof File)) return;
        payload.append(key, value);
      });

      if (formData.id) {
        await courseService.update(formData.id, payload);
      } else {
        await courseService.create(payload);
      }
      setModalOpen(false);
      onRefresh();
    } catch {
      alert('Error saving course');
    }
  };

  return (
    <div className="crud-section">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2>Course Management</h2>
        <button className="btn btn-primary" onClick={() => { setFormData({}); setModalOpen(true); }}>+ Add Course</button>
      </div>

      <div className="courses-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))' }}>
        {courses.map(course => (
          <div key={course.id} className="course-card-detailed">
            {course.image && (
              <img
                className="course-card-image"
                src={getAssetUrl(course.image)}
                alt={course.name}
                onError={(event) => {
                  event.currentTarget.style.display = 'none';
                }}
              />
            )}
            <span className="course-badge">{course.category}</span>
            <div className="course-code">{course.code}</div>
            <h3 style={{fontSize: '1.25rem', marginTop: '0.5rem'}}>{course.name}</h3>
            <p className="course-description">{course.description || 'No description provided.'}</p>
            
            <div className="course-meta">
              <span><strong>Duration</strong>{course.duration}</span>
              <span><strong>Fees</strong>Rs. {course.fees}</span>
              <span><strong>Faculty</strong>{course.Faculty?.name || course.facultyId || 'Unassigned'}</span>
            </div>
            
            <div style={{display: 'flex', gap: '0.5rem', marginTop: '1rem', borderTop: '1px solid #e2e8f0', paddingTop: '1rem'}}>
              <button className="btn btn-secondary btn-small" style={{flex: 1}} onClick={() => { setFormData(course); setModalOpen(true); }}>Edit Course</button>
              <button className="btn btn-secondary btn-small" style={{color: '#ef4444', borderColor: '#fee2e2'}} onClick={() => handleDelete(course.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="modal">
          <div className="modal-content" style={{maxWidth: '600px', padding: '2rem'}}>
            <button className="close" onClick={() => setModalOpen(false)}>×</button>
            <h2 style={{marginBottom: '1.5rem'}}>{formData.id ? 'Edit Course' : 'Add Course'}</h2>
            <form onSubmit={handleSave}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                 <div className="form-group">
                   <label>Course Name *</label>
                   <input type="text" name="name" value={formData.name || ''} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                 </div>
                 <div className="form-group">
                   <label>Course Code *</label>
                   <input type="text" name="code" value={formData.code || ''} onChange={(e) => setFormData({...formData, code: e.target.value})} required />
                 </div>
                 <div className="form-group">
                   <label>Category *</label>
                   <select name="category" value={formData.category || ''} onChange={(e) => setFormData({...formData, category: e.target.value})} required>
                     <option value="">Select Category</option>
                     <option value="Basic">Basic</option>
                     <option value="Advanced">Advanced</option>
                     <option value="Certification">Certification</option>
                     <option value="Skill Development">Skill Development</option>
                   </select>
                 </div>
                 <div className="form-group">
                   <label>Duration *</label>
                   <input type="text" name="duration" value={formData.duration || ''} onChange={(e) => setFormData({...formData, duration: e.target.value})} required />
                 </div>
                 <div className="form-group">
                   <label>Course Fees (Rs) *</label>
                   <input type="number" name="fees" value={formData.fees || ''} onChange={(e) => setFormData({...formData, fees: e.target.value})} required />
                 </div>
                 <div className="form-group">
                   <label>Course Photo</label>
                   <input type="file" name="image" accept="image/jpeg,image/png,image/gif" onChange={(e) => setFormData({...formData, image: e.target.files?.[0] || formData.image})} />
                   {typeof formData.image === 'string' && formData.image && (
                     <small style={{color: '#64748b', display: 'block', marginTop: '0.35rem'}}>Current photo saved</small>
                   )}
                 </div>
                 <div className="form-group">
                   <label>Assign Primary Faculty</label>
                   <select name="facultyId" value={formData.facultyId || ''} onChange={(e) => setFormData({...formData, facultyId: e.target.value})}>
                      <option value="">Select Faculty</option>
                      {faculty.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                   </select>
                 </div>
                 <div className="form-group" style={{gridColumn: '1 / -1'}}>
                   <label>Course Description</label>
                   <textarea name="description" value={formData.description || ''} onChange={(e) => setFormData({...formData, description: e.target.value})} rows="4" />
                 </div>
              </div>
              <div style={{display: 'flex', gap: '1rem', marginTop: '2rem'}}>
                <button type="submit" className="btn btn-primary">Save Course</button>
                <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
