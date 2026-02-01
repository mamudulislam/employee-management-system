import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'indigo' | 'white' | 'slate';
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = 'indigo',
  className = '',
}) => {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-3',
  };

  const colors_map = {
    indigo: 'border-indigo-200 border-t-indigo-600',
    white: 'border-white/30 border-t-white',
    slate: 'border-slate-200 border-t-slate-600',
  };

  return (
    <div
      className={`${sizes[size]} ${colors_map[color]} rounded-full animate-spin ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
};

interface LoadingButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  children: React.ReactNode;
  spinnerColor?: 'indigo' | 'white' | 'slate';
}

export const LoadingButton: React.FC<LoadingButtonProps> = ({
  isLoading = false,
  disabled = false,
  children,
  spinnerColor = 'white',
  className = '',
  ...props
}) => {
  return (
    <button
      disabled={disabled || isLoading}
      className={`flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all ${className}`}
      {...props}
    >
      {isLoading && <LoadingSpinner size="sm" color={spinnerColor} />}
      {children}
    </button>
  );
};

interface LoadingPageProps {
  message?: string;
}

export const LoadingPage: React.FC<LoadingPageProps> = ({
  message = 'Loading...',
}) => (
  <div className="flex flex-col items-center justify-center min-h-screen gap-4">
    <LoadingSpinner size="lg" color="indigo" />
    <p className="text-slate-600 font-medium">{message}</p>
  </div>
);

export default LoadingSpinner;
