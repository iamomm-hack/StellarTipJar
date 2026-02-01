import React, { useMemo } from 'react';
import './Leaderboard.css';

// Crown icon for #1
const CrownIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" strokeWidth="2">
    <path d="M2 20h20M4 15l4-7 4 4 4-4 4 7H4z"/>
  </svg>
);

// Medal icons
const GoldMedal = () => (
  <div className="medal medal-gold">1</div>
);

const SilverMedal = () => (
  <div className="medal medal-silver">2</div>
);

const BronzeMedal = () => (
  <div className="medal medal-bronze">3</div>
);

// User icon
const UserIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

function Leaderboard({ transactions }) {
  // Calculate top supporters from transactions
  const topSupporters = useMemo(() => {
    const supporterMap = {};
    
    transactions.forEach(tx => {
      const address = tx.from || tx.sender || 'Anonymous';
      if (!supporterMap[address]) {
        supporterMap[address] = { address, total: 0, count: 0 };
      }
      supporterMap[address].total += parseFloat(tx.amount);
      supporterMap[address].count += 1;
    });
    
    return Object.values(supporterMap)
      .sort((a, b) => b.total - a.total)
      .slice(0, 10);
  }, [transactions]);

  const shortenAddress = (address) => {
    if (!address || address === 'Anonymous') return 'Anonymous';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getRankDisplay = (rank) => {
    switch (rank) {
      case 1: return <GoldMedal />;
      case 2: return <SilverMedal />;
      case 3: return <BronzeMedal />;
      default: return <span className="rank-number">{rank}</span>;
    }
  };

  if (topSupporters.length === 0) {
    return (
      <div className="leaderboard empty">
        <div className="leaderboard-header">
          <CrownIcon />
          <h3>Top Supporters</h3>
        </div>
        <p className="empty-message">
          <UserIcon /> No supporters yet. Be the first!
        </p>
      </div>
    );
  }

  return (
    <div className="leaderboard">
      <div className="leaderboard-header">
        <CrownIcon />
        <h3>Top Supporters</h3>
        <span className="supporter-count">{topSupporters.length}</span>
      </div>
      
      <div className="leaderboard-list">
        {topSupporters.map((supporter, index) => (
          <div 
            key={supporter.address} 
            className={`leaderboard-item rank-${index + 1}`}
          >
            <div className="rank-badge">
              {getRankDisplay(index + 1)}
            </div>
            
            <div className="supporter-info">
              <span className="supporter-address">
                {shortenAddress(supporter.address)}
              </span>
              <span className="supporter-tips">
                {supporter.count} tip{supporter.count > 1 ? 's' : ''}
              </span>
            </div>
            
            <div className="supporter-amount">
              <span className="amount-value">{supporter.total.toFixed(2)}</span>
              <span className="amount-currency">XLM</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Leaderboard;
