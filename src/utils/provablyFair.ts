import { createHmac } from 'crypto';

// Client-side provably fair verification
export const generateClientSeed = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export const hashServerSeed = (serverSeed: string): string => {
  // In real implementation, this uses SHA-256
  // For mock, we simulate the hash
  return `hash_${serverSeed.slice(0, 16)}...`;
};

export const calculateCrashPoint = (
  serverSeed: string,
  clientSeed: string,
  nonce: number,
  houseEdge: number = 0.03
): number => {
  // HMAC-SHA256 of serverSeed + clientSeed + nonce
  const message = `${clientSeed}:${nonce}`;
  // In browser, we'd use Web Crypto API
  // For this implementation, we use a deterministic mock
  const combined = `${serverSeed}${message}`;
  let hash = 0;
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }

  // Convert to crash point using exponential distribution
  const hashDecimal = Math.abs(hash) / 2147483647;
  const edgeFactor = 1 - houseEdge;
  const crashPoint = Math.max(1.0, edgeFactor / (1 - hashDecimal));

  return Math.min(crashPoint, 1000);
};

export const verifyRound = (
  serverSeed: string,
  clientSeed: string,
  nonce: number,
  expectedCrashPoint: number,
  houseEdge: number = 0.03
): boolean => {
  const calculated = calculateCrashPoint(serverSeed, clientSeed, nonce, houseEdge);
  return Math.abs(calculated - expectedCrashPoint) < 0.001;
};
