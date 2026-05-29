import React, { useState, useEffect } from 'react';
import { getMemberById } from '../utils/familyHelpers';

const MemberModal = ({ editingId, members, onSave, onClose }) => {
  const [form, setForm] = useState({
    name: '',
    gender: 'Male',
    dob: '',
    fatherId: '',
    motherId: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingId) {
      const member = getMemberById(members, editingId);
      if (member) {
        setForm({
          name: member.name,
          gender: member.gender,
          dob: member.dob || '',
          fatherId: member.fatherId || '',
          motherId: member.motherId || ''
        });
      }
    } else {
      setForm({ name: '', gender: 'Male', dob: '', fatherId: '', motherId: '' });
    }
  }, [editingId, members]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError('Name is required');
      return;
    }
    onSave(form);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h3>{editingId ? '✏️ Edit Member' : '➕ Add New Member'}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name *</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Full name"
              required
            />
          </div>
          <div className="form-group">
            <label>Gender</label>
            <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>
          <div className="form-group">
            <label>Date of Birth</label>
            <input
              type="date"
              value={form.dob}
              onChange={(e) => setForm({ ...form, dob: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Select Father</label>
            <select value={form.fatherId} onChange={(e) => setForm({ ...form, fatherId: e.target.value })}>
              <option value="">— None —</option>
              {members.filter(m => m.id !== editingId).map(m => (
                <option key={m.id} value={m.id}>{m.name} ({m.gender})</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Select Mother</label>
            <select value={form.motherId} onChange={(e) => setForm({ ...form, motherId: e.target.value })}>
              <option value="">— None —</option>
              {members.filter(m => m.id !== editingId).map(m => (
                <option key={m.id} value={m.id}>{m.name} ({m.gender})</option>
              ))}
            </select>
          </div>
          {error && <div className="error-msg">{error}</div>}
          <div className="modal-actions">
            <button type="button" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MemberModal;