export const GAME_CONFIG = {
  MIN_BET: 10,
  MAX_BET: 100000,
  DEFAULT_BET: 100,
  BETTING_DURATION: 6000,
  HOUSE_EDGE: 0.03,
  RTP: 0.97,
  MAX_MULTIPLIER: 1000,
  HISTORY_LENGTH: 50,
} as const;

export const CURRENCY = {
  CODE: 'KES',
  SYMBOL: 'KSh',
  LOCALE: 'en-KE',
} as const;
