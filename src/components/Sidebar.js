import React from 'react';
import { Lock, Key, CreditCard, FileText, User } from 'react-feather';
import { useTheme } from '../ThemeContext';

const categories = [
  { name: 'Logins', icon: Lock },
  { name: 'Passkeys', icon: Key },
  { name: 'Payments', icon: CreditCard },
  { name: 'Secure Notes', icon: FileText },
  { name: 'Personal Info', icon: User },
  { name: 'IDs', icon: CreditCard },
];

function Sidebar({ activeCategory, setActiveCategory }) {
  const { darkMode } = useTheme();

  return (
    <div className={`w-64 ${darkMode ? 'bg-dark-sidebar' : 'bg-light-sidebar'} flex flex-col`}>
      <div className="p-6">
        <h1 className={`text-2xl font-bold ${darkMode ? 'text-dark-text' : 'text-light-text'}`}>OpenPass</h1>
      </div>
      <nav className="flex-1">
        {categories.map(({ name, icon: Icon }) => (
          <button
            key={name}
            className={`w-full text-left py-3 px-6 flex items-center transition-colors duration-200 ${
              activeCategory === name 
                ? `${darkMode ? 'bg-dark-card text-dark-button-primary' : 'bg-light-card text-light-button-primary'} font-semibold` 
                : `${darkMode ? 'text-dark-text hover:bg-dark-card' : 'text-light-text hover:bg-light-card'}`
            }`}
            onClick={() => setActiveCategory(name)}
          >
            <Icon className="mr-3" size={20} />
            {name}
          </button>
        ))}
      </nav>
    </div>
  );
}

export default Sidebar;