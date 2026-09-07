import React from 'react';
import './Button.css';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  type = 'button',
  onClick,
  className = '',
  ...props
}) => {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`btn btn-${variant} btn-${size} ${isLoading ? 'btn-loading' : ''} ${className}`}
      {...props}
    >
      {isLoading && <span className="btn-spinner" aria-hidden="true" />}
      {!isLoading && leftIcon && <span className="btn-icon left-icon">{leftIcon}</span>}
      <span className="btn-label">{children}</span>
      {!isLoading && rightIcon && <span className="btn-icon right-icon">{rightIcon}</span>}
    </button>
  );
};

export default Button;
