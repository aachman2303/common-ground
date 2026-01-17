
import React, { useState, useEffect } from 'react';
import { AVATARS } from '../constants';

interface GameLobbyProps {
  gameName: string;
  onMatchFound: (partner: typeof AVATARS[0]) => void;
  onCancel: () => void;
}

export const GameLobby: React.FC<GameLobbyProps> = ({ gameName, onMatchFound, onCancel }) => {
  const [status, setStatus] = useState<'scanning' | 'connecting' | 'found'>('scanning');
  const [message, setMessage] = useState('Scanning local frequencies...');
  const [partner, setPartner] = useState<typeof AVATARS[0] | null>(null);

  useEffect(() => {
    let mounted = true;

    const sequence = async () => {
      // Step 1: Scanning Phase
      await new Promise(r => setTimeout(r, 2000));
      if (!mounted) return;
      
      setStatus('connecting');
      setMessage('Establishing secure handshake...');

      // Step 2: Connecting Phase
      await new Promise(r => setTimeout(r, 1500));
      if (!mounted) return;

      // Step 3: Partner Found
      const randomAvatar = AVATARS[Math.floor(Math.random() * AVATARS.length)];
      setPartner(randomAvatar);
      setStatus('found');
      setMessage('Resonance detected!');

      // Step 4: Handover
      await new Promise(r => setTimeout(r, 2000));
      if (!mounted) return;
      
      onMatchFound(randomAvatar);
    };

    sequence();

    return () => { mounted = false; };
  }, [onMatchFound]);

  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center p-8 bg-slate-900/95 backdrop-blur-sm animate-fade-in">
      <div className="relative mb-10">
          {/* Outer Ring Animation */}
          {status === 'scanning' && (
             <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20 animate-ping"></div>
          )}
          {status === 'connecting' && (
             <div className="absolute inset-0 rounded-full border-4 border-t-indigo-500 border-r-indigo-500/50 border-b-indigo-500/10 border-l-indigo-500/50 animate-spin"></div>
          )}
          
          {/* Center Avatar Display */}
          <div className={`w-32 h-32 rounded-full flex items-center justify-center text-5xl bg-slate-800 border-4 transition-all duration-500 shadow-2xl ${status === 'found' ? 'border-brand-400 bg-brand-900 scale-110' : 'border-slate-700'}`}>
              {status === 'found' && partner ? (
                  <div className="animate-pop">{partner.icon}</div>
              ) : (
                  <span className="animate-pulse">🛰️</span>
              )}
          </div>

          {/* Connection Status Indicator */}
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-slate-900 px-3 py-1 rounded-full border border-slate-700 flex items-center space-x-2 whitespace-nowrap">
              <div className={`w-2 h-2 rounded-full ${status === 'found' ? 'bg-green-400' : 'bg-amber-400 animate-pulse'}`}></div>
              <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">
                  {status === 'found' ? 'Locked' : 'Searching'}
              </span>
          </div>
      </div>

      <div className="text-center space-y-2 max-w-xs">
          <h2 className="text-2xl font-mono font-bold text-white tracking-tight animate-pulse">
              {status === 'found' ? partner?.subject + ' Major' : message}
          </h2>
          <p className="text-slate-400 text-sm">
              {status === 'found' 
                ? `Anonymous peer joined ${gameName}`
                : `Finding a partner for ${gameName}...`
              }
          </p>
      </div>
      
      <button 
        onClick={onCancel} 
        className="mt-12 text-slate-500 hover:text-white uppercase tracking-widest text-xs font-bold border-b border-transparent hover:border-white transition-all pb-1"
      >
          Cancel Matchmaking
      </button>
    </div>
  );
};
