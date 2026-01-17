
import React from 'react';
import { ViewState, UserProfile } from '../types';
import { Lock, Unlock, Play, Trophy, Users, Zap } from 'lucide-react';

interface GameArcadeProps {
  user: UserProfile;
  onPlay: (game: ViewState) => void;
}

const GAMES = [
  {
    id: 'harmony',
    view: ViewState.COOP_GAME,
    title: 'Harmony Ripple',
    desc: 'Sync your breathing with a peer to create calm.',
    cost: 50,
    icon: '🌊',
    color: 'from-teal-400 to-emerald-500',
    type: 'Co-op Rhythm',
    players: '2 Players'
  },
  {
    id: 'tethered',
    view: ViewState.TETHERED_GAME,
    title: 'Tethered Trials',
    desc: 'Climb together. If one falls, you both fall.',
    cost: 200,
    icon: '🔗',
    color: 'from-indigo-500 to-purple-600',
    type: 'Co-op Physics',
    players: '2 Players'
  },
  {
    id: 'focus',
    view: ViewState.STUDY_ROOM,
    title: 'Focus Garden',
    desc: 'Pop distractions and grow your streak.',
    cost: 0,
    icon: '🌱',
    color: 'from-orange-400 to-amber-500',
    type: 'Single Player',
    players: 'Solo'
  }
];

export const GameArcade: React.FC<GameArcadeProps> = ({ user, onPlay }) => {
  const currentPoints = user.stats.communityPoints;

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      {/* Header Stats */}
      <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl -ml-16 -mb-16"></div>
        
        <div className="relative z-10 text-center">
            <h1 className="text-3xl font-serif font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-purple-200">The Arcade</h1>
            <p className="text-slate-400 text-sm mb-6">Spend Karma to unlock experiences.</p>
            
            <div className="inline-flex items-center space-x-3 bg-white/10 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-white/10">
                <Trophy className="text-yellow-400" size={20} />
                <span className="text-2xl font-mono font-bold">{currentPoints}</span>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">PTS</span>
            </div>
        </div>
      </div>

      {/* Game Grid */}
      <div className="space-y-5">
          {GAMES.map((game) => {
              const isUnlocked = currentPoints >= game.cost;
              const progress = Math.min(100, (currentPoints / game.cost) * 100);

              return (
                  <div key={game.id} className="group relative">
                      <div className={`relative overflow-hidden rounded-[2rem] border transition-all duration-500 ${isUnlocked ? 'bg-white border-stone-100 shadow-soft hover:shadow-xl hover:-translate-y-1' : 'bg-stone-50 border-stone-200 grayscale opacity-90'}`}>
                          
                          {/* Card Content */}
                          <div className="p-6">
                              <div className="flex justify-between items-start mb-4">
                                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${game.color} flex items-center justify-center text-3xl shadow-lg`}>
                                      {game.icon}
                                  </div>
                                  <div className="flex flex-col items-end">
                                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-lg mb-1 ${isUnlocked ? 'bg-stone-100 text-stone-500' : 'bg-stone-200 text-stone-400'}`}>
                                          {game.type}
                                      </span>
                                      <div className="flex items-center space-x-1 text-xs font-bold text-stone-400">
                                          <Users size={12} />
                                          <span>{game.players}</span>
                                      </div>
                                  </div>
                              </div>

                              <h3 className="text-xl font-bold text-stone-800 mb-1">{game.title}</h3>
                              <p className="text-sm text-stone-500 mb-6 leading-relaxed">{game.desc}</p>

                              {isUnlocked ? (
                                  <button 
                                    onClick={() => onPlay(game.view)}
                                    className={`w-full py-4 rounded-xl font-bold text-white flex items-center justify-center space-x-2 transition-all shadow-lg bg-gradient-to-r ${game.color} hover:opacity-90 active:scale-95`}
                                  >
                                      <Play size={18} fill="currentColor" />
                                      <span>Play Now</span>
                                  </button>
                              ) : (
                                  <div className="space-y-2">
                                      <div className="flex justify-between text-xs font-bold text-stone-400">
                                          <span>Locked</span>
                                          <span>{currentPoints}/{game.cost} PTS</span>
                                      </div>
                                      <div className="h-3 bg-stone-200 rounded-full overflow-hidden">
                                          <div className={`h-full bg-gradient-to-r ${game.color}`} style={{ width: `${progress}%` }}></div>
                                      </div>
                                      <button disabled className="w-full py-4 mt-2 bg-stone-100 text-stone-400 rounded-xl font-bold flex items-center justify-center space-x-2 cursor-not-allowed">
                                          <Lock size={16} />
                                          <span>Need {game.cost - currentPoints} more points</span>
                                      </button>
                                  </div>
                              )}
                          </div>
                      </div>
                  </div>
              );
          })}
      </div>
    </div>
  );
};
