import React from 'react';
import { Lock, Key, CreditCard, FileText, User } from 'react-feather';

const categories = [
  { name: 'Logins', icon: Lock },
  { name: 'Passkeys', icon: Key },
  { name: 'Payments', icon: CreditCard },
  { name: 'Secure Notes', icon: FileText },
  { name: 'Personal Info', icon: User },
  { name: 'IDs', icon: CreditCard },
];

function Sidebar({ activeCategory, setActiveCategory }) {
  return (
    <div className="w-64 bg-gray-200">
      <div className="p-4">
        <h1 className="text-2xl font-bold text-gray-800">OpenPass</h1>
      </div>
      <nav>
        {categories.map(({ name, icon: Icon }) => (
          <button
            key={name}
            className={`w-full text-left p-3 hover:bg-gray-300 flex items-center ${activeCategory === name ? 'bg-gray-300 font-semibold' : ''}`}
            onClick={() => setActiveCategory(name)}
          >
            <Icon className="mr-2" size={18} />
            {name}
          </button>
        ))}
      </nav>
    </div>
  );
}

export default Sidebar;