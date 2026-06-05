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

export const getMultiplierColor = (multiplier: number): string => {
  if (multiplier < 1.5) return 'text-brand-green';
  if (multiplier < 3) return 'text-brand-yellow';
  if (multiplier < 10) return 'text-brand-orange';
  return 'text-brand-red';
};

export const getCrashBadgeColor = (crashPoint: number): string => {
  if (crashPoint < 1.5) return 'bg-brand-red/20 text-brand-red border-brand-red/30';
  if (crashPoint < 2) return 'bg-brand-yellow/20 text-brand-yellow border-brand-yellow/30';
  if (crashPoint < 5) return 'bg-brand-green/20 text-brand-green border-brand-green/30';
  if (crashPoint < 10) return 'bg-brand-blue/20 text-brand-blue border-brand-blue/30';
  return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
};
