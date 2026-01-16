import React, { useState } from 'react';
import { UserProfile, RankInfo } from '../types';
import { AVATARS } from '../constants';

interface ProfileProps {
  user: UserProfile;
  onLogout: () => void;
}

const RANKS: RankInfo[] = [
    { title: 'Seedling', icon: '🌱', minMinutes: 0 },
    { title: 'Sapling', icon: '🌿', minMinutes: 300 },
    { title: 'Young Tree', icon: '🌳', minMinutes: 1000 },
    { title: 'Ancient Oak', icon: '🌲', minMinutes: 5000 },
    { title: 'Forest Spirit', icon: '🦌', minMinutes: 10000 },
];

export const Profile: React.FC<ProfileProps> = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'stats' | 'settings'>('stats');

  // Calculate Rank
  const currentMinutes = user.stats?.focusMinutes || 0;
  const currentRankIndex = RANKS.findIndex((r, i) => 
    currentMinutes >= r.minMinutes && (!RANKS[i+1] || currentMinutes < RANKS[i+1].minMinutes)
  );
  const currentRank = RANKS[currentRankIndex !== -1 ? currentRankIndex : 0];
  const nextRank = RANKS[currentRankIndex + 1];
  
  const progressToNext = nextRank 
    ? Math.min(100, Math.max(0, ((currentMinutes - currentRank.minMinutes) / (nextRank.minMinutes - currentRank.minMinutes)) * 100))
    : 100;

  // Derive Badges from Stats
  const stats = user.stats || { focusMinutes: 0, streakDays: 0, communitiesJoined: 0, sessionsCompleted: 0 };
  const ALL_BADGES = [
    { id: 'streak', icon: '🔥', label: 'Streak Master', desc: '3+ Day Streak', unlocked: stats.streakDays >= 3 },
    { id: 'focus', icon: '🧠', label: 'Deep Focus', desc: '120+ Mins Total', unlocked: stats.focusMinutes >= 120 },
    { id: 'social', icon: '🤝', label: 'Community Pillar', desc: 'Joined 2+ Groups', unlocked: stats.communitiesJoined >= 2 },
    { id: 'night', icon: '🌙', label: 'Night Owl', desc: '5+ Sessions', unlocked: stats.sessionsCompleted >= 5 },
    { id: 'zen', icon: '🧘', label: 'Zen Master', desc: '500+ Mins Total', unlocked: stats.focusMinutes >= 500 },
    { id: 'sage', icon: '🦉', label: 'Campus Sage', desc: '1000+ Mins Total', unlocked: stats.focusMinutes >= 1000 },
  ];

  return (
    <div className="space-y-6 animate-slide-up pb-24">
      {/* Header Card */}
      <div className="relative overflow-hidden rounded-[2rem] bg-white shadow-xl shadow-stone-200 border border-stone-100 group">
         {/* Decorative Background Image */}
         <div className="absolute inset-0 h-40">
             <img 
               src="https://images.unsplash.com/photo-1490750967868-58cb75069ed6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
               alt="Cozy Plant Background" 
               className="w-full h-full object-cover opacity-90 transition-transform duration-1000 group-hover:scale-105"
             />
             <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/60 to-white"></div>
         </div>

         <div className="relative pt-24 px-6 pb-8 text-center">
             <div className="relative inline-block mb-3">
                <div className="w-28 h-28 rounded-full bg-white border-4 border-white shadow-2xl flex items-center justify-center text-5xl animate-float relative z-10">
                    {AVATARS[user.avatarId].icon}
                </div>
                <div className="absolute bottom-2 right-2 w-7 h-7 bg-brand-500 rounded-full border-4 border-white flex items-center justify-center text-[10px] text-white font-bold z-20 shadow-sm" title="Online">
                    ✓
                </div>
             </div>
             
             <h2 className="text-3xl font-serif font-bold text-stone-800 tracking-tight">{user.nickname}</h2>
             <p className="text-sm text-stone-400 font-mono tracking-wider mb-6 bg-stone-50 inline-block px-3 py-1 rounded-full mt-2 border border-stone-100">{user.uniqueId}</p>
             
             {/* Rank Display */}
             <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 border border-stone-100 shadow-sm w-full">
                <div className="flex justify-between items-center text-sm font-bold mb-2">
                    <span className="text-brand-700 flex items-center gap-2">
                        <span className="text-xl">{currentRank.icon}</span> {currentRank.title}
                    </span>
                    {nextRank && (
                        <span className="text-stone-400 text-xs uppercase tracking-wider">Next: {nextRank.title}</span>
                    )}
                </div>
                <div className="relative w-full h-3 bg-stone-100 rounded-full overflow-hidden shadow-inner">
                    <div 
                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-brand-400 to-brand-600 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${progressToNext}%` }}
                    >
                         <div className="absolute inset-0 bg-white/30 animate-[shimmer_2s_infinite]"></div>
                    </div>
                </div>
                <div className="flex justify-between mt-2 text-[10px] font-bold text-stone-400 uppercase tracking-widest">
                    <span>{currentMinutes} mins</span>
                    <span>{nextRank ? nextRank.minMinutes : 'MAX'} mins</span>
                </div>
             </div>
         </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-stone-200/50 p-1.5 rounded-2xl backdrop-blur-sm">
          <button 
             onClick={() => setActiveTab('stats')}
             className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all duration-300 ${activeTab === 'stats' ? 'bg-white text-stone-800 shadow-md transform scale-100' : 'text-stone-500 hover:text-stone-600 scale-95'}`}
          >
              Journey & Badges
          </button>
          <button 
             onClick={() => setActiveTab('settings')}
             className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all duration-300 ${activeTab === 'settings' ? 'bg-white text-stone-800 shadow-md transform scale-100' : 'text-stone-500 hover:text-stone-600 scale-95'}`}
          >
              Settings
          </button>
      </div>

      {activeTab === 'stats' && (
          <div className="space-y-6 animate-fade-in">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-5 rounded-2xl border border-stone-100 shadow-sm hover:shadow-md transition-all group">
                      <div className="w-10 h-10 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center text-xl mb-3 group-hover:scale-110 transition-transform">⏳</div>
                      <div className="text-2xl font-bold text-stone-800 font-serif">{(currentMinutes / 60).toFixed(1)}h</div>
                      <div className="text-[10px] text-stone-400 uppercase tracking-widest font-bold mt-1">Focus Time</div>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-stone-100 shadow-sm hover:shadow-md transition-all group">
                      <div className="w-10 h-10 rounded-full bg-yellow-50 text-yellow-600 flex items-center justify-center text-xl mb-3 group-hover:scale-110 transition-transform">✨</div>
                      <div className="text-2xl font-bold text-stone-800 font-serif">{user.stats?.communityPoints || 0}</div>
                      <div className="text-[10px] text-stone-400 uppercase tracking-widest font-bold mt-1">Karma Points</div>
                  </div>
                  <div className="col-span-2 bg-gradient-to-r from-orange-50 to-red-50 p-5 rounded-2xl border border-orange-100 shadow-sm">
                      <div className="flex items-center justify-between">
                         <div className="flex items-center gap-4">
                            <div className="text-3xl animate-pulse">🔥</div>
                            <div>
                                <div className="text-xl font-bold text-stone-800 font-serif">{user.stats?.streakDays || 0} Day Streak</div>
                                <div className="text-[10px] text-orange-600/70 font-bold uppercase tracking-widest">Consistency is key</div>
                            </div>
                         </div>
                      </div>
                  </div>
              </div>

              {/* Badges Section */}
              <div>
                  <div className="flex items-center justify-between px-2 mb-3">
                      <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest">Achievements</h3>
                      <span className="text-[10px] bg-stone-100 text-stone-500 px-2 py-0.5 rounded-full font-bold">
                          {ALL_BADGES.filter(b => b.unlocked).length}/{ALL_BADGES.length}
                      </span>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                      {ALL_BADGES.map((badge, i) => (
                          <div 
                            key={badge.id} 
                            className={`flex flex-col items-center p-4 rounded-2xl border transition-all duration-500 relative overflow-hidden ${
                                badge.unlocked 
                                    ? 'bg-white border-brand-100 shadow-sm hover:shadow-md hover:-translate-y-1' 
                                    : 'bg-stone-50 border-stone-100 opacity-60 grayscale'
                            }`}
                          >
                              {/* Shine effect for unlocked */}
                              {badge.unlocked && <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500"></div>}
                              
                              <div className="text-3xl mb-2 filter drop-shadow-sm">{badge.icon}</div>
                              <span className="text-[10px] font-bold text-stone-800 text-center leading-tight mb-1">{badge.label}</span>
                              <span className="text-[8px] text-stone-400 text-center">{badge.desc}</span>
                              
                              {!badge.unlocked && (
                                  <div className="absolute top-2 right-2 text-[10px]">🔒</div>
                              )}
                          </div>
                      ))}
                  </div>
              </div>

              {/* Quote Card */}
              <div className="bg-brand-900 p-8 rounded-[2rem] relative overflow-hidden shadow-xl text-white text-center">
                  <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
                  <div className="relative z-10">
                      <p className="font-serif italic text-xl leading-relaxed opacity-90">
                          "Growth is not a race, it's a rhythm. Find yours."
                      </p>
                      <div className="w-12 h-1 bg-brand-500/50 mx-auto mt-4 rounded-full"></div>
                  </div>
              </div>
          </div>
      )}

      {activeTab === 'settings' && (
          <div className="bg-white rounded-3xl border border-stone-100 shadow-sm overflow-hidden animate-fade-in divide-y divide-stone-50">
              {[
                  { label: 'Notifications', type: 'toggle', active: true },
                  { label: 'Incognito Mode', type: 'toggle', active: false },
                  { label: 'Sound Effects', type: 'toggle', active: true },
                  { label: 'Dark Mode', type: 'toggle', active: false },
                  { label: 'Help & Support', type: 'link' },
                  { label: 'Privacy Policy', type: 'link' },
              ].map((item, idx) => (
                <div key={idx} className="p-5 flex justify-between items-center hover:bg-stone-50 transition-colors cursor-pointer group">
                    <span className="text-sm font-bold text-stone-600 group-hover:text-stone-900 transition-colors">{item.label}</span>
                    {item.type === 'toggle' ? (
                        <div className={`w-11 h-6 rounded-full relative transition-colors ${item.active ? 'bg-brand-500' : 'bg-stone-200'}`}>
                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${item.active ? 'left-6' : 'left-1'}`}></div>
                        </div>
                    ) : (
                        <span className="text-stone-300 group-hover:text-brand-500 transition-colors">→</span>
                    )}
                </div>
              ))}
              
              <div className="p-5 mt-2 bg-stone-50">
                  <button 
                    onClick={onLogout}
                    className="w-full py-4 bg-white border border-stone-200 text-red-500 rounded-2xl font-bold text-sm hover:bg-red-50 hover:border-red-200 transition-all shadow-sm"
                  >
                      Sign Out
                  </button>
                  <p className="text-center text-[10px] text-stone-300 mt-4 uppercase tracking-widest">Version 1.0.0 • Common Ground</p>
              </div>
          </div>
      )}
    </div>
  );
};