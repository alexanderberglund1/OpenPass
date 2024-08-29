import React, { useState, useEffect } from 'react';
import { Search, Plus, Save, Upload, Moon, Sun } from 'react-feather';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ItemList from './components/ItemList';
import AddNewForm from './components/AddNewForm';
import { ThemeProvider, useTheme } from './ThemeContext';
const { ipcRenderer } = window.require('electron');

function AppContent() {
  const [activeCategory, setActiveCategory] = useState('Logins');
  const [showAddNew, setShowAddNew] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const { darkMode, toggleDarkMode } = useTheme();

  useEffect(() => {
    filterItems();
  }, [items, activeCategory, searchTerm]);

  const filterItems = () => {
    const filtered = items.filter(item => 
      (activeCategory === 'Logins' ? item.type === 'logins' : item.type === activeCategory.toLowerCase().replace(' ', '_')) &&
      (item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
       item.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
       item.website?.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredItems(filtered);
  };

  const handleAddNew = (newItem) => {
    setItems([...items, { ...newItem, id: Date.now(), type: activeCategory.toLowerCase().replace(' ', '_') }]);
    setShowAddNew(false);
    setUnsavedChanges(true);
  };

  const handleDeleteItem = (id) => {
    setItems(items.filter(item => item.id !== id));
    setUnsavedChanges(true);
  };

  const handleEditItem = (editedItem) => {
    setItems(items.map(item => item.id === editedItem.id ? editedItem : item));
    setUnsavedChanges(true);
  };

  const handleSave = () => {
    ipcRenderer.send('save-database', items);
    ipcRenderer.once('database-saved', (event, message) => {
      console.log(message);
      setUnsavedChanges(false);
    });
  };

  const handleLoad = () => {
    ipcRenderer.send('load-database');
    ipcRenderer.once('database-loaded', (event, loadedItems) => {
      setItems(loadedItems);
      setUnsavedChanges(false);
    });
  };

  return (
    <div className={`flex h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'}`}>
      <Sidebar activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
      <div className="flex-1 flex flex-col">
        <Header 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm} 
          setShowAddNew={setShowAddNew}
          unsavedChanges={unsavedChanges}
          onSave={handleSave}
          onLoad={handleLoad}
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
        />
        <main className="flex-1 p-6 overflow-auto">
          <h2 className="text-2xl font-semibold mb-4">{activeCategory}</h2>
          <ItemList 
            items={filteredItems}
            onDeleteItem={handleDeleteItem}
            onEditItem={handleEditItem}
            darkMode={darkMode}
          />
        </main>
      </div>
      {showAddNew && (
        <AddNewForm
          onSave={handleAddNew}
          onCancel={() => setShowAddNew(false)}
          category={activeCategory}
          darkMode={darkMode}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;