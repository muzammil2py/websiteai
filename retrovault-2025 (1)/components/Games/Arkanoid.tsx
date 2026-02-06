
import React, { useRef, useEffect, useState } from 'react';

const Arkanoid: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isLeftDown, setIsLeftDown] = useState(false);
  const [isRightDown, setIsRightDown] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let ballX = canvas.width / 2;
    let ballY = canvas.height - 30;
    let dx = 2;
    let dy = -2;
    const ballRadius = 6;

    const paddleHeight = 10;
    const paddleWidth = 75;
    let paddleX = (canvas.width - paddleWidth) / 2;

    const brickRowCount = 3;
    const brickColumnCount = 5;
    const brickWidth = 50;
    const brickHeight = 15;
    const brickPadding = 10;
    const brickOffsetTop = 30;
    const brickOffsetLeft = 30;

    let rightPressed = false;
    let leftPressed = false;

    const bricks: any[] = [];
    for (let c = 0; c < brickColumnCount; c++) {
      bricks[c] = [];
      for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
      }
    }

    const keyDownHandler = (e: KeyboardEvent) => {
      if (e.key === 'Right' || e.key === 'ArrowRight') rightPressed = true;
      else if (e.key === 'Left' || e.key === 'ArrowLeft') leftPressed = true;
    };

    const keyUpHandler = (e: KeyboardEvent) => {
      if (e.key === 'Right' || e.key === 'ArrowRight') rightPressed = false;
      else if (e.key === 'Left' || e.key === 'ArrowLeft') leftPressed = false;
    };

    document.addEventListener('keydown', keyDownHandler, false);
    document.addEventListener('keyup', keyUpHandler, false);

    let animId: number;

    const collisionDetection = () => {
      for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
          const b = bricks[c][r];
          if (b.status === 1) {
            if (ballX > b.x && ballX < b.x + brickWidth && ballY > b.y && ballY < b.y + brickHeight) {
              dy = -dy;
              b.status = 0;
              setScore(s => s + 10);
            }
          }
        }
      }
    };

    const drawBall = () => {
      ctx.beginPath();
      ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
      ctx.fillStyle = '#1e3a8a';
      ctx.fill();
      ctx.closePath();
    };

    const drawPaddle = () => {
      ctx.beginPath();
      ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
      ctx.fillStyle = '#22c55e';
      ctx.fill();
      ctx.closePath();
    };

    const drawBricks = () => {
      for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
          if (bricks[c][r].status === 1) {
            const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
            const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
            bricks[c][r].x = brickX;
            bricks[c][r].y = brickY;
            ctx.beginPath();
            ctx.rect(brickX, brickY, brickWidth, brickHeight);
            ctx.fillStyle = '#22c55e';
            ctx.fill();
            ctx.closePath();
          }
        }
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawBricks();
      drawBall();
      drawPaddle();
      collisionDetection();

      if (ballX + dx > canvas.width - ballRadius || ballX + dx < ballRadius) {
        dx = -dx;
      }
      if (ballY + dy < ballRadius) {
        dy = -dy;
      } else if (ballY + dy > canvas.height - ballRadius) {
        if (ballX > paddleX && ballX < paddleX + paddleWidth) {
          dy = -dy;
        } else {
          setGameOver(true);
          return;
        }
      }

      const movingRight = rightPressed || isRightDown;
      const movingLeft = leftPressed || isLeftDown;

      if (movingRight && paddleX < canvas.width - paddleWidth) {
        paddleX += 7;
      } else if (movingLeft && paddleX > 0) {
        paddleX -= 7;
      }

      ballX += dx;
      ballY += dy;
      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      document.removeEventListener('keydown', keyDownHandler);
      document.removeEventListener('keyup', keyUpHandler);
      cancelAnimationFrame(animId);
    };
  }, [isLeftDown, isRightDown]);

  const resetGame = () => {
    window.location.reload(); // Simple way to reset stateful canvas game
  };

  return (
    <div className="flex flex-col items-center p-4 bg-green-50 rounded-lg shadow-inner w-full max-w-sm">
      <div className="mb-4 text-xl font-bold text-blue-900 font-pixel text-[12px]">Score: {score}</div>
      <canvas ref={canvasRef} width="300" height="240" className="border-4 border-blue-900 bg-white shadow-lg w-full" />
      
      {gameOver ? (
        <button onClick={resetGame} className="mt-4 bg-red-600 text-white font-pixel text-[10px] px-4 py-2 rounded-lg">RETRY</button>
      ) : (
        <div className="flex w-full gap-4 mt-8">
          <button 
            onTouchStart={() => setIsLeftDown(true)}
            onTouchEnd={() => setIsLeftDown(false)}
            onMouseDown={() => setIsLeftDown(true)}
            onMouseUp={() => setIsLeftDown(false)}
            className="flex-1 bg-blue-900 text-white py-6 rounded-2xl active:bg-blue-800 shadow-xl font-bold select-none"
          >
            LEFT
          </button>
          <button 
             onTouchStart={() => setIsRightDown(true)}
             onTouchEnd={() => setIsRightDown(false)}
             onMouseDown={() => setIsRightDown(true)}
             onMouseUp={() => setIsRightDown(false)}
            className="flex-1 bg-blue-900 text-white py-6 rounded-2xl active:bg-blue-800 shadow-xl font-bold select-none"
          >
            RIGHT
          </button>
        </div>
      )}
    </div>
  );
};

export default Arkanoid;
