import { useEffect, useRef, useCallback } from 'react';
import { useGameStore } from '@/stores/gameStore';
import { useUserStore } from '@/stores/userStore';
import { useUIStore } from '@/stores/uiStore';
import { mockSocket } from '@/mocks/socketServer';
import type { GameRound, Bet } from '@/types';

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';

export const useGameSocket = () => {
  const socketRef = useRef<any>(null);
  const {
    setCurrentRound,
    updateRound,
    addToHistory,
    placeBet: addBet,
    cashoutBet,
    setCountdown,
    setConnected,
    clearMyBets,
  } = useGameStore();

  const { updateBalance } = useUserStore();
  const { showToast } = useUIStore();

  useEffect(() => {
    const socket = USE_MOCK ? mockSocket : null; // Real WS later
    socketRef.current = socket;

    if (socket) {
      socket.connect();

      socket.on('connect', () => {
        setConnected(true);
        showToast('Connected to game server', 'success');
      });

      socket.on('disconnect', () => {
        setConnected(false);
        showToast('Disconnected from server', 'error');
      });

      socket.on('round:start', (round: GameRound) => {
        setCurrentRound(round);
        clearMyBets();

        // Countdown
        let count = 5;
        setCountdown(count);
        const interval = setInterval(() => {
          count--;
          setCountdown(count);
          if (count <= 0) clearInterval(interval);
        }, 1000);
      });

      socket.on('round:update', (round: GameRound) => {
        updateRound({
          currentMultiplier: round.currentMultiplier,
          state: round.state,
        });
      });

      socket.on('round:end', (round: GameRound) => {
        updateRound({
          state: 'crashed',
          currentMultiplier: round.crashPoint,
          endTime: round.endTime,
        });
        addToHistory(round);

        // Settle bets
        const { activeBets } = useGameStore.getState();
        activeBets.forEach(bet => {
          if (!bet.cashoutMultiplier) {
            showToast(`Lost KSh ${bet.amount}`, 'error');
          }
        });
        clearMyBets();
      });

      socket.on('bet:placed', (bet: Bet) => {
        addBet(bet);
      });

      socket.on('bet:cashout', (data: { betId: string; multiplier: number; profit: number }) => {
        cashoutBet(data.betId, data.multiplier, data.profit);
        updateBalance(data.profit);
        showToast(`Cashed out at ${data.multiplier.toFixed(2)}x! +KSh ${data.profit}`, 'success');
      });

      return () => {
        socket.disconnect();
      };
    }
  }, []);

  const placeBet = useCallback((amount: number, autoCashout?: number) => {
    socketRef.current?.send('bet:place', { amount, autoCashout });
  }, []);

  const cashOut = useCallback((betId: string, amount: number) => {
    socketRef.current?.send('bet:cashout', { betId, amount });
  }, []);

  const sendChat = useCallback((message: string) => {
    socketRef.current?.send('chat:send', { message });
  }, []);

  return { placeBet, cashOut, sendChat };
};
