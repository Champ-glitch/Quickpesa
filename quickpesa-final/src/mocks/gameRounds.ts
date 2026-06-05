import type { GameRound, Bet, ChatMessage, Transaction, DepositChannel, User } from '@/types';
import { calculateCrashPoint } from '@/utils/provablyFair';

const SERVER_SEED = 'demo_server_seed_for_mocking_only';

export const generateCrashPoint = (nonce: number): number => {
  return calculateCrashPoint(SERVER_SEED, 'demo_client', nonce, 0.03);
};

export const generateRoundHistory = (count: number = 50): GameRound[] => {
  const rounds: GameRound[] = [];
  const now = Date.now();
  for (let i = count; i > 0; i--) {
    const nonce = 1000000 + i;
    const crashPoint = generateCrashPoint(nonce);
    rounds.push({
      id: `round_${nonce}`,
      roundNumber: nonce,
      state: 'crashed',
      crashPoint,
      currentMultiplier: crashPoint,
      startTime: now - i * 15000,
      endTime: now - i * 15000 + Math.floor(Math.random() * 8000),
      serverSeedHash: `hash_${nonce}`,
      serverSeed: SERVER_SEED,
      clientSeed: 'demo_client',
      nonce,
    });
  }
  return rounds;
};

export const generateActiveBets = (roundId: string): Bet[] => {
  const names = ['Wanjiku', 'Omondi', 'Kamau', 'Achieng', 'Mutua', 'Njeri', 'Kipchoge'];
  const bets: Bet[] = [];
  for (let i = 0; i < 8; i++) {
    const amount = [50, 100, 200, 500, 1000, 2000][Math.floor(Math.random() * 6)];
    bets.push({
      id: `bet_${roundId}_${i}`,
      userId: `u${i}`,
      username: names[i % names.length] + Math.floor(Math.random() * 99),
      roundId,
      amount,
      autoCashout: Math.random() > 0.5 ? [1.5, 2, 3, 5][Math.floor(Math.random() * 4)] : null,
      cashoutMultiplier: null,
      profit: null,
      status: 'placed',
      createdAt: Date.now(),
    });
  }
  return bets;
};

export const generateChatHistory = (): ChatMessage[] => [
  { id: 'c1', userId: 'sys', username: 'System', message: 'Welcome to QuickPesa! Play responsibly.', type: 'system', createdAt: Date.now() - 3600000 },
  { id: 'c2', userId: 'u1', username: 'BigWins254', message: 'Just hit 15x!', type: 'win', amount: 5000, multiplier: 15.23, createdAt: Date.now() - 300000 },
  { id: 'c3', userId: 'u2', username: 'MbogiGenje', message: 'Hii game ni moto sana!', type: 'chat', createdAt: Date.now() - 240000 },
  { id: 'c4', userId: 'sys', username: 'System', message: 'Rain! 10 free bets dropped!', type: 'rain', amount: 100, createdAt: Date.now() - 180000 },
];

export const mockUser: User = {
  id: 'user_demo',
  phone: '254712345678',
  email: 'player@quickpesa.com',
  username: 'QuickPlayer',
  balance: 5280,
  totalWagered: 25000,
  totalWon: 32000,
  isVerified: true,
  createdAt: '2026-01-15',
};

export const mockTransactions: Transaction[] = [
  { id: 't1', userId: 'user_demo', type: 'deposit', amount: 5000, status: 'completed', method: 'mpesa', reference: 'SBJ3K9M2', createdAt: '2026-06-01 10:30' },
  { id: 't2', userId: 'user_demo', type: 'bet', amount: -200, status: 'completed', method: 'internal', createdAt: '2026-06-01 11:15' },
  { id: 't3', userId: 'user_demo', type: 'win', amount: 580, status: 'completed', method: 'internal', createdAt: '2026-06-01 11:16' },
  { id: 't4', userId: 'user_demo', type: 'withdrawal', amount: -2000, status: 'pending', method: 'mpesa', reference: 'WDR-9921', createdAt: '2026-06-01 12:00' },
];

export const depositChannels: DepositChannel[] = [
  { id: 'mpesa', name: 'M-Pesa', icon: 'phone', minAmount: 10, maxAmount: 150000, processingTime: 'Instant', fee: 'Free', active: true },
  { id: 'airtel', name: 'Airtel Money', icon: 'phone', minAmount: 10, maxAmount: 100000, processingTime: 'Instant', fee: 'Free', active: true },
  { id: 'bank', name: 'Bank Transfer', icon: 'building', minAmount: 1000, maxAmount: 500000, processingTime: '1-2 hours', fee: 'KSh 50', active: true },
  { id: 'crypto', name: 'Crypto (USDT)', icon: 'bitcoin', minAmount: 500, maxAmount: 1000000, processingTime: '5-10 min', fee: 'Network fee', active: true },
];
