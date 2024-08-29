import React from 'react';
import { Search, Plus, Save, Upload, Moon, Sun } from 'react-feather';

function Header({ searchTerm, setSearchTerm, setShowAddNew, unsavedChanges, onSave, onLoad, darkMode, toggleDarkMode }) {
  return (
    <header className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm p-4 flex flex-wrap justify-between items-center`}>
      <div className="flex items-center flex-grow mr-4 mb-2 sm:mb-0">
        <Search className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mr-2`} />
        <input
          type="text"
          placeholder="Search OpenPass"
          className={`w-full ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-black'} px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="flex items-center space-x-2 flex-wrap">
        <button
          className={`px-3 py-1 rounded-md flex items-center text-sm ${unsavedChanges ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-gray-300 text-gray-700'} transition-colors duration-200`}
          onClick={onSave}
          disabled={!unsavedChanges}
        >
          <Save size={16} className="mr-1" />
          Save
        </button>
        <button
          className={`px-3 py-1 rounded-md flex items-center text-sm ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white transition-colors duration-200`}
          onClick={onLoad}
        >
          <Upload size={16} className="mr-1" />
          Load
        </button>
        <button
          className={`px-3 py-1 rounded-md flex items-center text-sm ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white transition-colors duration-200`}
          onClick={() => setShowAddNew(true)}
        >
          <Plus size={16} className="mr-1" />
          Add new
        </button>
        <button
          className={`p-2 rounded-full ${darkMode ? 'bg-yellow-400 text-gray-900' : 'bg-gray-200 text-gray-700'}`}
          onClick={toggleDarkMode}
        >
          {darkMode ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>
    </header>
  );
}

export default Header;