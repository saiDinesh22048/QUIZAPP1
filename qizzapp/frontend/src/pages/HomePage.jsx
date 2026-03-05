import React from 'react';

export const HomePage = () => {
  return (
    <div className="home-page" style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <div style={{
        textAlign: 'center',
        color: 'white',
        fontSize: '3rem',
        fontWeight: 'bold',
        textShadow: '2px 2px 8px rgba(0,0,0,0.4)'
      }}>
        🚨 Don't try to hack us! 🚨
      </div>
    </div>
  );
};
