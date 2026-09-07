import React from 'react';
import './Badge.css';

const Badge = ({ children, variant = 'neutral', size = 'md', className = '', ...props }) => {
  return (
    <span className={`badge badge-${variant} badge-${size} ${className}`} {...props}>
      {children}
    </span>
  );
};

export default Badge;
