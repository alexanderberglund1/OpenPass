import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, RefreshCw, CreditCard, DollarSign } from 'react-feather';
import { useTheme } from '../ThemeContext';

function AddNewForm({ onSave, onCancel, category }) {
  const [newItem, setNewItem] = useState({ title: '', type: '', notes: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [passwordLength, setPasswordLength] = useState(12);
  const [useLetters, setUseLetters] = useState(true);
  const [useDigits, setUseDigits] = useState(true);
  const [useSymbols, setUseSymbols] = useState(false);
  const [useSimilarChars, setUseSimilarChars] = useState(false);
  const [paymentType, setPaymentType] = useState('');
  const { darkMode } = useTheme();

  useEffect(() => {
    setNewItem({ title: '', type: '', notes: '' });
    setPaymentType('');
  }, [category]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...newItem, type: category.toLowerCase() });
  };

  const generatePassword = () => {
    let charset = '';
    if (useLetters) charset += 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (useDigits) charset += '0123456789';
    if (useSymbols) charset += '!@#$%^&*()_+~`|}{[]:;?><,./-=';
    if (useSimilarChars) charset += 'il1Lo0O';

    let password = '';
    for (let i = 0; i < passwordLength; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }

    setNewItem(prev => ({ ...prev, password }));
  };

  const inputClass = `mb-2 p-2 w-full border rounded ${darkMode ? 'bg-gray-800 text-white border-gray-700' : 'bg-white text-black border-gray-300'}`;
  const buttonClass = `${darkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'} px-4 py-2 rounded-md text-sm font-medium`;

  const renderCategorySpecificFields = () => {
    switch (category) {
      case 'Logins':
        return (
          <>
            <input name="website" value={newItem.website} onChange={handleInputChange} placeholder="Website URL" className={inputClass} />
            <input name="username" value={newItem.username} onChange={handleInputChange} placeholder="Username" className={inputClass} />
            <div className="relative mb-2">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={newItem.password}
                onChange={handleInputChange}
                placeholder="Password"
                className={`${inputClass} pr-20`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              <button
                type="button"
                onClick={generatePassword}
                className="absolute right-10 top-2 text-gray-400 hover:text-gray-600"
                title="Generate Password"
              >
                <RefreshCw size={20} />
              </button>
            </div>
            <div className="mb-2">
              <label className="block text-sm font-medium mb-1">Password Length: {passwordLength}</label>
              <input
                type="range"
                min="4"
                max="40"
                value={passwordLength}
                onChange={(e) => setPasswordLength(Number(e.target.value))}
                className="w-full"
              />
            </div>
            <div className="mb-2 space-y-2">
              <label className="flex items-center">
                <input type="checkbox" checked={useLetters} onChange={() => setUseLetters(!useLetters)} className="mr-2" />
                <span className="text-sm">Letters (e.g. Aa)</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" checked={useDigits} onChange={() => setUseDigits(!useDigits)} className="mr-2" />
                <span className="text-sm">Digits (e.g. 345)</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" checked={useSymbols} onChange={() => setUseSymbols(!useSymbols)} className="mr-2" />
                <span className="text-sm">Symbols (e.g. @#$%)</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" checked={useSimilarChars} onChange={() => setUseSimilarChars(!useSimilarChars)} className="mr-2" />
                <span className="text-sm">Similar characters (e.g. il1 O0)</span>
              </label>
            </div>
          </>
        );
      case 'Payments':
        if (!paymentType) {
          return (
            <div className="flex justify-center space-x-4 mb-4">
              <button 
                type="button" 
                onClick={() => setPaymentType('credit_card')} 
                className={`${buttonClass} flex items-center justify-center w-1/2`}
              >
                <CreditCard size={16} className="mr-2" />
                Credit Card
              </button>
              <button 
                type="button" 
                onClick={() => setPaymentType('bank_account')} 
                className={`${buttonClass} flex items-center justify-center w-1/2`}
              >
                <DollarSign size={16} className="mr-2" />
                Bank Account
              </button>
            </div>
          );
        } else if (paymentType === 'credit_card') {
          return (
            <>
              <input name="cardholderName" value={newItem.cardholderName} onChange={handleInputChange} placeholder="Cardholder Name" className={inputClass} />
              <input name="cardNumber" value={newItem.cardNumber} onChange={handleInputChange} placeholder="Card Number" className={inputClass} />
              <div className="flex space-x-2">
                <input name="expirationMonth" value={newItem.expirationMonth} onChange={handleInputChange} placeholder="MM" className={`${inputClass} w-1/4`} />
                <input name="expirationYear" value={newItem.expirationYear} onChange={handleInputChange} placeholder="YYYY" className={`${inputClass} w-1/4`} />
                <input name="cvv" value={newItem.cvv} onChange={handleInputChange} placeholder="CVV" className={`${inputClass} w-1/4`} />
              </div>
              <input name="cardColor" value={newItem.cardColor} onChange={handleInputChange} placeholder="Card Color (e.g., Blue)" className={inputClass} />
            </>
          );
        } else if (paymentType === 'bank_account') {
          return (
            <>
              <input name="accountName" value={newItem.accountName} onChange={handleInputChange} placeholder="Account Name" className={inputClass} />
              <input name="accountNumber" value={newItem.accountNumber} onChange={handleInputChange} placeholder="Account Number" className={inputClass} />
              <input name="routingNumber" value={newItem.routingNumber} onChange={handleInputChange} placeholder="Routing Number" className={inputClass} />
              <input name="bankName" value={newItem.bankName} onChange={handleInputChange} placeholder="Bank Name" className={inputClass} />
            </>
          );
        }
        break;
      default:
        return null;
    }
  };

  return (
    <div className={`fixed inset-0 ${darkMode ? 'bg-black' : 'bg-white'} bg-opacity-50 flex justify-center items-center`}>
      <div className={`${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'} w-96 p-6 rounded-lg shadow-lg`}>
        <h2 className="text-2xl font-semibold mb-4">Add a {category}</h2>
        <form onSubmit={handleSubmit}>
          <input name="title" value={newItem.title} onChange={handleInputChange} placeholder="Title" className={inputClass} />
          {renderCategorySpecificFields()}
          <textarea name="notes" value={newItem.notes} onChange={handleInputChange} placeholder="Notes" className={`${inputClass} h-24`} />
          <div className="flex justify-end mt-4">
            <button
              type="button"
              className={`${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-black'} px-4 py-2 rounded-md mr-2 text-sm font-medium`}
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              className={buttonClass}
              type="submit"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddNewForm;