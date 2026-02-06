
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

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];

const Tetris: React.FC = () => {
  const [grid, setGrid] = useState<(number | string)[][]>(
    Array.from({ length: ROWS }, () => Array(COLS).fill(0))
  );
  const [pos, setPos] = useState({ x: 3, y: 0 });
  const [activeShape, setActiveShape] = useState(SHAPES[0]);
  const [activeColor, setActiveColor] = useState(COLORS[0]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  
  const posRef = useRef(pos);
  const shapeRef = useRef(activeShape);
  const gridRef = useRef(grid);
  const gameOverRef = useRef(gameOver);

  useEffect(() => { posRef.current = pos; }, [pos]);
  useEffect(() => { shapeRef.current = activeShape; }, [activeShape]);
  useEffect(() => { gridRef.current = grid; }, [grid]);
  useEffect(() => { gameOverRef.current = gameOver; }, [gameOver]);

  const checkCollision = (p: { x: number, y: number }, shape: number[][]) => {
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x] !== 0) {
          const newX = p.x + x;
          const newY = p.y + y;
          if (newX < 0 || newX >= COLS || newY >= ROWS) return true;
          if (newY >= 0 && gridRef.current[newY][newX] !== 0) return true;
        }
      }
    }
    return false;
  };

  const rotate = (shape: number[][]) => {
    return shape[0].map((_, i) => shape.map(row => row[i]).reverse());
  };

  const moveDown = useCallback(() => {
    if (gameOverRef.current) return;
    const newPos = { ...posRef.current, y: posRef.current.y + 1 };
    if (!checkCollision(newPos, shapeRef.current)) {
      setPos(newPos);
    } else {
      const newGrid = gridRef.current.map(row => [...row]);
      shapeRef.current.forEach((row, y) => {
        row.forEach((value, x) => {
          if (value !== 0) {
            const finalY = posRef.current.y + y;
            const finalX = posRef.current.x + x;
            if (finalY >= 0) newGrid[finalY][finalX] = activeColor;
          }
        });
      });

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
      
      const nextIdx = Math.floor(Math.random() * SHAPES.length);
      const nextShape = SHAPES[nextIdx];
      setActiveColor(COLORS[nextIdx]);
      setPos({ x: 3, y: 0 });
      setActiveShape(nextShape);

      if (checkCollision({ x: 3, y: 0 }, nextShape)) {
        setGameOver(true);
      }
    }
  }, [activeColor]);

  const moveLeft = () => {
    const next = { ...posRef.current, x: posRef.current.x - 1 };
    if (!checkCollision(next, shapeRef.current)) setPos(next);
  };

  const moveRight = () => {
    const next = { ...posRef.current, x: posRef.current.x + 1 };
    if (!checkCollision(next, shapeRef.current)) setPos(next);
  };

  const handleRotate = () => {
    const nextShape = rotate(shapeRef.current);
    if (!checkCollision(posRef.current, nextShape)) setActiveShape(nextShape);
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (gameOverRef.current) return;
      if (e.key === 'ArrowLeft') moveLeft();
      else if (e.key === 'ArrowRight') moveRight();
      else if (e.key === 'ArrowDown') moveDown();
      else if (e.key === 'ArrowUp') handleRotate();
    };
    window.addEventListener('keydown', handleKey);
    const interval = setInterval(moveDown, 800);
    return () => {
      window.removeEventListener('keydown', handleKey);
      clearInterval(interval);
    };
  }, [moveDown]);

  const renderGrid = () => {
    const displayGrid = grid.map(row => [...row]);
    activeShape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          const drawY = pos.y + y;
          const drawX = pos.x + x;
          if (drawY >= 0 && drawY < ROWS && drawX >= 0 && drawX < COLS) {
            displayGrid[drawY][drawX] = activeColor;
          }
        }
      });
    });

    return displayGrid.map((row, y) => (
      <div key={y} className="flex">
        {row.map((cell, x) => (
          <div
            key={x}
            className="w-5 h-5 md:w-6 md:h-6 border-[0.1px] border-gray-100"
            style={{ backgroundColor: cell === 0 ? '#fff' : (cell as string) }}
          />
        ))}
      </div>
    ));
  };

  const ControlButton = ({ onClick, children, className = "" }: any) => (
    <button
      onTouchStart={(e) => { e.preventDefault(); onClick(); }}
      onClick={onClick}
      className={`select-none active:scale-95 bg-blue-900 text-white w-14 h-14 rounded-full flex items-center justify-center font-bold text-xl shadow-lg border-b-4 border-blue-950 transition-all ${className}`}
    >
      {children}
    </button>
  );

  return (
    <div className="flex flex-col items-center p-2 bg-gray-50 rounded-lg shadow-inner w-full max-w-sm">
      <div className="mb-4 text-xl font-bold text-blue-900 font-pixel text-[12px]">Score: {score}</div>
      <div className="border-4 border-blue-900 bg-white shadow-xl mb-6">
        {renderGrid()}
      </div>
      
      {gameOver ? (
        <div className="mb-6 text-red-600 font-pixel text-[10px] animate-pulse">GAME OVER</div>
      ) : (
        <div className="flex flex-col gap-4 w-full items-center">
           <div className="flex gap-8">
            <ControlButton onClick={handleRotate}>↻</ControlButton>
          </div>
          <div className="flex gap-4">
            <ControlButton onClick={moveLeft}>←</ControlButton>
            <ControlButton onClick={moveDown}>↓</ControlButton>
            <ControlButton onClick={moveRight}>→</ControlButton>
          </div>
        </div>
      )}
      <div className="mt-4 text-[9px] text-blue-400 uppercase font-bold tracking-widest hidden md:block">
        ARROWS: Move & Rotate
      </div>
    </div>
  );
};

export default Tetris;
