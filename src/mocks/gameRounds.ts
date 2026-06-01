import type { GameRound, Bet, ChatMessage, LeaderboardEntry } from '@/types';
import { calculateCrashPoint } from '@/utils/provablyFair';

const SERVER_SEED = 'demo_server_seed_for_mocking_only_12345';

// Generate realistic crash distribution
export const generateCrashPoint = (nonce: number): number => {
  const clientSeed = 'demo_client_seed';
  return calculateCrashPoint(SERVER_SEED, clientSeed, nonce, 0.03);
};

// Generate round history
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
      endTime: now - i * 15000 + Math.random() * 10000,
      serverSeedHash: `hash_${nonce}`,
      serverSeed: SERVER_SEED,
      clientSeed: 'demo_client_seed',
      nonce,
    });
  }

  return rounds;
};

// Mock active bets for current round
export const generateActiveBets = (roundId: string): Bet[] => {
  const usernames = ['Wanjiku', 'Omondi', 'Kamau', 'Achieng', 'Mutua', 'Njeri', 'Kipchoge', 'Akinyi'];
  const bets: Bet[] = [];

  for (let i = 0; i < 12; i++) {
    const amount = [50, 100, 200, 500, 1000, 2000, 5000][Math.floor(Math.random() * 7)];
    bets.push({
      id: `bet_${roundId}_${i}`,
      userId: `user_${i}`,
      username: usernames[i % usernames.length] + Math.floor(Math.random() * 99),
      roundId,
      amount,
      autoCashout: Math.random() > 0.5 ? [1.5, 2, 3, 5, 10][Math.floor(Math.random() * 5)] : null,
      cashoutMultiplier: null,
      profit: null,
      status: 'placed',
      createdAt: Date.now(),
    });
  }

  return bets;
};

// Mock chat messages
export const generateChatHistory = (): ChatMessage[] => {
  const messages: ChatMessage[] = [
    {
      id: 'chat_1',
      userId: 'sys',
      username: 'System',
      message: 'Welcome to QuickPesa! Play responsibly.',
      type: 'system',
      createdAt: Date.now() - 3600000,
    },
    {
      id: 'chat_2',
      userId: 'u1',
      username: 'BigWins254',
      message: 'Just hit 15x! 🔥🔥',
      type: 'win',
      amount: 5000,
      multiplier: 15.23,
      createdAt: Date.now() - 300000,
    },
    {
      id: 'chat_3',
      userId: 'u2',
      username: 'MbogiGenje',
      message: 'Hii game ni moto sana!',
      type: 'chat',
      createdAt: Date.now() - 240000,
    },
    {
      id: 'chat_4',
      userId: 'sys',
      username: 'System',
      message: '🌧️ Rain! 10 free bets dropped!',
      type: 'rain',
      amount: 100,
      createdAt: Date.now() - 180000,
    },
    {
      id: 'chat_5',
      userId: 'u3',
      username: 'ShujaaWetu',
      message: 'Weka 2x auto cashout always works',
      type: 'chat',
      createdAt: Date.now() - 120000,
    },
  ];

  return messages;
};

// Mock leaderboard
export const generateLeaderboard = (): LeaderboardEntry[] => {
  return [
    { rank: 1, username: 'MillionaireMind', amount: 50000, multiplier: 47.5 },
    { rank: 2, username: 'NairobiKing', amount: 35000, multiplier: 23.1 },
    { rank: 3, username: 'MombasaHeat', amount: 28000, multiplier: 18.7 },
    { rank: 4, username: 'KisumuFinest', amount: 22000, multiplier: 15.2 },
    { rank: 5, username: 'EldoretSpeed', amount: 18000, multiplier: 12.8 },
    { rank: 6, username: 'NakuruBoss', amount: 15000, multiplier: 10.5 },
    { rank: 7, username: 'ThikaRising', amount: 12000, multiplier: 8.9 },
    { rank: 8, username: 'MalindiWave', amount: 10000, multiplier: 7.3 },
    { rank: 9, username: 'KitaleGamer', amount: 8500, multiplier: 6.1 },
    { rank: 10, username: 'MachakosPro', amount: 7000, multiplier: 5.4 },
  ];
};

// Mock user data
export const mockUser = {
  id: 'user_demo',
  phone: '254712345678',
  username: 'QuickPlayer',
  balance: 5000,
  totalWagered: 25000,
  totalWon: 32000,
  isVerified: true,
  createdAt: '2026-01-15',
};

// Mock transactions
export const mockTransactions = [
  { id: 'tx_1', userId: 'user_demo', type: 'deposit' as const, amount: 5000, status: 'completed' as const, method: 'mpesa' as const, reference: 'SBJ3K9M2', createdAt: '2026-06-01 10:30' },
  { id: 'tx_2', userId: 'user_demo', type: 'bet' as const, amount: -200, status: 'completed' as const, method: 'internal' as const, createdAt: '2026-06-01 11:15' },
  { id: 'tx_3', userId: 'user_demo', type: 'win' as const, amount: 580, status: 'completed' as const, method: 'internal' as const, createdAt: '2026-06-01 11:16' },
  { id: 'tx_4', userId: 'user_demo', type: 'bet' as const, amount: -500, status: 'completed' as const, method: 'internal' as const, createdAt: '2026-06-01 11:45' },
  { id: 'tx_5', userId: 'user_demo', type: 'win' as const, amount: 0, status: 'completed' as const, method: 'internal' as const, createdAt: '2026-06-01 11:46' },
  { id: 'tx_6', userId: 'user_demo', type: 'withdrawal' as const, amount: -2000, status: 'pending' as const, method: 'mpesa' as const, reference: 'WDR-9921', createdAt: '2026-06-01 12:00' },
];
