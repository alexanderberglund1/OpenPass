import React from 'react';
import { Search, Plus, Save, Upload, Moon, Sun } from 'react-feather';

function Header({ searchTerm, setSearchTerm, setShowAddNew, unsavedChanges, onSave, onLoad, darkMode, toggleDarkMode }) {
  return (
    <header className={`${darkMode ? 'bg-dark-sidebar' : 'bg-light-sidebar'} shadow-sm p-4`}>
      <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0">
        <div className="flex items-center w-full sm:w-auto mb-2 sm:mb-0">
          <Search className={`${darkMode ? 'text-dark-text-secondary' : 'text-light-text-secondary'} mr-2`} />
          <input
            type="text"
            placeholder="Search OpenPass"
            className={`w-full sm:w-64 ${darkMode ? 'bg-dark-card text-dark-text' : 'bg-light-card text-light-text'} px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-2">
          <button
            className={`px-3 py-1 rounded-md flex items-center text-sm ${unsavedChanges ? 'bg-dark-button-primary text-white' : 'bg-dark-button-secondary text-dark-text-secondary'} transition-colors duration-200`}
            onClick={onSave}
            disabled={!unsavedChanges}
          >
            <Save size={16} className="mr-1" />
            <span className="hidden sm:inline">Save</span>
          </button>
          <button
            className={`px-3 py-1 rounded-md flex items-center text-sm ${darkMode ? 'bg-dark-button-primary' : 'bg-light-button-primary'} text-white transition-colors duration-200`}
            onClick={onLoad}
          >
            <Upload size={16} className="mr-1" />
            <span className="hidden sm:inline">Load</span>
          </button>
          <button
            className={`px-3 py-1 rounded-md flex items-center text-sm ${darkMode ? 'bg-dark-button-primary' : 'bg-light-button-primary'} text-white transition-colors duration-200`}
            onClick={() => setShowAddNew(true)}
          >
            <Plus size={16} className="mr-1" />
            <span className="hidden sm:inline">Add new</span>
          </button>
          <button
            className={`p-2 rounded-full ${darkMode ? 'bg-dark-button-secondary text-dark-text' : 'bg-light-button-secondary text-light-text'}`}
            onClick={toggleDarkMode}
          >
            {darkMode ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;