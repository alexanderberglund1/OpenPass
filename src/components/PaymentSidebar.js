import React, { useState } from 'react';
import { Eye, EyeOff, Copy, X, Edit2 } from 'react-feather';
import { useTheme } from '../ThemeContext';

function PaymentSidebar({ payment, onClose, onEdit, onCopy, requireMasterPassword }) {
  const [showSensitiveInfo, setShowSensitiveInfo] = useState(false);
  const { darkMode } = useTheme();

  const handleCopy = (field) => {
    if (requireMasterPassword) {
      // Implement master password confirmation here
      console.log('Master password required for copying');
    } else {
      onCopy(field);
    }
  };

  const inputClass = `mb-2 p-2 w-full border rounded ${darkMode ? 'bg-dark-bg text-dark-text border-gray-700' : 'bg-white text-black border-gray-300'}`;
  const buttonClass = `${darkMode ? 'bg-dark-button-primary text-dark-text' : 'bg-blue-500 text-white'} px-2 py-1 rounded-md text-sm`;

  return (
    <div className={`fixed inset-y-0 right-0 w-96 ${darkMode ? 'bg-dark-card text-dark-text' : 'bg-white text-black'} shadow-lg p-6 overflow-y-auto`}>
      <button onClick={onClose} className="absolute top-4 right-4">
        <X size={24} />
      </button>
      <h2 className="text-2xl font-semibold mb-4">{payment.title}</h2>
      
      {payment.type === 'credit_card' && (
        <>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Card Number</label>
            <div className="flex items-center">
              <input
                type={showSensitiveInfo ? "text" : "password"}
                value={payment.cardNumber}
                readOnly
                className={`${inputClass} flex-grow`}
              />
              <button onClick={() => setShowSensitiveInfo(!showSensitiveInfo)} className={`${buttonClass} ml-2`}>
                {showSensitiveInfo ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
              <button onClick={() => handleCopy('cardNumber')} className={`${buttonClass} ml-2`}>
                <Copy size={16} />
              </button>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Cardholder Name</label>
            <input value={payment.cardholderName} readOnly className={inputClass} />
          </div>
          <div className="flex space-x-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Expiration</label>
              <input value={`${payment.expirationMonth}/${payment.expirationYear}`} readOnly className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">CVV</label>
              <div className="flex items-center">
                <input
                  type={showSensitiveInfo ? "text" : "password"}
                  value={payment.cvv}
                  readOnly
                  className={`${inputClass} w-20`}
                />
                <button onClick={() => handleCopy('cvv')} className={`${buttonClass} ml-2`}>
                  <Copy size={16} />
                </button>
              </div>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Card Color</label>
            <input value={payment.cardColor} readOnly className={inputClass} />
          </div>
        </>
      )}
      
      {payment.type === 'bank_account' && (
        <>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Account Name</label>
            <input value={payment.accountName} readOnly className={inputClass} />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Account Number</label>
            <div className="flex items-center">
              <input
                type={showSensitiveInfo ? "text" : "password"}
                value={payment.accountNumber}
                readOnly
                className={`${inputClass} flex-grow`}
              />
              <button onClick={() => setShowSensitiveInfo(!showSensitiveInfo)} className={`${buttonClass} ml-2`}>
                {showSensitiveInfo ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
              <button onClick={() => handleCopy('accountNumber')} className={`${buttonClass} ml-2`}>
                <Copy size={16} />
              </button>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Routing Number</label>
            <div className="flex items-center">
              <input
                type={showSensitiveInfo ? "text" : "password"}
                value={payment.routingNumber}
                readOnly
                className={`${inputClass} flex-grow`}
              />
              <button onClick={() => handleCopy('routingNumber')} className={`${buttonClass} ml-2`}>
                <Copy size={16} />
              </button>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Bank Name</label>
            <input value={payment.bankName} readOnly className={inputClass} />
          </div>
        </>
      )}
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Notes</label>
        <textarea value={payment.notes} readOnly className={`${inputClass} h-24`} />
      </div>
      
      <button onClick={() => onEdit(payment)} className={`${buttonClass} w-full flex items-center justify-center`}>
        <Edit2 size={16} className="mr-2" />
        Edit
      </button>
    </div>
  );
}

export default PaymentSidebar;