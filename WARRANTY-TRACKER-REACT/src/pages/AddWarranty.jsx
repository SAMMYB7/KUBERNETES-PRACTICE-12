import React, { useState } from 'react';
import axios from 'axios';
import './pages.css';

const AddWarranty = () => {
  const [warranty, setWarranty] = useState({
    itemName: '',
    purchaseDate: '',
    warrantyPeriodMonths: '',
    vendor: '',
    notes: ''
  });
  const [message, setMessage] = useState('');

  const baseUrl = `${import.meta.env.VITE_API_URL}/warrantyapi`;

  const handleChange = (e) => {
    setWarranty({ ...warranty, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!warranty.itemName || warranty.itemName.trim() === '') {
      setMessage('Please fill out the Item Name field.');
      setTimeout(() => {
        setMessage('');
      }, 3000);
      return false;
    }
    if (!warranty.purchaseDate || warranty.purchaseDate.trim() === '') {
      setMessage('Please fill out the Purchase Date field.');
      setTimeout(() => {
        setMessage('');
      }, 3000);
      return false;
    }
    if (!warranty.warrantyPeriodMonths || warranty.warrantyPeriodMonths.toString().trim() === '') {
      setMessage('Please fill out the Warranty Period field.');
      setTimeout(() => {
        setMessage('');
      }, 3000);
      return false;
    }
    if (!warranty.vendor || warranty.vendor.trim() === '') {
      setMessage('Please fill out the Vendor field.');
      setTimeout(() => {
        setMessage('');
      }, 3000);
      return false;
    }
    if (warranty.warrantyPeriodMonths && isNaN(warranty.warrantyPeriodMonths)) {
      setMessage('Warranty Period must be a valid number.');
      setTimeout(() => {
        setMessage('');
      }, 3000);
      return false;
    }
    return true;
  };

  const addWarranty = async () => {
    if (!validateForm()) return;
    try {
      const warrantyData = {
        itemName: warranty.itemName,
        purchaseDate: warranty.purchaseDate,
        warrantyPeriodMonths: parseInt(warranty.warrantyPeriodMonths),
        vendor: warranty.vendor,
        notes: warranty.notes || ''
      };
      await axios.post(`${baseUrl}/add`, warrantyData);
      setMessage('Warranty added successfully.');
      setTimeout(() => {
        setMessage('');
      }, 3000);
      resetForm();
    } catch (error) {
      setMessage('Error adding warranty. Please try again.');
      setTimeout(() => {
        setMessage('');
      }, 3000);
    }
  };

  const resetForm = () => {
    setWarranty({
      itemName: '',
      purchaseDate: '',
      warrantyPeriodMonths: '',
      vendor: '',
      notes: ''
    });
  };

  return (
    <div className="page-container">
      {message && (
        <div className={`message-banner ${message.toLowerCase().includes('error') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}

      <div className="content-card">
        <h2>Add New Warranty</h2>
        <p className="page-description">Fill in the details below to add a new warranty to the inventory.</p>

        <div className="form-grid">
          <input 
            type="text" 
            name="itemName" 
            placeholder="Item Name" 
            value={warranty.itemName} 
            onChange={handleChange}
            required
          />
          <input 
            type="date" 
            name="purchaseDate" 
            placeholder="Purchase Date" 
            value={warranty.purchaseDate} 
            onChange={handleChange} 
            required
          />
          <input 
            type="number" 
            name="warrantyPeriodMonths" 
            placeholder="Warranty Period (Months)" 
            value={warranty.warrantyPeriodMonths} 
            onChange={handleChange} 
            required
          />
          <input 
            type="text" 
            name="vendor" 
            placeholder="Vendor Name" 
            value={warranty.vendor} 
            onChange={handleChange}
            required
          />
          <input 
            type="text" 
            name="notes" 
            placeholder="Notes (Optional)" 
            value={warranty.notes} 
            onChange={handleChange}
            style={{ gridColumn: '1 / -1' }}
          />
        </div>

        <div className="btn-group">
          <button className="btn-blue" onClick={addWarranty}>Add Warranty</button>
          <button className="btn-gray" onClick={resetForm}>Clear Form</button>
        </div>
      </div>
    </div>
  );
};

export default AddWarranty;
