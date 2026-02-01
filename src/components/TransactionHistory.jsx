import { shortenAddress } from '../utils/stellar';
import '../styles/TransactionHistory.css';

/**
 * TransactionHistory component - displays list of past transactions
 * @param {Object} props
 * @param {Array} props.transactions - Array of transaction objects
 * @param {Function} props.onViewReceipt - Callback when transaction is clicked
 * @param {Function} props.onClearHistory - Callback to clear all history
 */
function TransactionHistory({ transactions, onViewReceipt, onClearHistory }) {
  const formatDate = (isoString) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear all transaction history?')) {
      onClearHistory();
    }
  };

  if (transactions.length === 0) {
    return (
      <section className="section transaction-history">
        <h2 className="section-title">Transaction History</h2>
        <div className="empty-state">
          <svg className="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="empty-text">No transactions yet</p>
          <p className="empty-subtext">Your tip history will appear here</p>
        </div>
      </section>
    );
  }

  return (
    <section className="section transaction-history">
      <div className="history-header">
        <h2 className="section-title">Transaction History</h2>
        <button className="btn-clear" onClick={handleClear}>
          Clear History
        </button>
      </div>
      
      <div className="transaction-list">
        {transactions.map((tx) => (
          <div 
            key={tx.id} 
            className="transaction-item"
            onClick={() => onViewReceipt(tx)}
          >
            <div className="tx-main">
              <div className="tx-amount">
                <span className="amount-value">{tx.amount}</span>
                <span className="amount-currency">XLM</span>
              </div>
              <span className={`status-badge status-${tx.status}`}>
                {tx.status}
              </span>
            </div>
            
            <div className="tx-details">
              <div className="tx-hash">
                <span className="tx-label">Hash:</span>
                <code className="tx-code">{shortenAddress(tx.hash)}</code>
              </div>
              <span className="tx-time">{formatDate(tx.timestamp)}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default TransactionHistory;
