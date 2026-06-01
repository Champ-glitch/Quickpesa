import { useEffect, useRef, useState, useCallback } from 'react';
import { useGameStore } from '@/stores/gameStore';

interface CrashEngineState {
  multiplier: number;
  isFlying: boolean;
  isCrashed: boolean;
  isBetting: boolean;
  elapsed: number;
}

export const useCrashEngine = () => {
  const { currentRound, countdown } = useGameStore();
  const [engineState, setEngineState] = useState<CrashEngineState>({
    multiplier: 1.0,
    isFlying: false,
    isCrashed: false,
    isBetting: false,
    elapsed: 0,
  });

  const animRef = useRef<number>();
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    if (!currentRound) return;

    if (currentRound.state === 'betting') {
      setEngineState({
        multiplier: 1.0,
        isFlying: false,
        isCrashed: false,
        isBetting: true,
        elapsed: countdown,
      });
    } else if (currentRound.state === 'flying') {
      startTimeRef.current = Date.now();
      setEngineState(prev => ({ ...prev, isFlying: true, isBetting: false }));

      const animate = () => {
        const elapsed = (Date.now() - startTimeRef.current) / 1000;
        // Smooth exponential curve
        const multiplier = Math.pow(1.02 + elapsed * 0.008, elapsed) + elapsed * 0.05;

        setEngineState(prev => ({
          ...prev,
          multiplier: Math.max(1.0, multiplier),
          elapsed,
        }));

        animRef.current = requestAnimationFrame(animate);
      };

      animRef.current = requestAnimationFrame(animate);

      return () => {
        if (animRef.current) cancelAnimationFrame(animRef.current);
      };
    } else if (currentRound.state === 'crashed') {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      setEngineState(prev => ({
        ...prev,
        isFlying: false,
        isCrashed: true,
        multiplier: currentRound.crashPoint || 1.0,
      }));
    }
  }, [currentRound?.state, currentRound?.crashPoint, countdown]);

  const getCurvePath = useCallback((width: number, height: number) => {
    const points: string[] = ['M 0 ' + height];
    const steps = 100;

    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const x = t * width;
      // Inverse Y because SVG coordinates
      const y = height - (t * height * 0.8);
      points.push(`L ${x} ${y}`);
    }

    return points.join(' ');
  }, []);

  return { ...engineState, getCurvePath };
};
