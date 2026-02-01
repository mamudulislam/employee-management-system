import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

/**
 * Mobile Responsive Drawer for navigation and content
 */
interface ResponsiveDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  position?: 'left' | 'right';
  size?: 'sm' | 'md' | 'lg';
}

export const ResponsiveDrawer: React.FC<ResponsiveDrawerProps> = ({
  isOpen,
  onClose,
  title,
  children,
  position = 'left',
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'w-64',
    md: 'w-80',
    lg: 'w-96',
  };

  const positionClasses = {
    left: 'left-0',
    right: 'right-0',
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 ${positionClasses[position]} h-full ${sizeClasses[size]} bg-white dark:bg-slate-900 shadow-lg z-50 transform transition-transform duration-300 md:hidden ${
          isOpen ? 'translate-x-0' : positionClasses[position] === 'left' ? '-translate-x-full' : 'translate-x-full'
        }`}
      >
        {title && (
          <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
            >
              <X size={20} className="text-slate-600 dark:text-slate-400" />
            </button>
          </div>
        )}
        <div className="h-full overflow-y-auto">{children}</div>
      </div>
    </>
  );
};

/**
 * Mobile Menu Button for toggling navigation
 */
interface MobileMenuButtonProps {
  onClick: () => void;
  isOpen?: boolean;
}

export const MobileMenuButton: React.FC<MobileMenuButtonProps> = ({
  onClick,
  isOpen = false,
}) => {
  return (
    <button
      onClick={onClick}
      className="md:hidden p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
      aria-label="Toggle menu"
    >
      {isOpen ? (
        <X size={24} className="text-slate-700 dark:text-slate-300" />
      ) : (
        <Menu size={24} className="text-slate-700 dark:text-slate-300" />
      )}
    </button>
  );
};

/**
 * Responsive Grid for mobile-first layout
 */
interface ResponsiveGridProps {
  children: React.ReactNode;
  columns?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
  gap?: 'sm' | 'md' | 'lg';
}

export const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  children,
  columns = { mobile: 1, tablet: 2, desktop: 3 },
  gap = 'md',
}) => {
  const gapClasses = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
  };

  const gridClasses = `grid ${
    columns.mobile ? `grid-cols-${columns.mobile}` : 'grid-cols-1'
  } ${columns.tablet ? `sm:grid-cols-${columns.tablet}` : 'sm:grid-cols-1'} ${
    columns.desktop ? `lg:grid-cols-${columns.desktop}` : 'lg:grid-cols-1'
  } ${gapClasses[gap]}`;

  return (
    <div className={gridClasses}>
      {children}
    </div>
  );
};

/**
 * Mobile optimized button with larger touch area
 */
interface MobileButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  fullWidth?: boolean;
}

export const MobileButton: React.FC<MobileButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  fullWidth = false,
  className = '',
  ...props
}) => {
  const variantClasses = {
    primary: 'bg-indigo-600 hover:bg-indigo-700 text-white',
    secondary: 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-900 dark:text-white',
    ghost: 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300',
  };

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-6 py-4 text-lg',
  };

  return (
    <button
      className={`rounded-lg font-medium transition-colors ${variantClasses[variant]} ${sizeClasses[size]} ${
        fullWidth ? 'w-full' : ''
      } active:scale-95 transition-transform ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

/**
 * Mobile optimized card with better touch spacing
 */
interface MobileCardProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export const MobileCard: React.FC<MobileCardProps> = ({
  children,
  onClick,
  className = '',
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white dark:bg-slate-900 rounded-lg p-4 sm:p-6 shadow-sm border border-slate-200 dark:border-slate-700 transition-all ${
        onClick ? 'active:scale-95 cursor-pointer hover:shadow-md' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};

/**
 * Mobile optimized input with larger touch area
 */
interface MobileInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const MobileInput: React.FC<MobileInputProps> = ({
  label,
  error,
  className = '',
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          {label}
        </label>
      )}
      <input
        className={`w-full px-4 py-3 text-base border rounded-lg dark:bg-slate-800 dark:border-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
          error ? 'border-red-500' : 'border-slate-300'
        } ${className}`}
        {...props}
      />
      {error && <p className="text-sm text-red-600 dark:text-red-400 mt-1">{error}</p>}
    </div>
  );
};

/**
 * Hide/Show component based on breakpoint
 */
interface ResponsiveVisibilityProps {
  children: React.ReactNode;
  hideOn?: 'mobile' | 'tablet' | 'desktop';
  showOn?: 'mobile' | 'tablet' | 'desktop';
}

export const ResponsiveVisibility: React.FC<ResponsiveVisibilityProps> = ({
  children,
  hideOn,
  showOn,
}) => {
  const hideClasses = {
    mobile: 'hidden sm:block',
    tablet: 'hidden lg:block',
    desktop: 'lg:hidden',
  };

  const showClasses = {
    mobile: 'sm:hidden',
    tablet: 'lg:hidden',
    desktop: 'hidden lg:block',
  };

  const className = showOn ? showClasses[showOn] : hideClasses[hideOn || 'mobile'];

  return <div className={className}>{children}</div>;
};

/**
 * Mobile optimized stack for vertical/horizontal layouts
 */
interface ResponsiveStackProps {
  children: React.ReactNode;
  direction?: 'auto' | 'row' | 'col';
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ResponsiveStack: React.FC<ResponsiveStackProps> = ({
  children,
  direction = 'auto',
  gap = 'md',
  className = '',
}) => {
  const gapClasses = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
  };

  const directionClass =
    direction === 'auto'
      ? 'flex-col sm:flex-row'
      : direction === 'row'
        ? 'flex-row'
        : 'flex-col';

  return (
    <div className={`flex ${directionClass} ${gapClasses[gap]} ${className}`}>
      {children}
    </div>
  );
};

export default {
  ResponsiveDrawer,
  MobileMenuButton,
  ResponsiveGrid,
  MobileButton,
  MobileCard,
  MobileInput,
  ResponsiveVisibility,
  ResponsiveStack,
};
