import React from 'react';
import './Input.css';

const Input = ({
  label,
  id,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  helperText,
  required = false,
  disabled = false,
  leftIcon,
  rightIcon,
  className = '',
  ...props
}) => {
  const inputId = id || name;

  return (
    <div className={`form-field ${error ? 'has-error' : ''} ${className}`}>
      {label && (
        <label htmlFor={inputId} className="form-label">
          {label} {required && <span className="required-star" aria-hidden="true">*</span>}
        </label>
      )}
      <div className="input-wrapper">
        {leftIcon && <span className="input-icon left">{leftIcon}</span>}
        <input
          id={inputId}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
          className={`input-control ${leftIcon ? 'with-left-icon' : ''} ${rightIcon ? 'with-right-icon' : ''}`}
          {...props}
        />
        {rightIcon && <span className="input-icon right">{rightIcon}</span>}
      </div>
      {error && (
        <p id={`${inputId}-error`} className="field-error-message" role="alert">
          {error}
        </p>
      )}
      {!error && helperText && (
        <p id={`${inputId}-helper`} className="field-helper-text">
          {helperText}
        </p>
      )}
    </div>
  );
};

export default Input;
