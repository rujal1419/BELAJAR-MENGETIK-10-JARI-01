import React from 'react';
import { Zap, ArrowDown, MessageSquareMore, Star } from 'lucide-react';
import { UserState } from '../types';
import { LEVEL_CONFIG } from '../constants';

interface TopBarProps {
  state: UserState;
  sessionStats: { wpm: number, accuracy: number };
  onOpenAI: () => void;
  notification: string | null;
}

export const TopBar: React.FC<TopBarProps> = ({ state, sessionStats, onOpenAI, notification }) => {
  const lastHistoryItem = state.history.length > 0 ? state.history[state.history.length - 1] : null;
  const isDropping = lastHistoryItem ? sessionStats.accuracy < lastHistoryItem.accuracy : false;

  return (
    <div className="bg-gray-900 border-b border-gray-800 p-4 flex items-center justify-between sticky top-0 z-40 h-16 shadow-md backdrop-blur-md bg-opacity-90">
      {/* Left: Logo */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 group cursor-default">
           <div className="bg-blue-600 p-1.5 rounded-lg group-hover:bg-blue-500 transition-colors">
             <Zap className="w-5 h-5 text-white" fill="currentColor" />
           </div>
           <h1 className="text-lg font-bold text-white tracking-tight hidden sm:block">Guru Ketik <span className="text-blue-500 text-xs font-mono ml-1 px-1.5 py-0.5 bg-blue-500/10 rounded">v2.1</span></h1>
        </div>
      </div>

      {/* Center: Real-time Stats */}
      <div className="absolute left-1/2 -translate-x-1/2 flex gap-8 md:gap-16">
           <div className="text-center">
               <div className="text-[10px] text-gray-500 font-bold tracking-widest uppercase mb-0.5">WPM</div>
               <div className="text-2xl md:text-3xl font-mono font-bold text-blue-400 leading-none drop-shadow-[0_0_8px_rgba(96,165,250,0.3)]">{sessionStats.wpm}</div>
           </div>
           <div className="text-center">
               <div className="text-[10px] text-gray-500 font-bold tracking-widest uppercase flex items-center justify-center gap-1 mb-0.5">
                   AKURASI
                   {isDropping && (
                       <span 
                        className="flex items-center text-red-500 ml-1 animate-pulse" 
                        title={`Turun dari ${lastHistoryItem?.accuracy}% sesi lalu`}
                       >
                           <ArrowDown className="w-3 h-3" />
                       </span>
                   )}
               </div>
               <div className={`text-2xl md:text-3xl font-mono font-bold leading-none ${sessionStats.accuracy >= 95 ? 'text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.3)]' : 'text-yellow-400'}`}>
                   {sessionStats.accuracy}%
               </div>
           </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
          <div className="hidden md:flex flex-col items-end mr-2">
               <div className="px-3 py-1 rounded-full bg-gray-800 border border-gray-700 text-xs text-blue-300 font-bold font-mono">
                  {LEVEL_CONFIG[state.level]?.label.split(':')[0] || state.level}
               </div>
               <div className="text-[10px] text-gray-500 mt-0.5">
                  Target: {LEVEL_CONFIG[state.level]?.minWpm} WPM
               </div>
          </div>
          
          <div className="relative">
            {/* Notification Popover */}
            {notification && (
                <div className="absolute top-12 right-0 w-72 z-50 animate-fade-in origin-top-right">
                    <div className="bg-indigo-600 text-white p-4 rounded-xl shadow-2xl relative border border-indigo-400">
                        {/* Triangle arrow pointing up - aligned right to point to button */}
                        <div className="absolute -top-2 right-5 w-4 h-4 bg-indigo-600 rotate-45 border-l border-t border-indigo-400"></div>
                        
                        <div className="flex items-start gap-3 relative z-10">
                            <div className="bg-white/20 p-1.5 rounded-full shrink-0 mt-0.5">
                                <Star className="w-4 h-4 text-yellow-300 fill-yellow-300 animate-spin-slow" />
                            </div>
                            <div className="text-sm font-medium leading-relaxed">
                                {notification}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <button 
                onClick={onOpenAI}
                className={`relative flex items-center justify-center bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white w-9 h-9 md:w-auto md:h-auto md:px-3 md:py-1.5 rounded-full text-xs font-bold transition-all shadow-lg shadow-indigo-500/20 active:scale-95 border border-white/10 ${notification ? 'ring-2 ring-indigo-400 ring-offset-2 ring-offset-gray-900 animate-bounce' : ''}`}
                title="Analisis AI Gemini"
            >
                <MessageSquareMore className="w-4 h-4" />
                <span className="hidden md:inline ml-2">Analisis</span>
            </button>
          </div>
      </div>
    </div>
  );
};