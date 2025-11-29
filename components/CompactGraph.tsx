import React from 'react';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, TooltipProps, CartesianGrid } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { SessionResult } from '../types';

interface CompactGraphProps {
  history: SessionResult[];
}

const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900 border border-gray-700 p-3 rounded-lg shadow-xl text-xs z-50">
        <p className="text-gray-400 mb-1 font-medium">Sesi Latihan #{label}</p>
        <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            <p className="text-white font-bold font-mono text-sm">{payload[0].value} WPM</p>
        </div>
      </div>
    );
  }
  return null;
};

export const CompactGraph: React.FC<CompactGraphProps> = ({ history }) => {
  // Take last 10 sessions so the X-axis labels aren't too crowded
  const data = history.slice(-10).map(h => ({
    id: h.id,
    wpm: h.wpm
  }));

  return (
    <div className="bg-gray-800 rounded-xl p-5 border border-gray-700 shadow-md flex-1 flex flex-col min-h-[240px] relative">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
          <TrendingUp className="w-3 h-3" /> Grafik Performa
        </h2>
        <div className="flex items-center gap-2">
            {history.length > 0 && (
            <span className="text-[10px] text-gray-400 bg-gray-900/50 border border-gray-700 px-2 py-0.5 rounded font-mono">
                Avg: <span className="text-blue-400 font-bold">{Math.round(history.reduce((a, b) => a + b.wpm, 0) / history.length)}</span> WPM
            </span>
            )}
        </div>
      </div>
      
      <div className="flex-1 w-full h-full min-h-[150px] -ml-2">
        {history.length === 0 ? (
            <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs flex-col gap-2 opacity-50">
                <TrendingUp className="w-10 h-10 stroke-1" />
                <span>Mulai mengetik untuk melihat grafik</span>
            </div>
        ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorWpm" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.4} />
                <XAxis 
                    dataKey="id" 
                    tick={{fill: '#6b7280', fontSize: 10, fontFamily: 'monospace'}}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(val) => `#${val}`}
                    dy={10}
                />
                <YAxis 
                    hide 
                    domain={['dataMin - 5', 'dataMax + 5']} 
                />
                <Tooltip 
                    content={<CustomTooltip />} 
                    cursor={{ stroke: '#4b5563', strokeWidth: 1, strokeDasharray: '4 4' }}
                />
                <Line 
                    type="monotone" 
                    dataKey="wpm" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    dot={{fill: '#1f2937', stroke: '#3b82f6', strokeWidth: 2, r: 4}}
                    activeDot={{r: 6, fill: '#60a5fa', stroke: '#fff', strokeWidth: 2}}
                    animationDuration={1000}
                />
              </LineChart>
            </ResponsiveContainer>
        )}
      </div>
      {/* Legend / Label Sesi */}
      {history.length > 0 && (
          <div className="text-center mt-1">
            <span className="text-[10px] text-gray-600 font-medium tracking-widest uppercase">Riwayat Sesi</span>
          </div>
      )}
    </div>
  );
};