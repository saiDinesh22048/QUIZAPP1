import React from 'react';
import '../styles/global.css';

export const Header = ({ title, subtitle }) => {
  return (
    <header className="header">
      <div className="container">
        <h1 className="header-title">{title}</h1>
        {subtitle && <p className="header-subtitle">{subtitle}</p>}
      </div>
    </header>
  );
};

export const Button = ({ children, onClick, variant = 'primary', disabled = false, className = '' }) => {
  return (
    <button
      className={`btn btn-${variant} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export const Card = ({ children, className = '' }) => {
  return (
    <div className={`card ${className}`}>
      {children}
    </div>
  );
};

export const Modal = ({ isOpen, title, children, onClose, onConfirm, confirmText = 'Confirm', cancelText = 'Cancel' }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{title}</h2>
        {children}
        <div className="modal-actions">
          <Button onClick={onClose} variant="secondary">{cancelText}</Button>
          <Button onClick={onConfirm} variant="primary">{confirmText}</Button>
        </div>
      </div>
    </div>
  );
};

export const Alert = ({ message, type = 'error' }) => {
  return (
    <div className={`alert alert-${type}`}>
      {message}
    </div>
  );
};

export const Loading = () => {
  return (
    <div className="loading">
      <div className="spinner"></div>
      <p>Loading...</p>
    </div>
  );
};

export const Badge = ({ text, variant = 'default' }) => {
  return <span className={`badge badge-${variant}`}>{text}</span>;
};
