import React from 'react';

export function Card({ children, className = '', ...props }) {
  return (
    <div
      className={`bg-white shadow rounded-lg overflow-hidden ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '', ...props }) {
  return (
    <div
      className={`border-b border-gray-200 px-4 py-3 bg-gray-50 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardContent({ children, className = '', ...props }) {
  return (
    <div className={`p-4 ${className}`} {...props}>
      {children}
    </div>
  );
}
