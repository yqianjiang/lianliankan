import React from 'react';
import { Play, Pause, Home } from 'lucide-react';
import { GameStatus, Level } from '../types';

interface HeaderProps {
  status: GameStatus;
  score: number;
  timeLeft: number;
  currentLevel: Level;
  onPauseToggle: () => void;
  onSettings: () => void;
  formatTime: (seconds: number) => string;
}

const Header: React.FC<HeaderProps> = ({
  status,
  score,
  timeLeft,
  currentLevel,
  onPauseToggle,
  onSettings,
  formatTime
}) => {
  if (status === GameStatus.IDLE) return null;

  return (
    <div className="w-full max-w-2xl h-20 shrink-0 flex items-center mb-2">
      <div className="w-full flex justify-between items-center bg-white/80 backdrop-blur-md p-3 sm:p-4 rounded-2xl shadow-sm border border-white/50 animate-in fade-in duration-300">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">得分</span>
          <span className="text-xl sm:text-2xl font-black text-slate-800 leading-none">{score}</span>
          <span className="text-[8px] font-medium text-slate-500">{currentLevel.difficulty}</span>
        </div>

        <div className="flex flex-col items-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">时间</span>
          <div className={`flex items-center gap-1 text-xl sm:text-2xl font-black leading-none ${timeLeft < 20 ? 'text-rose-500 animate-pulse' : 'text-slate-800'}`}>
            {formatTime(timeLeft)}
          </div>
        </div>

        <div className="flex gap-2">
          {(status === GameStatus.PLAYING || status === GameStatus.PAUSED) && (
            <button onClick={onPauseToggle} className="p-2 sm:p-3 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all active:scale-95 text-slate-600">
              {status === GameStatus.PAUSED ? <Play size={20} /> : <Pause size={20} />}
            </button>
          )}
          <button onClick={onSettings} className="p-2 sm:p-3 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all active:scale-95 text-slate-600">
            <Home size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;