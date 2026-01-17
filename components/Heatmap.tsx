
import React, { useState, useEffect } from 'react';
import { BUILDINGS, CHECK_IN_OPTIONS } from '../constants';
import { ViewState } from '../types';
import { getSharedRealityInsight, getCollectiveMoodPrompt } from '../services/geminiService';
import { MessageCircle, Zap } from 'lucide-react';

interface HeatmapProps {
  onViewChange: (view: ViewState) => void;
  userSignal: string | null;
  onPulseChat?: () => void;
}

export const Heatmap: React.FC<HeatmapProps> = ({ onViewChange, userSignal, onPulseChat }) => {
  const [selectedBuilding, setSelectedBuilding] = useState<string | null>(null);
  const [realityInsight, setRealityInsight] = useState<string>("");
  const [microPrompt, setMicroPrompt] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [showMicroPrompt, setShowMicroPrompt] = useState(true);

  useEffect(() => {
    if (userSignal) {
      setLoading(true);
      Promise.all([
        getSharedRealityInsight(userSignal),
        getCollectiveMoodPrompt()
      ]).then(([insight, prompt]) => {
        setRealityInsight(insight);
        setMicroPrompt(prompt);
        setLoading(false);
      });
    }
  }, [userSignal]);

  const getStressColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-rose-400';
      case 'moderate': return 'bg-amber-300';
      case 'low': return 'bg-emerald-400';
      default: return 'bg-stone-200';
    }
  };

  const currentSignal = CHECK_IN_OPTIONS.find(c => c.id === userSignal);

  return (
    <div className="space-y-6 pb-20">
      {/* Mood-Boost Micro-Prompt */}
      {showMicroPrompt && microPrompt && (
        <div className="bg-gradient-to-r from-teal-500 to-emerald-600 rounded-2xl p-4 shadow-lg shadow-teal-100/50 text-white flex justify-between items-center animate-slide-up relative overflow-hidden group">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/noise.png')] opacity-20"></div>
            <div className="relative z-10 flex items-center space-x-4">
                <span className="text-3xl filter drop-shadow-sm">💡</span>
                <div>
                    <p className="text-[10px] font-bold uppercase opacity-80 tracking-widest mb-0.5">Collective Boost</p>
                    <p className="font-serif font-medium text-lg leading-tight">{microPrompt}</p>
                </div>
            </div>
            <button 
                onClick={() => setShowMicroPrompt(false)}
                className="relative z-10 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
            >
                ✕
            </button>
        </div>
      )}

      {/* Shared Reality Card */}
      <div className="bg-white p-7 rounded-[2rem] shadow-soft border border-stone-100 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-50/50 rounded-full -mr-20 -mt-20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-3xl"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-serif font-bold text-stone-800 tracking-tight">Shared Reality</h2>
            <div className="flex items-center space-x-2 bg-stone-50 px-3 py-1 rounded-full border border-stone-100">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-500"></span>
              </span>
              <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Live</span>
            </div>
          </div>
          
          <div className="mb-6">
             {loading ? (
                <div className="space-y-2">
                    <div className="h-4 bg-stone-100 rounded w-3/4 animate-pulse"></div>
                    <div className="h-4 bg-stone-100 rounded w-1/2 animate-pulse"></div>
                </div>
             ) : (
                <p className="text-xl text-stone-600 leading-relaxed font-medium">
                  "{realityInsight || "The campus environment is demanding today."}"
                </p>
             )}
          </div>

          {currentSignal && (
            <div className="bg-stone-50/80 rounded-2xl p-4 border border-stone-100 flex flex-col space-y-4">
               <div className="flex items-center space-x-4">
                   <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-2xl border border-stone-100">
                       {currentSignal.icon}
                   </div>
                   <div>
                     <p className="text-xs text-stone-400 font-bold uppercase tracking-wider mb-0.5">Your Context</p>
                     <p className="text-sm font-bold text-stone-700">
                       <span className="text-brand-600 text-lg mr-1">{currentSignal.count + 1}</span> 
                       students also reported <span className="italic">{currentSignal.label}</span>.
                     </p>
                   </div>
               </div>
               
               {/* Pulse Active Action */}
               {onPulseChat && (
                   <button 
                     onClick={onPulseChat}
                     className="w-full py-3 bg-white border border-brand-200 text-brand-700 rounded-xl font-bold text-sm shadow-sm hover:bg-brand-50 hover:border-brand-300 transition-all flex items-center justify-center space-x-2 group"
                   >
                       <div className="bg-brand-100 p-1.5 rounded-lg group-hover:bg-brand-200 transition-colors">
                           <MessageCircle size={16} />
                       </div>
                       <span>Enter Pulse Room</span>
                       <Zap size={14} className="text-amber-500" />
                   </button>
               )}
            </div>
          )}
        </div>
      </div>

      {/* Buildings List */}
      <div>
        <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-4 px-2">Academic Pressure Hotspots</h3>
        <div className="space-y-3">
          {BUILDINGS.map((building) => (
            <div 
              key={building.id}
              onClick={() => setSelectedBuilding(selectedBuilding === building.id ? null : building.id)}
              className={`bg-white rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden ${selectedBuilding === building.id ? 'border-brand-200 shadow-md ring-1 ring-brand-50' : 'border-stone-100 shadow-sm hover:border-stone-200'}`}
            >
              <div className="p-5 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {/* Stress Indicator Pill */}
                  <div className={`w-1.5 h-12 rounded-full ${getStressColor(building.stressLevel)} ${building.stressLevel === 'high' ? 'shadow-[0_0_10px_rgba(251,113,133,0.4)]' : ''}`}></div>
                  
                  <div>
                    <h4 className="font-bold text-stone-800 text-base">{building.name}</h4>
                    <p className="text-xs text-stone-500 font-medium">{building.activity}</p>
                  </div>
                </div>
                
                <div className="text-right">
                   <div className={`inline-block px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide mb-1 ${
                       building.stressLevel === 'high' ? 'bg-rose-50 text-rose-600' :
                       building.stressLevel === 'moderate' ? 'bg-amber-50 text-amber-600' :
                       'bg-emerald-50 text-emerald-600'
                   }`}>
                    {building.stressLevel}
                  </div>
                  <p className="text-[10px] text-stone-400">{building.occupancy} active</p>
                </div>
              </div>

              {/* Expanded View */}
              {selectedBuilding === building.id && (
                <div className="bg-stone-50/50 p-5 border-t border-stone-100 space-y-4 animate-slide-up">
                   <div className="flex gap-3">
                        <div className="flex-1 bg-white p-3 rounded-xl border border-stone-100 text-xs text-stone-600 leading-relaxed shadow-sm">
                            <span className="block text-[10px] font-bold text-stone-400 uppercase mb-1">Vibe</span>
                            "Library is quiet but tense. Everyone is in deadline mode."
                        </div>
                        <div className="flex-1 bg-brand-50/50 p-3 rounded-xl border border-brand-100 text-xs text-brand-800 leading-relaxed shadow-sm">
                            <span className="block text-[10px] font-bold text-brand-400 uppercase mb-1">Support</span>
                            "We're all grinding together. You got this."
                        </div>
                   </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewChange(ViewState.STUDY_ROOM);
                    }}
                    className="w-full py-3 bg-stone-800 text-white rounded-xl text-sm font-bold shadow-lg hover:bg-black transition-all"
                  >
                    Join {building.name} Virtually
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
