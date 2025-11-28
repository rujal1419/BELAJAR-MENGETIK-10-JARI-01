import React from 'react';
import { Zap, ArrowUp, ArrowDown, MessageSquareMore } from 'lucide-react';
import { UserState } from '../types';

interface TopBarProps {
  state: UserState;
  sessionStats: { wpm: number, accuracy: number };
  onOpenAI: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ state, sessionStats, onOpenAI }) => {
  const lastHistoryItem = state.history.length > 0 ? state.history[state.history.length - 1] : null;
  
  // Logic: Is current session better than the VERY LAST session recorded?
  // If no history, assume neutral/good.
  const isAccuracyBetter = lastHistoryItem ? sessionStats.accuracy >= lastHistoryItem.accuracy : true;
  const showTrend = state.history.length > 0;

  return (
    <div className="bg-gray-900 border-b border-gray-800 p-4 flex items-center justify-between sticky top-0 z-40 h-16 shadow-md backdrop-blur-md bg-opacity-90">
      {/* Left: Logo */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 group cursor-default">
           <div className="bg-blue-600 p-1.5 rounded-lg group-hover:bg-blue-500 transition-colors">
             <Zap className="w-5 h-5 text-white" fill="currentColor" />
           </div>
           <h1 className="text-lg font-bold text-white tracking-tight hidden sm:block">Guru Ketik <span className="text-blue-500 text-xs font-mono ml-1 px-1.5 py-0.5 bg-blue-500/10 rounded">v2.0</span></h1>
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
                   {showTrend && (
                       <span 
                        className={`flex items-center ${isAccuracyBetter ? 'text-green-500' : 'text-red-500'}`} 
                        title={isAccuracyBetter ? 'Akurasi meningkat/sama dibanding sesi lalu' : 'Akurasi menurun dibanding sesi lalu'}
                       >
                           {isAccuracyBetter ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                       </span>
                   )}
               </div>
               <div className={`text-2xl md:text-3xl font-mono font-bold leading-none ${sessionStats.accuracy > 95 ? 'text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.3)]' : 'text-yellow-400'}`}>
                   {sessionStats.accuracy}%
               </div>
           </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
          <div className="hidden md:block px-3 py-1 rounded-full bg-gray-800 border border-gray-700 text-xs text-gray-300 font-medium font-mono">
              {state.level}
          </div>
          
          <button 
            onClick={onOpenAI}
            className="relative flex items-center justify-center bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white w-9 h-9 md:w-auto md:h-auto md:px-3 md:py-1.5 rounded-full text-xs font-bold transition-all shadow-lg shadow-indigo-500/20 active:scale-95 border border-white/10"
            title="Analisis AI Gemini"
          >
              <MessageSquareMore className="w-4 h-4" />
              <span className="hidden md:inline ml-2">Analisis</span>
              {/* Notification dot to encourage usage */}
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
              </span>
          </button>
      </div>
    </div>
  );
};