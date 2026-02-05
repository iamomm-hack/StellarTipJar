import React, { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import albedo from '@albedo-link/intent';
import { shortenAddress, fundAccount } from '../utils/stellar';
import { QRCodeCanvas } from 'qrcode.react';
import { WalletIcon } from './Icons';
import './WalletConnect.css';

/**
 * WalletConnect Component - Albedo Wallet
 * Web-based wallet - works perfectly on localhost!
 * 
 * Props:
 * - onConnect(publicKey): Called when wallet connects
 * - onDisconnect(): Called when wallet disconnects
 * - compact: If true, shows compact navbar button instead of full card
 * - balance: XLM balance to display in dropdown (compact mode only)
 */

// Set global flag for network detection
if (typeof window !== 'undefined') {
    window.WALLET_TYPE = 'albedo';
}

export const WalletConnect = ({ onConnect, onDisconnect, compact = false, balance = 0, showToast }) => {
    const [publicKey, setPublicKey] = useState(null);
    const [isConnecting, setIsConnecting] = useState(false);
    const [isFunding, setIsFunding] = useState(false);
    const [error, setError] = useState(null);
    const [copied, setCopied] = useState(false);
    const [showQR, setShowQR] = useState(false);
    
    const cardRef = useRef(null);
    const connectBtnRef = useRef(null);
    const qrModalRef = useRef(null);

    // Network is always TESTNET for Albedo
    const network = 'TESTNET';

    const handleFundAccount = async () => {
        if (!publicKey || isFunding) return;
        
        setIsFunding(true);
        try {
            console.log('💸 Requesting Friendbot funding...');
            await fundAccount(publicKey);
            console.log('✅ Funding successful!');
            
            // Notify user with elegant toast
            if (showToast) {
                showToast('✅ +10,000 XLM! Please disconnect & reconnect to update balance.', 'success');
            } else {
                alert('✅ Account funded with 10,000 Testnet XLM! Please disconnect and reconnect to refresh balance.');
            }
            
            // Close dropdown
            setShowQR(false);
        } catch (err) {
            console.error('Funding failed:', err);
            if (showToast) {
                showToast('❌ Funding failed: ' + err.message, 'error');
            } else {
                alert('❌ Funding failed: ' + err.message);
            }
        } finally {
            setIsFunding(false);
        }
    };

    // Initial animation
    useEffect(() => {
        if (cardRef.current) {
            gsap.fromTo(
                cardRef.current,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }
            );
        }
    }, []);

    // Button hover animation
    useEffect(() => {
        const btn = connectBtnRef.current;
        if (!btn) return;

        const handleEnter = () => {
            gsap.to(btn, { scale: 1.02, duration: 0.2, ease: 'power2.out' });
        };
        const handleLeave = () => {
            gsap.to(btn, { scale: 1, duration: 0.2, ease: 'power2.out' });
        };
        const handleDown = () => {
            gsap.to(btn, { scale: 0.98, duration: 0.1 });
        };
        const handleUp = () => {
            gsap.to(btn, { scale: 1.02, duration: 0.15, ease: 'back.out(2)' });
        };

        btn.addEventListener('mouseenter', handleEnter);
        btn.addEventListener('mouseleave', handleLeave);
        btn.addEventListener('mousedown', handleDown);
        btn.addEventListener('mouseup', handleUp);

        return () => {
            btn.removeEventListener('mouseenter', handleEnter);
            btn.removeEventListener('mouseleave', handleLeave);
            btn.removeEventListener('mousedown', handleDown);
            btn.removeEventListener('mouseup', handleUp);
        };
    }, [publicKey]);

    // QR Modal animation
    useEffect(() => {
        if (showQR && qrModalRef.current) {
            gsap.fromTo(
                qrModalRef.current,
                { opacity: 0, scale: 0.9 },
                { opacity: 1, scale: 1, duration: 0.3, ease: 'back.out(1.7)' }
            );
        }
    }, [showQR]);

    const handleConnect = async () => {
        console.log('🔌 Albedo Connect button clicked');
        
        setIsConnecting(true);
        setError(null);
        
        try {
            console.log('📞 Calling Albedo publicKey()...');
            
            // Albedo connection - opens web popup
            const result = await albedo.publicKey({
                require_existing: false
            });
            
            console.log('✅ Albedo connected! Public Key:', result.pubkey);
            setPublicKey(result.pubkey);
            
            // Notify parent component
            if (onConnect) {
                onConnect(result.pubkey);
            }
            
            // Success animation
            if (cardRef.current) {
                gsap.fromTo(
                    cardRef.current,
                    { scale: 0.98 },
                    { scale: 1, duration: 0.4, ease: 'back.out(2)' }
                );
            }
        } catch (err) {
            console.error('❌ Albedo connection error:', err);
            
            if (err.message?.includes('canceled')) {
                setError('Connection was canceled');
            } else {
                setError(err.message || 'Failed to connect Albedo wallet');
            }
            
            // Error shake animation
            if (cardRef.current) {
                gsap.fromTo(
                    cardRef.current,
                    { x: -10 },
                    { x: 0, duration: 0.5, ease: 'elastic.out(1, 0.3)' }
                );
            }
        } finally {
            setIsConnecting(false);
        }
    };

    const handleDisconnect = () => {
        console.log('🔌 Disconnecting Albedo wallet...');
        setPublicKey(null);
        setError(null);
        
        // Notify parent component
        if (onDisconnect) {
            onDisconnect();
        }
        
        // Disconnect animation
        if (cardRef.current) {
            gsap.fromTo(
                cardRef.current,
                { opacity: 1 },
                { opacity: 0.8, duration: 0.2, ease: 'power2.out', onComplete: () => {
                    gsap.to(cardRef.current, { opacity: 1, duration: 0.3 });
                }}
            );
        }
    };

    const copyAddress = async () => {
        if (!publicKey) return;

        try {
            await navigator.clipboard.writeText(publicKey);
            setCopied(true);

            // Animate the copy feedback
            const toast = document.querySelector('.copied-toast');
            if (toast) {
                gsap.fromTo(
                    toast,
                    { opacity: 0, y: -10 },
                    { opacity: 1, y: 0, duration: 0.3, ease: 'back.out(2)' }
                );
            }

            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const toggleQR = () => {
        setShowQR(!showQR);
    };

    // Compact navbar mode
    if (compact) {
        if (publicKey) {
            return (
                <div style={{ position: 'relative' }}>
                    <button
                        ref={connectBtnRef}
                        className="btn-nav-wallet btn-wallet-connected"
                        onClick={() => setShowQR(!showQR)}
                        title="Click to view details"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.5rem 1rem',
                            borderRadius: '8px',
                            border: 'none',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            cursor: 'pointer',
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        <WalletIcon size={16} />
                        <span>{shortenAddress(publicKey)}</span>
                        <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>▼</span>
                    </button>

                    {/* Dropdown Menu */}
                    {showQR && (
                        <div
                            style={{
                                position: 'absolute',
                                top: 'calc(100% + 0.5rem)',
                                right: 0,
                                background: 'white',
                                borderRadius: '12px',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                                padding: '1rem',
                                minWidth: '280px',
                                zIndex: 1000,
                                border: '1px solid rgba(0,0,0,0.1)'
                            }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div style={{ marginBottom: '0.75rem' }}>
                                <div style={{ fontSize: '0.75rem', color: '#666', marginBottom: '0.25rem' }}>
                                    Balance
                                </div>
                                <div style={{ fontSize: '1rem', fontWeight: '600', color: '#333', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span>{balance.toFixed(2)} XLM</span>
                                    {balance < 10 && (
                                        <button
                                            onClick={handleFundAccount}
                                            disabled={isFunding}
                                            style={{
                                                fontSize: '0.65rem',
                                                padding: '0.2rem 0.5rem',
                                                background: '#10b981',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '4px',
                                                cursor: isFunding ? 'wait' : 'pointer',
                                                opacity: isFunding ? 0.7 : 1
                                            }}
                                            title="Get 10,000 Free Testnet XLM"
                                        >
                                            {isFunding ? 'Funding...' : '+ Get Free XLM'}
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div style={{ marginBottom: '0.75rem' }}>
                                <div style={{ fontSize: '0.75rem', color: '#666', marginBottom: '0.25rem' }}>
                                    Address
                                </div>
                                <div style={{ 
                                    fontSize: '0.75rem', 
                                    color: '#333',
                                    wordBreak: 'break-all',
                                    fontFamily: 'monospace',
                                    background: '#f5f5f5',
                                    padding: '0.5rem',
                                    borderRadius: '6px'
                                }}>
                                    {publicKey}
                                </div>
                                <button
                                    onClick={copyAddress}
                                    style={{
                                        marginTop: '0.5rem',
                                        padding: '0.25rem 0.75rem',
                                        fontSize: '0.75rem',
                                        borderRadius: '6px',
                                        border: '1px solid #ddd',
                                        background: 'white',
                                        cursor: 'pointer',
                                        color: '#667eea'
                                    }}
                                >
                                    {copied ? '✓ Copied!' : '📋 Copy'}
                                </button>
                            </div>

                            <div style={{ borderTop: '1px solid #eee', paddingTop: '0.75rem' }}>
                                <button
                                    onClick={() => {
                                        handleDisconnect();
                                        setShowQR(false);
                                    }}
                                    style={{
                                        width: '100%',
                                        padding: '0.5rem',
                                        borderRadius: '8px',
                                        border: 'none',
                                        background: '#fee',
                                        color: '#c33',
                                        cursor: 'pointer',
                                        fontSize: '0.875rem',
                                        fontWeight: '500',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.5rem'
                                    }}
                                >
                                    <span>🔌</span>
                                    <span>Disconnect Wallet</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            );
        }

        return (
            <button
                ref={connectBtnRef}
                className="btn-nav-wallet"
                onClick={handleConnect}
                disabled={isConnecting}
                style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    cursor: isConnecting ? 'not-allowed' : 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    opacity: isConnecting ? 0.7 : 1,
                    transition: 'all 0.2s ease'
                }}
            >
                {isConnecting ? 'Connecting...' : 'Connect Wallet'}
            </button>
        );
    }

    // Full card mode
    if (publicKey) {
        return (
            <div className="wallet-card wallet-connected" ref={cardRef}>
                <div className="wallet-header">
                    <span className="wallet-icon">👛</span>
                    <h3>Wallet Connected</h3>
                    <span className={`network-badge ${network.toLowerCase()}`}>{network}</span>
                </div>
                <div className="wallet-info">
                    <div className="address-row">
                        <p className="public-key" title={publicKey}>
                            {shortenAddress(publicKey)}
                        </p>
                        <button
                            className="copy-btn"
                            onClick={copyAddress}
                            title="Copy Address"
                        >
                            {copied ? '✓' : '📋'}
                        </button>
                        <button
                            className="qr-btn"
                            onClick={toggleQR}
                            title="Show QR Code"
                        >
                            📱
                        </button>
                    </div>
                    {copied && <span className="copied-toast">Copied!</span>}
                </div>
                <button className="btn btn-disconnect" onClick={handleDisconnect}>
                    Disconnect
                </button>

                {/* QR Code Modal */}
                {showQR && (
                    <div className="qr-modal-overlay" onClick={toggleQR}>
                        <div className="qr-modal-content" ref={qrModalRef} onClick={(e) => e.stopPropagation()}>
                            <button className="qr-close" onClick={toggleQR}>×</button>
                            <h4>Scan QR Code</h4>
                            <div className="qr-code-wrapper">
                                <QRCodeCanvas
                                    value={publicKey}
                                    size={200}
                                    level="H"
                                    includeMargin={true}
                                />
                            </div>
                            <p className="qr-address">{shortenAddress(publicKey)}</p>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="wallet-card" ref={cardRef}>
            <div className="wallet-header">
                <span className="wallet-icon">👛</span>
                <h3>Connect Wallet</h3>
            </div>
            <p className="wallet-description">
                Connect your Albedo wallet to start sending XLM on {network.toLowerCase()}.
            </p>
            {error && <p className="error-message">{error}</p>}
            <button
                ref={connectBtnRef}
                className="btn btn-connect"
                onClick={handleConnect}
                disabled={isConnecting}
            >
                {isConnecting ? 'Opening Albedo...' : 'Connect Albedo'}
            </button>
            
            {/* Info */}
            <div style={{ 
                marginTop: '1rem', 
                fontSize: '0.75rem', 
                color: '#999', 
                textAlign: 'center',
                padding: '0.5rem',
                background: 'rgba(0,0,0,0.02)',
                borderRadius: '8px'
            }}>
                <strong>Albedo</strong> - Web-based wallet, works on all browsers!
            </div>
        </div>
    );
};
