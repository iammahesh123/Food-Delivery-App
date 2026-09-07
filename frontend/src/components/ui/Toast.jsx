import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import './Toast.css';

const Toast = ({ message, type = 'info', onClose }) => {
  if (!message) return null;

  return (
    <div className={`toast toast-${type} fade-in`} role="status" aria-live="polite">
      <div className="toast-icon">
        {type === 'success' && <CheckCircle2 size={18} />}
        {type === 'error' && <AlertCircle size={18} />}
        {type === 'info' && <Info size={18} />}
      </div>
      <span className="toast-text">{message}</span>
      {onClose && (
        <button onClick={onClose} className="toast-close" aria-label="Dismiss message">
          <X size={14} />
        </button>
      )}
    </div>
  );
};

export default Toast;
