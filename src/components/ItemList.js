import React from 'react';
import { Eye, EyeOff, Edit2, Trash2, Copy, CreditCard, DollarSign } from 'react-feather';
import { useTheme } from '../ThemeContext';

function ItemList({ items, onDeleteItem, onEditItem, onCopyItem, category }) {
  const { darkMode } = useTheme();

  const renderPaymentCard = (item) => {
    const isCard = item.cardNumber != null;
    const Icon = isCard ? CreditCard : DollarSign;
    const lastFour = isCard ? item.cardNumber.slice(-4) : item.accountNumber.slice(-4);

    return (
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-gray-200'} rounded-lg p-4 shadow-md relative overflow-hidden`}>
        <div className="absolute top-2 right-2 flex space-x-2">
          <button onClick={() => onEditItem(item)} className="text-gray-400 hover:text-white">
            <Edit2 size={16} />
          </button>
          <button onClick={() => onDeleteItem(item.id)} className="text-gray-400 hover:text-white">
            <Trash2 size={16} />
          </button>
        </div>
        <Icon className="text-gray-400 mb-2" size={32} />
        <div className="text-white text-lg font-semibold mb-1">{item.title}</div>
        <div className="text-gray-400 text-sm">**** **** **** {lastFour}</div>
      </div>
    );
  };

  const renderLoginItem = (item) => {
    return (
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-gray-200'} rounded-lg p-4 shadow-md`}>
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center">
            {item.website && (
              <img 
                src={`https://www.google.com/s2/favicons?domain=${item.website}&sz=32`}
                alt="Website icon"
                className="w-5 h-5 mr-2"
              />
            )}
            <h3 className="font-semibold text-white">{item.title}</h3>
          </div>
          <div className="flex space-x-2">
            <button onClick={() => onEditItem(item)} className="text-gray-400 hover:text-white">
              <Edit2 size={16} />
            </button>
            <button onClick={() => onDeleteItem(item.id)} className="text-gray-400 hover:text-white">
              <Trash2 size={16} />
            </button>
          </div>
        </div>
        <p className="text-sm text-gray-400">{item.username}</p>
        <div className="mt-2 flex items-center">
          <input 
            type="password" 
            value={item.password} 
            readOnly 
            className="bg-gray-700 text-white p-1 rounded text-sm w-full mr-2"
          />
          <button onClick={() => onCopyItem(item)} className="text-gray-400 hover:text-white ml-2">
            <Copy size={16} />
          </button>
        </div>
      </div>
    );
  };

  if (items.length === 0) {
    return <p className="text-center mt-4 text-gray-400">No items found in this category.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {items.map(item => (
        <div key={item.id}>
          {category === 'Payments' ? renderPaymentCard(item) : renderLoginItem(item)}
        </div>
      ))}
    </div>
  );
}

export default ItemList;