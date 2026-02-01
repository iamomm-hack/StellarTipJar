import React, { useEffect, useState } from 'react';
import { generateThankYouData } from '../utils/thankYouMessages';
import '../styles/ThankYou.css';

const ConfettiIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="5" r="2" fill="#f59e0b"/>
    <circle cx="5" cy="12" r="2" fill="#8b5cf6"/>
    <circle cx="19" cy="12" r="2" fill="#10b981"/>
    <circle cx="8" cy="18" r="2" fill="#3b82f6"/>
    <circle cx="16" cy="18" r="2" fill="#ef4444"/>
  </svg>
);

const StarIcon = ({ color }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>
);

const HeartIcon = ({ color }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
  </svg>
);

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

function ThankYou({ amount, senderAddress, onClose, onViewReceipt }) {
  const [thankYouData, setThankYouData] = useState(null);
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const data = generateThankYouData(amount, null);
    setThankYouData(data);

    const confettiTimer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(confettiTimer);
  }, [amount]);

  if (!thankYouData) return null;

  const getTierIcon = () => {
    switch (thankYouData.tier) {
      case 'large':
        return <StarIcon color={thankYouData.tierColor} />;
      case 'medium':
        return <HeartIcon color={thankYouData.tierColor} />;
      default:
        return <ConfettiIcon />;
    }
  };

  return (
    <div className="thankyou-overlay">
      {showConfetti && (
        <div className="confetti-container">
          {[...Array(20)].map((_, i) => (
            <div key={i} className={`confetti confetti-${i % 5}`} style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 0.5}s`
            }} />
          ))}
        </div>
      )}
      
      <div className="thankyou-modal">
        <button className="thankyou-close" onClick={onClose}>
          <CloseIcon />
        </button>

        <div className="thankyou-header">
          <div className="thankyou-icon-wrapper" style={{ 
            background: `${thankYouData.tierColor}15`,
            borderColor: thankYouData.tierColor 
          }}>
            {getTierIcon()}
          </div>
        </div>

        <h2 className="thankyou-title">Thank You!</h2>
        
        <div className="thankyou-amount" style={{ color: thankYouData.tierColor }}>
          {thankYouData.amount} XLM
        </div>

        <span className="thankyou-tier" style={{ 
          background: `${thankYouData.tierColor}15`,
          color: thankYouData.tierColor 
        }}>
          {thankYouData.tierLabel}
        </span>

        <p className="thankyou-message">{thankYouData.message}</p>

        {senderAddress && (
          <p className="thankyou-sender">
            From: {senderAddress.slice(0, 6)}...{senderAddress.slice(-4)}
          </p>
        )}

        <div className="thankyou-actions">
          <button className="btn-view-receipt" onClick={onViewReceipt}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke="currentColor" strokeWidth="2"/>
              <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            View Receipt
          </button>
          <button className="btn-close-thankyou" onClick={onClose}>
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

export default ThankYou;
