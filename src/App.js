import React, { useState, useEffect } from 'react';
import { Search, Plus } from 'react-feather';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ItemList from './components/ItemList';
import AddNewForm from './components/AddNewForm';
const { ipcRenderer } = window.require('electron');

function App() {
  const [activeCategory, setActiveCategory] = useState('Logins');
  const [showAddNew, setShowAddNew] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [showPassword, setShowPassword] = useState({});

  useEffect(() => {
    loadItems();
    ipcRenderer.on('item-saved', () => {
      loadItems();
    });
    return () => {
      ipcRenderer.removeAllListeners('item-saved');
    };
  }, []);

  useEffect(() => {
    filterItems();
  }, [items, activeCategory, searchTerm]);

  const loadItems = () => {
    ipcRenderer.send('load-items');
    ipcRenderer.once('items-loaded', (event, loadedItems) => {
      console.log('Loaded items:', loadedItems);
      setItems(loadedItems);
    });
  };

  const filterItems = () => {
    const filtered = items.filter(item => 
      (activeCategory === 'Logins' ? item.type === 'login' : item.type === activeCategory.toLowerCase().replace(' ', '_')) &&
      (item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
       item.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
       item.website?.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredItems(filtered);
  };

  const handleAddNew = (newItem) => {
    ipcRenderer.send('save-item', { ...newItem, id: Date.now(), type: activeCategory.toLowerCase().replace(' ', '_') });
    setShowAddNew(false);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
      <div className="flex-1 flex flex-col">
        <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} setShowAddNew={setShowAddNew} />
        <main className="flex-1 p-6 bg-gray-100 overflow-auto">
          <h2 className="text-2xl font-semibold mb-4">{activeCategory}</h2>
          <ItemList 
            items={filteredItems} 
            showPassword={showPassword}
            setShowPassword={setShowPassword}
          />
        </main>
      </div>
      {showAddNew && (
        <AddNewForm
          onSave={handleAddNew}
          onCancel={() => setShowAddNew(false)}
          category={activeCategory}
        />
      )}
    </div>
  );
}

export default App;