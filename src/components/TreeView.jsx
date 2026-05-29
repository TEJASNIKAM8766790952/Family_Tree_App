import React from 'react';

const TreeNode = ({ member, members, selectedId, onSelect }) => {
  const children = members.filter(m => m.fatherId === member.id || m.motherId === member.id);
  return (
    <li className="tree-node">
      <div
        className={`tree-item ${selectedId === member.id ? 'selected' : ''}`}
        onClick={() => onSelect(member.id)}
      >
        <span className="tree-gender">
          {member.gender === 'Male' ? '♂' : member.gender === 'Female' ? '♀' : '⚬'}
        </span>
        <span className="tree-name">{member.name}</span>
      </div>
      {children.length > 0 && (
        <ul className="tree-node-children">
          {children.map(child => (
            <TreeNode
              key={child.id}
              member={child}
              members={members}
              selectedId={selectedId}
              onSelect={onSelect}
            />
          ))}
        </ul>
      )}
    </li>
  );
};

const TreeView = ({ members, rootMembers, selectedId, onSelect }) => {
  return (
    <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
      {rootMembers.map(root => (
        <TreeNode
          key={root.id}
          member={root}
          members={members}
          selectedId={selectedId}
          onSelect={onSelect}
        />
      ))}
    </ul>
  );
};

export default TreeView;