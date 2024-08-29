import React from 'react';
import { Eye, EyeOff, Edit2, Trash2, Copy } from 'react-feather';
import WebsiteLogo from './WebsiteLogo';

function ItemList({ items, showPassword, setShowPassword }) {
  const togglePasswordVisibility = (id) => {
    setShowPassword(prev => ({ ...prev, [id]: !prev[id] }));
  };

  if (items.length === 0) {
    return <p className="text-gray-500 text-center mt-4">No items found in this category.</p>;
  }

  return (
    <ul>
      {items.map(item => (
        <li key={item.id} className="bg-white shadow rounded-lg p-4 mb-4 hover:shadow-md transition-shadow duration-200">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <WebsiteLogo url={item.website} />
              <h3 className="font-semibold text-lg ml-2">{item.title}</h3>
            </div>
            <div className="space-x-2">
              <button className="text-blue-500 hover:text-blue-700">
                <Edit2 size={18} />
              </button>
              <button className="text-red-500 hover:text-red-700">
                <Trash2 size={18} />
              </button>
            </div>
          </div>
          {item.username && (
            <div className="flex items-center mt-2">
              <p className="text-gray-600 mr-2">{item.username}</p>
              <button className="text-gray-400 hover:text-gray-600">
                <Copy size={16} />
              </button>
            </div>
          )}
          {item.password && (
            <div className="flex items-center mt-2">
              <input 
                type={showPassword[item.id] ? "text" : "password"} 
                value={item.password} 
                readOnly 
                className="bg-gray-100 p-1 rounded mr-2"
              />
              <button onClick={() => togglePasswordVisibility(item.id)}>
                {showPassword[item.id] ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
              <button className="ml-2 text-gray-400 hover:text-gray-600">
                <Copy size={16} />
              </button>
            </div>
          )}
          {item.website && <p className="text-gray-600 mt-2">{item.website}</p>}
        </li>
      ))}
    </ul>
  );
}

export default ItemList;