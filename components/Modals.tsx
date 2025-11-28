import React, { useState, useEffect } from 'react';
import { AlertTriangle, X, Sparkles, BrainCircuit } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { UserState } from '../types';

export const ResetConfirmationModal = ({ isOpen, onClose, onConfirm }: { isOpen: boolean, onClose: () => void, onConfirm: () => void }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[110] p-4">
            <div className="bg-gray-800 border border-red-500/30 p-6 rounded-2xl max-w-sm w-full shadow-2xl relative animate-fade-in transform scale-100">
                <div className="flex flex-col items-center text-center gap-4">
                    <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center">
                        <AlertTriangle className="w-6 h-6 text-red-500" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white mb-2">Reset Progres?</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Yakin mau kehilangan progres belajarmu yang sudah sampai sejauh ini? Data tidak bisa dikembalikan.
                        </p>
                    </div>
                    <div className="flex gap-3 w-full mt-2">
                        <button 
                            onClick={onClose} 
                            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg text-sm font-medium transition-colors"
                        >
                            Batal
                        </button>
                        <button 
                            onClick={onConfirm} 
                            className="flex-1 bg-red-600 hover:bg-red-500 text-white py-2 rounded-lg text-sm font-medium transition-colors"
                        >
                            Ya, Reset
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const AIAnalysisModal = ({ isOpen, onClose, state }: { isOpen: boolean, onClose: () => void, state: UserState }) => {
    const [feedback, setFeedback] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && !feedback) {
            analyze();
        }
    }, [isOpen]);

    const analyze = async () => {
        if (!process.env.API_KEY) {
            setFeedback("API Key tidak ditemukan. Pastikan environment variable diset dengan benar.");
            return;
        }
        setLoading(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            // Calculate worst keys
            const worstKeys = Object.entries(state.letterStats)
                .sort((a, b) => (b[1].errors / (b[1].attempts || 1)) - (a[1].errors / (a[1].attempts || 1)))
                .slice(0, 3)
                .filter(k => k[1].errors > 0)
                .map(k => k[0].toUpperCase());

            const prompt = `
                Sebagai instruktur mengetik profesional, berikan analisis singkat dan motivasi (maksimum 3 kalimat) untuk siswa dengan data berikut:
                - Level: ${state.level}
                - WPM Terakhir: ${state.history.length > 0 ? state.history[state.history.length-1].wpm : 0}
                - Rata-rata WPM: ${state.history.length > 0 ? Math.round(state.history.reduce((a,b)=>a+b.wpm,0)/state.history.length) : 0}
                - Huruf yang sering salah: ${worstKeys.join(', ') || 'Tidak ada (Sempurna!)'}.
                
                Gunakan bahasa Indonesia yang gaul, suportif, dan konstruktif. Berikan satu tips spesifik.
            `;
            
            const response = await ai.models.generateContent({ 
                model: 'gemini-2.5-flash', 
                contents: prompt 
            });
            setFeedback(response.text);
        } catch (e) {
            console.error(e);
            setFeedback("Gagal menghubungi AI. Coba lagi nanti.");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <div className="bg-gray-800 border border-indigo-500/50 p-6 rounded-2xl max-w-md w-full shadow-2xl relative animate-fade-in ring-1 ring-white/10">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"><X className="w-5 h-5"/></button>
                <div className="flex items-center gap-3 mb-4 text-indigo-400">
                    <Sparkles className="w-6 h-6" />
                    <h3 className="text-lg font-bold">Analisis AI Gemini</h3>
                </div>
                <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-700 min-h-[120px] flex items-center justify-center">
                    {loading ? (
                        <div className="flex flex-col items-center gap-3 text-indigo-300 text-sm animate-pulse">
                            <BrainCircuit className="w-8 h-8" /> 
                            <span>Menganalisis pola jari Anda...</span>
                        </div>
                    ) : (
                        <p className="text-gray-200 text-sm leading-relaxed text-center font-medium">
                            {feedback}
                        </p>
                    )}
                </div>
                <div className="mt-6 text-center">
                    <button onClick={onClose} className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-2.5 rounded-full text-sm font-bold transition-all shadow-lg hover:shadow-indigo-500/25 active:scale-95">
                        Siap Latihan Lagi!
                    </button>
                </div>
            </div>
        </div>
    )
}