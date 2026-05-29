// Helper functions for family tree logic

export const getMemberById = (members, id) => members.find(m => m.id === id);

export const getChildren = (members, id) => members.filter(m => m.fatherId === id || m.motherId === id);

export const getParents = (members, member) => ({
  father: member?.fatherId ? getMemberById(members, member.fatherId) : null,
  mother: member?.motherId ? getMemberById(members, member.motherId) : null
});

export const getSiblings = (members, member) => {
  if (!member) return [];
  return members.filter(m =>
    m.id !== member.id && (m.fatherId === member.fatherId || m.motherId === member.motherId)
  );
};

export const getRootMembers = (members) => {
  return members.filter(member => {
    const hasFather = member.fatherId && members.some(m => m.id === member.fatherId);
    const hasMother = member.motherId && members.some(m => m.id === member.motherId);
    return !hasFather && !hasMother;
  });
};

// Cycle detection: is ancestorId an ancestor of descendantId?
export const isDescendant = (members, ancestorId, descendantId, visited = new Set()) => {
  if (ancestorId === descendantId) return true;
  if (visited.has(descendantId)) return false;
  visited.add(descendantId);
  const member = getMemberById(members, descendantId);
  if (!member) return false;
  if (member.fatherId && isDescendant(members, ancestorId, member.fatherId, visited)) return true;
  if (member.motherId && isDescendant(members, ancestorId, member.motherId, visited)) return true;
  return false;
};

export const isValidParentChange = (members, childId, newParentId) => {
  if (!newParentId) return true;
  if (childId === newParentId) return false;
  return !isDescendant(members, newParentId, childId);
};