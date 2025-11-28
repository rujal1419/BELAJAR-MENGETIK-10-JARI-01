import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Award, 
  Settings, 
  RotateCcw,
  RefreshCw,
  ArrowDown
} from 'lucide-react';

import { UserState, Level } from './types';
import { INITIAL_STATE, LEVELS } from './constants';
import { TopBar } from './components/TopBar';
import { VisualKeyboard } from './components/VisualKeyboard';
import { CompactGraph } from './components/CompactGraph';
import { AIAnalysisModal, ResetConfirmationModal } from './components/Modals';

const App = () => {
  const [userState, setUserState] = useState<UserState>(INITIAL_STATE);
  const [currentText, setCurrentText] = useState("");
  const [userInput, setUserInput] = useState("");
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
  const [lastWpm, setLastWpm] = useState<number | null>(null);
  const [sessionStats, setSessionStats] = useState({ wpm: 0, accuracy: 100 });
  const [showSettings, setShowSettings] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  // Load from LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem('geminiTypingTutor_v2');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setUserState({ ...INITIAL_STATE, ...parsed });
      } catch (e) {
        console.error("Failed to load save", e);
      }
    }
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem('geminiTypingTutor_v2', JSON.stringify(userState));
  }, [userState]);

  const generateText = () => {
    const texts = LEVELS[userState.level];
    const randomIndex = Math.floor(Math.random() * texts.length);
    setCurrentText(texts[randomIndex]);
    setUserInput("");
    setIsSessionActive(false);
    setSessionStats({ wpm: 0, accuracy: 100 });
  };

  useEffect(() => { 
    if (!currentText) generateText(); 
  }, [userState.level]);

  // WPM Timer
  useEffect(() => {
      let interval: any;
      if (isSessionActive && sessionStartTime) {
          interval = setInterval(() => {
            const timeElapsed = (Date.now() - sessionStartTime) / 1000 / 60;
            if (timeElapsed > 0) {
               const words = userInput.length / 5;
               setSessionStats(prev => ({ ...prev, wpm: Math.round(words / timeElapsed) }));
            }
          }, 500);
      }
      return () => clearInterval(interval);
  }, [isSessionActive, sessionStartTime, userInput]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    
    if (!isSessionActive && val.length === 1) { 
        setIsSessionActive(true); 
        setSessionStartTime(Date.now()); 
    }
    
    if (val.length > userInput.length) {
        const charTyped = val.slice(-1);
        const targetChar = currentText[val.length - 1];
        const isError = charTyped !== targetChar;
        
        setUserState(prev => {
            const key = targetChar.toLowerCase();
            const currentStat = prev.letterStats[key] || { attempts: 0, errors: 0 };
            return { 
                ...prev, 
                letterStats: { 
                    ...prev.letterStats, 
                    [key]: { 
                        attempts: currentStat.attempts + 1, 
                        errors: currentStat.errors + (isError ? 1 : 0) 
                    } 
                } 
            };
        });
    }
    setUserInput(val);
    
    let errors = 0;
    for (let i = 0; i < val.length; i++) { if (val[i] !== currentText[i]) errors++; }
    const accuracy = Math.max(0, Math.round(((val.length - errors) / val.length) * 100));
    setSessionStats(prev => ({ ...prev, accuracy: isNaN(accuracy) ? 100 : accuracy }));

    if (val.length === currentText.length) {
        finishSession(val, errors);
    }
  };

  const finishSession = (finalInput: string, errors: number) => {
    setIsSessionActive(false);
    const endTime = Date.now();
    const durationSeconds = (endTime - (sessionStartTime || endTime)) / 1000;
    const words = finalInput.length / 5;
    const minutes = durationSeconds / 60;
    const finalWpm = Math.round(words / minutes) || 0;
    const finalAccuracy = Math.max(0, Math.round(((finalInput.length - errors) / finalInput.length) * 100));

    setLastWpm(finalWpm);
    setUserState(prev => ({
        ...prev,
        history: [...prev.history, { 
            id: prev.totalSessions + 1, 
            wpm: finalWpm, 
            accuracy: finalAccuracy, 
            date: new Date().toISOString() 
        }],
        totalSessions: prev.totalSessions + 1,
        timeRemaining: Math.max(0, prev.timeRemaining - Math.round(durationSeconds))
    }));
    
    setTimeout(() => { 
        generateText(); 
        setLastWpm(null);
    }, 2000);
  };

  const changeLevel = (lvl: Level) => {
      setUserState(prev => ({ ...prev, level: lvl }));
      setUserInput("");
      setSessionStats({ wpm: 0, accuracy: 100 });
  }

  const changeDuration = (minutes: number) => {
      setUserState(prev => ({ 
          ...prev, 
          targetDuration: minutes * 60, 
          timeRemaining: minutes * 60 
      }));
      setShowSettings(false);
  };

  const performReset = () => {
      setUserState(INITIAL_STATE);
      setShowResetModal(false);
      generateText();
  }

  const skipText = () => {
      generateText();
  }

  const targetChar = currentText[userInput.length] || '';

  return (
    <div className="min-h-screen bg-gray-950 text-gray-200 font-sans flex flex-col">
      <TopBar state={userState} sessionStats={sessionStats} onOpenAI={() => setShowAI(true)} />
      
      <AIAnalysisModal isOpen={showAI} onClose={() => setShowAI(false)} state={userState} />
      <ResetConfirmationModal isOpen={showResetModal} onClose={() => setShowResetModal(false)} onConfirm={performReset} />

      <main className="flex-1 max-w-7xl mx-auto p-4 md:p-8 flex flex-col lg:flex-row gap-8 w-full justify-center">
        
        {/* LEFT COLUMN: Learning Area (Restricted width to match keyboard visually) */}
        <div className="flex-1 flex flex-col gap-6 max-w-3xl w-full">
            {/* Typing Display */}
            <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 shadow-xl relative overflow-hidden min-h-[200px] flex items-center justify-center w-full group transition-colors hover:border-gray-600">
                
                {/* Completion Overlay */}
                {lastWpm !== null && !isSessionActive && userInput.length === currentText.length && (
                    <div className="absolute inset-0 bg-gray-900/90 backdrop-blur-md flex flex-col items-center justify-center z-20 animate-fade-in">
                        <div className="text-5xl font-bold text-white mb-2 tracking-tighter drop-shadow-lg">{lastWpm} <span className="text-xl text-gray-400 font-medium">WPM</span></div>
                        <div className="text-green-400 text-lg font-bold mb-6 flex items-center gap-2">
                             <Award className="w-5 h-5" /> Sesi Selesai!
                        </div>
                        <div className="text-gray-500 text-sm animate-pulse">Menyiapkan teks berikutnya...</div>
                    </div>
                )}
                
                {/* Text Display */}
                <div className="w-full text-center relative z-10 px-4">
                     <div className="font-mono text-xl md:text-2xl leading-relaxed text-gray-600 break-words tracking-wide">
                        {currentText.split('').map((char, idx) => {
                            let color = "text-gray-600";
                            let bg = "";
                            
                            if (idx < userInput.length) {
                                color = userInput[idx] === char ? "text-gray-100" : "text-red-400";
                                if (userInput[idx] !== char) bg = "bg-red-500/10 rounded";
                            }
                            if (idx === userInput.length) {
                                return (
                                    <span key={idx} className="relative">
                                        <span className="absolute -inset-1 bg-blue-500/20 rounded animate-pulse"></span>
                                        <span className="border-b-2 border-blue-500 text-gray-200">{char === ' ' ? '␣' : char}</span>
                                    </span>
                                )
                            }
                            return <span key={idx} className={`${color} ${bg} transition-all duration-75 px-[1px]`}>{char}</span>
                        })}
                    </div>
                </div>

                <input 
                    type="text" 
                    className="opacity-0 absolute inset-0 cursor-default h-full w-full z-0" 
                    value={userInput} 
                    onChange={handleInput} 
                    autoFocus 
                    onBlur={(e) => e.target.focus()} 
                />
                
                <button 
                    onClick={skipText}
                    className="absolute bottom-4 right-4 p-2 text-gray-600 hover:text-white transition-colors z-20 opacity-0 group-hover:opacity-100"
                    title="Lewati Teks"
                >
                    <RefreshCw className="w-5 h-5" />
                </button>
            </div>

            {/* Visual Keyboard */}
            <VisualKeyboard activeChar={targetChar} letterStats={userState.letterStats} />
        </div>

        {/* RIGHT COLUMN: Dashboard (Timer, Settings, Graph) */}
        <div className="lg:w-80 flex flex-col gap-6 shrink-0 w-full">
            
            {/* Widget 1: Daily Progress & Target */}
            <div className="bg-gray-800 p-5 rounded-2xl border border-gray-700 relative shadow-lg">
                 <div className="flex justify-between items-start mb-2">
                    <span className="text-[11px] text-gray-400 font-bold uppercase tracking-widest flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5" /> Progres Harian
                    </span>
                    
                    <div className="relative">
                        <button onClick={() => setShowSettings(!showSettings)} className="text-gray-500 hover:text-white transition-colors p-1 hover:bg-gray-700 rounded-lg">
                            <Settings className="w-4 h-4" />
                        </button>
                        
                        {/* Settings Popover */}
                        {showSettings && (
                            <div className="absolute top-8 right-0 bg-gray-700 border border-gray-600 rounded-xl p-2 shadow-2xl z-30 flex flex-col gap-1 w-32 animate-fade-in ring-1 ring-black/20">
                                <span className="text-[10px] text-gray-400 px-2 py-1.5 border-b border-gray-600 mb-1 font-bold">Target Waktu</span>
                                {[10, 20, 30, 45, 60].map(m => (
                                    <button key={m} onClick={() => changeDuration(m)} className="text-left px-2 py-1.5 text-xs hover:bg-blue-600 hover:text-white rounded-lg text-gray-200 transition-colors">
                                        {m} Menit
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                 </div>
                 
                 {/* Compact Time Display */}
                 <div className="flex items-center gap-2 mb-3">
                     <div className="text-3xl font-mono font-bold text-white tracking-tighter">
                        {Math.floor(userState.timeRemaining / 60)}<span className="text-gray-500 text-sm ml-0.5">m</span>
                     </div>
                     <div className="text-3xl font-mono font-bold text-white tracking-tighter">
                        {(userState.timeRemaining % 60).toString().padStart(2, '0')}<span className="text-gray-500 text-sm ml-0.5">d</span>
                     </div>
                 </div>
                 
                 <div className="w-full bg-gray-900 h-1.5 rounded-full overflow-hidden border border-gray-700/50">
                     <div 
                        className="bg-gradient-to-r from-blue-600 to-indigo-500 h-full transition-all duration-1000 ease-linear" 
                        style={{ width: `${(userState.timeRemaining / userState.targetDuration) * 100}%` }}
                     ></div>
                 </div>
            </div>

            {/* Widget 2: Level & Reset */}
            <div className="bg-gray-800 p-5 rounded-2xl border border-gray-700 shadow-lg">
                 <div className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Award className="w-3.5 h-3.5" /> Tingkatan
                 </div>
                 <div className="flex flex-col gap-3">
                     <div className="relative">
                        <select 
                            value={userState.level} 
                            onChange={(e) => changeLevel(e.target.value as Level)}
                            className="w-full bg-gray-900 border border-gray-600 text-xs text-white rounded-lg p-2.5 pr-8 focus:ring-1 focus:ring-blue-500 outline-none appearance-none cursor-pointer font-medium"
                        >
                            <option value={Level.PEMULA}>PEMULA (Dasar Jari)</option>
                            <option value={Level.MENENGAH}>MENENGAH (Kalimat)</option>
                            <option value={Level.MAHIR}>MAHIR (Kompleks)</option>
                        </select>
                        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                            <ArrowDown className="w-4 h-4" />
                        </div>
                     </div>

                     <button 
                        onClick={() => setShowResetModal(true)} 
                        className="w-full bg-red-500/5 hover:bg-red-500/10 border border-red-500/20 text-red-400 text-xs py-2 rounded-lg flex items-center justify-center gap-2 transition-all font-medium"
                     >
                        <RotateCcw className="w-3 h-3" /> Reset Progres
                     </button>
                 </div>
            </div>

            {/* Widget 3: Graph */}
            <CompactGraph history={userState.history} />
            
        </div>
      </main>
    </div>
  );
};

export default App;