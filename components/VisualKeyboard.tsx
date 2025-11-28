import React from 'react';
import { LetterStat } from '../types';
import { KEYBOARD_LAYOUT } from '../constants';

interface VisualKeyboardProps {
  activeChar: string;
  letterStats: Record<string, LetterStat>;
}

const getProficiencyColor = (char: string, stats: Record<string, LetterStat>): string => {
  const stat = stats[char.toLowerCase()];
  if (!stat || stat.attempts < 5) return 'bg-gray-700/50 text-gray-400 border-gray-600'; 
  
  const errorRate = stat.errors / stat.attempts;
  
  if (errorRate > 0.1) return 'bg-red-500/20 text-red-400 border-red-500/50 shadow-[0_0_10px_rgba(239,68,68,0.1)]'; 
  if (errorRate > 0.05) return 'bg-orange-500/20 text-orange-400 border-orange-500/50'; 
  return 'bg-green-500/20 text-green-400 border-green-500/50'; 
};

export const VisualKeyboard: React.FC<VisualKeyboardProps> = ({ activeChar, letterStats }) => {
  return (
    <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg w-full">
       <div className="flex justify-between items-center mb-4">
         <h3 className="text-gray-500 text-[10px] font-bold tracking-widest uppercase">Visual Map</h3>
         <div className="flex gap-3 text-[10px] font-medium">
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 bg-green-500/20 border border-green-500 rounded-full"></div> Bagus</div>
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 bg-orange-500/20 border border-orange-500 rounded-full"></div> Sedang</div>
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 bg-red-500/20 border border-red-500 rounded-full"></div> Lemah</div>
         </div>
       </div>
      <div className="flex flex-col gap-2 items-center w-full select-none">
        {KEYBOARD_LAYOUT.map((row, rowIdx) => (
          <div key={rowIdx} className="flex gap-2 w-full justify-center">
            {row.map((char) => {
              const isActive = activeChar.toLowerCase() === char;
              const colorClass = getProficiencyColor(char, letterStats);
              return (
                <div
                  key={char}
                  className={`
                    flex items-center justify-center rounded-lg font-mono font-bold border-b-4 transition-all duration-150 text-sm md:text-base
                    ${char === 'space' ? 'flex-1 max-w-xs' : 'w-full max-w-[3.5rem] h-12 md:h-14 aspect-square'}
                    ${isActive ? 'transform translate-y-1 border-b-0 brightness-125 ring-2 ring-blue-400 bg-gray-600' : ''}
                    ${colorClass}
                  `}
                >
                  {char.toUpperCase()}
                </div>
              );
            })}
          </div>
        ))}
         <div className="flex gap-2 w-full justify-center mt-1">
             <div className={`
                w-1/2 h-12 rounded-lg border-b-4 flex items-center justify-center text-xs font-bold text-gray-400 transition-all duration-150
                ${activeChar === ' ' ? 'transform translate-y-1 border-b-0 brightness-125 ring-2 ring-blue-400 bg-gray-600' : 'bg-gray-700 border-gray-900'}
             `}>
                 SPACE
             </div>
         </div>
      </div>
    </div>
  );
};