import React, { useState, useEffect } from 'react';
import { BUILDINGS, CHECK_IN_OPTIONS } from '../constants';
import { ViewState } from '../types';
import { getSharedRealityInsight, getCollectiveMoodPrompt } from '../services/geminiService';

interface HeatmapProps {
  onViewChange: (view: ViewState) => void;
  userSignal: string | null;
}

export const Heatmap: React.FC<HeatmapProps> = ({ onViewChange, userSignal }) => {
  const [selectedBuilding, setSelectedBuilding] = useState<string | null>(null);
  const [realityInsight, setRealityInsight] = useState<string>("");
  const [microPrompt, setMicroPrompt] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [showMicroPrompt, setShowMicroPrompt] = useState(true);

  useEffect(() => {
    if (userSignal) {
      setLoading(true);
      
      // Parallel fetch
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
      case 'high': return 'bg-calm-red text-white shadow-red-200';
      case 'moderate': return 'bg-calm-yellow text-white shadow-yellow-200';
      case 'low': return 'bg-calm-green text-white shadow-green-200';
      default: return 'bg-slate-200';
    }
  };

  const getStressIndicator = (level: string) => {
    switch (level) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200 animate-pulse';
      case 'moderate': return 'bg-yellow-100 text-yellow-800 border-yellow-200 animate-pulse-slow';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-slate-100';
    }
  };

  const currentSignal = CHECK_IN_OPTIONS.find(c => c.id === userSignal);

  return (
    <div className="space-y-6">
      {/* Mood-Boost Micro-Prompt */}
      {showMicroPrompt && microPrompt && (
        <div className="bg-gradient-to-r from-teal-400 to-emerald-500 rounded-xl p-3 shadow-md shadow-emerald-100 text-white flex justify-between items-center animate-slide-up relative overflow-hidden">
            <div className="absolute inset-0 bg-white opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '16px 16px' }}></div>
            <div className="relative z-10 flex items-center space-x-3">
                <span className="text-2xl">💡</span>
                <div>
                    <p className="text-[10px] font-bold uppercase opacity-90 tracking-wider">Collective Mood Boost</p>
                    <p className="font-bold text-sm">{microPrompt}</p>
                </div>
            </div>
            <button 
                onClick={() => setShowMicroPrompt(false)}
                className="relative z-10 w-6 h-6 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-xs"
            >
                ✕
            </button>
        </div>
      )}

      {/* Shared Reality Card */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden">
        {/* Background visual element */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-brand-50 rounded-full -mr-16 -mt-16 opacity-50 blur-2xl"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-800 tracking-tight">Shared Reality Visualization</h2>
            <div className="flex items-center space-x-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Live</span>
            </div>
          </div>
          
          <div className="mb-4">
             {loading ? (
                <div className="h-4 bg-slate-100 rounded w-3/4 animate-pulse"></div>
             ) : (
                <p className="text-xl font-medium text-slate-700 leading-snug">
                  {realityInsight || "The campus environment is demanding today."}
                </p>
             )}
          </div>

          {currentSignal && (
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 flex items-center space-x-3">
               <div className="text-2xl">{currentSignal.icon}</div>
               <div>
                 <p className="text-xs text-slate-500">Context:</p>
                 <p className="text-sm font-bold text-slate-800">
                   {currentSignal.count + 1} students also reported <span className="text-brand-700">{currentSignal.label}</span>.
                 </p>
               </div>
            </div>
          )}
        </div>
      </div>

      {/* Pulse Chat Invitation */}
      {currentSignal && (
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-2xl p-5 text-white shadow-lg shadow-indigo-200 relative overflow-hidden animate-slide-up">
           <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
           <div className="relative z-10">
             <div className="flex items-center space-x-2 mb-2">
                 <span className="bg-white/20 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">Connect Safely</span>
                 <span className="text-indigo-200 text-[10px]">Anonymous</span>
             </div>
             
             <h3 className="font-bold text-lg leading-tight mb-1">Find Common Ground</h3>
             <p className="text-indigo-100 text-xs mb-4">
                 Connect with others feeling <span className="font-bold text-white">"{currentSignal.label}"</span> right now.
             </p>

             <div className="flex space-x-3">
                 <button 
                    onClick={() => onViewChange(ViewState.PULSE_CHAT)}
                    className="flex-1 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl py-2 px-3 text-xs font-bold transition-all flex items-center justify-center space-x-2"
                 >
                    <span className="text-lg">👥</span>
                    <span>Group Pulse</span>
                 </button>
                 <button 
                    onClick={() => onViewChange(ViewState.ONE_ON_ONE_CHAT)}
                    className="flex-1 bg-white text-indigo-700 rounded-xl py-2 px-3 text-xs font-bold shadow-md hover:scale-105 transition-transform flex items-center justify-center space-x-2"
                 >
                    <span className="text-lg">💬</span>
                    <span>1:1 Deep Dive</span>
                 </button>
             </div>
           </div>
        </div>
      )}

      {/* Buildings List */}
      <div>
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 px-1">Academic Pressure Hotspots</h3>
        <div className="space-y-3">
          {BUILDINGS.map((building) => (
            <div 
              key={building.id}
              onClick={() => setSelectedBuilding(selectedBuilding === building.id ? null : building.id)}
              className="bg-white rounded-xl border border-slate-100 overflow-hidden shadow-sm transition-all duration-200 active:scale-[0.99]"
            >
              <div className="p-4 flex items-center justify-between cursor-pointer">
                <div className="flex items-center space-x-3">
                  {/* Animated vertical bar for visual stress indication */}
                  <div className={`w-2 h-10 rounded-full transition-shadow duration-300 shadow-sm ${getStressColor(building.stressLevel)} ${building.stressLevel === 'high' ? 'animate-pulse' : ''}`}></div>
                  <div>
                    <h4 className="font-semibold text-slate-800">{building.name}</h4>
                    <p className="text-xs text-slate-500">{building.activity}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                   <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border transition-colors duration-300 ${getStressIndicator(building.stressLevel)}`}>
                    {building.stressLevel}
                  </span>
                  <span className="text-xs text-slate-400 mt-1">{building.occupancy} here</span>
                </div>
              </div>

              {/* Expanded Detail View */}
              {selectedBuilding === building.id && (
                <div className="bg-slate-50 p-4 border-t border-slate-100 space-y-3 animate-fade-in">
                  <div className="flex items-start space-x-3">
                    <div className="bg-white p-2 rounded-lg shadow-sm text-xs text-slate-600 italic border border-slate-100 flex-1">
                      "Deadline mode in full effect here. Quiet but intense focus."
                    </div>
                  </div>
                   <div className="flex items-start space-x-3 justify-end">
                    <div className="bg-brand-50 p-2 rounded-lg shadow-sm text-xs text-brand-700 border border-brand-100 flex-1 text-right">
                      "Shared strength in numbers. We're all getting through this."
                    </div>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewChange(ViewState.STUDY_ROOM);
                    }}
                    className="w-full mt-2 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700 transition-colors"
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