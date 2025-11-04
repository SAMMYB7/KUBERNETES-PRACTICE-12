import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './pages.css';

const ViewWarranties = () => {
  const [warranties, setWarranties] = useState([]);
  const [warranty, setWarranty] = useState({
    id: '',
    itemName: '',
    purchaseDate: '',
    warrantyPeriodMonths: '',
    expiryDate: '',
    vendor: '',
    notes: ''
  });
  const [message, setMessage] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);

  const baseUrl = `${import.meta.env.VITE_API_URL}/warrantyapi`;

  useEffect(() => {
    fetchAllWarranties();
  }, []);

  const fetchAllWarranties = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${baseUrl}/all`);
      setWarranties(res.data);
      setLoading(false);
    } catch (error) {
      setMessage('Failed to fetch warranties.');
      setLoading(false);
      setTimeout(() => {
        setMessage('');
      }, 3000);
    }
  };

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

  const updateWarranty = async () => {
    if (!validateForm()) return;
    try {
      const warrantyData = {
        itemName: warranty.itemName,
        purchaseDate: warranty.purchaseDate,
        warrantyPeriodMonths: parseInt(warranty.warrantyPeriodMonths),
        vendor: warranty.vendor,
        notes: warranty.notes || ''
      };
      await axios.put(`${baseUrl}/update/${warranty.id}`, warrantyData);
      setMessage('Warranty updated successfully.');
      setTimeout(() => {
        setMessage('');
      }, 3000);
      fetchAllWarranties();
      resetForm();
    } catch (error) {
      setMessage('Error updating warranty.');
      setTimeout(() => {
        setMessage('');
      }, 3000);
    }
  };

  const deleteWarranty = async (id) => {
    if (window.confirm('Are you sure you want to delete this warranty?')) {
      try {
        await axios.delete(`${baseUrl}/delete/${id}`);
        setMessage('Warranty deleted successfully.');
        setTimeout(() => {
          setMessage('');
        }, 3000);
        fetchAllWarranties();
      } catch (error) {
        setMessage('Error deleting warranty.');
        setTimeout(() => {
          setMessage('');
        }, 3000);
      }
    }
  };

  const handleEdit = (warrantyItem) => {
    setWarranty({
      id: warrantyItem.id,
      itemName: warrantyItem.itemName,
      purchaseDate: warrantyItem.purchaseDate,
      warrantyPeriodMonths: warrantyItem.warrantyPeriodMonths.toString(),
      expiryDate: warrantyItem.expiryDate,
      vendor: warrantyItem.vendor,
      notes: warrantyItem.notes || ''
    });
    setEditMode(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setWarranty({
      id: '',
      itemName: '',
      purchaseDate: '',
      warrantyPeriodMonths: '',
      expiryDate: '',
      vendor: '',
      notes: ''
    });
    setEditMode(false);
  };

  const getDaysUntilExpiry = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getRowClassName = (expiryDate) => {
    const daysUntilExpiry = getDaysUntilExpiry(expiryDate);
    if (daysUntilExpiry <= 30 && daysUntilExpiry >= 0) {
      return 'expiring-soon';
    }
    if (daysUntilExpiry < 0) {
      return 'expired';
    }
    return '';
  };

  const formatExpiryStatus = (expiryDate) => {
    const daysUntilExpiry = getDaysUntilExpiry(expiryDate);
    if (daysUntilExpiry < 0) {
      return `Expired ${Math.abs(daysUntilExpiry)} days ago`;
    }
    if (daysUntilExpiry === 0) {
      return 'Expires today';
    }
    if (daysUntilExpiry <= 30) {
      return `Expires in ${daysUntilExpiry} days`;
    }
    return '';
  };

  return (
    <div className="page-container">
      {message && (
        <div className={`message-banner ${message.toLowerCase().includes('error') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}

      {editMode && (
        <div className="content-card edit-card">
          <h3>Edit Warranty</h3>
          <p className="page-description">Update the warranty details below.</p>
          
          <div className="form-grid">
            <input 
              type="text" 
              name="id" 
              placeholder="ID" 
              value={warranty.id} 
              disabled
            />
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
            <button className="btn-green" onClick={updateWarranty}>Update Warranty</button>
            <button className="btn-gray" onClick={resetForm}>Cancel</button>
          </div>
        </div>
      )}

      <div className="content-card">
        <h2>All Warranties</h2>
        <p className="page-description">
          Browse all warranties in the inventory. Click Edit to modify or Delete to remove a warranty.
        </p>

        {loading ? (
          <div className="loading">Loading warranties...</div>
        ) : warranties.length === 0 ? (
          <div className="no-data">
            <p>No warranties found in the inventory.</p>
            <p>Add your first warranty to get started!</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Item Name</th>
                  <th>Purchase Date</th>
                  <th>Warranty Period</th>
                  <th>Expiry Date</th>
                  <th>Vendor</th>
                  <th>Notes</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {warranties.map((warrantyItem) => (
                  <tr key={warrantyItem.id} className={getRowClassName(warrantyItem.expiryDate)}>
                    <td>{warrantyItem.id}</td>
                    <td>{warrantyItem.itemName}</td>
                    <td>{warrantyItem.purchaseDate}</td>
                    <td>{warrantyItem.warrantyPeriodMonths} months</td>
                    <td>{warrantyItem.expiryDate}</td>
                    <td>{warrantyItem.vendor}</td>
                    <td>{warrantyItem.notes || '-'}</td>
                    <td className="expiry-status">{formatExpiryStatus(warrantyItem.expiryDate)}</td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn-green" onClick={() => handleEdit(warrantyItem)}>Edit</button>
                        <button className="btn-red" onClick={() => deleteWarranty(warrantyItem.id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewWarranties;
