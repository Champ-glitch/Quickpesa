import { CURRENCY } from './constants';

export const formatKES = (amount: number): string => {
  return `${CURRENCY.SYMBOL} ${amount.toLocaleString(CURRENCY.LOCALE, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
};

export const formatMultiplier = (multiplier: number): string => {
  return `${multiplier.toFixed(2)}x`;
};

export const formatTimeAgo = (timestamp: number): string => {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
};

export const getMultiplierColor = (multiplier: number): string => {
  if (multiplier < 1.5) return 'text-qp-primary';
  if (multiplier < 3) return 'text-yellow-400';
  if (multiplier < 10) return 'text-orange-400';
  return 'text-red-500';
};

export const getCrashPointColor = (crashPoint: number): string => {
  if (crashPoint < 1.5) return 'bg-red-500/20 text-red-400 border-red-500/30';
  if (crashPoint < 2) return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
  if (crashPoint < 5) return 'bg-qp-primary/20 text-qp-primary border-qp-primary/30';
  if (crashPoint < 10) return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
  return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
};
