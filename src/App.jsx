import { useState, useEffect } from 'react';
import { connectWallet, disconnectWallet, signTransaction } from './utils/wallet';
import { 
  getBalance, 
  buildPaymentTransaction, 
  submitTransaction,
  shortenAddress,
  copyToClipboard,
  getExplorerLink,
  NETWORK_PASSPHRASE 
} from './utils/stellar';
import { saveTransaction, getTransactions, clearTransactions } from './utils/storage';
import Toast from './components/Toast';
import TransactionHistory from './components/TransactionHistory';
import Receipt from './components/Receipt';
import './App.css';

// Fixed creator address (replace with your testnet address)
const CREATOR_ADDRESS = 'GBMQJ3G5LDWODZKUUQWGGT6NIKMM7KL5NLHVIG53WLNLWB27Z4AKH3F4';
const CREATOR_NAME = 'OM KUMAR';

function App() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [publicKey, setPublicKey] = useState('');
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [customAmount, setCustomAmount] = useState('');
  const [copied, setCopied] = useState(false);
  
  // Transaction history state
  const [transactions, setTransactions] = useState([]);
  const [showReceipt, setShowReceipt] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  
  // Toast state
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });

  // Load transactions from localStorage on mount
  useEffect(() => {
    const stored = getTransactions();
    setTransactions(stored);
  }, []);

  // Fetch balance when wallet connects
  useEffect(() => {
    if (walletConnected && publicKey) {
      fetchBalance();
    }
  }, [walletConnected, publicKey]);

  const fetchBalance = async () => {
    try {
      const bal = await getBalance(publicKey);
      setBalance(bal);
    } catch (err) {
      console.error('Balance fetch error:', err);
    }
  };

  const showToast = (message, type = 'info') => {
    setToast({ show: true, message, type });
  };

  const hideToast = () => {
    setToast({ show: false, message: '', type: 'info' });
  };

  const handleConnect = async () => {
    setLoading(true);
    
    try {
      const pubKey = await connectWallet();
      setPublicKey(pubKey);
      setWalletConnected(true);
      showToast('Wallet connected successfully!', 'success');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = () => {
    disconnectWallet();
    setWalletConnected(false);
    setPublicKey('');
    setBalance(0);
    showToast('Wallet disconnected', 'info');
  };

  const sendTip = async (amount) => {
    if (!walletConnected) {
      showToast('Please connect your wallet first', 'error');
      return;
    }

    setLoading(true);

    try {
      // Build transaction
      const xdr = await buildPaymentTransaction(publicKey, CREATOR_ADDRESS, amount);
      
      // Sign with Freighter
      const signedXdr = await signTransaction(xdr, NETWORK_PASSPHRASE);
      
      // Submit transaction
      const hash = await submitTransaction(signedXdr);
      
      // Save transaction to history
      const txData = {
        hash,
        amount,
        recipient: CREATOR_ADDRESS,
        sender: publicKey,
        status: 'success'
      };
      
      const savedTx = saveTransaction(txData);
      if (savedTx) {
        setTransactions(prev => [savedTx, ...prev]);
      }
      
      showToast(`Thank you! Your ${amount} XLM tip was sent successfully.`, 'success');
      setCustomAmount('');
      
      // Refresh balance
      setTimeout(fetchBalance, 2000);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleTip = (amount) => {
    sendTip(amount);
  };

  const handleCustomTip = () => {
    const amount = parseFloat(customAmount);
    if (isNaN(amount) || amount <= 0) {
      showToast('Please enter a valid amount', 'error');
      return;
    }
    sendTip(amount);
  };

  const handleViewReceipt = (transaction) => {
    setSelectedTransaction(transaction);
    setShowReceipt(true);
  };

  const handleCloseReceipt = () => {
    setShowReceipt(false);
    setSelectedTransaction(null);
  };

  const handleClearHistory = () => {
    const success = clearTransactions();
    if (success) {
      setTransactions([]);
      showToast('Transaction history cleared', 'info');
    }
  };

  const handleCopyAddress = async () => {
    const success = await copyToClipboard(CREATOR_ADDRESS);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="container">
      {/* Header */}
      <header className="header">
        <h1 className="title">Stellar Tip Jar</h1>
        <p className="subtitle">
          Support my work by sending a small XLM tip on Stellar testnet.
        </p>
      </header>

      {/* Creator Section */}
      <section className="section">
        <h2 className="section-title">Built by</h2>
        <p className="creator-name">{CREATOR_NAME}</p>
        <div className="address-container">
          <p className="label">Stellar Address</p>
          <div className="address-row">
            <code className="address">{shortenAddress(CREATOR_ADDRESS)}</code>
            <button 
              className="copy-btn"
              onClick={handleCopyAddress}
              aria-label="Copy address"
            >
              {copied ? '✓ Copied' : 'Copy'}
            </button>
          </div>
        </div>

        {/* QR Code Placeholder */}
        <div className="qr-wrapper">
          <div className="qr-placeholder">
            <svg viewBox="0 0 200 200" className="qr-svg">
              <rect x="10" y="10" width="180" height="180" fill="none" stroke="currentColor" strokeWidth="2"/>
              <text x="100" y="100" textAnchor="middle" dominantBaseline="middle" fontSize="14" fill="currentColor">
                QR Code
              </text>
              <text x="100" y="120" textAnchor="middle" dominantBaseline="middle" fontSize="10" fill="currentColor" opacity="0.6">
                (Testnet Address)
              </text>
            </svg>
          </div>
        </div>
      </section>

      {/* Wallet Section */}
      <section className="section">
        <h2 className="section-title">Your Wallet</h2>
        
        {!walletConnected ? (
          <button 
            className="btn btn-primary"
            onClick={handleConnect}
            disabled={loading}
          >
            {loading ? 'Connecting...' : 'Connect Freighter Wallet'}
          </button>
        ) : (
          <div className="wallet-info">
            <div className="info-row">
              <span className="label">Connected:</span>
              <code className="value">{shortenAddress(publicKey)}</code>
            </div>
            <div className="info-row">
              <span className="label">Your Balance:</span>
              <span className="value balance">{balance.toFixed(2)} XLM</span>
            </div>
            <button 
              className="btn btn-secondary"
              onClick={handleDisconnect}
            >
              Disconnect
            </button>
          </div>
        )}
      </section>

      {/* Tip Section */}
      {walletConnected && (
        <section className="section">
          <h2 className="section-title">Send a Tip</h2>
          
          <div className="tip-buttons">
            <button 
              className="btn btn-tip"
              onClick={() => handleTip(1)}
              disabled={loading}
            >
              Tip 1 XLM
            </button>
            <button 
              className="btn btn-tip"
              onClick={() => handleTip(5)}
              disabled={loading}
            >
              Tip 5 XLM
            </button>
          </div>

          <div className="custom-tip">
            <div className="input-group">
              <input
                type="number"
                className="tip-input"
                placeholder="Custom amount"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                disabled={loading}
                min="0.01"
                step="0.01"
              />
              <button 
                className="btn btn-send"
                onClick={handleCustomTip}
                disabled={loading || !customAmount}
              >
                {loading ? 'Sending...' : 'Send Tip'}
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Transaction History */}
      {walletConnected && (
        <TransactionHistory
          transactions={transactions}
          onViewReceipt={handleViewReceipt}
          onClearHistory={handleClearHistory}
        />
      )}

      {/* Footer */}
      <footer className="footer">
        <p>Built on Stellar Testnet</p>
      </footer>

      {/* Toast Notification */}
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      )}

      {/* Receipt Modal */}
      {showReceipt && selectedTransaction && (
        <Receipt
          transaction={selectedTransaction}
          onClose={handleCloseReceipt}
        />
      )}
    </div>
  );
}

export default App;
