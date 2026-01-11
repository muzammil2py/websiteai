
import React, { useState, useEffect, useCallback, useRef } from 'react';

const GRID_SIZE = 15;
const CELL_SIZE = 20;

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

    // Self collision
    if (snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
      setGameOver(true);
      return;
    }

    const newSnake = [newHead, ...snake];
    lastDir.current = dir;

    // Eat food
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

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' && lastDir.current.y !== 1) setDir({ x: 0, y: -1 });
      else if (e.key === 'ArrowDown' && lastDir.current.y !== -1) setDir({ x: 0, y: 1 });
      else if (e.key === 'ArrowLeft' && lastDir.current.x !== 1) setDir({ x: -1, y: 0 });
      else if (e.key === 'ArrowRight' && lastDir.current.x !== -1) setDir({ x: 1, y: 0 });
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  useEffect(() => {
    const interval = setInterval(moveSnake, 200);
    return () => clearInterval(interval);
  }, [moveSnake]);

  return (
    <div className="flex flex-col items-center p-4 bg-green-50 rounded-lg shadow-inner">
      <div className="mb-4 text-xl font-bold text-blue-900">Score: {score}</div>
      <div 
        className="relative bg-white border-4 border-blue-900"
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
      {gameOver && <div className="mt-4 text-red-600 font-pixel text-xs">GAME OVER</div>}
    </div>
  );
};

export default Snake;
