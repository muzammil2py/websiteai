
import React, { useRef, useEffect, useState } from 'react';

const Pong: React.FC<{ title: string }> = ({ title }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scores, setScores] = useState({ p1: 0, cpu: 0 });
  const [p1Y, setP1Y] = useState(150);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let ball = { x: 150, y: 100, vx: 3, vy: 2, r: 6 };
    let cpuY = 150;
    let localP1Y = 150;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = '#fff';
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2, 0);
      ctx.lineTo(canvas.width / 2, canvas.height);
      ctx.stroke();

      // Ball
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
      ctx.fill();

      // Paddles
      ctx.fillRect(10, localP1Y, 10, 50);
      ctx.fillRect(canvas.width - 20, cpuY, 10, 50);

      // Physics
      ball.x += ball.vx;
      ball.y += ball.vy;

      if (ball.y < ball.r || ball.y > canvas.height - ball.r) ball.vy *= -1;

      // P1 Paddle
      if (ball.x < 20 && ball.y > localP1Y && ball.y < localP1Y + 50) {
        ball.vx = Math.abs(ball.vx) + 0.2;
        ball.vy += (ball.y - (localP1Y + 25)) * 0.1;
      }
      // CPU Paddle
      if (ball.x > canvas.width - 20 && ball.y > cpuY && ball.y < cpuY + 50) {
        ball.vx = -Math.abs(ball.vx) - 0.2;
      }

      // CPU AI
      if (cpuY + 25 < ball.y) cpuY += 2.5;
      else cpuY -= 2.5;

      // Score
      if (ball.x < 0) {
        setScores(s => ({ ...s, cpu: s.cpu + 1 }));
        ball = { x: 150, y: 100, vx: 3, vy: 2, r: 6 };
      }
      if (ball.x > canvas.width) {
        setScores(s => ({ ...s, p1: s.p1 + 1 }));
        ball = { x: 150, y: 100, vx: -3, vy: 2, r: 6 };
      }

      requestAnimationFrame(draw);
    };

    const handleTouch = (e: any) => {
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches ? e.touches[0] : e;
      const y = (touch.clientY - rect.top) * (canvas.height / rect.height);
      localP1Y = Math.max(0, Math.min(canvas.height - 50, y - 25));
      setP1Y(localP1Y);
    };

    canvas.addEventListener('touchmove', handleTouch);
    canvas.addEventListener('mousemove', handleTouch);

    const animId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div className="flex flex-col items-center p-4 bg-black rounded-3xl border-8 border-gray-800 w-full max-w-sm">
      <div className="flex justify-between w-full px-12 mb-4 font-pixel text-xl text-white">
        <span>{scores.p1}</span>
        <span className="text-[10px] opacity-50">{title}</span>
        <span>{scores.cpu}</span>
      </div>
      <canvas ref={canvasRef} width="300" height="200" className="w-full cursor-none" />
      <div className="mt-6 text-gray-500 font-pixel text-[8px] uppercase">Slide to move paddle</div>
    </div>
  );
};

export default Pong;
