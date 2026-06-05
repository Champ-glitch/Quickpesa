import { useEffect, useRef, useState } from 'react';
import { useGameStore } from '@/stores/gameStore';

interface EngineState {
  multiplier: number;
  isFlying: boolean;
  isCrashed: boolean;
  isBetting: boolean;
  elapsed: number;
}

export const useCrashEngine = () => {
  const { currentRound, countdown } = useGameStore();
  const [state, setState] = useState<EngineState>({
    multiplier: 1.0, isFlying: false, isCrashed: false, isBetting: false, elapsed: 0,
  });
  const animRef = useRef<number | null>(null);
  const startRef = useRef<number>(0);

  useEffect(() => {
    if (!currentRound) return;

    if (currentRound.state === 'betting') {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      setState({ multiplier: 1.0, isFlying: false, isCrashed: false, isBetting: true, elapsed: countdown || 0 });
    } else if (currentRound.state === 'flying') {
      startRef.current = Date.now();
      setState(prev => ({ ...prev, isFlying: true, isBetting: false }));
      const animate = () => {
        const elapsed = (Date.now() - startRef.current) / 1000;
        const mult = Math.pow(1.02 + elapsed * 0.008, elapsed) + elapsed * 0.05;
        setState(prev => ({ ...prev, multiplier: Math.max(1.0, mult), elapsed }));
        animRef.current = requestAnimationFrame(animate);
      };
      animRef.current = requestAnimationFrame(animate);
      return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
    } else if (currentRound.state === 'crashed') {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      setState(prev => ({ ...prev, isFlying: false, isCrashed: true, multiplier: currentRound.crashPoint }));
    }
  }, [currentRound?.state, currentRound?.crashPoint, countdown]);

  return state;
};
