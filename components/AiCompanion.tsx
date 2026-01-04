
import React, { useState, useEffect } from 'react';
import { getDailyCompanionMessage } from '../services/geminiService';

export const AiCompanion: React.FC = () => {
  const [message, setMessage] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Simulate checking user stats on load
    const checkUserWellbeing = async () => {
       // In a real app, pass user context here
       const msg = await getDailyCompanionMessage();
       setMessage(msg);
       // Show after a slight delay
       setTimeout(() => setVisible(true), 2000);
    };
    checkUserWellbeing();
  }, []);

  if (!message || !visible) return null;

  return (
    <div className="fixed bottom-24 left-4 right-4 z-50 animate-slide-up">
       <div className="bg-slate-900/90 backdrop-blur text-white p-4 rounded-2xl shadow-2xl border border-slate-700 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-brand-400 to-indigo-500"></div>
          <div className="flex items-start space-x-3">
             <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-lg shadow-sm border border-white/20">
                🤖
             </div>
             <div className="flex-1">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Common Ground Companion</p>
                <p className="text-sm font-medium leading-relaxed opacity-95">"{message}"</p>
             </div>
             <button 
                onClick={() => setVisible(false)}
                className="text-slate-500 hover:text-white transition-colors"
             >
                ✕
             </button>
          </div>
          <div className="mt-3 flex space-x-2">
              <button className="flex-1 bg-white/10 hover:bg-white/20 py-1.5 rounded-lg text-xs font-bold transition-colors">
                  I'm okay
              </button>
              <button className="flex-1 bg-indigo-600 hover:bg-indigo-700 py-1.5 rounded-lg text-xs font-bold transition-colors shadow-lg shadow-indigo-500/30">
                  Actually, I'm stressed
              </button>
          </div>
       </div>
    </div>
  );
};
