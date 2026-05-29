import React from 'react';
import { getParents, getChildren, getSiblings } from '../utils/familyHelpers';

const DetailPanel = ({ member, members, onEdit, onDelete, onSelectMember }) => {
  if (!member) {
    return (
      <div className="detail-empty">
        👈 Select a family member to see details
      </div>
    );
  }

  const parents = getParents(members, member);
  const children = getChildren(members, member.id);
  const siblings = getSiblings(members, member);

  return (
    <>
      <div className="detail-header">
        <span className="detail-name">{member.name}</span>
        <div className="detail-actions">
          <button onClick={() => onEdit(member)}>✎ Edit</button>
          <button className="danger" onClick={() => onDelete(member.id)}>🗑 Delete</button>
        </div>
      </div>

      <div className="detail-section">
        <div className="detail-label">GENDER</div>
        <div className="detail-value">{member.gender || '—'}</div>
      </div>

      <div className="detail-section">
        <div className="detail-label">DATE OF BIRTH</div>
        <div className="detail-value">
          {member.dob ? new Date(member.dob).toLocaleDateString() : 'Not specified'}
        </div>
      </div>

      <div className="detail-section">
        <div className="detail-label">PARENTS</div>
        <div className="detail-value">
          {parents.father && (
            <span className="member-badge" onClick={() => onSelectMember(parents.father.id)}>
              👨 Father: {parents.father.name}
            </span>
          )}
          {parents.mother && (
            <span className="member-badge" onClick={() => onSelectMember(parents.mother.id)}>
              👩 Mother: {parents.mother.name}
            </span>
          )}
          {!parents.father && !parents.mother && <span>— No parents listed —</span>}
        </div>
      </div>

      <div className="detail-section">
        <div className="detail-label">CHILDREN ({children.length})</div>
        <div className="detail-value">
          {children.length > 0 ? (
            children.map(child => (
              <span key={child.id} className="member-badge" onClick={() => onSelectMember(child.id)}>
                👶 {child.name}
              </span>
            ))
          ) : (
            <span>No children</span>
          )}
        </div>
      </div>

      <div className="detail-section">
        <div className="detail-label">SIBLINGS</div>
        <div className="detail-value">
          {siblings.length > 0 ? (
            siblings.map(sib => (
              <span key={sib.id} className="member-badge" onClick={() => onSelectMember(sib.id)}>
                👥 {sib.name}
              </span>
            ))
          ) : (
            <span>No siblings</span>
          )}
        </div>
      </div>
    </>
  );
};

export default DetailPanel;