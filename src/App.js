import React, { useState, useEffect } from 'react';
import TreeView from './components/TreeView';
import DetailPanel from './components/DetailPanel';
import MemberModal from './components/MemberModal';
import SearchBar from './components/SearchBar';
import { getRootMembers, getMemberById, isValidParentChange } from './utils/familyHelpers';
import './App.css';

const generateId = () => crypto.randomUUID ? crypto.randomUUID() : Date.now() + '-' + Math.random().toString(36);

// Sample initial data
const initialMembers = [
  { id: '1', name: 'Amit Sharma', gender: 'Male', dob: '1965-04-12', fatherId: null, motherId: null },
  { id: '2', name: 'Sunita Sharma', gender: 'Female', dob: '1968-07-23', fatherId: null, motherId: null },
  { id: '3', name: 'Rohan Sharma', gender: 'Male', dob: '1992-03-10', fatherId: '1', motherId: '2' },
  { id: '4', name: 'Aarav Sharma', gender: 'Male', dob: '2018-09-15', fatherId: '3', motherId: null },
  { id: '5', name: 'Priya Verma', gender: 'Female', dob: '1995-11-02', fatherId: null, motherId: null }
];

function App() {
  const [members, setMembers] = useState(() => {
    const stored = localStorage.getItem('familyTreeData');
    return stored ? JSON.parse(stored) : initialMembers;
  });
  const [selectedMemberId, setSelectedMemberId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('familyTreeData', JSON.stringify(members));
  }, [members]);

  const handleAdd = () => {
    setEditingId(null);
    setShowModal(true);
  };

  const handleEdit = (member) => {
    setEditingId(member.id);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (!window.confirm('Delete this member? Children will lose parent references.')) return;
    let updated = members.filter(m => m.id !== id);
    updated = updated.map(m => ({
      ...m,
      fatherId: m.fatherId === id ? null : m.fatherId,
      motherId: m.motherId === id ? null : m.motherId
    }));
    setMembers(updated);
    if (selectedMemberId === id) setSelectedMemberId(null);
  };

  const saveMember = (formData) => {
    if (editingId) {
      // Validate cycles for parent changes
      if (formData.fatherId && !isValidParentChange(members, editingId, formData.fatherId)) {
        alert('Invalid father: would create a cycle');
        return;
      }
      if (formData.motherId && !isValidParentChange(members, editingId, formData.motherId)) {
        alert('Invalid mother: would create a cycle');
        return;
      }
      setMembers(members.map(m =>
        m.id === editingId
          ? { ...m, ...formData, fatherId: formData.fatherId || null, motherId: formData.motherId || null }
          : m
      ));
    } else {
      const newMember = {
        id: generateId(),
        ...formData,
        fatherId: formData.fatherId || null,
        motherId: formData.motherId || null
      };
      setMembers([...members, newMember]);
    }
    setShowModal(false);
  };

  const exportData = () => {
    const dataStr = JSON.stringify(members, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `familytree_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importData = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target.result);
        if (Array.isArray(imported)) {
          if (window.confirm('Replace current tree with imported data?')) {
            setMembers(imported);
            setSelectedMemberId(null);
          }
        } else {
          alert('Invalid file: not an array');
        }
      } catch (err) {
        alert('Error parsing JSON');
      }
    };
    reader.readAsText(file);
  };

  const rootMembers = getRootMembers(members);
  const selectedMember = getMemberById(members, selectedMemberId);

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>🌳 Family Tree Builder</h1>
        <div className="toolbar">
          <button className="btn-primary" onClick={handleAdd}>+ Add Member</button>
          <button onClick={exportData}>📤 Export JSON</button>
          <label className="btn-secondary">
            📥 Import JSON
            <input
              type="file"
              accept=".json"
              style={{ display: 'none' }}
              onChange={(e) => e.target.files && importData(e.target.files[0])}
            />
          </label>
        </div>
      </header>

      <div className="main-layout">
        <aside className="tree-panel">
          <SearchBar members={members} onSelect={setSelectedMemberId} />
          <div className="tree-view">
            {rootMembers.length === 0 && members.length === 0 && (
              <p className="empty-message">🌱 No members yet. Click "Add Member" to start.</p>
            )}
            {rootMembers.length === 0 && members.length > 0 && (
              <p className="empty-message">⚠️ No root ancestors found. Check parent relationships.</p>
            )}
            <TreeView
              members={members}
              rootMembers={rootMembers}
              selectedId={selectedMemberId}
              onSelect={setSelectedMemberId}
            />
          </div>
        </aside>

        <section className="detail-panel">
          <DetailPanel
            member={selectedMember}
            members={members}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onSelectMember={setSelectedMemberId}
          />
        </section>
      </div>

      {showModal && (
        <MemberModal
          editingId={editingId}
          members={members}
          onSave={saveMember}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

export default App;