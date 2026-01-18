import React from 'react';
import { Lightbulb, Shuffle } from 'lucide-react';
import { GameStatus } from '../types';

interface FooterProps {
  status: GameStatus;
  hints: number;
  shuffles: number;
  onHint: () => void;
  onShuffle: (isAuto?: boolean) => void;
}

const Footer: React.FC<FooterProps> = ({
  status,
  hints,
  shuffles,
  onHint,
  onShuffle
}) => {
  if (status !== GameStatus.PLAYING && status !== GameStatus.PAUSED) return null;

  return (
    <div className="w-full max-w-2xl shrink-0 grid grid-cols-2 gap-3 mb-2 px-2">
      <button
        onClick={onHint}
        disabled={hints === 0}
        className="flex items-center justify-center gap-2 p-3 bg-white rounded-xl shadow-sm border border-white hover:bg-slate-50 transition-all active:scale-95 disabled:opacity-50"
      >
        <div className="relative">
          <Lightbulb className="text-yellow-500" size={20} />
          {hints > 0 && <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-yellow-500 text-white text-[8px] font-black rounded-full flex items-center justify-center">{hints}</span>}
        </div>
        <div className="text-left">
          <div className="text-[10px] font-black text-slate-800">提示</div>
        </div>
      </button>

      <button
        onClick={() => onShuffle(false)}
        disabled={shuffles === 0}
        className="flex items-center justify-center gap-2 p-3 bg-white rounded-xl shadow-sm border border-white hover:bg-slate-50 transition-all active:scale-95 disabled:opacity-50"
      >
        <div className="relative">
          <Shuffle className="text-indigo-500" size={20} />
          {shuffles > 0 && <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-indigo-500 text-white text-[8px] font-black rounded-full flex items-center justify-center">{shuffles}</span>}
        </div>
        <div className="text-left">
          <div className="text-[10px] font-black text-slate-800">重排</div>
        </div>
      </button>
    </div>
  );
};

export default Footer;