export const GAME_CONFIG = {
  MIN_BET: 10,
  MAX_BET: 100000,
  DEFAULT_BET: 100,
  BETTING_DURATION: 5000, // 5 seconds
  HOUSE_EDGE: 0.03, // 3%
  RTP: 0.97, // 97%
  MAX_MULTIPLIER: 1000,
  HISTORY_LENGTH: 50,
  CHAT_HISTORY_LENGTH: 100,
} as const;

export const CURRENCY = {
  CODE: 'KES',
  SYMBOL: 'KSh',
  LOCALE: 'en-KE',
} as const;

export const SOCKET_EVENTS = {
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  ROUND_START: 'round:start',
  ROUND_UPDATE: 'round:update',
  ROUND_END: 'round:end',
  BET_PLACED: 'bet:placed',
  BET_CASHOUT: 'bet:cashout',
  CHAT_MESSAGE: 'chat:message',
  BALANCE_UPDATE: 'balance:update',
} as const;
