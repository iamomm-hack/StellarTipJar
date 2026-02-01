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
import { 
  saveTransaction, 
  getTransactions, 
  clearTransactions,
  getTotalTipsReceived
} from './utils/storage';
import { 
  getXLMPrice, 
  convertUSDtoXLM, 
  convertXLMtoUSD,
  validateXLMAmount,
  clearPriceCache
} from './utils/stellar-price';
import { saveProfile, getProfile } from './utils/profile-storage';
import { playTipSound, playSuccessSound } from './utils/sounds';
import { generatePDFReport } from './utils/pdf-export';
import Toast from './components/Toast';
import TransactionHistory from './components/TransactionHistory';
import Receipt from './components/Receipt';
import ProfileSettings from './components/ProfileSettings';
import Analytics from './components/Analytics';
import ThankYou from './components/ThankYou';
import InstallPrompt from './components/InstallPrompt';
import ThemeToggle from './components/ThemeToggle';
import TipGoals from './components/TipGoals';
import Leaderboard from './components/Leaderboard';
import Confetti from './components/Confetti';
import StreakBadge from './components/StreakBadge';
import Milestones from './components/Milestones';
import EmbedWidget from './components/EmbedWidget';
import QRCode from './components/QRCode';
import {
  ChevronUpIcon,
  ChevronDownIcon,
  CheckIcon,
  RefreshIcon,
  RocketIcon,
  LoaderIcon,
  HeartIcon,
  ArrowDownIcon,
  WalletIcon,
  QrCodeIcon,
  LogOutIcon
} from './components/Icons';
import './App.css';

// Fixed creator address (replace with your testnet address)
// Using testnet distribution account for testing - REPLACE THIS WITH YOUR OWN ADDRESS
const CREATOR_ADDRESS = 'GAFKEZCKRSFF4PE46HKR4SOPEBCFCUOL5EU3ESZFLQKEB3UDIM6ZHUNM';
const CREATOR_NAME = 'OM KUMAR';

