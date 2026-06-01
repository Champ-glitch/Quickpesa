import { create } from 'zustand';
import type { GameRound, Bet } from '@/types';

interface GameState {
  currentRound: GameRound | null;
  roundHistory: GameRound[];
  myBets: Bet[];
  activeBets: Bet[];
  countdown: number;
  isConnected: boolean;

  // Actions
  setCurrentRound: (round: GameRound) => void;
  updateRound: (round: Partial<GameRound>) => void;
  addToHistory: (round: GameRound) => void;
  placeBet: (bet: Bet) => void;
  cashoutBet: (betId: string, multiplier: number, profit: number) => void;
  setCountdown: (count: number) => void;
  setConnected: (connected: boolean) => void;
  clearMyBets: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  currentRound: null,
  roundHistory: [],
  myBets: [],
  activeBets: [],
  countdown: 0,
  isConnected: false,

  setCurrentRound: (round) => set({ currentRound: round }),

  updateRound: (round) => set((state) => ({
    currentRound: state.currentRound 
      ? { ...state.currentRound, ...round } 
      : null,
  })),

  addToHistory: (round) => set((state) => ({
    roundHistory: [round, ...state.roundHistory].slice(0, 50),
  })),

  placeBet: (bet) => set((state) => ({
    myBets: [bet, ...state.myBets],
    activeBets: [...state.activeBets, bet],
  })),

  cashoutBet: (betId, multiplier, profit) => set((state) => ({
    myBets: state.myBets.map(b => 
      b.id === betId 
        ? { ...b, cashoutMultiplier: multiplier, profit, status: 'cashed_out' as const }
        : b
    ),
    activeBets: state.activeBets.filter(b => b.id !== betId),
  })),

  setCountdown: (count) => set({ countdown: count }),
  setConnected: (connected) => set({ isConnected: connected }),
  clearMyBets: () => set({ activeBets: [] }),
}));
