
import React, { useState, useEffect, useCallback, useRef } from 'react';

const GRID_SIZE = 15;
const CELL_SIZE = 18;

const Snake: React.FC = () => {
  const [snake, setSnake] = useState([{ x: 7, y: 7 }]);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [dir, setDir] = useState({ x: 0, y: -1 });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const lastDir = useRef({ x: 0, y: -1 });

  const moveSnake = useCallback(() => {
    if (gameOver) return;

    const newHead = {
      x: (snake[0].x + dir.x + GRID_SIZE) % GRID_SIZE,
      y: (snake[0].y + dir.y + GRID_SIZE) % GRID_SIZE
    };

    if (snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
      setGameOver(true);
      return;
    }

    const newSnake = [newHead, ...snake];
    lastDir.current = dir;

    if (newHead.x === food.x && newHead.y === food.y) {
      setScore(s => s + 10);
      setFood({
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      });
    } else {
      newSnake.pop();
    }

    setSnake(newSnake);
  }, [snake, dir, food, gameOver]);

  const changeDir = (newDir: {x: number, y: number}) => {
    if (newDir.y !== 0 && lastDir.current.y === 0) setDir(newDir);
    if (newDir.x !== 0 && lastDir.current.x === 0) setDir(newDir);
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') changeDir({ x: 0, y: -1 });
      else if (e.key === 'ArrowDown') changeDir({ x: 0, y: 1 });
      else if (e.key === 'ArrowLeft') changeDir({ x: -1, y: 0 });
      else if (e.key === 'ArrowRight') changeDir({ x: 1, y: 0 });
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  useEffect(() => {
    const interval = setInterval(moveSnake, 200);
    return () => clearInterval(interval);
  }, [moveSnake]);

  const DPadButton = ({ onClick, children, className = "" }: any) => (
    <button
      onTouchStart={(e) => { e.preventDefault(); onClick(); }}
      onClick={onClick}
      className={`select-none bg-blue-900 text-white w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg shadow-md border-b-4 border-blue-950 active:scale-95 transition-all ${className}`}
    >
      {children}
    </button>
  );

  return (
    <div className="flex flex-col items-center p-4 bg-green-50 rounded-lg shadow-inner w-full max-w-sm">
      <div className="mb-4 text-xl font-bold text-blue-900 font-pixel text-[12px]">Score: {score}</div>
      <div 
        className="relative bg-white border-4 border-blue-900 mb-8 mx-auto"
        style={{ width: GRID_SIZE * CELL_SIZE, height: GRID_SIZE * CELL_SIZE }}
      >
        {snake.map((segment, i) => (
          <div
            key={i}
            className="absolute bg-green-600 border border-white"
            style={{
              width: CELL_SIZE,
              height: CELL_SIZE,
              left: segment.x * CELL_SIZE,
              top: segment.y * CELL_SIZE,
            }}
          />
        ))}
        <div
          className="absolute bg-red-500 rounded-full"
          style={{
            width: CELL_SIZE,
            height: CELL_SIZE,
            left: food.x * CELL_SIZE,
            top: food.y * CELL_SIZE,
          }}
        />
      </div>
      
      {gameOver ? (
         <div className="text-red-600 font-pixel text-[10px] animate-pulse">GAME OVER</div>
      ) : (
        <div className="flex flex-col items-center gap-2">
          <DPadButton onClick={() => changeDir({ x: 0, y: -1 })}>↑</DPadButton>
          <div className="flex gap-2">
            <DPadButton onClick={() => changeDir({ x: -1, y: 0 })}>←</DPadButton>
            <div className="w-12 h-12 bg-gray-200 rounded-xl opacity-20"></div>
            <DPadButton onClick={() => changeDir({ x: 1, y: 0 })}>→</DPadButton>
          </div>
          <DPadButton onClick={() => changeDir({ x: 0, y: 1 })}>↓</DPadButton>
        </div>
      )}
    </div>
  );
};

export default Snake;
