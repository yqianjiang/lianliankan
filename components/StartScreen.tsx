import React from 'react';
import { Activity, Medal } from 'lucide-react';
import { Theme, Level, GameStats } from '../types';
import { THEMES, LEVELS } from '../constants';

interface StartScreenProps {
  theme: Theme;
  stats: GameStats;
  onThemeSelect: (theme: Theme) => void;
  onLevelSelect: (level: Level) => void;
  formatTime: (seconds: number) => string;
}

const StartScreen: React.FC<StartScreenProps> = ({
  theme,
  stats,
  onThemeSelect,
  onLevelSelect,
  formatTime
}) => {
  return (
    <div className="bg-white/95 backdrop-blur-xl p-6 sm:p-8 rounded-[2.5rem] shadow-2xl border border-white flex flex-col items-center text-center max-w-lg w-full overflow-y-auto max-h-full no-scrollbar z-50">
      <div className="flex items-center gap-3 mb-2">
        <div className="text-3xl sm:text-4xl font-black text-slate-800 tracking-tight">连连看</div>
        <div className="bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full text-xs font-black flex items-center gap-1">
          <Activity size={10} />
          已玩 {stats.totalGames} 局
        </div>
      </div>

      <div className="w-full space-y-6">
        <section className="text-left">
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-indigo-500 text-[10px] flex items-center justify-center text-white">1</span>
            选择主题
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {THEMES.map(t => (
              <button
                key={t.id}
                onClick={() => onThemeSelect(t)}
                className={`p-2 rounded-xl border-2 transition-all flex flex-col items-center ${theme.id === t.id ? 'border-indigo-500 bg-indigo-50' : 'border-slate-100 bg-white hover:border-indigo-200'}`}
              >
                <span className="text-xl mb-1">{t.type === 'emoji' ? t.items[0] : <img src={t.items[0]} className="w-6 h-6 rounded-lg object-cover" />}</span>
                <span className="text-[10px] font-bold text-slate-600 truncate w-full text-center">{t.name}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="text-left pb-4">
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
             <span className="w-4 h-4 rounded-full bg-indigo-500 text-[10px] flex items-center justify-center text-white">2</span>
             选择关卡
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {LEVELS.map(l => {
              const bestScore = stats.highScores[l.id];
              return (
                <button
                  key={l.id}
                  onClick={() => onLevelSelect(l)}
                  className="p-3 bg-slate-50/50 border border-slate-100 rounded-xl text-left hover:border-indigo-400 hover:bg-white hover:shadow-lg transition-all active:scale-95 group relative overflow-hidden"
                >
                  <div className="flex justify-between items-start">
                    <div className="font-black text-slate-800 text-sm group-hover:text-indigo-600">{l.name}</div>
                    {bestScore !== undefined && <Medal size={14} className="text-yellow-500" />}
                  </div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{l.cols}x{l.rows}</div>
                  {bestScore !== undefined && (
                    <div className="mt-1 text-[10px] font-black text-indigo-500 bg-indigo-50 inline-block px-1.5 py-0.5 rounded">
                      最高分: {bestScore}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};

export default StartScreen;