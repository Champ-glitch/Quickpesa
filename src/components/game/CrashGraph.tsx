import { useRef, useEffect, useState } from 'react';
import { useGameStore } from '@/stores/gameStore';
import { useCrashEngine } from '@/hooks/useCrashEngine';
import { formatMultiplier, getMultiplierColor } from '@/utils/formatters';

export const CrashGraph = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { currentRound } = useGameStore();
  const { multiplier, isFlying, isCrashed, isBetting } = useCrashEngine();
  const [dims, setDims] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const update = () => {
      const c = canvasRef.current?.parentElement;
      if (c) setDims({ w: c.clientWidth, h: c.clientHeight });
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c || dims.w === 0) return;
    const ctx = c.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    c.width = dims.w * dpr; c.height = dims.h * dpr;
    ctx.scale(dpr, dpr);
    const w = dims.w, h = dims.h;
    ctx.clearRect(0, 0, w, h);

    // Background
    ctx.fillStyle = '#0a0e1a';
    ctx.fillRect(0, 0, w, h);

    // Grid lines
    ctx.strokeStyle = 'rgba(42, 52, 65, 0.4)';
    ctx.lineWidth = 1;
    for (let i = 1; i < 5; i++) {
      const y = (h / 5) * i;
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }
    for (let i = 1; i < 6; i++) {
      const x = (w / 6) * i;
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
    }

    if (isBetting) {
      ctx.fillStyle = '#22c55e';
      ctx.font = `bold ${Math.min(w * 0.07, 28)}px JetBrains Mono`;
      ctx.textAlign = 'center';
      const text1 = 'WAITING FOR';
      const text2 = 'NEXT ROUND';
      ctx.fillText(text1, w / 2, h / 2 - 8);
      ctx.fillText(text2, w / 2, h / 2 + 22);
      ctx.font = `${Math.min(w * 0.035, 14)}px Inter`;
      ctx.fillStyle = '#6b7280';
      ctx.fillText('Place your bets', w / 2, h / 2 + 48);
      return;
    }

    if (isFlying || isCrashed) {
      const points: {x:number,y:number}[] = [];
      const maxTime = Math.max(multiplier, 1);
      const maxMult = Math.max(multiplier, 2);

      for (let t = 0; t <= multiplier; t += 0.05) {
        const progress = t / maxTime;
        const x = Math.min(progress * w * 0.85, w - 30);
        const curveMult = Math.pow(1.02 + t * 0.008, t) + t * 0.05;
        const y = Math.max(30, h - (curveMult / maxMult) * h * 0.7);
        if (y > 0 && y < h) points.push({ x, y });
      }

      if (points.length > 1) {
        // Glow line
        ctx.shadowColor = isCrashed ? '#ef4444' : '#22c55e';
        ctx.shadowBlur = 12;
        ctx.strokeStyle = isCrashed ? '#ef4444' : '#22c55e';
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) ctx.lineTo(points[i].x, points[i].y);
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Fill under
        ctx.fillStyle = isCrashed ? 'rgba(239,68,68,0.06)' : 'rgba(34,197,94,0.06)';
        ctx.beginPath();
        ctx.moveTo(points[0].x, h);
        for (const p of points) ctx.lineTo(p.x, p.y);
        ctx.lineTo(points[points.length-1].x, h);
        ctx.closePath(); ctx.fill();

        // Draw airplane at the tip
        const last = points[points.length-1];
        drawAirplane(ctx, last.x, last.y, isCrashed);
      }
    }

    if (isCrashed && currentRound?.crashPoint) {
      ctx.fillStyle = '#ef4444';
      ctx.font = `bold ${Math.min(w * 0.1, 40)}px JetBrains Mono`;
      ctx.textAlign = 'center';
      ctx.fillText('FLEW AWAY', w / 2, h / 2 - 10);
      ctx.font = `bold ${Math.min(w * 0.07, 24)}px JetBrains Mono`;
      ctx.fillText(`@ ${currentRound.crashPoint.toFixed(2)}x`, w / 2, h / 2 + 28);
    }
  }, [dims, multiplier, isFlying, isCrashed, isBetting, currentRound]);

  return (
    <div className="relative w-full bg-dark-900 rounded-xl overflow-hidden border border-dark-border" style={{ aspectRatio: '16/11' }}>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        {(isFlying || isCrashed) && (
          <div className={`text-center ${isCrashed ? 'animate-crash-shake' : ''}`}>
            <span className={`text-4xl sm:text-5xl font-bold font-mono ${getMultiplierColor(multiplier)}`}>
              {formatMultiplier(multiplier)}
            </span>
          </div>
        )}
      </div>
      <canvas ref={canvasRef} style={{ width: dims.w, height: dims.h }} className="absolute inset-0" />
      {currentRound?.serverSeedHash && (
        <div className="absolute bottom-1 left-2 right-2 flex justify-between text-[9px] text-gray-700 font-mono">
          <span className="truncate">Hash: {currentRound.serverSeedHash}</span>
          <span>#{currentRound.roundNumber}</span>
        </div>
      )}
    </div>
  );
};

// Draw a simple airplane icon
function drawAirplane(ctx: CanvasRenderingContext2D, x: number, y: number, crashed: boolean) {
  ctx.save();
  ctx.translate(x, y);

  // Small rotation based on position
  const angle = -0.3;
  ctx.rotate(angle);

  const color = crashed ? '#ef4444' : '#22c55e';
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;

  // Airplane body
  ctx.beginPath();
  ctx.ellipse(0, 0, 12, 4, 0, 0, Math.PI * 2);
  ctx.fill();

  // Wings
  ctx.beginPath();
  ctx.moveTo(-2, -2);
  ctx.lineTo(2, -2);
  ctx.lineTo(0, -10);
  ctx.closePath();
  ctx.fill();

  // Tail
  ctx.beginPath();
  ctx.moveTo(-8, 0);
  ctx.lineTo(-12, -6);
  ctx.lineTo(-6, -2);
  ctx.closePath();
  ctx.fill();

  // Propeller glow
  if (!crashed) {
    ctx.shadowColor = '#22c55e';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(10, 0, 3, 0, Math.PI * 2);
    ctx.fillStyle = '#4ade80';
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  ctx.restore();
}
