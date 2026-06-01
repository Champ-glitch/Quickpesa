import type { GameRound, Bet, ChatMessage } from '@/types';
import { generateCrashPoint } from './gameRounds';
import { GAME_CONFIG } from '@/utils/constants';

// Mock WebSocket server for offline development
class MockSocketServer {
  private listeners: Map<string, ((data: any) => void)[]> = new Map();
  private roundState: GameRound | null = null;
  private animationFrame: number | null = null;
  private currentMultiplier: number = 1.0;
  private startTime: number = 0;
  private isRunning: boolean = false;

  connect() {
    setTimeout(() => {
      this.emit('connect', {});
      this.startRoundLoop();
    }, 500);
  }

  disconnect() {
    this.isRunning = false;
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
  }

  on(event: string, callback: (data: any) => void) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  emit(event: string, data: any) {
    const callbacks = this.listeners.get(event) || [];
    callbacks.forEach(cb => cb(data));
  }

  send(event: string, data: any) {
    // Handle client messages
    if (event === 'bet:place') {
      this.handlePlaceBet(data);
    } else if (event === 'bet:cashout') {
      this.handleCashout(data);
    } else if (event === 'chat:send') {
      this.handleChat(data);
    }
  }

  private startRoundLoop() {
    this.isRunning = true;
    const runRound = () => {
      if (!this.isRunning) return;

      // Betting phase
      this.startBettingPhase();

      setTimeout(() => {
        if (!this.isRunning) return;
        this.startFlyingPhase();
      }, GAME_CONFIG.BETTING_DURATION);
    };

    runRound();
  }

  private startBettingPhase() {
    const nonce = Math.floor(Date.now() / 1000);
    const crashPoint = generateCrashPoint(nonce);

    this.roundState = {
      id: `round_${nonce}`,
      roundNumber: nonce,
      state: 'betting',
      crashPoint,
      currentMultiplier: 1.0,
      startTime: Date.now(),
      endTime: null,
      serverSeedHash: `hash_${nonce}_demo`,
      serverSeed: null,
      clientSeed: 'client_' + nonce,
      nonce,
    };

    this.emit('round:start', this.roundState);

    // Countdown
    let countdown = GAME_CONFIG.BETTING_DURATION / 1000;
    const countdownInterval = setInterval(() => {
      countdown--;
      if (countdown <= 0) {
        clearInterval(countdownInterval);
      }
    }, 1000);
  }

  private startFlyingPhase() {
    if (!this.roundState) return;

    this.roundState.state = 'flying';
    this.currentMultiplier = 1.0;
    this.startTime = Date.now();

    const crashPoint = this.roundState.crashPoint || 2.0;

    const animate = () => {
      if (!this.isRunning || !this.roundState) return;

      const elapsed = (Date.now() - this.startTime) / 1000;
      // Exponential growth curve
      this.currentMultiplier = Math.pow(1.05 + elapsed * 0.01, elapsed) + elapsed * 0.1;
      this.currentMultiplier = Math.max(1.0, Math.min(this.currentMultiplier, crashPoint));

      this.roundState.currentMultiplier = this.currentMultiplier;
      this.emit('round:update', {
        ...this.roundState,
        currentMultiplier: this.currentMultiplier,
      });

      if (this.currentMultiplier >= crashPoint) {
        this.roundState.state = 'crashed';
        this.roundState.currentMultiplier = crashPoint;
        this.roundState.endTime = Date.now();
        this.emit('round:end', this.roundState);

        setTimeout(() => {
          this.startRoundLoop();
        }, 3000);
        return;
      }

      this.animationFrame = requestAnimationFrame(animate);
    };

    animate();
  }

  private handlePlaceBet(data: { amount: number; autoCashout?: number }) {
    // Simulate bet acceptance
    const bet: Bet = {
      id: `bet_${Date.now()}`,
      userId: 'user_demo',
      username: 'You',
      roundId: this.roundState?.id || '',
      amount: data.amount,
      autoCashout: data.autoCashout || null,
      cashoutMultiplier: null,
      profit: null,
      status: 'placed',
      createdAt: Date.now(),
    };

    this.emit('bet:placed', bet);
  }

  private handleCashout(data: { betId: string }) {
    if (!this.roundState || this.roundState.state !== 'flying') return;

    const profit = Math.floor(data.amount * this.currentMultiplier - data.amount);

    this.emit('bet:cashout', {
      betId: data.betId,
      multiplier: this.currentMultiplier,
      profit,
    });
  }

  private handleChat(data: { message: string }) {
    const chatMessage: ChatMessage = {
      id: `chat_${Date.now()}`,
      userId: 'user_demo',
      username: 'You',
      message: data.message,
      type: 'chat',
      createdAt: Date.now(),
    };

    this.emit('chat:message', chatMessage);
  }
}

export const mockSocket = new MockSocketServer();
