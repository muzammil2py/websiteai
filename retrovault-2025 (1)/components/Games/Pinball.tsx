
import React, { useRef, useEffect, useState } from 'react';

const Pinball: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [leftDown, setLeftDown] = useState(false);
  const [rightDown, setRightDown] = useState(false);
  const [launchTrigger, setLaunchTrigger] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let ball = { x: 280, y: 350, vx: 0, vy: 0, radius: 8 };
    const gravity = 0.15;
    const friction = 0.99;
    
    const bumpers = [
      { x: 100, y: 100, r: 20, color: '#ef4444' },
      { x: 220, y: 120, r: 20, color: '#ef4444' },
      { x: 160, y: 200, r: 25, color: '#f59e0b' },
    ];

    const flipperLength = 60;
    const flipperWidth = 10;
    let localLeftDown = false;
    let localRightDown = false;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'z' || e.key === 'ArrowLeft') { setLeftDown(true); localLeftDown = true; }
      if (e.key === 'm' || e.key === 'ArrowRight') { setRightDown(true); localRightDown = true; }
      if (e.key === ' ') { launch(); }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'z' || e.key === 'ArrowLeft') { setLeftDown(false); localLeftDown = false; }
      if (e.key === 'm' || e.key === 'ArrowRight') { setRightDown(false); localRightDown = false; }
    };

    const launch = () => {
      if (ball.vy === 0 && ball.vx === 0) {
        ball.vy = -12;
        ball.vx = -1;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    let animationId: number;

    const update = () => {
      if (gameOver) return;

      // Update local state from parent component state for touch reactivity
      localLeftDown = leftDown;
      localRightDown = rightDown;

      ball.vy += gravity;
      ball.vx *= friction;
      ball.vy *= friction;
      ball.x += ball.vx;
      ball.y += ball.vy;

      if (ball.x < ball.radius) { ball.x = ball.radius; ball.vx *= -0.8; }
      if (ball.x > canvas.width - ball.radius) { ball.x = canvas.width - ball.radius; ball.vx *= -0.8; }
      if (ball.y < ball.radius) { ball.y = ball.radius; ball.vy *= -0.8; }
      
      if (ball.y > canvas.height) {
        setGameOver(true);
      }

      bumpers.forEach(b => {
        const dx = ball.x - b.x;
        const dy = ball.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < ball.radius + b.r) {
          const angle = Math.atan2(dy, dx);
          ball.vx = Math.cos(angle) * 8;
          ball.vy = Math.sin(angle) * 8;
          setScore(s => s + 50);
        }
      });

      const leftAngle = localLeftDown ? -0.5 : 0.4;
      const rightAngle = localRightDown ? 0.5 : -0.4;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      bumpers.forEach(b => {
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fillStyle = b.color;
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.stroke();
      });

      ctx.save();
      ctx.translate(80, 360);
      ctx.rotate(leftAngle);
      ctx.fillStyle = '#1d4ed8';
      ctx.fillRect(0, -flipperWidth/2, flipperLength, flipperWidth);
      ctx.restore();

      ctx.save();
      ctx.translate(220, 360);
      ctx.rotate(rightAngle);
      ctx.fillStyle = '#1d4ed8';
      ctx.fillRect(-flipperLength, -flipperWidth/2, flipperLength, flipperWidth);
      ctx.restore();

      const checkFlipper = (fx: number, fy: number, angle: number, isLeft: boolean) => {
        const dx = ball.x - fx;
        const dy = ball.y - fy;
        const rotatedX = dx * Math.cos(-angle) - dy * Math.sin(-angle);
        const rotatedY = dx * Math.sin(-angle) + dy * Math.cos(-angle);
        const boundX = isLeft ? flipperLength : 0;
        const startX = isLeft ? 0 : -flipperLength;
        if (rotatedX > startX && rotatedX < boundX && Math.abs(rotatedY) < ball.radius + flipperWidth/2) {
          ball.vy = -10;
          ball.vx = isLeft ? 2 : -2;
          setScore(s => s + 10);
        }
      };
      checkFlipper(80, 360, leftAngle, true);
      checkFlipper(220, 360, rightAngle, false);

      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
      ctx.fillStyle = '#333';
      ctx.fill();

      animationId = requestAnimationFrame(update);
    };

    update();
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      cancelAnimationFrame(animationId);
    };
  }, [gameOver, leftDown, rightDown, launchTrigger]);

  return (
    <div className="flex flex-col items-center p-2 bg-gray-100 rounded-xl shadow-inner border-2 border-gray-300 w-full max-w-sm">
      <div className="mb-4 text-xl font-bold text-blue-900 font-pixel text-[10px]">Score: {score}</div>
      <canvas ref={canvasRef} width="300" height="400" className="bg-white border-4 border-blue-900 rounded-lg shadow-lg w-full" />
      
      <div className="grid grid-cols-2 gap-4 w-full mt-6">
        <button 
          onTouchStart={() => setLeftDown(true)}
          onTouchEnd={() => setLeftDown(false)}
          className="bg-blue-900 text-white py-8 rounded-2xl active:bg-blue-800 shadow-xl font-bold select-none text-xs font-pixel"
        >
          FLIP L
        </button>
        <button 
          onTouchStart={() => setRightDown(true)}
          onTouchEnd={() => setRightDown(false)}
          className="bg-blue-900 text-white py-8 rounded-2xl active:bg-blue-800 shadow-xl font-bold select-none text-xs font-pixel"
        >
          FLIP R
        </button>
      </div>
      <button 
        onTouchStart={() => setLaunchTrigger(t => t + 1)}
        onClick={() => setLaunchTrigger(t => t + 1)}
        className="w-full mt-4 bg-green-500 text-white py-4 rounded-xl shadow-lg font-pixel text-[10px] active:scale-95 transition-all"
      >
        LAUNCH BALL
      </button>
      
      {gameOver && (
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 bg-red-600 text-white px-4 py-2 font-pixel text-[8px] rounded hover:bg-red-700 animate-bounce"
        >
          RETRY
        </button>
      )}
    </div>
  );
};

export default Pinball;
