import React from 'react';
import { TileData, Position, ConnectionPath, GameStatus } from '../types';
import { isSamePosition } from '../services/gameLogic';

interface GameBoardProps {
  grid: (TileData | null)[][];
  status: GameStatus;
  selected: Position | null;
  hintedPair: [Position, Position] | null;
  wrongPair: [Position, Position] | null;
  connection: ConnectionPath | null;
  onTileClick: (pos: Position) => void;
}

const GameBoard: React.FC<GameBoardProps> = ({
  grid,
  status,
  selected,
  hintedPair,
  wrongPair,
  connection,
  onTileClick
}) => {
  if (status !== GameStatus.PLAYING && status !== GameStatus.PAUSED) return null;

  const cols = grid[0]?.length || 0;
  const rows = grid.length;

  return (
    <div 
      className="relative w-full max-w-[min(95vw,600px)] mx-auto"
      style={{ aspectRatio: `${cols}/${rows}` }}
    >
      <div
        className="grid w-full h-full gap-0"
        style={{
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`
        }}
      >
        {grid.map((row, y) => row.map((tile, x) => {
          const isSelected = selected && isSamePosition(selected, {x, y});
          const isHinted = hintedPair && (isSamePosition(hintedPair[0], {x, y}) || isSamePosition(hintedPair[1], {x, y}));
          const isWrong = wrongPair && (isSamePosition(wrongPair[0], {x, y}) || isSamePosition(wrongPair[1], {x, y}));

          return (
            <div
              key={tile?.id || `empty-${x}-${y}`}
              onClick={() => onTileClick({x, y})}
              className={`
                aspect-square p-0.5 sm:p-1 cursor-pointer select-none transition-all duration-200
                ${!tile ? 'opacity-0 pointer-events-none' : ''}
              `}
            >
              <div className={`
                w-full h-full flex items-center justify-center rounded-md sm:rounded-xl overflow-hidden
                ${!tile ? '' : 'bg-white shadow-sm border border-white hover:shadow-md active:scale-90'}
                ${isSelected ? 'ring-2 sm:ring-4 ring-indigo-500 ring-offset-1 z-10 scale-110' : ''}
                ${isHinted ? 'animate-bounce ring-2 sm:ring-4 ring-yellow-400 z-10 shadow-lg' : ''}
                ${isWrong ? 'ring-2 sm:ring-4 ring-red-500 z-10 tile-wrong bg-red-50' : ''}
              `}>
                {tile?.type === 'emoji' ? (
                  <span className="text-xl sm:text-2xl">{tile.value}</span>
                ) : tile?.value && (
                  <img src={tile.value} className="w-full h-full object-cover" />
                )}
              </div>
            </div>
          );
        }))}
      </div>

      {/* Path SVG */}
      {connection && (
        <svg
          className="absolute inset-0 pointer-events-none z-20"
          viewBox={`0 0 ${cols} ${rows}`}
          style={{ width: '100%', height: '100%' }}
          preserveAspectRatio="none"
        >
          <path
            d={connection.points.map((p, i) => {
              const x = p.x + 0.5;
              const y = p.y + 0.5;
              return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
            }).join(' ')}
            fill="none"
            stroke="rgb(99, 102, 241)"
            strokeWidth="0.12"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="animate-pulse"
          />
        </svg>
      )}
    </div>
  );
};

export default GameBoard;