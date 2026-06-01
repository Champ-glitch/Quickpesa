export const generateClientSeed = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export const calculateCrashPoint = (
  serverSeed: string,
  clientSeed: string,
  nonce: number,
  houseEdge: number = 0.03
): number => {
  const combined = `${serverSeed}:${clientSeed}:${nonce}`;
  let hash = 0;
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  const hashDecimal = Math.abs(hash) / 2147483647;
  const edgeFactor = 1 - houseEdge;
  const crashPoint = Math.max(1.0, edgeFactor / (1 - hashDecimal));
  return Math.min(crashPoint, 1000);
};
