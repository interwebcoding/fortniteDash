import React, { useState, FormEvent } from 'react';
import './AddPlayerForm.css';

import { Platform } from '../types';

interface AddPlayerFormProps {
  onAdd: (username: string, platform: Platform) => void;
}

const AddPlayerForm: React.FC<AddPlayerFormProps> = ({ onAdd }) => {
  const [username, setUsername] = useState('');
  const [platform, setPlatform] = useState<Platform>('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!username) return;
    onAdd(username.trim(), platform);
    setUsername('');
  };

  return (
    <form onSubmit={handleSubmit} className="add-player-form">
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={e => setUsername(e.target.value)}
        required
      />
      <select
        value={platform}
        onChange={e => setPlatform(e.target.value as Platform)}
      >
        <option value="">-- Platform (optional) --</option>
        <option value="pc">PC</option>
        <option value="xbox">Xbox</option>
        <option value="psn">PSN</option>
      </select>
      <button type="submit">
        Add Player
      </button>
    </form>
  );
};

export default AddPlayerForm;