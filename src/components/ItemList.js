import React, { useState } from 'react';
import { Eye, EyeOff, Edit2, Trash2, Copy } from 'react-feather';

function ItemList({ items }) {
  const [showPassword, setShowPassword] = useState({});

  const togglePasswordVisibility = (id) => {
    setShowPassword(prev => ({ ...prev, [id]: !prev[id] }));
  };

  if (items.length === 0) {
    return <p className="text-gray-500 text-center mt-4">No items found in this category.</p>;
  }

  return (
    <ul className="space-y-2">
      {items.map(item => (
        <li key={item.id} className="bg-white shadow-sm rounded-lg p-3 hover:shadow-md transition-shadow duration-200">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <img
                src={`https://www.google.com/s2/favicons?domain=${item.website}&sz=32`}
                alt="Website Logo"
                className="w-6 h-6 mr-2"
              />
              <div>
                <h3 className="font-semibold text-md">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.username}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button className="text-gray-400 hover:text-blue-500 transition-colors duration-200">
                <Edit2 size={16} />
              </button>
              <button className="text-gray-400 hover:text-red-500 transition-colors duration-200">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
          <div className="mt-2 flex items-center">
            <input 
              type={showPassword[item.id] ? "text" : "password"} 
              value={item.password} 
              readOnly 
              className="bg-gray-100 p-1 rounded text-sm w-40 mr-2 focus:outline-none"
            />
            <button 
              onClick={() => togglePasswordVisibility(item.id)}
              className="text-gray-400 hover:text-blue-500 transition-colors duration-200 mr-2"
            >
              {showPassword[item.id] ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
            <button className="text-gray-400 hover:text-blue-500 transition-colors duration-200">
              <Copy size={16} />
            </button>
          </div>
          {item.website && <p className="text-xs text-gray-500 mt-1">{item.website}</p>}
        </li>
      ))}
    </ul>
  );
}

export default ItemList;