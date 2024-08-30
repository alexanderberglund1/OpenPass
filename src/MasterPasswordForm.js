import React, { useState } from 'react';
import { useTheme } from './ThemeContext';

function MasterPasswordForm({ onSubmit, isSetup }) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { darkMode } = useTheme();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSetup && password !== confirmPassword) {
      alert("Passwords don't match");
      return;
    }
    onSubmit(password);
  };

  return (
    <div className={`flex items-center justify-center h-screen ${darkMode ? 'bg-dark-bg' : 'bg-light-bg'}`}>
      <form onSubmit={handleSubmit} className={`p-6 rounded-lg shadow-md ${darkMode ? 'bg-dark-card' : 'bg-light-card'}`}>
        <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-dark-text' : 'text-light-text'}`}>
          {isSetup ? 'Set Master Password' : 'Enter Master Password'}
        </h2>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Master password"
          className={`w-full p-2 mb-4 rounded ${darkMode ? 'bg-dark-bg text-dark-text' : 'bg-light-bg text-light-text'}`}
          required
        />
        {isSetup && (
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm master password"
            className={`w-full p-2 mb-4 rounded ${darkMode ? 'bg-dark-bg text-dark-text' : 'bg-light-bg text-light-text'}`}
            required
          />
        )}
        <button type="submit" className={`w-full p-2 rounded ${darkMode ? 'bg-dark-button-primary' : 'bg-light-button-primary'} text-white`}>
          {isSetup ? 'Set Password' : 'Unlock'}
        </button>
      </form>
    </div>
  );
}

export default MasterPasswordForm;