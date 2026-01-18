import React from 'react';
import { TileData, Position, ConnectionPath, GameStatus } from '../types';
import { isSamePosition } from '../services/gameLogic';
import { TILE_COLORS } from '../constants';

interface GameBoardProps {
  grid: (TileData | null)[][];
  status: GameStatus;
  selected: Position | null;
  hintedPair: [Position, Position] | null;
  wrongPair: [Position, Position] | null;
  connection: ConnectionPath | null;
  comboCount: number;
  onTileClick: (pos: Position) => void;
}

const GameBoard: React.FC<GameBoardProps> = ({
  grid,
  status,
  selected,
  hintedPair,
  wrongPair,
  connection,
  comboCount,
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
          
          const baseBg = tile?.type === 'emoji' ? (TILE_COLORS[tile.value] || 'bg-white') : 'bg-transparent';
          const tileBg = isWrong ? 'bg-red-50' : baseBg;

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
                ${!tile ? '' : `${tileBg} shadow-sm border border-white/50 hover:shadow-md active:scale-90`}
                ${isSelected ? 'ring-2 sm:ring-4 ring-indigo-500 ring-offset-1 z-10 scale-110 shadow-lg' : ''}
                ${isHinted ? 'animate-bounce ring-2 sm:ring-4 ring-yellow-400 z-10 shadow-lg' : ''}
                ${isWrong ? 'ring-2 sm:ring-4 ring-red-500 z-10 tile-wrong' : ''}
              `}>
                {tile?.type === 'emoji' ? (
                  <span className="text-xl sm:text-2xl drop-shadow-sm">{tile.value}</span>
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
            stroke={comboCount > 1 ? "#f59e0b" : "rgb(99, 102, 241)"}
            strokeWidth={comboCount > 1 ? "0.2" : "0.12"}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={comboCount > 1 ? "animate-rainbow" : "animate-pulse"}
          />
        </svg>
      )}

      {/* Combo Indicator */}
      {comboCount > 1 && (
        <div 
          key={comboCount}
          className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none select-none"
        >
          <div className="animate-combo flex flex-col items-center">
             <span className="text-4xl sm:text-6xl font-black text-indigo-600/90 drop-shadow-[0_2px_2px_rgba(255,255,255,0.8)] italic">
               COMBO
             </span>
             <span className="text-5xl sm:text-7xl font-black text-orange-500 drop-shadow-[0_2px_2px_rgba(255,255,255,0.8)] -mt-3">
               x{comboCount}
             </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameBoard;