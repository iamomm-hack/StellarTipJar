import React from 'react';
import { WalletConnect } from './components/WalletConnect';
import './App.css';

/**
 * DEMO PAGE: Standalone WalletConnect Component
 * 
 * This is a simple demo showing how to use the WalletConnect component
 * independently without integrating it into the main App.jsx
 */

function WalletConnectDemo() {
  return (
    <div className="app" data-theme="light">
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '2rem'
      }}>
        <div style={{ maxWidth: '500px', width: '100%' }}>
          <h1 style={{ 
            color: 'white', 
            textAlign: 'center', 
            marginBottom: '2rem',
            fontSize: '2.5rem',
            fontWeight: '700'
          }}>
            Wallet Connect Demo
          </h1>
          
          <WalletConnect />
          
          <p style={{ 
            color: 'rgba(255,255,255,0.8)', 
            textAlign: 'center', 
            marginTop: '2rem',
            fontSize: '0.875rem'
          }}>
            This is a standalone component with GSAP animations
          </p>
        </div>
      </div>
    </div>
  );
}

export default WalletConnectDemo;
