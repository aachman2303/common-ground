import React, { useState } from 'react';
import { UserProfile, RankInfo } from '../types';
import { AVATARS } from '../constants';

interface ProfileProps {
  user: UserProfile;
  onLogout: () => void;
}

const BADGES = [
    { id: 1, icon: '🌙', name: 'Night Owl', desc: 'Checked in after midnight' },
    { id: 2, icon: '🔥', name: 'Streak', desc: '3 Day Streak' },
    { id: 3, icon: '🤝', name: 'Community', desc: 'Joined 2 Communities' },
    { id: 4, icon: '🧘', name: 'Zen Master', desc: 'Used Calm Mode' },
    { id: 5, icon: '👂', name: 'Listener', desc: 'Helped 5 Peers' },
];

const RANKS: RankInfo[] = [
    { title: 'Seedling', icon: '🌱', minMinutes: 0 },
    { title: 'Sapling', icon: '🌿', minMinutes: 300 },
    { title: 'Young Tree', icon: '🌳', minMinutes: 1000 },
    { title: 'Ancient Oak', icon: '🌲', minMinutes: 5000 },
];

export const Profile: React.FC<ProfileProps> = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'stats' | 'settings'>('stats');

  // Calculate Rank
  const currentMinutes = user.stats?.focusMinutes || 750; // Default mock if missing
  const currentRankIndex = RANKS.findIndex((r, i) => 
    currentMinutes >= r.minMinutes && (!RANKS[i+1] || currentMinutes < RANKS[i+1].minMinutes)
  );
  const currentRank = RANKS[currentRankIndex !== -1 ? currentRankIndex : 0];
  const nextRank = RANKS[currentRankIndex + 1];
  
  const progressToNext = nextRank 
    ? ((currentMinutes - currentRank.minMinutes) / (nextRank.minMinutes - currentRank.minMinutes)) * 100
    : 100;

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header Card */}
      <div className="relative overflow-hidden rounded-3xl bg-white shadow-soft border border-stone-100 group">
         {/* Decorative Background Image */}
         <div className="absolute inset-0 h-32 bg-stone-200">
             <img 
               src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
               alt="Calm Background" 
               className="w-full h-full object-cover opacity-80"
             />
             <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/90"></div>
         </div>

         <div className="relative pt-16 px-6 pb-6 text-center">
             <div className="relative inline-block">
                <div className="w-24 h-24 rounded-full bg-white border-4 border-white shadow-xl flex items-center justify-center text-4xl animate-float">
                    {AVATARS[user.avatarId].icon}
                </div>
                <div className="absolute bottom-1 right-1 w-6 h-6 bg-brand-500 rounded-full border-2 border-white flex items-center justify-center text-[10px] text-white font-bold" title="Online">
                    ✓
                </div>
             </div>
             
             <h2 className="mt-3 text-2xl font-serif font-bold text-stone-800">{user.nickname}</h2>
             <p className="text-sm text-stone-500 font-mono tracking-wide mb-3">{user.uniqueId}</p>
             
             {/* Rank Display */}
             <div className="bg-stone-50 rounded-xl p-3 border border-stone-100 inline-block w-full max-w-xs">
                <div className="flex justify-between items-center text-xs font-bold mb-1">
                    <span className="text-brand-700 flex items-center gap-1">
                        {currentRank.icon} {currentRank.title}
                    </span>
                    {nextRank && <span className="text-stone-400">{nextRank.title}</span>}
                </div>
                <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-brand-500 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${progressToNext}%` }}
                    ></div>
                </div>
                <div className="text-[10px] text-stone-400 mt-1 text-right">
                    {currentMinutes} / {nextRank ? nextRank.minMinutes : 'MAX'} min focus
                </div>
             </div>
         </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-stone-100 p-1 rounded-2xl">
          <button 
             onClick={() => setActiveTab('stats')}
             className={`flex-1 py-2 text-sm font-bold rounded-xl transition-all ${activeTab === 'stats' ? 'bg-white text-stone-800 shadow-sm' : 'text-stone-400'}`}
          >
              My Journey
          </button>
          <button 
             onClick={() => setActiveTab('settings')}
             className={`flex-1 py-2 text-sm font-bold rounded-xl transition-all ${activeTab === 'settings' ? 'bg-white text-stone-800 shadow-sm' : 'text-stone-400'}`}
          >
              Settings
          </button>
      </div>

      {activeTab === 'stats' && (
          <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-2xl border border-stone-100 shadow-sm animate-pop delay-100 hover:scale-[1.02] transition-transform">
                      <div className="text-brand-500 text-2xl mb-1">⏳</div>
                      <div className="text-2xl font-bold text-stone-800 font-serif">{(currentMinutes / 60).toFixed(1)}h</div>
                      <div className="text-xs text-stone-400 uppercase tracking-wider font-bold">Focus Time</div>
                  </div>
                  <div className="bg-white p-4 rounded-2xl border border-stone-100 shadow-sm animate-pop delay-200 hover:scale-[1.02] transition-transform">
                      <div className="text-calm-red text-2xl mb-1">✨</div>
                      <div className="text-2xl font-bold text-stone-800 font-serif">{user.stats?.communityPoints || 0}</div>
                      <div className="text-xs text-stone-400 uppercase tracking-wider font-bold">Community Pts</div>
                  </div>
                  <div className="col-span-2 bg-white p-4 rounded-2xl border border-stone-100 shadow-sm animate-pop delay-300">
                      <div className="flex items-center justify-between">
                         <div>
                            <div className="text-cozy-rust text-xl mb-1">🔥</div>
                            <div className="text-lg font-bold text-stone-800 font-serif">{user.stats?.streakDays || 0} Day Streak</div>
                         </div>
                         <div className="text-right">
                            <div className="text-xs text-stone-400 font-bold uppercase">Consistency</div>
                         </div>
                      </div>
                  </div>
              </div>

              {/* Badges */}
              <div>
                  <h3 className="text-sm font-bold text-stone-400 uppercase tracking-wider mb-3 px-1">Recent Badges</h3>
                  <div className="grid grid-cols-5 gap-2">
                      {BADGES.map((badge, i) => (
                          <div key={badge.id} className={`flex flex-col items-center p-2 rounded-xl bg-white border border-stone-100 shadow-sm animate-pop`} style={{ animationDelay: `${(i+3) * 100}ms` }}>
                              <div className="text-xl mb-1 filter drop-shadow-sm transform hover:scale-125 transition-transform duration-300 cursor-default" title={badge.desc}>
                                  {badge.icon}
                              </div>
                              <span className="text-[8px] font-bold text-stone-600 text-center leading-tight">{badge.name}</span>
                          </div>
                      ))}
                  </div>
              </div>

              {/* Quote Card */}
              <div className="bg-brand-50 p-6 rounded-2xl relative overflow-hidden border border-brand-100 animate-slide-up delay-300">
                  <div className="absolute top-0 right-0 text-9xl opacity-10 font-serif text-brand-900 leading-none -mr-4 -mt-8">”</div>
                  <p className="relative z-10 font-serif italic text-brand-800 text-center text-lg leading-relaxed">
                      "Strive for progress, not perfection."
                  </p>
              </div>
          </div>
      )}

      {activeTab === 'settings' && (
          <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden animate-fade-in">
              <div className="p-4 border-b border-stone-50 flex justify-between items-center hover:bg-stone-50 transition-colors">
                  <span className="text-sm font-bold text-stone-600">Notifications</span>
                  <div className="w-10 h-6 bg-brand-500 rounded-full relative cursor-pointer">
                      <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                  </div>
              </div>
              <div className="p-4 border-b border-stone-50 flex justify-between items-center hover:bg-stone-50 transition-colors">
                  <span className="text-sm font-bold text-stone-600">Incognito Mode</span>
                  <div className="w-10 h-6 bg-stone-200 rounded-full relative cursor-pointer">
                      <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                  </div>
              </div>
              <div className="p-4 flex justify-between items-center hover:bg-stone-50 transition-colors cursor-pointer text-brand-600 font-bold text-sm">
                  <span>Help & Support</span>
                  <span>→</span>
              </div>
              
              <div className="p-4 border-t border-stone-100 mt-2">
                  <button 
                    onClick={onLogout}
                    className="w-full py-3 bg-stone-100 text-stone-600 rounded-xl font-bold text-sm hover:bg-red-50 hover:text-red-500 transition-colors"
                  >
                      Sign Out
                  </button>
              </div>
          </div>
      )}
    </div>
  );
};
