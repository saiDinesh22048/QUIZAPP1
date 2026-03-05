import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/global.css';

export const Navigation = ({ currentPage }) => {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo" style={{ textDecoration: 'none' }}>
          🏆 Quiz Auction
        </Link>
        <div className="nav-links">
          <Link 
            to="/display" 
            className={`nav-btn ${currentPage === 'display' ? 'active' : ''}`}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            Display
          </Link>
          <Link 
            to="/quiz" 
            className={`nav-btn ${currentPage === 'quiz' ? 'active' : ''}`}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            Quiz
          </Link>
        </div>
      </div>
    </nav>
  );
};
