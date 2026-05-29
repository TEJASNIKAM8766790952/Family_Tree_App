import React, { useState } from 'react';

const SearchBar = ({ members, onSelect }) => {
  const [term, setTerm] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = (value) => {
    setTerm(value);
    if (value.trim() === '') {
      setResults([]);
      return;
    }
    const filtered = members.filter(m =>
      m.name.toLowerCase().includes(value.toLowerCase())
    );
    setResults(filtered.slice(0, 6));
  };

  return (
    <div className="search-box">
      <input
        type="text"
        className="search-input"
        placeholder="🔍 Search by name..."
        value={term}
        onChange={(e) => handleSearch(e.target.value)}
      />
      {results.length > 0 && (
        <div className="search-results">
          {results.map(m => (
            <span
              key={m.id}
              className="member-badge"
              onClick={() => {
                onSelect(m.id);
                setTerm('');
                setResults([]);
              }}
            >
              {m.name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;