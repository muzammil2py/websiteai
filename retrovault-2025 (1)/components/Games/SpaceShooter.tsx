
import React, { useRef, useEffect, useState } from 'react';
import { GameMetadata } from '../../types';

interface SpaceShooterProps { game: GameMetadata; }

const SpaceShooter: React.FC<SpaceShooterProps> = ({ game }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [movingLeft, setMovingLeft] = useState(false);
  const [movingRight, setMovingRight] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let player = { x: canvas.width / 2 - 15, y: canvas.height - 40, w: 30, h: 20 };
    let bullets: any[] = [];
    let enemies: any[] = [];
    let frame = 0;

    const spawnEnemy = () => {
      enemies.push({
        x: Math.random() * (canvas.width - 20),
        y: -20,
        w: 20,
        h: 20,
        speed: 1 + Math.random() * 2
      });
    };

    const draw = () => {
      if (gameOver) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Player
      ctx.fillStyle = '#22c55e';
      ctx.fillRect(player.x, player.y, player.w, player.h);
      ctx.fillStyle = '#fff';
      ctx.fillRect(player.x + 10, player.y - 5, 10, 5);

      if (movingLeft && player.x > 0) player.x -= 5;
      if (movingRight && player.x < canvas.width - player.w) player.x += 5;

      // Bullets
      if (frame % 15 === 0) bullets.push({ x: player.x + 13, y: player.y, w: 4, h: 10 });
      bullets.forEach((b, i) => {
        b.y -= 7;
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(b.x, b.y, b.w, b.h);
        if (b.y < 0) bullets.splice(i, 1);
      });

      // Enemies
      if (frame % 60 === 0) spawnEnemy();
      enemies.forEach((e, ei) => {
        e.y += e.speed;
        ctx.font = '16px serif';
        ctx.fillText(game.icon || '👾', e.x, e.y + 15);

        // Collision bullet
        bullets.forEach((b, bi) => {
          if (b.x < e.x + e.w && b.x + b.w > e.x && b.y < e.y + e.h && b.y + b.h > e.y) {
            enemies.splice(ei, 1);
            bullets.splice(bi, 1);
            setScore(s => s + 100);
          }
        });

        // Collision player
        if (player.x < e.x + e.w && player.x + player.w > e.x && player.y < e.y + e.h && player.y + player.h > e.y) {
          setGameOver(true);
        }

        if (e.y > canvas.height) enemies.splice(ei, 1);
      });

      frame++;
      requestAnimationFrame(draw);
    };

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') setMovingLeft(true);
      if (e.key === 'ArrowRight') setMovingRight(true);
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') setMovingLeft(false);
      if (e.key === 'ArrowRight') setMovingRight(false);
    };

    window.addEventListener('keydown', handleKey);
    window.addEventListener('keyup', handleKeyUp);
    const animId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('keydown', handleKey);
      window.removeEventListener('keyup', handleKeyUp);
      cancelAnimationFrame(animId);
    };
  }, [movingLeft, movingRight, gameOver, game.icon]);

  return (
    <div className="flex flex-col items-center p-2 bg-blue-950 rounded-2xl w-full max-w-sm border-4 border-blue-800 shadow-2xl">
      <div className="text-white font-pixel text-[10px] mb-2 uppercase tracking-widest">{game.title}</div>
      <div className="text-green-400 font-pixel text-[14px] mb-4">Score: {score}</div>
      <canvas ref={canvasRef} width="300" height="400" className="bg-black border-2 border-blue-900 rounded-lg w-full" />
      <div className="flex w-full gap-4 mt-6 mb-2 px-2">
        <button onTouchStart={() => setMovingLeft(true)} onTouchEnd={() => setMovingLeft(false)} className="flex-1 bg-blue-800 text-white py-8 rounded-2xl active:bg-blue-700 shadow-lg font-bold">LEFT</button>
        <button onTouchStart={() => setMovingRight(true)} onTouchEnd={() => setMovingRight(false)} className="flex-1 bg-blue-800 text-white py-8 rounded-2xl active:bg-blue-700 shadow-lg font-bold">RIGHT</button>
      </div>
      {gameOver && <button onClick={() => window.location.reload()} className="mt-2 text-red-500 font-pixel text-xs animate-pulse">GAME OVER - RETRY</button>}
    </div>
  );
};

export default SpaceShooter;
