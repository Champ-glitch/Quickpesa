import { useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';
import { useGameStore } from '@/stores/gameStore';
import { useUserStore } from '@/stores/userStore';
import { useUIStore } from '@/stores/uiStore';
import { mockSocket } from '@/mocks/socketServer';
import type { GameRound, Bet } from '@/types';

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';
const WS_URL = import.meta.env.VITE_WS_URL || 'wss://quickpesa-backend.onrender.com';

export const useGameSocket = () => {
  const socketRef = useRef<any>(null);
  const {
    setCurrentRound, updateRound, addToHistory,
    placeBet: addBet, cashoutBet, setCountdown,
    setConnected, clearMyBets,
  } = useGameStore();
  const { updateBalance } = useUserStore();
  const { showToast } = useUIStore();

  useEffect(() => {
    let socket: any;

    if (USE_MOCK) {
      socket = mockSocket;
      socket.connect();
    } else {
      const token = localStorage.getItem('qp_token');
      socket = io(WS_URL, {
        auth: { token },
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 10,
        reconnectionDelay: 2000,
      });
    }

    socketRef.current = socket;

    socket.on('connect', () => setConnected(true));

    socket.on('disconnect', () => {
      setConnected(false);
      showToast('Connection lost, reconnecting...', 'error');
    });

    socket.on('round:start', (round: GameRound) => {
      setCurrentRound(round);
      clearMyBets();
      let count = 6;
      setCountdown(count);
      const interval = setInterval(() => {
        count--;
        setCountdown(count);
        if (count <= 0) clearInterval(interval);
      }, 1000);
    });

    socket.on('round:fly', () => updateRound({ state: 'flying' }));

    socket.on('round:update', (data: { id: string; currentMultiplier: number }) => {
      updateRound({ currentMultiplier: data.currentMultiplier, state: 'flying' });
    });

    socket.on('round:end', (round: GameRound) => {
      updateRound({ state: 'crashed', currentMultiplier: round.crashPoint, endTime: round.endTime });
      addToHistory(round);
      clearMyBets();
    });

    socket.on('bet:placed', (bet: Bet) => addBet(bet));

    socket.on('bet:cashout', (data: { betId: string; multiplier: number; profit: number; payout: number }) => {
      cashoutBet(data.betId, data.multiplier, data.profit);
      updateBalance(data.payout);
      showToast(`Cashed out at ${data.multiplier.toFixed(2)}x! +KSh ${data.profit}`, 'success');
    });

    socket.on('bet:lost', (data: { betId: string; amount: number }) => {
      showToast(`Lost KSh ${data.amount}`, 'error');
    });

    socket.on('error', (data: { message: string }) => showToast(data.message, 'error'));

    return () => socket.disconnect();
  }, []);

  const placeBet = useCallback((amount: number, autoCashout?: number) => {
    if (USE_MOCK) socketRef.current?.send('bet:place', { amount, autoCashout });
    else socketRef.current?.emit('bet:place', { amount, autoCashout });
  }, []);

  const cashOut = useCallback((betId: string, amount?: number) => {
    if (USE_MOCK) socketRef.current?.send('bet:cashout', { betId, amount });
    else socketRef.current?.emit('bet:cashout', { betId });
  }, []);

  const sendChat = useCallback((message: string) => {
    if (USE_MOCK) socketRef.current?.send('chat:send', { message });
    else socketRef.current?.emit('chat:send', { message });
  }, []);

  return { placeBet, cashOut, sendChat };
};
