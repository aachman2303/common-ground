
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
    <div className="fixed bottom-24 left-0 right-0 z-50 flex justify-center pointer-events-none px-4">
       <div className="bg-slate-800/95 backdrop-blur-md text-white p-3 pr-8 rounded-2xl shadow-xl border border-slate-700 w-full max-w-xs pointer-events-auto animate-slide-up relative ring-1 ring-white/10">
          
          {/* Close Button */}
          <button 
            onClick={() => setVisible(false)}
            className="absolute top-2 right-2 text-slate-500 hover:text-white p-1.5 rounded-full hover:bg-slate-700 transition-colors"
          >
             <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
          
          <div className="flex items-start gap-3">
             <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-indigo-500/20 flex items-center justify-center text-lg border border-indigo-500/30 shadow-inner">
                🤖
             </div>
             <div>
                <p className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider mb-0.5">Companion</p>
                <p className="text-xs font-medium leading-relaxed text-slate-200">{message}</p>
             </div>
          </div>
          
          <div className="mt-2.5 flex gap-2 pl-11">
              <button 
                onClick={() => setVisible(false)} 
                className="px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-[10px] font-bold transition-colors border border-slate-600"
              >
                  I'm good
              </button>
              <button className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-[10px] font-bold transition-colors shadow-lg shadow-indigo-900/40 border border-indigo-500">
                  Stressed
              </button>
          </div>
       </div>
    </div>
  );
};
