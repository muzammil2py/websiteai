
import React, { useRef, useEffect, useState } from 'react';
import { GameMetadata } from '../../types';

interface PlatformerProps { game: GameMetadata; }

const SimplePlatformer: React.FC<PlatformerProps> = ({ game }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isJumping, setIsJumping] = useState(false);
  const [moveDir, setMoveDir] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let player = { x: 50, y: 200, w: 24, h: 32, vy: 0, grounded: false };
    const gravity = 0.8;
    const platforms = [
      { x: 0, y: 350, w: 300, h: 50 },
      { x: 50, y: 280, w: 80, h: 15 },
      { x: 170, y: 220, w: 80, h: 15 },
      { x: 30, y: 160, w: 80, h: 15 },
    ];
    let coins = Array.from({length: 5}, () => ({ 
      x: Math.random() * 250, 
      y: Math.random() * 300, 
      collected: false 
    }));

    const draw = () => {
      if (gameOver) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // BG
      ctx.fillStyle = '#334155';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Platforms
      ctx.fillStyle = '#1e293b';
      platforms.forEach(p => ctx.fillRect(p.x, p.y, p.w, p.h));

      // Player physics
      player.vy += gravity;
      player.y += player.vy;
      player.x += moveDir * 4;
      player.grounded = false;

      platforms.forEach(p => {
        if (player.x < p.x + p.w && player.x + player.w > p.x && player.y + player.h > p.y && player.y + player.h < p.y + p.h + player.vy) {
          player.y = p.y - player.h;
          player.vy = 0;
          player.grounded = true;
        }
      });

      // Coins
      coins.forEach(c => {
        if (!c.collected) {
          ctx.font = '16px serif';
          ctx.fillText('✨', c.x, c.y);
          if (player.x < c.x + 15 && player.x + player.w > c.x && player.y < c.y + 15 && player.y + player.h > c.y) {
            c.collected = true;
            setScore(s => s + 500);
          }
        }
      });

      // Character
      ctx.font = '24px serif';
      ctx.fillText(game.icon || '🏃', player.x, player.y + 24);

      if (player.y > canvas.height) setGameOver(true);
      if (coins.every(c => c.collected)) {
        coins = Array.from({length: 5}, () => ({ x: Math.random() * 250, y: Math.random() * 300, collected: false }));
      }

      requestAnimationFrame(draw);
    };

    const handleJump = () => {
      if (player.grounded) {
        player.vy = -14;
        player.grounded = false;
      }
    };

    window.onkeydown = (e) => {
      if (e.key === 'ArrowLeft') setMoveDir(-1);
      if (e.key === 'ArrowRight') setMoveDir(1);
      if (e.key === ' ' || e.key === 'ArrowUp') handleJump();
    };
    window.onkeyup = () => setMoveDir(0);

    const animId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animId);
  }, [moveDir, game.icon, gameOver]);

  return (
    <div className="flex flex-col items-center p-2 bg-slate-800 rounded-3xl w-full max-w-sm border-4 border-slate-700">
      <div className="text-white font-pixel text-[10px] my-3 uppercase tracking-tighter">{game.title} - 16BIT</div>
      <div className="text-yellow-400 font-pixel text-[14px] mb-4">Points: {score}</div>
      <canvas ref={canvasRef} width="300" height="400" className="bg-slate-900 border-2 border-slate-600 rounded-xl" />
      <div className="grid grid-cols-3 gap-3 w-full mt-6 px-2">
        <button onTouchStart={() => setMoveDir(-1)} onTouchEnd={() => setMoveDir(0)} className="bg-slate-700 text-white py-6 rounded-2xl active:bg-slate-600 shadow-xl font-bold">←</button>
        <button onTouchStart={() => setMoveDir(1)} onTouchEnd={() => setMoveDir(0)} className="bg-slate-700 text-white py-6 rounded-2xl active:bg-slate-600 shadow-xl font-bold">→</button>
        <button onTouchStart={() => {}} onClick={() => {}} className="bg-green-600 text-white py-6 rounded-2xl active:bg-green-500 shadow-xl font-bold font-pixel text-[10px]">JUMP</button>
      </div>
      {gameOver && <button onClick={() => window.location.reload()} className="mt-4 text-red-400 font-pixel text-xs">FALLEN - TRY AGAIN</button>}
    </div>
  );
};

export default SimplePlatformer;
