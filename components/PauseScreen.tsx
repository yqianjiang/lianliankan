import React from 'react';
import { Pause } from 'lucide-react';
import { GameStatus } from '../types';

interface PauseScreenProps {
  status: GameStatus;
  onResume: () => void;
}

const PauseScreen: React.FC<PauseScreenProps> = ({ status, onResume }) => {
  if (status !== GameStatus.PAUSED) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-xl transition-all">
      <div className="flex flex-col items-center text-center">
        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-2xl mb-6 text-indigo-500 animate-pulse border border-slate-100">
          <Pause size={36} fill="currentColor" />
        </div>
        <h2 className="text-3xl font-black text-slate-800 mb-8">暂停中</h2>
        <button
          onClick={onResume}
          className="px-8 py-3 bg-indigo-600 text-white rounded-full font-black text-lg shadow-xl shadow-indigo-100 hover:scale-110 active:scale-95 transition-all"
        >
          继续挑战
        </button>
      </div>
    </div>
  );
};

export default PauseScreen;