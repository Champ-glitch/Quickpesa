export type RoundState = 'betting' | 'flying' | 'crashed';

export interface GameRound {
  id: string;
  roundNumber: number;
  state: RoundState;
  crashPoint: number;
  currentMultiplier: number;
  startTime: number;
  endTime: number | null;
  serverSeedHash: string;
  serverSeed: string | null;
  clientSeed: string;
  nonce: number;
}

export interface Bet {
  id: string;
  userId: string;
  username: string;
  roundId: string;
  amount: number;
  autoCashout: number | null;
  cashoutMultiplier: number | null;
  profit: number | null;
  status: 'placed' | 'cashed_out' | 'lost';
  createdAt: number;
}

export interface User {
  id: string;
  phone: string;
  email: string;
  username: string;
  balance: number;
  totalWagered: number;
  totalWon: number;
  isVerified: boolean;
  createdAt: string;
}

export interface Transaction {
  id: string;
  userId: string;
  type: 'deposit' | 'withdrawal' | 'bet' | 'win' | 'bonus';
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  method: 'mpesa' | 'airtel' | 'bank' | 'crypto' | 'internal';
  reference?: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  userId: string;
  username: string;
  message: string;
  type: 'chat' | 'win' | 'rain' | 'system';
  amount?: number;
  multiplier?: number;
  createdAt: number;
}

export interface DepositChannel {
  id: string;
  name: string;
  icon: string;
  minAmount: number;
  maxAmount: number;
  processingTime: string;
  fee: string;
  active: boolean;
}
