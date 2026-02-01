import { useState } from 'react';
import { getExplorerLink, copyToClipboard } from '../utils/stellar';
import { CheckIcon, CopyIcon, ExternalLinkIcon } from './Icons';
import '../styles/Receipt.css';

/**
 * Receipt modal component - displays detailed transaction information
 * @param {Object} props
 * @param {Object} props.transaction - Transaction object
 * @param {Function} props.onClose - Callback to close modal
 */
function Receipt({ transaction, onClose }) {
  const [copied, setCopied] = useState(false);

  if (!transaction) return null;

  const formatFullDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const handleCopyHash = async () => {
    const success = await copyToClipboard(transaction.hash);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-content receipt-modal">
        <div className="receipt-header">
          <h2 className="receipt-title">Transaction Receipt</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <div className="receipt-body">
          {/* Status */}
          <div className="receipt-status">
            <span className={`status-badge-large status-${transaction.status}`}>
              {transaction.status === 'success' && <CheckIcon size={16} />}
              {transaction.status}
            </span>
          </div>

          {/* Amount */}
          <div className="receipt-amount">
            <span className="receipt-amount-value">{transaction.amount}</span>
            <span className="receipt-amount-currency">XLM</span>
          </div>

          {/* Details */}
          <div className="receipt-details">
            <div className="receipt-row">
              <span className="receipt-label">Transaction Hash</span>
              <div className="receipt-value-group">
                <code className="receipt-hash">{transaction.hash}</code>
                <button 
                  className="copy-btn-small"
                  onClick={handleCopyHash}
                  aria-label="Copy hash"
                >
                  {copied ? <CheckIcon size={14} /> : <CopyIcon size={14} />}
                </button>
              </div>
            </div>

            <div className="receipt-row">
              <span className="receipt-label">From</span>
              <code className="receipt-value">{transaction.sender}</code>
            </div>

            <div className="receipt-row">
              <span className="receipt-label">To</span>
              <code className="receipt-value">{transaction.recipient}</code>
            </div>

            <div className="receipt-row">
              <span className="receipt-label">Date & Time</span>
              <span className="receipt-value">{formatFullDate(transaction.timestamp)}</span>
            </div>

            <div className="receipt-row">
              <span className="receipt-label">Network</span>
              <span className="receipt-value">Stellar Testnet</span>
            </div>
          </div>

          {/* Actions */}
          <div className="receipt-actions">
            <a
              href={getExplorerLink(transaction.hash)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-explorer"
            >
              View on Stellar Expert <ExternalLinkIcon size={14} />
            </a>
            
            {/* Share Buttons */}
            <div className="share-buttons">
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`I just tipped ${transaction.amount} XLM on Stellar Tip Jar! 🚀\n\nTransaction: ${getExplorerLink(transaction.hash)}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-share btn-twitter"
                title="Share on Twitter"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <button
                className="btn btn-share"
                onClick={() => {
                  navigator.clipboard.writeText(getExplorerLink(transaction.hash));
                  alert('Link copied!');
                }}
                title="Copy Link"
              >
                <CopyIcon size={16} />
              </button>
            </div>
            
            <button className="btn btn-close-modal" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Receipt;
