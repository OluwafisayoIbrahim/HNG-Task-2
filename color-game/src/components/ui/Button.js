import React from 'react';

export function Button({ variant = 'primary', size = 'md', className = '', children, ...props }) {
  const baseClasses =
    'inline-flex items-center justify-center rounded-md font-medium focus:outline-none transition-colors';

  let variantClasses;
  if (variant === 'outline') {
    variantClasses = 'border border-gray-300 text-gray-700 bg-transparent hover:bg-gray-100';
  } else if (variant === 'secondary') {
    variantClasses = 'bg-gray-200 text-gray-800 hover:bg-gray-300';
  } else {
    variantClasses = 'bg-blue-500 text-white hover:bg-blue-600';
  }

  let sizeClasses;
  if (size === 'lg') {
    sizeClasses = 'px-6 py-3 text-lg';
  } else if (size === 'sm') {
    sizeClasses = 'px-2 py-1 text-sm';
  } else {
    sizeClasses = 'px-4 py-2';
  }

  return (
    <button
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
