import { useCallback, useMemo, useState } from 'react';
import { feeService } from '../../services/api';

const paymentMethods = ['Cash', 'UPI', 'Bank Transfer', 'Card', 'Cheque'];
const paymentTypes = ['Course Fee', 'Installment', 'Full Payment'];
const feeStatuses = ['All', 'Paid', 'Pending'];

const money = (value) => `Rs. ${Number(value || 0).toFixed(2)}`;
const numberValue = (value) => Number(value || 0);
const today = () => new Date().toISOString().split('T')[0];

const getApiMessage = (error, fallback) => {
  const data = error?.response?.data;
  if (data?.message) return data.message;
  if (Array.isArray(data?.errors) && data.errors.length > 0) return data.errors[0].msg || fallback;
  return fallback;
};

export default function FeeManager({ fees = [], students = [], courses = [], onRefresh }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [historyFee, setHistoryFee] = useState(null);
  const [formData, setFormData] = useState({});
  const [paymentData, setPaymentData] = useState({});
  const [selectedFee, setSelectedFee] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [saving, setSaving] = useState(false);

  const getStudent = useCallback(
    (fee) => students.find((student) => String(student.id) === String(fee.studentId)) || fee.Student,
    [students]
  );
  const getCourse = useCallback(
    (fee) => courses.find((course) => String(course.id) === String(fee.courseId)) || fee.Course,
    [courses]
  );

  const calculateTotal = (data) => numberValue(data.courseFees);
  const calculatePending = (data) => Math.max(calculateTotal(data) - numberValue(data.paidAmount) - numberValue(data.discount), 0);

  const summary = useMemo(() => fees.reduce((totals, fee) => ({
    total: totals.total + numberValue(fee.totalFees),
    paid: totals.paid + numberValue(fee.paidAmount),
    pending: totals.pending + numberValue(fee.pendingAmount),
    discount: totals.discount + numberValue(fee.discount),
  }), { total: 0, paid: 0, pending: 0, discount: 0 }), [fees]);

  const filteredFees = useMemo(() => {
    const query = search.trim().toLowerCase();
    return fees.filter((fee) => {
      const student = getStudent(fee);
      const course = getCourse(fee);
      const searchable = [
        student?.fullName,
        student?.admissionId,
        course?.name,
        fee.paymentMethod,
        fee.paymentType,
      ].filter(Boolean).join(' ').toLowerCase();
      const statusMatch = statusFilter === 'All'
        || (statusFilter === 'Paid' && numberValue(fee.pendingAmount) <= 0)
        || (statusFilter === 'Pending' && numberValue(fee.pendingAmount) > 0);
      return statusMatch && (!query || searchable.includes(query));
    });
  }, [fees, search, statusFilter, getStudent, getCourse]);

  const handleStudentSelect = (studentId) => {
    const student = students.find((item) => String(item.id) === String(studentId));
    const course = courses.find((item) => String(item.id) === String(student?.courseId));
    const courseFees = numberValue(course?.fees);
    setFormData((current) => ({
      ...current,
      studentId,
      courseId: student?.courseId || '',
      courseFees,
      totalFees: courseFees,
    }));
  };

  const handleFeeFieldChange = (field, value) => {
    setFormData((current) => {
      const nextData = { ...current, [field]: value };
      if (field === 'courseId') {
        const course = courses.find((item) => String(item.id) === String(value));
        nextData.courseFees = numberValue(course?.fees);
      }
      nextData.totalFees = calculateTotal(nextData);
      return nextData;
    });
  };

  const validateFeeForm = () => {
    const totalFees = calculateTotal(formData);
    const paidAmount = numberValue(formData.paidAmount);
    const discount = numberValue(formData.discount);

    if (!formData.studentId || !formData.courseId) return 'Select student and course.';
    if (totalFees <= 0) return 'Total fees must be greater than zero.';
    if (paidAmount < 0 || discount < 0) return 'Paid amount and discount cannot be negative.';
    if (paidAmount + discount > totalFees) return 'Paid amount and discount cannot be greater than total fees.';
    return '';
  };

  const handleSave = async (event) => {
    event.preventDefault();
    const validationMessage = validateFeeForm();
    if (validationMessage) {
      alert(validationMessage);
      return;
    }

    try {
      setSaving(true);
      const payload = {
        studentId: formData.studentId,
        courseId: formData.courseId,
        admissionFees: 0,
        courseFees: numberValue(formData.courseFees),
        totalFees: calculateTotal(formData),
        paidAmount: numberValue(formData.paidAmount),
        discount: numberValue(formData.discount),
        paymentMethod: formData.paymentMethod || 'Cash',
        paymentType: formData.paymentType || 'Installment',
        paidDate: formData.paidDate || today(),
      };

      if (formData.id) {
        await feeService.update(formData.id, payload);
      } else {
        await feeService.create(payload);
      }
      setModalOpen(false);
      setFormData({});
      onRefresh();
    } catch (error) {
      alert(getApiMessage(error, 'Error saving fee record'));
    } finally {
      setSaving(false);
    }
  };

  const openFeeModal = (fee = null) => {
    if (fee) {
      setFormData({
        ...fee,
        courseFees: numberValue(fee.courseFees || fee.totalFees),
        paidAmount: numberValue(fee.paidAmount),
        discount: numberValue(fee.discount),
      });
    } else {
      setFormData({
        courseFees: 0,
        totalFees: 0,
        paidAmount: 0,
        discount: 0,
        paymentMethod: 'Cash',
        paymentType: 'Installment',
        paidDate: today(),
      });
    }
    setModalOpen(true);
  };

  const openPaymentModal = (fee) => {
    if (numberValue(fee.pendingAmount) <= 0) {
      alert('This fee record is already fully paid.');
      return;
    }
    setSelectedFee(fee);
    setPaymentData({
      amount: '',
      paymentMethod: fee.paymentMethod || 'Cash',
      paymentType: 'Installment',
      paidDate: today(),
      note: '',
    });
    setPaymentModalOpen(true);
  };

  const handlePaymentSave = async (event) => {
    event.preventDefault();
    const amount = numberValue(paymentData.amount);
    const pendingAmount = numberValue(selectedFee?.pendingAmount);

    if (amount <= 0) {
      alert('Enter a valid payment amount.');
      return;
    }
    if (amount > pendingAmount) {
      alert('Payment amount cannot be greater than pending fees.');
      return;
    }

    try {
      setSaving(true);
      await feeService.addInstallment(selectedFee.id, { ...paymentData, amount });
      setPaymentModalOpen(false);
      setSelectedFee(null);
      onRefresh();
    } catch (error) {
      alert(getApiMessage(error, 'Error recording installment/payment'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (fee) => {
    const student = getStudent(fee);
    if (!window.confirm(`Delete fee record for ${student?.fullName || 'this student'}?`)) return;

    try {
      await feeService.delete(fee.id);
      onRefresh();
    } catch (error) {
      alert(getApiMessage(error, 'Error deleting fee record'));
    }
  };

  return (
    <div className="crud-section">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', gap: '1rem', flexWrap: 'wrap' }}>
        <h2>Fees Management</h2>
        <button className="btn btn-primary" onClick={() => openFeeModal()}>+ Add Fee Record</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(150px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <FeeStat label="Total Fees" value={summary.total} color="#0f172a" />
        <FeeStat label="Collected" value={summary.paid} color="#059669" />
        <FeeStat label="Pending" value={summary.pending} color="#dc2626" />
        <FeeStat label="Discount" value={summary.discount} color="#7c3aed" />
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Search student, admission ID, course..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          style={{ maxWidth: '360px' }}
        />
        <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} style={{ maxWidth: '180px' }}>
          {feeStatuses.map((status) => <option key={status} value={status}>{status} Fees</option>)}
        </select>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Student</th>
              <th>Course</th>
              <th>Course Fee</th>
              <th>Total</th>
              <th>Paid</th>
              <th>Pending</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredFees.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '2rem' }}>No fee records found.</td>
              </tr>
            ) : filteredFees.map((fee) => {
              const student = getStudent(fee);
              const course = getCourse(fee);
              const installments = Array.isArray(fee.installments) ? fee.installments : [];
              const isPaid = numberValue(fee.pendingAmount) <= 0;
              return (
                <tr key={fee.id}>
                  <td>
                    <strong>{student?.fullName || `ID: ${fee.studentId}`}</strong>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{student?.admissionId || ''}</div>
                  </td>
                  <td>{course?.name || fee.courseId}</td>
                  <td>{money(fee.courseFees || fee.totalFees)}</td>
                  <td><strong>{money(fee.totalFees)}</strong></td>
                  <td style={{ color: '#059669', fontWeight: 700 }}>{money(fee.paidAmount)}</td>
                  <td style={{ color: isPaid ? '#64748b' : '#dc2626', fontWeight: 700 }}>{money(fee.pendingAmount)}</td>
                  <td>
                    <span className={`status-badge ${isPaid ? 'completed' : 'active'}`}>{isPaid ? 'Paid' : 'Pending'}</span>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>
                      {fee.paymentMethod || 'Cash'} | {installments.length} payment(s)
                    </div>
                  </td>
                  <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                    <button className="btn btn-primary btn-small" onClick={() => openPaymentModal(fee)} disabled={isPaid} style={{ marginRight: '0.5rem' }}>Pay</button>
                    <button className="btn btn-secondary btn-small" onClick={() => setHistoryFee(fee)} style={{ marginRight: '0.5rem' }}>History</button>
                    <button className="btn btn-secondary btn-small" onClick={() => openFeeModal(fee)} style={{ marginRight: '0.5rem' }}>Edit</button>
                    <button className="btn btn-secondary btn-small" onClick={() => handleDelete(fee)} style={{ color: '#ef4444', borderColor: '#fee2e2' }}>Delete</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="modal">
          <div className="modal-content" style={{ maxWidth: '720px', padding: '2rem' }}>
            <button className="close" onClick={() => setModalOpen(false)}>x</button>
            <h2 style={{ marginBottom: '1.5rem' }}>{formData.id ? 'Edit Fee Record' : 'Add Fee Record'}</h2>
            <form onSubmit={handleSave}>
              <div className="form-group">
                <label>Student *</label>
                <select value={formData.studentId || ''} onChange={(event) => handleStudentSelect(event.target.value)} required disabled={Boolean(formData.id)}>
                  <option value="">Select Student</option>
                  {students.map((student) => (
                    <option key={student.id} value={student.id}>{student.fullName} ({student.admissionId})</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Course *</label>
                <select value={formData.courseId || ''} onChange={(event) => handleFeeFieldChange('courseId', event.target.value)} required>
                  <option value="">Select Course</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>{course.name} - {money(course.fees)}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '1rem' }}>
                <FormNumber label="Course Fees" value={formData.courseFees} onChange={(value) => handleFeeFieldChange('courseFees', value)} />
                <ReadOnlyAmount label="Total Fees" value={calculateTotal(formData)} />
                <FormNumber label="Discount / Scholarship" value={formData.discount} onChange={(value) => handleFeeFieldChange('discount', value)} />
                <FormNumber label="Paid Amount" value={formData.paidAmount} onChange={(value) => handleFeeFieldChange('paidAmount', value)} />
                <ReadOnlyAmount label="Pending Amount" value={calculatePending(formData)} />
                <div className="form-group">
                  <label>Payment Method</label>
                  <select value={formData.paymentMethod || 'Cash'} onChange={(event) => handleFeeFieldChange('paymentMethod', event.target.value)}>
                    {paymentMethods.map((method) => <option key={method} value={method}>{method}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Payment Type</label>
                  <select value={formData.paymentType || 'Installment'} onChange={(event) => handleFeeFieldChange('paymentType', event.target.value)}>
                    {paymentTypes.map((type) => <option key={type} value={type}>{type}</option>)}
                  </select>
                </div>
                {!formData.id && (
                  <div className="form-group">
                    <label>Opening Payment Date</label>
                    <input type="date" value={formData.paidDate || today()} onChange={(event) => handleFeeFieldChange('paidDate', event.target.value)} />
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save Fee Record'}</button>
                <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {paymentModalOpen && selectedFee && (
        <div className="modal">
          <div className="modal-content" style={{ maxWidth: '520px', padding: '2rem' }}>
            <button className="close" onClick={() => setPaymentModalOpen(false)}>x</button>
            <h2 style={{ marginBottom: '1rem' }}>Record Payment</h2>
            <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
              Pending: <strong>{money(selectedFee.pendingAmount)}</strong>
            </p>
            <form onSubmit={handlePaymentSave}>
              <FormNumber label="Amount *" value={paymentData.amount} min="1" onChange={(value) => setPaymentData({ ...paymentData, amount: value })} required />
              <div className="form-group">
                <label>Payment Type *</label>
                <select value={paymentData.paymentType} onChange={(event) => setPaymentData({ ...paymentData, paymentType: event.target.value })} required>
                  {paymentTypes.map((type) => <option key={type} value={type}>{type}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Payment Method *</label>
                <select value={paymentData.paymentMethod} onChange={(event) => setPaymentData({ ...paymentData, paymentMethod: event.target.value })} required>
                  {paymentMethods.map((method) => <option key={method} value={method}>{method}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Payment Date</label>
                <input type="date" value={paymentData.paidDate} onChange={(event) => setPaymentData({ ...paymentData, paidDate: event.target.value })} />
              </div>
              <div className="form-group">
                <label>Note / Transaction ID</label>
                <input type="text" value={paymentData.note} onChange={(event) => setPaymentData({ ...paymentData, note: event.target.value })} placeholder="UPI ref, receipt note, etc." />
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save Payment'}</button>
                <button type="button" className="btn btn-secondary" onClick={() => setPaymentModalOpen(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {historyFee && (
        <div className="modal">
          <div className="modal-content" style={{ maxWidth: '720px', padding: '2rem' }}>
            <button className="close" onClick={() => setHistoryFee(null)}>x</button>
            <h2 style={{ marginBottom: '1rem' }}>Payment History</h2>
            <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
              {getStudent(historyFee)?.fullName || `Student ID: ${historyFee.studentId}`} | Total {money(historyFee.totalFees)}
            </p>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Receipt</th>
                    <th>Type</th>
                    <th>Method</th>
                    <th>Note</th>
                    <th style={{ textAlign: 'right' }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {(Array.isArray(historyFee.installments) ? historyFee.installments : []).length === 0 ? (
                    <tr><td colSpan="6" style={{ textAlign: 'center', padding: '1.5rem' }}>No payments recorded.</td></tr>
                  ) : historyFee.installments.map((payment, index) => (
                    <tr key={`${payment.receiptNumber || 'payment'}-${index}`}>
                      <td>{payment.paidDate ? new Date(payment.paidDate).toLocaleDateString() : '-'}</td>
                      <td>{payment.receiptNumber || '-'}</td>
                      <td>{payment.paymentType || '-'}</td>
                      <td>{payment.paymentMethod || '-'}</td>
                      <td>{payment.note || '-'}</td>
                      <td style={{ textAlign: 'right', fontWeight: 700 }}>{money(payment.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FeeStat({ label, value, color }) {
  return (
    <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem' }}>
      <div style={{ color: '#64748b', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase' }}>{label}</div>
      <div style={{ color, fontSize: '1.2rem', fontWeight: 800, marginTop: '0.35rem' }}>{money(value)}</div>
    </div>
  );
}

function FormNumber({ label, value, onChange, min = '0', required = false }) {
  return (
    <div className="form-group">
      <label>{label}</label>
      <input type="number" min={min} step="0.01" value={value ?? ''} onChange={(event) => onChange(event.target.value)} required={required} />
    </div>
  );
}

function ReadOnlyAmount({ label, value }) {
  return (
    <div className="form-group">
      <label>{label}</label>
      <input type="number" value={Number(value || 0).toFixed(2)} readOnly />
    </div>
  );
}
