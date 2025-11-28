import React from 'react';
import { BarChart, Bar, ResponsiveContainer, XAxis, Tooltip, TooltipProps } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { SessionResult } from '../types';

interface CompactGraphProps {
  history: SessionResult[];
}

const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900 border border-gray-700 p-2 rounded shadow-xl text-xs">
        <p className="text-gray-400 mb-1">Sesi #{label}</p>
        <p className="text-blue-400 font-bold font-mono">{payload[0].value} WPM</p>
      </div>
    );
  }
  return null;
};

export const CompactGraph: React.FC<CompactGraphProps> = ({ history }) => {
  // Take last 15 sessions for clarity
  const data = history.slice(-15).map(h => ({
    id: h.id,
    wpm: h.wpm
  }));

  return (
    <div className="bg-gray-800 rounded-xl p-5 border border-gray-700 shadow-md flex-1 flex flex-col min-h-[200px]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
          <TrendingUp className="w-3 h-3" /> Grafik Performa
        </h2>
        {history.length > 0 && (
           <span className="text-[10px] text-gray-500 bg-gray-900 px-2 py-0.5 rounded">Avg: {Math.round(history.reduce((a, b) => a + b.wpm, 0) / history.length)} WPM</span>
        )}
      </div>
      
      <div className="flex-1 w-full h-full min-h-[120px]">
        {history.length === 0 ? (
            <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs flex-col gap-2">
                <TrendingUp className="w-8 h-8 opacity-20" />
                <span>Belum ada data latihan</span>
            </div>
        ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <XAxis 
                    dataKey="id" 
                    hide 
                />
                <Tooltip 
                    content={<CustomTooltip />} 
                    cursor={{fill: 'rgba(255,255,255,0.05)'}} 
                />
                <Bar 
                    dataKey="wpm" 
                    fill="#3b82f6" 
                    radius={[4, 4, 0, 0]} 
                    animationDuration={500}
                />
              </BarChart>
            </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};