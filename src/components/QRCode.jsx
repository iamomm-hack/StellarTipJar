import React, { useRef, useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { DownloadIcon, CopyIcon, CheckIcon } from './Icons';
import './QRCode.css';

/**
 * QR Code generator using qrcode.react
 * Generates real scannable QR code for Stellar address
 */
function QRCode({ address, size = 200, showAddress = true }) {
  const qrRef = useRef(null);
  const [copied, setCopied] = useState(false);

  const handleDownload = () => {
    // Find the canvas element inside the wrapper
    const canvas = qrRef.current?.querySelector('canvas');
    if (canvas) {
      const link = document.createElement('a');
      link.download = 'stellar-tip-jar-qr.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="qr-code-container">
      <div className="qr-code-wrapper" ref={qrRef}>
        <QRCodeCanvas
          value={address}
          size={size}
          bgColor={"#ffffff"}
          fgColor={"#000000"}
          level={"Q"}
          includeMargin={true}
          imageSettings={{
            src: "https://cryptologos.cc/logos/stellar-xlm-logo.png",
            x: undefined,
            y: undefined,
            height: 24,
            width: 24,
            excavate: true,
          }}
          className="qr-canvas"
        />
      </div>
      
      {showAddress && (
        <div className="qr-address">
          <span className="address-text">{address}</span>
        </div>
      )}
      
      <div className="qr-actions">
        <button className="btn-qr-action" onClick={handleDownload}>
          <DownloadIcon size={18} /> Download QR
        </button>
        <button 
          className={`btn-qr-action ${copied ? 'btn-copied' : ''}`} 
          onClick={handleCopy}
        >
          {copied ? <CheckIcon size={18} /> : <CopyIcon size={18} />}
          {copied ? 'Address Copied!' : 'Copy Address'}
        </button>
      </div>
    </div>
  );
}

export default QRCode;
