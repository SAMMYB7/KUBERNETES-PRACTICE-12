import React, { useState } from 'react';
import axios from 'axios';
import './pages.css';

const SearchWarranty = () => {
  const [idToFetch, setIdToFetch] = useState('');
  const [fetchedWarranty, setFetchedWarranty] = useState(null);
  const [message, setMessage] = useState('');
  const [searching, setSearching] = useState(false);

  const baseUrl = `${import.meta.env.VITE_API_URL}/warrantyapi`;

  const getWarrantyById = async () => {
    if (!idToFetch.trim()) {
      setMessage('Please enter a warranty ID.');
      setTimeout(() => {
        setMessage('');
      }, 3000);
      return;
    }

    try {
      setSearching(true);
      const res = await axios.get(`${baseUrl}/get/${idToFetch}`);
      setFetchedWarranty(res.data);
      setMessage('');
      setSearching(false);
    } catch (error) {
      setFetchedWarranty(null);
      setMessage('Warranty not found. Please check the ID and try again.');
      setSearching(false);
      setTimeout(() => {
        setMessage('');
      }, 3000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      getWarrantyById();
    }
  };

  const clearSearch = () => {
    setIdToFetch('');
    setFetchedWarranty(null);
    setMessage('');
  };

  const getDaysUntilExpiry = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
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
      return `⚠️ Expires in ${daysUntilExpiry} days`;
    }
    return `Expires in ${daysUntilExpiry} days`;
  };

  const getExpiryClass = (expiryDate) => {
    const daysUntilExpiry = getDaysUntilExpiry(expiryDate);
    if (daysUntilExpiry < 0) {
      return 'expired-status';
    }
    if (daysUntilExpiry <= 30) {
      return 'expiring-status';
    }
    return 'valid-status';
  };

  return (
    <div className="page-container">
      {message && (
        <div className={`message-banner ${message.toLowerCase().includes('error') || message.toLowerCase().includes('not found') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}

      <div className="content-card">
        <h2>Search Warranty by ID</h2>
        <p className="page-description">Enter the warranty ID to find a specific warranty in the inventory.</p>

        <div className="search-container">
          <input
            type="text"
            value={idToFetch}
            onChange={(e) => setIdToFetch(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter Warranty ID (e.g., 1)"
            className="search-input"
          />
          <div className="btn-group">
            <button className="btn-blue" onClick={getWarrantyById} disabled={searching}>
              {searching ? 'Searching...' : '🔍 Search Warranty'}
            </button>
            <button className="btn-gray" onClick={clearSearch}>Clear</button>
          </div>
        </div>

        {fetchedWarranty && (
          <div className="search-result">
            <h3>Warranty Details</h3>
            <div className="book-details-card">
              <div className="detail-row">
                <span className="detail-label">ID:</span>
                <span className="detail-value">{fetchedWarranty.id}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Item Name:</span>
                <span className="detail-value">{fetchedWarranty.itemName}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Purchase Date:</span>
                <span className="detail-value">{fetchedWarranty.purchaseDate}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Warranty Period:</span>
                <span className="detail-value">{fetchedWarranty.warrantyPeriodMonths} months</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Expiry Date:</span>
                <span className="detail-value">{fetchedWarranty.expiryDate}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Vendor:</span>
                <span className="detail-value">{fetchedWarranty.vendor}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Notes:</span>
                <span className="detail-value">{fetchedWarranty.notes || '-'}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Status:</span>
                <span className={`detail-value ${getExpiryClass(fetchedWarranty.expiryDate)}`}>
                  {formatExpiryStatus(fetchedWarranty.expiryDate)}
                </span>
              </div>
            </div>
          </div>
        )}

        {!fetchedWarranty && !message && (
          <div className="search-placeholder">
            <div className="placeholder-icon">🔎</div>
            <p>Enter a warranty ID above to search for a warranty</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchWarranty;
