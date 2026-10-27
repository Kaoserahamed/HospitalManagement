import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, hint, id, ...rest }) => {
  const inputId = id || `input-${Math.random().toString(36).slice(2)}`;
  return (
    <div className="form-field">
      {label ? <label htmlFor={inputId} className="form-label">{label}</label> : null}
      <input id={inputId} className={`form-input ${error ? 'form-input-error' : ''}`} {...rest} />
      {error ? <span className="form-error" role="alert">{error}</span> : null}
      {hint && !error ? <span className="form-hint">{hint}</span> : null}
    </div>
  );
};

export default Input;
