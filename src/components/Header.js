import React from 'react';
import { Search, Plus } from 'react-feather';

const Header = ({ searchTerm, setSearchTerm, setShowAddNew }) => (
  <header className="bg-gray-300 p-4 flex items-center justify-between">
    <div className="flex items-center flex-grow mr-4">
      <Search className="text-gray-600 mr-2" />
      <input
        type="text"
        placeholder="Search OpenPass"
        className="bg-gray-200 px-4 py-2 rounded-md w-full"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
    <button
      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center transition-colors duration-200"
      onClick={() => setShowAddNew(true)}
    >
      <Plus size={20} className="mr-2" />
      Add new
    </button>
  </header>
);

export default Header;