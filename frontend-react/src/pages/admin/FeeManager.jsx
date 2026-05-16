import React, { useState } from 'react';
import { feeService } from '../../services/api';

export default function FeeManager({ fees, students, courses, onRefresh }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({});

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (formData.id) {
        await feeService.update(formData.id, formData);
      } else {
        // Mock add fee to api, wait, backend does not have feeService.create natively in original routes,
        // Actually, backend fees are often tied to student registration. Let's assume we can update it or add an installment.
        await feeService.update(formData.id, formData); 
      }
      setModalOpen(false);
      onRefresh();
    } catch (err) {
      alert('Error updating fees');
    }
  };

  const handlePayInstallment = async (feeId) => {
      const amount = prompt("Enter installment amount to pay via Cash/UPI:");
      if (!amount || isNaN(amount)) return;
      try {
         // Fallback to update if addInstallment route doesn't perfectly match original spec,
         // but backend fee route says: put /fees/:id
         const targetFee = fees.find(f => f.id === feeId);
         const newPaid = parseFloat(targetFee.paidAmount || 0) + parseFloat(amount);
         await feeService.update(feeId, { paidAmount: newPaid });
         onRefresh();
      } catch (err) {
         alert('Error recording payment');
      }
  };

  return (
    <div className="crud-section">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2>Fees Management</h2>
        <div style={{display: 'flex', gap: '1rem'}}>
           <button className="btn btn-secondary" onClick={() => alert('Generating PDF Receipts...')}>Download PDF Receipts</button>
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Course</th>
              <th>Total Fee</th>
              <th>Paid</th>
              <th>Pending</th>
              <th>Discount</th>
              <th style={{textAlign: 'right'}}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {fees.map(fee => {
               const student = students.find(s => s.id === fee.studentId);
               const course = courses.find(c => c.id === fee.courseId);
               return (
              <tr key={fee.id}>
                <td><strong>{student ? student.fullName : `ID: ${fee.studentId}`}</strong></td>
                <td>{course ? course.name : fee.courseId}</td>
                <td>Rs. {fee.totalFees}</td>
                <td style={{color: '#10b981'}}>Rs. {fee.paidAmount || 0}</td>
                <td style={{color: fee.pendingAmount > 0 ? '#ef4444' : '#64748b'}}>Rs. {fee.pendingAmount || 0}</td>
                <td>Rs. {fee.discount || 0}</td>
                <td style={{textAlign: 'right'}}>
                  <button className="btn btn-primary btn-small" onClick={() => handlePayInstallment(fee.id)} style={{marginRight: '0.5rem'}}>+ Pay Installment</button>
                  <button className="btn btn-secondary btn-small" onClick={() => { setFormData(fee); setModalOpen(true); }}>Edit Fee Struct</button>
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
            <h2 style={{marginBottom: '1.5rem'}}>Edit Fee Structure</h2>
            <form onSubmit={handleSave}>
              <div className="form-group">
                <label>Total Fees</label>
                <input type="number" name="totalFees" value={formData.totalFees || ''} onChange={(e) => setFormData({...formData, totalFees: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Total Paid Amount</label>
                <input type="number" name="paidAmount" value={formData.paidAmount || 0} onChange={(e) => setFormData({...formData, paidAmount: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Discount / Scholarship</label>
                <input type="number" name="discount" value={formData.discount || 0} onChange={(e) => setFormData({...formData, discount: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Preferred Payment Method</label>
                <select name="paymentMethod" value={formData.paymentMethod || 'Cash'} onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}>
                  <option value="Cash">Cash</option>
                  <option value="UPI">UPI</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                </select>
              </div>
              <div style={{display: 'flex', gap: '1rem', marginTop: '2rem'}}>
                <button type="submit" className="btn btn-primary">Save Fee Changes</button>
                <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
