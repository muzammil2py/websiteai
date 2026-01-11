
import React, { useState, useEffect, useCallback, useRef } from 'react';

const COLS = 10;
const ROWS = 20;

const SHAPES = [
  [[1, 1, 1, 1]], // I
  [[1, 1], [1, 1]], // O
  [[0, 1, 0], [1, 1, 1]], // T
  [[1, 0, 0], [1, 1, 1]], // L
  [[0, 0, 1], [1, 1, 1]], // J
  [[1, 1, 0], [0, 1, 1]], // S
  [[0, 1, 1], [1, 1, 0]]  // Z
];

const Tetris: React.FC = () => {
  const [grid, setGrid] = useState<(number | string)[][]>(
    Array.from({ length: ROWS }, () => Array(COLS).fill(0))
  );
  const [pos, setPos] = useState({ x: 3, y: 0 });
  const [activeShape, setActiveShape] = useState(SHAPES[0]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const gameLoopRef = useRef<number>();

  const checkCollision = useCallback((p: { x: number, y: number }, shape: number[][]) => {
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x] !== 0) {
          const newX = p.x + x;
          const newY = p.y + y;
          if (newX < 0 || newX >= COLS || newY >= ROWS || (newY >= 0 && grid[newY][newX] !== 0)) {
            return true;
          }
        }
      }
    }
    return false;
  }, [grid]);

  const rotate = (shape: number[][]) => {
    return shape[0].map((_, i) => shape.map(row => row[i]).reverse());
  };

  const moveDown = useCallback(() => {
    if (gameOver) return;
    const newPos = { ...pos, y: pos.y + 1 };
    if (!checkCollision(newPos, activeShape)) {
      setPos(newPos);
    } else {
      // Place piece
      const newGrid = grid.map(row => [...row]);
      activeShape.forEach((row, y) => {
        row.forEach((value, x) => {
          if (value !== 0) {
            const finalY = pos.y + y;
            const finalX = pos.x + x;
            if (finalY >= 0) newGrid[finalY][finalX] = 'blue';
          }
        });
      });

      // Clear lines
      let cleared = 0;
      const finalGrid = newGrid.filter(row => {
        const isFull = row.every(cell => cell !== 0);
        if (isFull) cleared++;
        return !isFull;
      });
      while (finalGrid.length < ROWS) {
        finalGrid.unshift(Array(COLS).fill(0));
      }

      setScore(s => s + (cleared * 100));
      setGrid(finalGrid);
      
      const nextShape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
      setPos({ x: 3, y: 0 });
      setActiveShape(nextShape);

      if (checkCollision({ x: 3, y: 0 }, nextShape)) {
        setGameOver(true);
      }
    }
  }, [pos, activeShape, grid, checkCollision, gameOver]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (gameOver) return;
      if (e.key === 'ArrowLeft') {
        const next = { ...pos, x: pos.x - 1 };
        if (!checkCollision(next, activeShape)) setPos(next);
      } else if (e.key === 'ArrowRight') {
        const next = { ...pos, x: pos.x + 1 };
        if (!checkCollision(next, activeShape)) setPos(next);
      } else if (e.key === 'ArrowDown') {
        moveDown();
      } else if (e.key === 'ArrowUp') {
        const nextShape = rotate(activeShape);
        if (!checkCollision(pos, nextShape)) setActiveShape(nextShape);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [pos, activeShape, checkCollision, moveDown, gameOver]);

  useEffect(() => {
    const interval = setInterval(moveDown, 800);
    return () => clearInterval(interval);
  }, [moveDown]);

  const renderGrid = () => {
    const displayGrid = grid.map(row => [...row]);
    activeShape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          const drawY = pos.y + y;
          const drawX = pos.x + x;
          if (drawY >= 0 && drawY < ROWS && drawX >= 0 && drawX < COLS) {
            displayGrid[drawY][drawX] = 'green';
          }
        }
      });
    });

    return displayGrid.map((row, y) => (
      <div key={y} className="flex">
        {row.map((cell, x) => (
          <div
            key={x}
            className={`w-6 h-6 border-[0.5px] border-gray-200 ${
              cell === 'green' ? 'bg-green-500' : cell === 'blue' ? 'bg-blue-900' : 'bg-white'
            }`}
          />
        ))}
      </div>
    ));
  };

  return (
    <div className="flex flex-col items-center p-4 bg-green-50 rounded-lg shadow-inner">
      <div className="mb-4 text-xl font-bold text-blue-900">Score: {score}</div>
      <div className="border-4 border-blue-900 bg-white">
        {renderGrid()}
      </div>
      {gameOver && (
        <div className="mt-4 text-red-600 font-pixel text-xs animate-pulse">GAME OVER</div>
      )}
      <div className="mt-4 text-xs text-blue-700 italic">
        Arrows to move & rotate. Down to drop.
      </div>
    </div>
  );
};

export default Tetris;
