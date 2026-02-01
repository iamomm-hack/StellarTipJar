import { useEffect } from 'react';
import '../styles/Toast.css';

/**
 * Toast notification component
 * @param {Object} props
 * @param {string} props.message - Message to display
 * @param {string} props.type - Type of toast (success/error/info)
 * @param {Function} props.onClose - Callback when toast closes
 */
function Toast({ message, type = 'info', onClose }) {
  useEffect(() => {
    // Auto-dismiss after 4 seconds
    const timer = setTimeout(() => {
      onClose();
    }, 4000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'info':
        return 'ℹ';
      default:
        return '';
    }
  };

  return (
    <div className={`toast toast-${type}`}>
      <span className="toast-icon">{getIcon()}</span>
      <span className="toast-message">{message}</span>
      <button className="toast-close" onClick={onClose} aria-label="Close">
        ×
      </button>
    </div>
  );
}

export default Toast;
