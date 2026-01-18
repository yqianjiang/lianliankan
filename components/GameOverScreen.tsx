import React from 'react';
import { Trophy, RotateCcw, ChevronRight, Medal } from 'lucide-react';
import { GameStatus, Level } from '../types';
import { LEVELS } from '../constants';

interface GameOverScreenProps {
  status: GameStatus;
  currentLevel: Level;
  score: number;
  timeLeft: number;
  levelTime: number;
  hints: number;
  shuffles: number;
  isNewRecord: boolean;
  onNextLevel: () => void;
  onRestart: () => void;
  onBackToMenu: () => void;
  formatTime: (seconds: number) => string;
}

const GameOverScreen: React.FC<GameOverScreenProps> = ({
  status,
  currentLevel,
  score,
  timeLeft,
  levelTime,
  hints,
  shuffles,
  isNewRecord,
  onNextLevel,
  onRestart,
  onBackToMenu,
  formatTime
}) => {
  if (status !== GameStatus.WON && status !== GameStatus.LOST) return null;

  const levelIdx = LEVELS.findIndex(l => l.id === currentLevel.id) + 1;
  const propsCount = hints + shuffles;
  const propsBonus = propsCount * 50;
  const timeBonus = timeLeft * 10;
  const levelReward = levelIdx * 100;
  const finalScore = score + propsBonus + timeBonus + levelReward;

  return (
    <div className="bg-white p-6 sm:p-10 rounded-4xl shadow-2xl border border-white flex flex-col items-center text-center max-w-xs w-full relative min-w-90">
      {isNewRecord && (
        <div className="absolute -top-3 -right-3 bg-yellow-400 text-yellow-900 px-3 py-1.5 rounded-xl font-black text-xs shadow-lg rotate-12 flex items-center gap-1 animate-bounce z-10">
          <Medal size={12} /> 新纪录!
        </div>
      )}

      {status === GameStatus.WON ? (
        <>
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
            <Trophy className="text-yellow-600" size={36} />
          </div>
          <h2 className="text-2xl font-black text-slate-800 mb-1">大获全胜!</h2>
          
          <div className="w-full space-y-2 mb-6 text-left px-2">
            <div className="flex justify-between items-center">
              <span className="text-slate-400 font-bold text-xs uppercase tracking-wider">本关得分</span>
              <span className="text-slate-700 font-bold text-sm">{score}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-slate-400 font-bold text-xs uppercase tracking-wider">剩余道具 ({propsCount})</span>
              <span className="text-slate-700 font-bold text-sm">+{propsBonus}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-400 font-bold text-xs uppercase tracking-wider">剩余时间 ({timeLeft}s)</span>
              <span className="text-slate-700 font-bold text-sm">+{timeBonus}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-400 font-bold text-xs uppercase tracking-wider">过关奖励</span>
              <span className="text-slate-700 font-bold text-sm">+{levelReward}</span>
            </div>

            <div className="h-px bg-slate-100 my-2" />

            <div className="flex justify-between items-center">
              <span className="text-indigo-600 font-black text-lg uppercase tracking-tight">总得分</span>
              <span className="text-indigo-600 font-black text-2xl tracking-tighter">{finalScore}</span>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mb-4">
            <RotateCcw className="text-rose-600" size={36} />
          </div>
          <h2 className="text-2xl font-black text-slate-800 mb-2">时间到了!</h2>
          <p className="text-slate-500 mb-6 font-medium italic text-xs">再试一次，禅师。</p>
        </>
      )}

      <div className="w-full flex flex-col gap-2">
        {status === GameStatus.WON && LEVELS.findIndex(l => l.id === currentLevel.id) < LEVELS.length - 1 && (
          <button
            onClick={onNextLevel}
            className="w-full py-3 bg-indigo-600 text-white rounded-xl font-black text-base shadow-lg shadow-indigo-100 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            下一关 <ChevronRight size={18} />
          </button>
        )}
        <button
          onClick={onRestart}
          className={`w-full py-3 rounded-xl font-black text-base transition-all active:scale-95 flex items-center justify-center gap-2 ${status === GameStatus.LOST ? 'bg-rose-600 text-white shadow-rose-100' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
        >
          再来一局
        </button>
        <button
          onClick={onBackToMenu}
          className="text-xs font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors mt-2"
        >
          返回主菜单
        </button>
      </div>
    </div>
  );
};

export default GameOverScreen;