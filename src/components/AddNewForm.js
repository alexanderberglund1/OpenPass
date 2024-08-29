import React, { useState } from 'react';
import { Eye, EyeOff } from 'react-feather';

function AddNewForm({ onSave, onCancel, category }) {
  const [newItem, setNewItem] = useState({ title: '', website: '', username: '', password: '', notes: '' });
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(newItem);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-end transition-opacity duration-300">
      <div className="bg-white w-96 h-full p-6 flex flex-col animate-slide-in">
        <h2 className="text-2xl font-semibold mb-4">Add a {category.slice(0, -1)}</h2>
        <form onSubmit={handleSubmit} className="flex-1">
          <input name="title" value={newItem.title} onChange={handleInputChange} placeholder="Title" className="mb-2 p-2 w-full border rounded" />
          <input name="website" value={newItem.website} onChange={handleInputChange} placeholder="Website URL" className="mb-2 p-2 w-full border rounded" />
          <input name="username" value={newItem.username} onChange={handleInputChange} placeholder="Username" className="mb-2 p-2 w-full border rounded" />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={newItem.password}
              onChange={handleInputChange}
              placeholder="Password"
              className="mb-2 p-2 w-full border rounded pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-2 text-gray-600"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <textarea name="notes" value={newItem.notes} onChange={handleInputChange} placeholder="Notes" className="mb-2 p-2 w-full border rounded" rows="3" />
        </form>
        <div className="flex justify-end mt-4">
          <button
            className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md mr-2 transition-colors duration-200"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors duration-200"
            onClick={handleSubmit}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddNewForm;