import { type ReactNode } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit';
}

export const Button = ({
  children, variant = 'primary', size = 'md', fullWidth = false,
  disabled = false, loading = false, onClick, className, type = 'button',
}: ButtonProps) => {
  const variants = {
    primary: 'bg-brand-green hover:bg-brand-greenDark text-white',
    secondary: 'bg-dark-700 hover:bg-dark-600 text-white border border-dark-border',
    danger: 'bg-brand-red hover:bg-red-600 text-white',
    ghost: 'hover:bg-white/5 text-gray-400',
    outline: 'border-2 border-brand-green text-brand-green hover:bg-brand-green/10',
  };
  const sizes = { sm: 'px-3 py-1.5 text-sm', md: 'px-4 py-2.5 text-sm', lg: 'px-6 py-3.5 text-base font-bold' };

  return (
    <button
      type={type} onClick={onClick} disabled={disabled || loading}
      className={cn(
        'rounded-lg font-semibold transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant], sizes[size], fullWidth && 'w-full', className
      )}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          Loading...
        </span>
      ) : children}
    </button>
  );
};
