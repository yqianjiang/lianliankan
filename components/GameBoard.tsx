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
  isMobile: boolean;
  onTileClick: (pos: Position) => void;
}

const GameBoard: React.FC<GameBoardProps> = ({
  grid,
  status,
  selected,
  hintedPair,
  wrongPair,
  connection,
  isMobile,
  onTileClick
}) => {
  if (status !== GameStatus.PLAYING && status !== GameStatus.PAUSED) return null;

  return (
    <>
      <div
        className="grid gap-0.5 sm:gap-2"
        style={{
          gridTemplateColumns: `repeat(${grid[0]?.length || 0}, minmax(0, 1fr))`
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
                aspect-square flex items-center justify-center rounded-md sm:rounded-xl cursor-pointer select-none transition-all duration-200 overflow-hidden size-11 md:size-14
                ${!tile ? 'opacity-0 pointer-events-none' : 'bg-white shadow-sm border border-white hover:shadow-md active:scale-90'}
                ${isSelected ? 'ring-2 sm:ring-4 ring-indigo-500 ring-offset-1 z-10 scale-110' : ''}
                ${isHinted ? 'animate-bounce ring-2 sm:ring-4 ring-yellow-400 z-10 shadow-lg' : ''}
                ${isWrong ? 'ring-2 sm:ring-4 ring-red-500 z-10 tile-wrong bg-red-50' : ''}
              `}
            >
              {tile?.type === 'emoji' ? (
                <span className="text-2xl">{tile.value}</span>
              ) : tile?.value && (
                <img src={tile.value} className="w-full h-full object-cover" />
              )}
            </div>
          );
        }))}
      </div>

      {/* Path SVG */}
      {connection && (
        <svg
          className="absolute inset-0 pointer-events-none z-20"
          viewBox={`0 0 ${grid[0].length * (isMobile ? 36 : 64)} ${grid.length * (isMobile ? 36 : 64)}`}
          style={{ width: '100%', height: '100%', transform: isMobile ? 'translate(4px, 4px)' : 'translate(8px, 8px)' }}
        >
          <path
            d={connection.points.map((p, i) => {
              const tileSize = isMobile ? 36 : 64;
              const half = tileSize / 2;
              const x = p.x * tileSize + half - (isMobile ? 4 : 8);
              const y = p.y * tileSize + half - (isMobile ? 4 : 8);
              return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
            }).join(' ')}
            fill="none"
            stroke="rgb(99, 102, 241)"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="animate-pulse"
          />
        </svg>
      )}
    </>
  );
};

export default GameBoard;