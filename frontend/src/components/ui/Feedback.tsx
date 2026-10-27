import React from 'react';

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({ size = 'md', label = 'Loading' }) => (
  <div className={`spinner spinner-${size}`} role="status" aria-label={label}>
    <span className="sr-only">{label}</span>
  </div>
);

export interface CardProps {
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ title, children, footer, className }) => (
  <div className={`card ${className || ''}`}>
    {title ? <div className="card-header"><h3 className="card-title">{title}</h3></div> : null}
    <div className="card-body">{children}</div>
    {footer ? <div className="card-footer">{footer}</div> : null}
  </div>
);

export interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({ variant = 'default', children }) => (
  <span className={`badge badge-${variant}`}>{children}</span>
);

export interface AlertProps {
  variant?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  children: React.ReactNode;
  onClose?: () => void;
}

export const Alert: React.FC<AlertProps> = ({ variant = 'info', title, children, onClose }) => (
  <div className={`alert alert-${variant}`} role="alert">
    {title ? <strong className="alert-title">{title}</strong> : null}
    <div className="alert-content">{children}</div>
    {onClose ? (
      <button className="alert-close" onClick={onClose} aria-label="Dismiss">
        ×
      </button>
    ) : null}
  </div>
);

export default { Spinner, Card, Badge, Alert };
