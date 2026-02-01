import React, { useState } from 'react';
import './EmbedWidget.css';

// Copy icon
const CopyIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
  </svg>
);

// Code icon
const CodeIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="16 18 22 12 16 6"/>
    <polyline points="8 6 2 12 8 18"/>
  </svg>
);

// Close icon
const CloseIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

function EmbedWidget({ creatorAddress, creatorName, isOpen, onClose }) {
  const [copied, setCopied] = useState(false);
  const [embedType, setEmbedType] = useState('button');

  const baseUrl = window.location.origin;

  const embedCodes = {
    button: `<!-- Stellar Tip Button -->
<a href="${baseUrl}" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:8px;padding:12px 24px;background:linear-gradient(135deg,#d4a76a,#c49660);color:white;text-decoration:none;border-radius:30px;font-family:-apple-system,sans-serif;font-weight:600;box-shadow:0 4px 15px rgba(212,167,106,0.3);transition:transform 0.2s" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">
  ⭐ Tip ${creatorName || 'Me'} with XLM
</a>`,
    
    badge: `<!-- Stellar Tip Badge -->
<a href="${baseUrl}" target="_blank" rel="noopener" style="display:inline-block;padding:8px 16px;background:#1a1a1a;color:#d4a76a;text-decoration:none;border-radius:8px;font-family:monospace;font-size:14px;border:1px solid #d4a76a">
  💫 Support on Stellar
</a>`,

    iframe: `<!-- Stellar Tip Widget -->
<iframe 
  src="${baseUrl}?embed=true" 
  width="350" 
  height="400" 
  frameborder="0" 
  style="border-radius:16px;box-shadow:0 4px 20px rgba(0,0,0,0.1)"
></iframe>`
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(embedCodes[embedType]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="embed-modal-backdrop" onClick={onClose}>
      <div className="embed-modal" onClick={e => e.stopPropagation()}>
        <div className="embed-header">
          <div className="embed-title">
            <CodeIcon size={24} />
            <h3>Embed Tip Button</h3>
          </div>
          <button className="btn-close" onClick={onClose}>
            <CloseIcon size={20} />
          </button>
        </div>

        <div className="embed-content">
          <p className="embed-description">
            Add a tip button to your website or blog to receive XLM tips!
          </p>

          {/* Embed Type Selector */}
          <div className="embed-type-selector">
            <button 
              className={`type-btn ${embedType === 'button' ? 'active' : ''}`}
              onClick={() => setEmbedType('button')}
            >
              Button
            </button>
            <button 
              className={`type-btn ${embedType === 'badge' ? 'active' : ''}`}
              onClick={() => setEmbedType('badge')}
            >
              Badge
            </button>
            <button 
              className={`type-btn ${embedType === 'iframe' ? 'active' : ''}`}
              onClick={() => setEmbedType('iframe')}
            >
              Widget
            </button>
          </div>

          {/* Preview */}
          <div className="embed-preview">
            <span className="preview-label">Preview</span>
            <div 
              className="preview-container"
              dangerouslySetInnerHTML={{ __html: embedCodes[embedType] }}
            />
          </div>

          {/* Code */}
          <div className="embed-code-section">
            <span className="code-label">Copy this code</span>
            <pre className="embed-code">
              <code>{embedCodes[embedType]}</code>
            </pre>
            <button className="btn-copy-code" onClick={handleCopy}>
              <CopyIcon size={16} />
              {copied ? 'Copied!' : 'Copy Code'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmbedWidget;
