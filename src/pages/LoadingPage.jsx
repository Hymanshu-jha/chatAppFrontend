import React from 'react';
import './css/LoadingPage.css';

const LoadingPage = () => {
  return (
    <div className="loading-container">
      <div className="spinner"></div>
      <h2 className="loading-text">Loading, please wait...</h2>
    </div>
  );
};

export default LoadingPage;
