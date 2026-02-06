
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GameMetadata } from '../../types';

const GRID_SIZE = 12;
const CELL_SIZE = 24;

const MazeGame: React.FC<{ game: GameMetadata }> = ({ game }) => {
  const [player, setPlayer] = useState({ x: 1, y: 1 });
  const [enemies, setEnemies] = useState([{ x: 10, y: 10 }, { x: 10, y: 1 }]);
  const [dots, setDots] = useState<any[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const mazeRef = useRef<number[][]>([
    [1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,1,0,0,0,0,0,1],
    [1,0,1,1,0,1,0,1,1,1,0,1],
    [1,0,1,0,0,0,0,0,0,1,0,1],
    [1,0,1,0,1,1,1,1,0,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,0,1,1,1,1,1,0,1],
    [1,0,0,0,0,1,0,0,0,0,0,1],
    [1,0,1,1,0,1,0,1,1,1,0,1],
    [1,0,0,1,0,0,0,1,0,0,0,1],
    [1,0,0,0,0,1,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1],
  ]);

  useEffect(() => {
    const d = [];
    for(let y=0; y<GRID_SIZE; y++) {
      for(let x=0; x<GRID_SIZE; x++) {
        if(mazeRef.current[y][x] === 0) d.push({x, y, collected: false});
      }
    }
    setDots(d);
  }, []);

  const movePlayer = (dx: number, dy: number) => {
    if (gameOver) return;
    const nx = player.x + dx;
    const ny = player.y + dy;
    if (mazeRef.current[ny][nx] === 0) {
      setPlayer({ x: nx, y: ny });
      setDots(prev => prev.map(dot => (dot.x === nx && dot.y === ny) ? {...dot, collected: true} : dot));
      if (dots.some(d => d.x === nx && d.y === ny && !d.collected)) setScore(s => s + 10);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      if (gameOver) return;
      setEnemies(prev => prev.map(e => {
        const dx = player.x > e.x ? 1 : -1;
        const dy = player.y > e.y ? 1 : -1;
        const moveX = Math.random() > 0.5;
        const nx = e.x + (moveX ? dx : 0);
        const ny = e.y + (moveX ? 0 : dy);
        if (mazeRef.current[ny]?.[nx] === 0) return {x: nx, y: ny};
        return e;
      }));
    }, 500);
    return () => clearInterval(timer);
  }, [player, gameOver]);

  useEffect(() => {
    if (enemies.some(e => e.x === player.x && e.y === player.y)) setGameOver(true);
  }, [enemies, player]);

  const ControlBtn = ({ children, onClick }: any) => (
    <button onTouchStart={onClick} className="w-12 h-12 bg-blue-900 text-white rounded-xl shadow-lg flex items-center justify-center font-bold">
      {children}
    </button>
  );

  return (
    <div className="flex flex-col items-center p-4 bg-blue-50 rounded-3xl w-full max-w-sm border-4 border-blue-200">
      <div className="mb-4 font-pixel text-[10px] text-blue-900 uppercase">Maze Master: {game.title}</div>
      <div className="mb-4 font-bold text-blue-800">Score: {score}</div>
      <div 
        className="bg-blue-900 p-1 rounded-lg grid" 
        style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)` }}
      >
        {mazeRef.current.map((row, y) => row.map((cell, x) => (
          <div key={`${x}-${y}`} className="w-6 h-6 flex items-center justify-center">
            {cell === 1 ? <div className="w-full h-full bg-blue-700 border border-blue-800 rounded-sm"></div> : (
              player.x === x && player.y === y ? <span className="text-sm">{game.icon}</span> :
              enemies.some(e => e.x === x && e.y === y) ? <span className="text-sm">👾</span> :
              dots.some(d => d.x === x && d.y === y && !d.collected) ? <div className="w-1 h-1 bg-yellow-400 rounded-full"></div> : null
            )}
          </div>
        )))}
      </div>
      <div className="mt-8 flex flex-col items-center gap-2">
        <ControlBtn onClick={() => movePlayer(0, -1)}>↑</ControlBtn>
        <div className="flex gap-2">
          <ControlBtn onClick={() => movePlayer(-1, 0)}>←</ControlBtn>
          <div className="w-12 h-12"></div>
          <ControlBtn onClick={() => movePlayer(1, 0)}>→</ControlBtn>
        </div>
        <ControlBtn onClick={() => movePlayer(0, 1)}>↓</ControlBtn>
      </div>
      {gameOver && <div className="mt-4 text-red-600 font-pixel text-xs animate-bounce">CAUGHT!</div>}
    </div>
  );
};

export default MazeGame;
