import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ItemList from './components/ItemList';
import AddNewForm from './components/AddNewForm';
import MasterPasswordForm from './MasterPasswordForm';
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
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [needsSetup, setNeedsSetup] = useState(false);

  useEffect(() => {
    checkMasterPasswordExists();
  }, []);

  useEffect(() => {
    filterItems();
  }, [items, activeCategory, searchTerm]);

  const checkMasterPasswordExists = async () => {
    const result = await ipcRenderer.invoke('check-master-password-exists');
    setNeedsSetup(!result.exists);
  };

  const filterItems = () => {
    const filtered = items.filter(item => 
      item.type === activeCategory.toLowerCase().replace(' ', '_') &&
      (item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
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

  const handleCopyItem = (item) => {
    const textToCopy = item.password || item.cardNumber || item.accountNumber;
    navigator.clipboard.writeText(textToCopy)
      .then(() => console.log('Copied successfully'))
      .catch(err => console.error('Failed to copy:', err));
  };

  const handleSave = async () => {
    try {
      const result = await ipcRenderer.invoke('save-database', items);
      if (result.success) {
        console.log(result.message);
        setUnsavedChanges(false);
      } else {
        console.error('Error saving database:', result.error);
      }
    } catch (error) {
      console.error('Error saving database:', error);
    }
  };

  const handleLoad = async () => {
    try {
      const result = await ipcRenderer.invoke('load-database');
      if (result.success) {
        setItems(result.data);
        setUnsavedChanges(false);
      } else {
        console.error('Error loading database:', result.error);
      }
    } catch (error) {
      console.error('Error loading database:', error);
    }
  };

  const handleSetMasterPassword = async (password) => {
    try {
      const result = await ipcRenderer.invoke('set-master-password', password);
      if (result.success) {
        setNeedsSetup(false);
        setIsUnlocked(true);
      } else {
        console.error('Error setting master password:', result.error);
      }
    } catch (error) {
      console.error('Error setting master password:', error);
    }
  };

  const handleUnlock = async (password) => {
    try {
      const result = await ipcRenderer.invoke('unlock-database', { password });
      if (result.success) {
        setIsUnlocked(true);
        await handleLoad(); // Load the database after unlocking
      } else {
        console.error('Error unlocking database:', result.error);
        // You might want to show an error message to the user here
      }
    } catch (error) {
      console.error('Error unlocking database:', error);
    }
  };

  if (needsSetup) {
    return <MasterPasswordForm onSubmit={handleSetMasterPassword} isSetup={true} />;
  }

  if (!isUnlocked) {
    return <MasterPasswordForm onSubmit={handleUnlock} isSetup={false} />;
  }

  return (
    <div className={`flex h-screen ${darkMode ? 'dark bg-dark-bg text-dark-text' : 'bg-light-bg text-light-text'}`}>
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
            onCopyItem={handleCopyItem}
            category={activeCategory}
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

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;