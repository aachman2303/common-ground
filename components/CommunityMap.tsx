import React, { useState } from 'react';
import { AVATARS } from '../constants';
import { UserProfile, Community } from '../types';
import { getCalmZonePrediction } from '../services/geminiService';

interface CommunityMapProps {
  user: UserProfile;
  communities: Community[];
  onJoin: (id: string) => void;
}

export const CommunityMap: React.FC<CommunityMapProps> = ({ user, communities, onJoin }) => {
  const [activeCommunity, setActiveCommunity] = useState<Community | null>(null);
  const [showCalmZones, setShowCalmZones] = useState(false);
  const [calmPrediction, setCalmPrediction] = useState<string>("");
  const [loadingCalm, setLoadingCalm] = useState(false);

  const toggleCalmZones = async () => {
    if (!showCalmZones) {
        setLoadingCalm(true);
        const prediction = await getCalmZonePrediction();
        setCalmPrediction(prediction);
        setLoadingCalm(false);
        setShowCalmZones(true);
    } else {
        setShowCalmZones(false);
        setCalmPrediction("");
    }
  };

  // Mock calm zones data
  const CALM_ZONES = [
      { id: 'cz1', top: '15%', left: '80%', label: 'North Garden' },
      { id: 'cz2', top: '70%', left: '15%', label: 'Old Archive' },
  ];

  // Mock map background with a grid pattern
  return (
    <div className="relative w-full h-[70vh] bg-blue-50 rounded-3xl overflow-hidden shadow-inner border border-blue-100">
      {/* Map Background Pattern */}
      <div className="absolute inset-0 opacity-10" 
           style={{ 
             backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)', 
             backgroundSize: '20px 20px' 
           }}>
      </div>
      
      {/* Roads/Paths (Decorative) */}
      <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none">
        <path d="M0 100 Q 150 50 300 150 T 600 100" stroke="#cbd5e1" strokeWidth="20" fill="none" />
        <path d="M100 0 Q 50 200 150 400" stroke="#cbd5e1" strokeWidth="20" fill="none" />
        <circle cx="200" cy="200" r="80" fill="#e2e8f0" />
      </svg>
      
      {/* Calm Zone Controls */}
      <div className="absolute top-4 right-4 z-40">
          <button 
            onClick={toggleCalmZones}
            className={`flex items-center space-x-2 px-3 py-2 rounded-full font-bold text-xs shadow-lg transition-all ${showCalmZones ? 'bg-emerald-500 text-white' : 'bg-white text-emerald-600 hover:bg-emerald-50'}`}
          >
             {loadingCalm ? <span className="animate-spin">⏳</span> : <span>✨</span>}
             <span>{showCalmZones ? 'Show All' : 'Predict Calm Zones'}</span>
          </button>
      </div>
      
      {/* Prediction Toast */}
      {showCalmZones && calmPrediction && (
          <div className="absolute top-16 right-4 left-4 bg-emerald-600 text-white text-xs p-3 rounded-xl shadow-lg z-40 animate-slide-up opacity-95">
              <span className="font-bold">AI Forecast:</span> {calmPrediction}
          </div>
      )}

      {/* User Avatar (Center) */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center">
        <div className="relative">
          <div className="w-16 h-16 rounded-full bg-white border-4 border-brand-500 shadow-xl flex items-center justify-center text-3xl animate-pulse-slow">
             {AVATARS[user.avatarId].icon}
          </div>
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-brand-500 rotate-45"></div>
        </div>
        <div className="mt-2 px-2 py-1 bg-brand-600 text-white text-[10px] font-bold rounded-full shadow-md">
          YOU
        </div>
      </div>

      {/* Community Bubbles - Hidden if calm zones active */}
      {!showCalmZones && communities.map((comm) => (
        <div 
          key={comm.id}
          onClick={() => setActiveCommunity(comm)}
          className="absolute z-10 cursor-pointer transition-transform hover:scale-110 active:scale-95 group"
          style={{ top: `${comm.lat}%`, left: `${comm.lng}%` }}
        >
          <div className="flex flex-col items-center">
             <div className={`w-12 h-12 rounded-full bg-white border-2 shadow-lg flex items-center justify-center text-xl relative ${comm.isJoined ? 'border-brand-500 ring-2 ring-brand-200' : 'border-indigo-400'}`}>
                {comm.avatar}
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[8px] text-white flex items-center justify-center font-bold border border-white">
                  {comm.members > 99 ? '99+' : comm.members}
                </span>
             </div>
             <span className="mt-1 px-2 py-0.5 bg-white/90 backdrop-blur text-slate-800 text-[9px] font-bold rounded shadow-sm border border-slate-100 group-hover:bg-indigo-50 transition-colors whitespace-nowrap">
               {comm.name}
             </span>
          </div>
        </div>
      ))}
      
      {/* Calm Zone Markers */}
      {showCalmZones && CALM_ZONES.map((zone) => (
          <div 
            key={zone.id}
            className="absolute z-30 animate-appear"
            style={{ top: zone.top, left: zone.left }}
          >
             <div className="flex flex-col items-center">
                 <div className="w-10 h-10 rounded-full bg-emerald-100 border-2 border-emerald-400 shadow-emerald-200 shadow-lg flex items-center justify-center text-xl animate-float">
                     🍃
                 </div>
                 <div className="mt-1 px-2 py-0.5 bg-white text-emerald-700 text-[9px] font-bold rounded shadow-sm border border-emerald-100">
                     {zone.label}
                 </div>
             </div>
          </div>
      ))}

      {/* Active Community Modal Overlay */}
      {activeCommunity && !showCalmZones && (
        <div className="absolute inset-x-4 bottom-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-2xl border border-slate-200 z-30 animate-slide-up">
           <div className="flex justify-between items-start mb-2">
             <div className="flex items-center space-x-3">
               <div className="text-3xl bg-indigo-50 w-12 h-12 rounded-xl flex items-center justify-center border border-indigo-100">
                 {activeCommunity.avatar}
               </div>
               <div>
                 <h3 className="font-bold text-slate-800">{activeCommunity.name}</h3>
                 <p className="text-xs text-slate-500 font-mono tracking-wider">{activeCommunity.code}</p>
               </div>
             </div>
             <button onClick={() => setActiveCommunity(null)} className="text-slate-400 hover:text-slate-600">✕</button>
           </div>
           
           <p className="text-sm text-slate-600 mb-3 leading-relaxed">{activeCommunity.description}</p>
           
           <div className="flex space-x-2">
             <button 
                onClick={() => onJoin(activeCommunity.id)}
                className={`flex-1 py-2 text-white rounded-lg font-bold text-xs shadow transition-colors ${activeCommunity.isJoined ? 'bg-green-600 hover:bg-green-700' : 'bg-indigo-600 hover:bg-indigo-700'}`}
             >
               {activeCommunity.isJoined ? 'Leave Community' : 'Join Community'}
             </button>
             <button className="flex-1 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg font-bold text-xs hover:bg-slate-50 transition-colors">
               Peek Inside
             </button>
           </div>
        </div>
      )}
    </div>
  );
};