function App() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [publicKey, setPublicKey] = useState('');
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [tipAmount, setTipAmount] = useState('');
  const [tipMessage, setTipMessage] = useState('');
  
  // Price conversion state
  const [xlmPrice, setXlmPrice] = useState(null);
  const [priceLoading, setPriceLoading] = useState(false);
  const [currencyMode, setCurrencyMode] = useState('XLM'); // 'XLM' or 'USD'
  const [usdAmount, setUsdAmount] = useState('');
  
  // Profile state
  const [profile, setProfile] = useState(null);
  const [showProfileSettings, setShowProfileSettings] = useState(false);
  
  // History toggle state
  const [showHistory, setShowHistory] = useState(false);
  
  // Tab navigation state
  const [activeTab, setActiveTab] = useState('tip'); // 'tip', 'history', 'analytics'
  
  // Transaction history state
  const [transactions, setTransactions] = useState([]);
  const [showReceipt, setShowReceipt] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [walletDropdownOpen, setWalletDropdownOpen] = useState(false);
  
  // Toast state
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  
  // Thank You modal state
  const [showThankYou, setShowThankYou] = useState(false);
  const [lastTipData, setLastTipData] = useState({ amount: 0, hash: '' });
  
  // Dark mode state
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });
  
  // Apply dark mode to body
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);
  
  // Confetti, Embed, and QR state
  const [showConfetti, setShowConfetti] = useState(false);
  const [showEmbedWidget, setShowEmbedWidget] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  
  const totalTips = transactions.reduce((sum, tx) => sum + parseFloat(tx.amount), 0);
  const tipCount = transactions.length;

  // Load data from localStorage on mount
  useEffect(() => {
    const stored = getTransactions();
    setTransactions(stored);
    
    // Load profile
    const profileData = getProfile();
    setProfile(profileData);
  }, []);

  // Fetch XLM price on mount
  useEffect(() => {
    fetchXLMPrice();
  }, []);

  // Fetch balance when wallet connects
  useEffect(() => {
    if (walletConnected && publicKey) {
      fetchBalance();
    }
  }, [walletConnected, publicKey]);

  const fetchXLMPrice = async () => {
    setPriceLoading(true);
    try {
      const price = await getXLMPrice();
      setXlmPrice(price);
    } catch (error) {
      console.error('Error fetching XLM price:', error);
      showToast('Failed to fetch XLM price', 'error');
    } finally {
      setPriceLoading(false);
    }
  };

  const handleCurrencyToggle = () => {
    const newMode = currencyMode === 'XLM' ? 'USD' : 'XLM';
    setCurrencyMode(newMode);
    
    // Convert existing amount
    if (newMode === 'USD' && tipAmount && xlmPrice) {
      const usd = convertXLMtoUSD(parseFloat(tipAmount), xlmPrice);
      setUsdAmount(usd.toFixed(2));
      setTipAmount('');
    } else if (newMode === 'XLM' && usdAmount && xlmPrice) {
      const xlm = convertUSDtoXLM(parseFloat(usdAmount), xlmPrice);
      setTipAmount(xlm.toFixed(2));
      setUsdAmount('');
    }
  };

  const handleAmountChange = (value) => {
    if (currencyMode === 'XLM') {
      setTipAmount(value);
      // Update USD equivalent
      if (value && xlmPrice) {
        const usd = convertXLMtoUSD(parseFloat(value), xlmPrice);
        setUsdAmount(usd.toFixed(2));
      } else {
        setUsdAmount('');
      }
    } else {
      setUsdAmount(value);
      // Update XLM equivalent
      if (value && xlmPrice) {
        const xlm = convertUSDtoXLM(parseFloat(value), xlmPrice);
        setTipAmount(xlm.toFixed(2));
      } else {
        setTipAmount('');
      }
    }
  };

  const refreshPrice = () => {
    clearPriceCache();
    fetchXLMPrice();
    showToast('Price refreshed!', 'success');
  };

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

    // Validate amount
    const validation = validateXLMAmount(amount);
    if (!validation.valid) {
      showToast(validation.error, 'error');
      return;
    }

    setLoading(true);

    console.log('Starting tip transaction...', { amount, recipient: CREATOR_ADDRESS, sender: publicKey });

    try {
      // Build transaction
      console.log('Building transaction...');
      const xdr = await buildPaymentTransaction(publicKey, CREATOR_ADDRESS, amount);
      console.log('Transaction built XDR:', xdr ? 'Yes' : 'No');
      
      // Sign with Freighter
      console.log('Requesting signature from Freighter...');
      const signedXdr = await signTransaction(xdr, NETWORK_PASSPHRASE);
      console.log('Transaction signed:', signedXdr ? 'Yes' : 'No');
      
      // Submit transaction
      console.log('Submitting transaction...');
      
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
        // Show Thank You modal with tip data
        setLastTipData({ amount, hash, transaction: savedTx });
        setShowThankYou(true);
        
        // ✨ Trigger confetti and sound
        playSuccessSound();
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }
      
      // Clear input fields
      setTipAmount('');
      setUsdAmount('');
      
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

  const handleSaveProfile = (profileData) => {
    const success = saveProfile(profileData);
    if (success) {
      setProfile(profileData);
      setShowProfileSettings(false);
      showToast('Profile updated successfully!', 'success');
    } else {
      showToast('Failed to update profile', 'error');
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
    <div className="app">
      {/* Top Navigation Bar */}
      <nav className="top-nav">
        <div className="nav-content">
          <div className="nav-left">
            <h3 className="logo">Stellar Tip Jar</h3>
          </div>
          <div className="nav-right">
            <ThemeToggle isDark={darkMode} onToggle={() => setDarkMode(!darkMode)} />
            {!walletConnected ? (
              <button 
                className="btn-nav-wallet"
                onClick={handleConnect}
                disabled={loading}
              >
                {loading ? 'Connecting...' : 'Connect Wallet'}
              </button>
            ) : (
              <div className="wallet-dropdown">
                <button 
                  className="btn-wallet-connected"
                  onClick={() => setWalletDropdownOpen(!walletDropdownOpen)}
                >
                  <span className="wallet-icon"><WalletIcon size={14} /></span>
                  <span className="wallet-short-address">{shortenAddress(publicKey)}</span>
                  <span className="dropdown-arrow">{walletDropdownOpen ? <ChevronUpIcon size={12} /> : <ChevronDownIcon size={12} />}</span>
                </button>
                
                {walletDropdownOpen && (
                  <div className="wallet-dropdown-menu">
                    <div className="dropdown-item wallet-info">
                      <span className="info-label">Balance</span>
                      <span className="info-value">{balance.toFixed(2)} XLM</span>
                    </div>
                    <div className="dropdown-item wallet-info">
                      <span className="info-label">Address</span>
                      <span className="info-value wallet-full-address">{publicKey}</span>
                    </div>
                    <div className="dropdown-divider"></div>
                    <button 
                      className="dropdown-item btn-dropdown-disconnect"
                      onClick={() => {
                        handleDisconnect();
                        setWalletDropdownOpen(false);
                      }}
                    >
                      <LogOutIcon size={16} /> Disconnect Wallet
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section - Unique Personal Design */}
      <section className="hero-section">
        <div className="hero-content">
          {/* Personal Greeting */}
          <div className="hero-greeting">
            <span className="wave-emoji">👋</span>
            <h2 className="greeting-text">Hey there!</h2>
          </div>

          {/* Main Message */}
          <h1 className="hero-title">
            I'm {CREATOR_NAME}
          </h1>

          <p className="hero-message">
            If you enjoy my work and want to support what I do, you can send me a tip using Stellar (XLM). 
            Every contribution helps me keep creating!
          </p>

          {/* Tip Stats */}
          <div className="tip-stats">
            <div className="stat-item">
              <svg className="stat-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z" fill="currentColor"/>
              </svg>
              <div className="stat-info">
                <span className="stat-value">{totalTips.toFixed(2)} XLM</span>
                <span className="stat-label">Total Tips Received</span>
              </div>
            </div>
            <div className="stat-item">
              <svg className="stat-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="currentColor"/>
              </svg>
              <div className="stat-info">
                <span className="stat-value">{transactions.length}</span>
                <span className="stat-label">Supporters</span>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="hero-cta-section">
            {!walletConnected ? (
              <div className="cta-wrapper">
                <p className="cta-prompt">Ready to send a tip?</p>
                <button 
                  className="btn-hero-cta"
                  onClick={handleConnect}
                  disabled={loading}
                >
                  {loading ? 'Connecting...' : 'Connect Your Wallet'}
                </button>
                <p className="cta-note">Connect with Freighter Wallet to get started</p>
              </div>
            ) : (
              <div className="hero-connected">
                <div className="connected-badge">
                  <span className="badge-icon"><CheckIcon size={14} /></span>
                  <span className="badge-text">Wallet Connected</span>
                </div>
                <p className="connected-message">Scroll down to send a tip <ArrowDownIcon size={14} /></p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Tab Navigation */}
      {walletConnected && (
        <nav className="tab-navigation">
          <button 
            className={`tab-btn ${activeTab === 'tip' ? 'active' : ''}`}
            onClick={() => setActiveTab('tip')}
          >
            <RocketIcon size={18} />
            <span>Send Tip</span>
          </button>
          <button 
            className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 8v4l3 3M3 12a9 9 0 1018 0 9 9 0 00-18 0z" strokeLinecap="round"/>
            </svg>
            <span>History</span>
            {transactions.length > 0 && (
              <span className="tab-badge">{transactions.length}</span>
            )}
          </button>
          <button 
            className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 20V10M12 20V4M6 20v-6" strokeLinecap="round"/>
            </svg>
            <span>Analytics</span>
          </button>
        </nav>
      )}

      {/* Send Tip Section */}
      {walletConnected && activeTab === 'tip' && (
        <div className="tab-content tip-tab-content">
          {/* Streak Badge - Top Right */}
          <div className="streak-container">
            <StreakBadge transactions={transactions} />
          </div>
          
          {/* Tip Goals Progress - Full Width */}
          <TipGoals totalTips={totalTips} />
          
          <section className="tip-section">
            <div className="tip-card">
              <div className="tip-header">
                <div>
                  <h2 className="tip-title">Send a Tip</h2>
                  <p className="tip-subtitle">
                    Support my work with XLM
                    <span className={`network-badge ${window.DEV_MODE_ACTIVE ? 'demo' : 'testnet'}`}>
                      {window.DEV_MODE_ACTIVE ? '⚠️ DEMO' : '🟢 TESTNET'}
                    </span>
                  </p>
                </div>
                <button 
                  className="btn-show-qr"
                  onClick={() => setShowQRCode(true)}
                  title="Show QR Code"
                >
                  <QrCodeIcon size={18} /> QR Code
                </button>
              </div>

            <div className="tip-content">
              <div className="quick-tips">
                <p className="quick-tips-label">Quick Amounts</p>
                <div className="tip-buttons">
                  <button 
                    className="btn-quick-tip"
                    onClick={() => handleTip(profile?.customTips[0] || 1)}
                    disabled={loading}
                  >
                    <span className="tip-amount">{profile?.customTips[0] || 1}</span>
                    <span className="tip-currency">XLM</span>
                  </button>
                  <button 
                    className="btn-quick-tip"
                    onClick={() => handleTip(profile?.customTips[1] || 5)}
                    disabled={loading}
                  >
                    <span className="tip-amount">{profile?.customTips[1] || 5}</span>
                    <span className="tip-currency">XLM</span>
                  </button>
                  <button 
                    className="btn-quick-tip"
                    onClick={() => handleTip(profile?.customTips[2] || 10)}
                    disabled={loading}
                  >
                    <span className="tip-amount">{profile?.customTips[2] || 10}</span>
                    <span className="tip-currency">XLM</span>
                  </button>
                </div>
              </div>

              <div className="custom-tip-section">
                <div className="custom-tip-header">
                  <p className="custom-tip-label">Custom Amount</p>
                  {xlmPrice && (
                    <div className="conversion-display">
                      <span className="conversion-rate">
                        1 XLM = ${xlmPrice.toFixed(4)} USD
                      </span>
                      <button 
                        className="refresh-rate-btn"
                        onClick={refreshPrice}
                        disabled={priceLoading}
                        title="Refresh price"
                      >
                        <RefreshIcon size={14} />
                      </button>
                      <button 
                        className="currency-toggle"
                        onClick={handleCurrencyToggle}
                        title="Toggle currency"
                      >
                        {currencyMode === 'XLM' ? 'USD' : 'XLM'}
                      </button>
                    </div>
                  )}
                </div>
                <div className="custom-tip-input-wrapper">
                  <input
                    type="number"
                    className="custom-tip-input"
                    placeholder={`Enter amount in ${currencyMode}`}
                    value={currencyMode === 'XLM' ? tipAmount : usdAmount}
                    onChange={(e) => handleAmountChange(e.target.value)}
                    disabled={loading}
                    min="0.01"
                    step="0.01"
                  />
                  <span className="input-suffix">{currencyMode}</span>
                </div>
                {(currencyMode === 'XLM' ? usdAmount : tipAmount) && xlmPrice && (
                  <p className="usd-equivalent">
                    ≈ {currencyMode === 'XLM' 
                      ? `$${usdAmount} USD` 
                      : `${tipAmount} XLM`}
                  </p>
                )}
                <button 
                  className="btn-custom-tip"
                  onClick={() => handleTip(parseFloat(tipAmount))}
                  disabled={loading || !tipAmount}
                >
                  {loading ? <><LoaderIcon size={16} /> Sending...</> : <><RocketIcon size={16} /> Send Tip</>}
                </button>
              </div>
            </div>
          </div>
        </section>
        </div>
      )}

      {/* Transaction History Section */}
      {walletConnected && activeTab === 'history' && (
        <div className="tab-content">
          <TransactionHistory
            transactions={transactions}
            onViewReceipt={handleViewReceipt}
            onClearHistory={handleClearHistory}
          />
        </div>
      )}

      {/* Analytics Dashboard Section */}
      {walletConnected && activeTab === 'analytics' && (
        <div className="tab-content">
          <Analytics transactions={transactions} onExportPDF={() => generatePDFReport(transactions, { supporters: new Set(transactions.map(t => t.from)).size })} />
          <Leaderboard transactions={transactions} />
          <Milestones totalTips={totalTips} tipCount={tipCount} />
          
          {/* Embed Widget Button */}
          <div className="embed-section">
            <button 
              className="btn-embed-widget"
              onClick={() => setShowEmbedWidget(true)}
            >
              🔗 Get Embed Code
            </button>
          </div>
        </div>
      )}

      <div className="container">

      {/* Footer */}
      <footer className="footer">
        <p className="footer-text">Built on Stellar Testnet</p>
        <p className="footer-creator"><HeartIcon size={14} color="#ef4444" filled={true} /> OM KUMAR</p>
        <div className="social-links">
          <a 
            href="https://github.com/iamomm-hack/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="social-btn"
            aria-label="GitHub"
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
            </svg>
          </a>
          <a 
            href="https://x.com/omdotcmd" 
            target="_blank" 
            rel="noopener noreferrer"
            className="social-btn"
            aria-label="X (Twitter)"
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </a>
          <a 
            href="https://linkedin.com/in/om-kumar16/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="social-btn"
            aria-label="LinkedIn"
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </a>
          <a 
            href="mailto:iamkumarom.edu@gmail.com"
            className="social-btn"
            aria-label="Email"
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
            </svg>
          </a>
        </div>
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

      {/* Profile Settings Modal */}
      {showProfileSettings && profile && (
        <ProfileSettings
          profile={profile}
          onSave={handleSaveProfile}
          onClose={() => setShowProfileSettings(false)}
        />
      )}

      {/* Thank You Modal */}
      {showThankYou && (
        <ThankYou
          amount={lastTipData.amount}
          senderAddress={publicKey}
          onClose={() => setShowThankYou(false)}
          onViewReceipt={() => {
            setShowThankYou(false);
            if (lastTipData.transaction) {
              handleViewReceipt(lastTipData.transaction);
            }
          }}
        />
      )}

      {/* PWA Install Prompt */}
      <InstallPrompt />
      
      {/* Confetti Animation */}
      <Confetti active={showConfetti} duration={3000} />
      
      {/* Embed Widget Modal */}
      <EmbedWidget 
        isOpen={showEmbedWidget}
        onClose={() => setShowEmbedWidget(false)}
        creatorAddress={CREATOR_ADDRESS}
        creatorName={CREATOR_NAME}
      />
      
      {/* QR Code Modal */}
      {showQRCode && (
        <div className="qr-modal-backdrop" onClick={() => setShowQRCode(false)}>
          <div className="qr-modal" onClick={e => e.stopPropagation()}>
            <button className="btn-close-qr" onClick={() => setShowQRCode(false)}>✕</button>
            <h3 className="qr-modal-title">Scan to Tip</h3>
            <QRCode address={CREATOR_ADDRESS} size={220} />
          </div>
        </div>
      )}
      </div>
    </div>
  );
}

export default App;
