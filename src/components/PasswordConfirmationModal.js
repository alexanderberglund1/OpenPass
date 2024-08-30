import React, { useState } from 'react';
import { useTheme } from '../ThemeContext';

function PasswordConfirmationModal({ onConfirm, onCancel }) {
  const [password, setPassword] = useState('');
  const { darkMode } = useTheme();

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm(password);
  };

  const inputClass = `mb-2 p-2 w-full border rounded ${darkMode ? 'bg-dark-bg text-dark-text border-gray-700' : 'bg-white text-black border-gray-300'}`;
  const buttonClass = `${darkMode ? 'bg-dark-button-primary text-dark-text' : 'bg-blue-500 text-white'} px-4 py-2 rounded-md`;

  return (
    <div className={`fixed inset-0 ${darkMode ? 'bg-black' : 'bg-white'} bg-opacity-50 flex justify-center items-center`}>
      <div className={`${darkMode ? 'bg-dark-card text-dark-text' : 'bg-white text-black'} w-96 p-6 rounded-lg shadow-lg`}>
        <h2 className="text-2xl font-semibold mb-4">Confirm Master Password</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter master password"
            className={inputClass}
            required
          />
          <div className="flex justify-end mt-4">
            <button
              type="button"
              className={`${darkMode ? 'bg-dark-button-secondary text-dark-text' : 'bg-gray-200 text-black'} px-4 py-2 rounded-md mr-2`}
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              className={buttonClass}
              type="submit"
            >
              Confirm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PasswordConfirmationModal;