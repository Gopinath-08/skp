import { useState } from 'react';
import '../styles/pages.css';

export default function StudentZone() {
  const [admissionId, setAdmissionId] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (!admissionId.trim()) {
      setError('Please enter a valid Admission ID.');
      return;
    }
    setLoading(true);
    setError('');
    
    // Simulate API call for now since we might not have a public endpoint
    setTimeout(() => {
      setLoading(false);
      // Mock data response based on typical DB schema
      setResult({
        admissionId: admissionId.toUpperCase(),
        fullName: 'Student Name',
        course: 'DCA',
        status: 'Active',
        certificateStatus: 'Pending',
      });
    }, 1000);
  };

  return (
    <div className="page-shell">
      <div className="section-heading" style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <span>Student Portal</span>
        <h2>Student Zone</h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '1rem auto' }}>
          Check your admission status, course details, and certificate issuance status by entering your Admission ID below.
        </p>
      </div>

      <div style={{ maxWidth: '600px', margin: '0 auto', background: 'var(--surface-light)', padding: '2rem', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-color)' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Admission ID / Registration Number</label>
            <input 
              type="text" 
              placeholder="e.g. ICE26TLG001 or ICE26KHR001" 
              value={admissionId}
              onChange={(e) => setAdmissionId(e.target.value)}
              style={{ fontSize: '1.125rem', padding: '0.75rem 1rem' }}
            />
          </div>
          {error && <div style={{ color: 'var(--error)', fontSize: '0.875rem' }}>{error}</div>}
          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.875rem' }} disabled={loading}>
            {loading ? 'Searching...' : 'Check Status'}
          </button>
        </form>

        {result && (
          <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'var(--primary-light)', borderRadius: 'var(--radius-lg)' }} className="animate-fade-in">
            <h3 style={{ color: 'var(--primary-color)', marginBottom: '1rem', fontSize: '1.25rem' }}>Student Details</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>Admission ID</div>
                <div style={{ fontWeight: 600 }}>{result.admissionId}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>Student Name</div>
                <div style={{ fontWeight: 600 }}>{result.fullName}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>Course Enrolled</div>
                <div style={{ fontWeight: 600 }}>{result.course}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>Admission Status</div>
                <div><span className={`status-badge active`}>{result.status}</span></div>
              </div>
              <div style={{ gridColumn: '1 / -1', marginTop: '0.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>Certificate Status</div>
                <div style={{ fontWeight: 600, color: result.certificateStatus === 'Issued' ? 'var(--success)' : 'var(--warning)' }}>
                  {result.certificateStatus}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
