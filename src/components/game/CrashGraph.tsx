import { useRef, useEffect, useState } from 'react';
import { useGameStore } from '@/stores/gameStore';
import { useCrashEngine } from '@/hooks/useCrashEngine';
import { formatMultiplier, getMultiplierColor } from '@/utils/formatters';

export const CrashGraph = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { currentRound } = useGameStore();
  const { multiplier, isFlying, isCrashed, isBetting, elapsed } = useCrashEngine();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Responsive canvas
  useEffect(() => {
    const updateDimensions = () => {
      const container = canvasRef.current?.parentElement;
      if (container) {
        setDimensions({
          width: container.clientWidth,
          height: container.clientHeight,
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Draw the crash curve
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || dimensions.width === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = dimensions.width * dpr;
    canvas.height = dimensions.height * dpr;
    ctx.scale(dpr, dpr);

    const w = dimensions.width;
    const h = dimensions.height;

    // Clear
    ctx.clearRect(0, 0, w, h);

    // Background grid
    ctx.strokeStyle = 'rgba(31, 41, 55, 0.5)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 5; i++) {
      const y = (h / 5) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    if (isBetting) {
      // Waiting state
      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 48px JetBrains Mono';
      ctx.textAlign = 'center';
      ctx.fillText('PLACE YOUR BETS', w / 2, h / 2 - 20);

      ctx.font = '24px JetBrains Mono';
      ctx.fillStyle = '#9ca3af';
      ctx.fillText(`Starting in ${elapsed}s`, w / 2, h / 2 + 30);
      return;
    }

    if (isFlying || isCrashed) {
      // Draw the curve
      const points: { x: number; y: number }[] = [];
      const maxTime = Math.max(elapsed, 1);
      const maxMult = Math.max(multiplier, 2);

      for (let t = 0; t <= elapsed; t += 0.016) {
        const progress = t / maxTime;
        const x = progress * w * 0.85;
        const curveMult = Math.pow(1.02 + t * 0.008, t) + t * 0.05;
        const y = h - (curveMult / maxMult) * h * 0.8;

        if (y > 0 && y < h) {
          points.push({ x, y });
        }
      }

      if (points.length > 1) {
        // Glow effect
        ctx.shadowColor = isCrashed ? '#ef4444' : '#10b981';
        ctx.shadowBlur = 20;

        // Curve line
        ctx.strokeStyle = isCrashed ? '#ef4444' : '#10b981';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);

        for (let i = 1; i < points.length; i++) {
          ctx.lineTo(points[i].x, points[i].y);
        }
        ctx.stroke();

        ctx.shadowBlur = 0;

        // Fill under curve
        ctx.fillStyle = isCrashed 
          ? 'rgba(239, 68, 68, 0.1)' 
          : 'rgba(16, 185, 129, 0.1)';
        ctx.beginPath();
        ctx.moveTo(points[0].x, h);
        for (const p of points) ctx.lineTo(p.x, p.y);
        ctx.lineTo(points[points.length - 1].x, h);
        ctx.closePath();
        ctx.fill();

        // Current point dot
        const lastPoint = points[points.length - 1];
        ctx.fillStyle = isCrashed ? '#ef4444' : '#10b981';
        ctx.beginPath();
        ctx.arc(lastPoint.x, lastPoint.y, 6, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    if (isCrashed && currentRound?.crashPoint) {
      ctx.fillStyle = '#ef4444';
      ctx.font = 'bold 64px JetBrains Mono';
      ctx.textAlign = 'center';
      ctx.fillText(`CRASHED`, w / 2, h / 2 - 20);

      ctx.font = 'bold 36px JetBrains Mono';
      ctx.fillText(`@ ${currentRound.crashPoint.toFixed(2)}x`, w / 2, h / 2 + 40);
    }
  }, [dimensions, multiplier, isFlying, isCrashed, isBetting, elapsed, currentRound]);

  return (
    <div className="relative w-full aspect-[4/3] bg-qp-card rounded-2xl overflow-hidden border border-qp-border">
      {/* Multiplier overlay */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        {(isFlying || isCrashed) && (
          <div className={`text-center ${isCrashed ? 'animate-crash-shake' : ''}`}>
            <span className={`text-6xl font-bold font-mono ${getMultiplierColor(multiplier)}`}>
              {formatMultiplier(multiplier)}
            </span>
          </div>
        )}
      </div>

      <canvas
        ref={canvasRef}
        style={{ width: dimensions.width, height: dimensions.height }}
        className="absolute inset-0"
      />

      {/* Server seed hash */}
      {currentRound?.serverSeedHash && (
        <div className="absolute bottom-2 left-2 right-2 flex justify-between text-[10px] text-qp-muted/50">
          <span className="font-mono truncate">Hash: {currentRound.serverSeedHash}</span>
          <span className="font-mono">#{currentRound.roundNumber}</span>
        </div>
      )}
    </div>
  );
};
