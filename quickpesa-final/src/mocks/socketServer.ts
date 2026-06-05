import type { GameRound, Bet, ChatMessage } from '@/types';
import { generateCrashPoint } from './gameRounds';
import { GAME_CONFIG } from '@/utils/constants';

class MockSocketServer {
  private listeners: Map<string, ((data: any) => void)[]> = new Map();
  private roundState: GameRound | null = null;
  private animFrame: number | null = null;
  private currentMult: number = 1.0;
  private startTime: number = 0;
  private running: boolean = false;
  private betAmounts: Map<string, number> = new Map();

  connect() {
    setTimeout(() => {
      this.emit('connect', {});
      this.loop();
    }, 500);
  }

  disconnect() {
    this.running = false;
    if (this.animFrame) cancelAnimationFrame(this.animFrame);
  }

  on(event: string, cb: (data: any) => void) {
    if (!this.listeners.has(event)) this.listeners.set(event, []);
    this.listeners.get(event)!.push(cb);
  }

  emit(event: string, data: any) {
    (this.listeners.get(event) || []).forEach(cb => cb(data));
  }

  send(event: string, data: any) {
    if (event === 'bet:place') this.handleBet(data);
    else if (event === 'bet:cashout') this.handleCashout(data);
    else if (event === 'chat:send') this.handleChat(data);
  }

  private loop() {
    this.running = true;
    this.startBetting();
    setTimeout(() => {
      if (this.running) this.startFlying();
    }, GAME_CONFIG.BETTING_DURATION);
  }

  private startBetting() {
    const nonce = Math.floor(Date.now() / 1000);
    const crashPoint = generateCrashPoint(nonce);
    this.roundState = {
      id: `r_${nonce}`, roundNumber: nonce, state: 'betting', crashPoint,
      currentMultiplier: 1.0, startTime: Date.now(), endTime: null,
      serverSeedHash: `hash_${nonce}_demo`, serverSeed: null,
      clientSeed: 'client_' + nonce, nonce,
    };
    this.emit('round:start', this.roundState);
  }

  private startFlying() {
    if (!this.roundState) return;
    this.roundState.state = 'flying';
    this.currentMult = 1.0;
    this.startTime = Date.now();
    const crash = this.roundState.crashPoint;

    const animate = () => {
      if (!this.running || !this.roundState) return;
      const elapsed = (Date.now() - this.startTime) / 1000;
      this.currentMult = Math.pow(1.02 + elapsed * 0.008, elapsed) + elapsed * 0.05;
      this.currentMult = Math.max(1.0, Math.min(this.currentMult, crash));
      this.roundState.currentMultiplier = this.currentMult;
      this.emit('round:update', { ...this.roundState, currentMultiplier: this.currentMult });

      if (this.currentMult >= crash) {
        this.roundState.state = 'crashed';
        this.roundState.currentMultiplier = crash;
        this.roundState.endTime = Date.now();
        this.emit('round:end', this.roundState);
        setTimeout(() => this.loop(), 3000);
        return;
      }
      this.animFrame = requestAnimationFrame(animate);
    };
    animate();
  }

  private handleBet(data: { amount: number; autoCashout?: number }) {
    const bid = `bet_${Date.now()}`;
    this.betAmounts.set(bid, data.amount);
    this.emit('bet:placed', {
      id: bid, userId: 'user_demo', username: 'You',
      roundId: this.roundState?.id || '', amount: data.amount,
      autoCashout: data.autoCashout || null, cashoutMultiplier: null,
      profit: null, status: 'placed', createdAt: Date.now(),
    });
  }

  private handleCashout(data: { betId: string; amount: number }) {
    if (!this.roundState || this.roundState.state !== 'flying') return;
    const amt = this.betAmounts.get(data.betId) || data.amount || 100;
    const profit = Math.floor(amt * this.currentMult - amt);
    this.emit('bet:cashout', { betId: data.betId, multiplier: this.currentMult, profit });
  }

  private handleChat(data: { message: string }) {
    this.emit('chat:message', {
      id: `chat_${Date.now()}`, userId: 'user_demo', username: 'You',
      message: data.message, type: 'chat', createdAt: Date.now(),
    });
  }
}

export const mockSocket = new MockSocketServer();
