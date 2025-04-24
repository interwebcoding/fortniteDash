import React, { useState, FormEvent } from 'react';

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
    <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={e => setUsername(e.target.value)}
        required
        style={{ marginRight: '0.5rem', padding: '0.5rem' }}
      />
      <select
        value={platform}
        onChange={e => setPlatform(e.target.value as Platform)}
        style={{ marginRight: '0.5rem', padding: '0.5rem' }}
      >
        <option value="">-- Platform (optional) --</option>
        <option value="pc">PC</option>
        <option value="xbox">Xbox</option>
        <option value="psn">PSN</option>
      </select>
      <button type="submit" style={{ padding: '0.5rem 1rem' }}>
        Add Player
      </button>
    </form>
  );
};

export default AddPlayerForm;