import React, { useState } from 'react';

export default function CharacterStat ({ stat, value, onStatChange }) {
  const [editing, setEditing] = useState(false);
  const [newValue, setNewValue] = useState(value);

  const handleEditClick = () => {
    setEditing(true);
  };

  const handleInputChange = event => {
    setNewValue(event.target.value);
  };

  const handleSaveClick = () => {
    onStatChange(stat, parseInt(newValue, 10));
    setEditing(false);
  };

  return (
    <div className="character-stat">
      <div className="stat-header">
        <span>{stat.toUpperCase()}</span>
        <button onClick={handleEditClick}>Edit</button>
      </div>
      {editing ? (
        <div className="stat-input">
          <input
            type="number"
            value={newValue}
            onChange={handleInputChange}
          />
          <button onClick={handleSaveClick}>Save</button>
        </div>
      ) : (
        <div className="stat-value">{value}</div>
      )}
    </div>
  );
};
