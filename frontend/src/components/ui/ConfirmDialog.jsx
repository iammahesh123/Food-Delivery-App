import React, { useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import Button from './Button';
import './ConfirmDialog.css';

const ConfirmDialog = ({
  isOpen,
  title = 'Confirm Action',
  message = 'Are you sure you want to perform this action? This cannot be undone.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'destructive', // 'destructive' | 'primary'
  onConfirm,
  onClose,
  isLoading = false,
}) => {
  // ESC key listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && !isLoading) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, isLoading, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop fade-in" onClick={onClose} role="presentation">
      <div
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
      >
        <button
          className="modal-close-btn"
          onClick={onClose}
          disabled={isLoading}
          aria-label="Close dialog"
        >
          <X size={18} />
        </button>

        <div className="modal-header">
          <div className={`modal-icon-badge ${variant}`}>
            <AlertTriangle size={22} />
          </div>
          <h2 id="confirm-dialog-title" className="modal-title">
            {title}
          </h2>
        </div>

        <p className="modal-message">{message}</p>

        <div className="modal-footer">
          <Button variant="secondary" onClick={onClose} disabled={isLoading}>
            {cancelText}
          </Button>
          <Button variant={variant} onClick={onConfirm} isLoading={isLoading}>
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
