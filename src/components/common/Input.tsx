import { forwardRef, type InputHTMLAttributes } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  prefix?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, prefix, className, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && <label className="text-xs font-medium text-gray-400">{label}</label>}
        <div className="relative">
          {prefix && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">{prefix}</span>
          )}
          <input
            ref={ref}
            className={cn(
              'w-full bg-dark-800 border border-dark-border rounded-lg px-4 py-3 text-white placeholder:text-gray-600',
              'focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green/30',
              'transition-all text-sm',
              prefix && 'pl-10',
              error && 'border-red-500 focus:border-red-500',
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';
