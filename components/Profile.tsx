
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

const TECH_STACK = [
  {
    title: "Core AI/ML Services",
    icon: "🧠",
    color: "bg-indigo-50 text-indigo-600",
    techs: ["Vertex AI", "Gemini API", "Dialogflow", "TensorFlow.js"]
  },
  // ... existing items kept for brevity, structure remains ...
  { title: "AI Safety & Moderation", icon: "🛡️", color: "bg-rose-50 text-rose-600", techs: ["Perspective API", "Recommendations AI"] },
  { title: "Language & Vision", icon: "👁️", color: "bg-teal-50 text-teal-600", techs: ["Natural Language API", "Vision AI"] },
  { title: "Predictive Intelligence", icon: "🔮", color: "bg-fuchsia-50 text-fuchsia-600", techs: ["Vertex AI Forecasting", "AutoML Tables", "Anomaly Detection"] },
  { title: "Cloud & Infrastructure", icon: "☁️", color: "bg-blue-50 text-blue-600", techs: ["Firebase", "Cloud Run", "Cloud Spanner", "Cloud SQL", "Cloud CDN", "VPC Service Controls"] },
  { title: "Maps & Geolocation", icon: "🗺️", color: "bg-green-50 text-green-600", techs: ["Google Maps Platform", "Places API", "Geocoding API", "Heatmaps"] },
  { title: "Workspace & Productivity", icon: "📚", color: "bg-yellow-50 text-yellow-600", techs: ["Calendar API", "Gmail API", "Google Meet API", "Drive API"] },
  { title: "Data & Analytics", icon: "📊", color: "bg-purple-50 text-purple-600", techs: ["Google Analytics 4", "Looker Studio", "BigQuery", "Cloud Monitoring"] },
  { title: "Security & Identity", icon: "🔐", color: "bg-slate-50 text-slate-600", techs: ["Cloud Identity", "reCAPTCHA Enterprise", "Secret Manager", "Cloud Armor"] },
  { title: "Development & Deployment", icon: "🛠️", color: "bg-orange-50 text-orange-600", techs: ["Cloud Build", "Artifact Registry", "Cloud Deploy"] }
];

export const Profile: React.FC<ProfileProps> = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'stats' | 'settings'>('stats');
  const [showTechModal, setShowTechModal] = useState(false);

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

  // Garden Logic
  const getPlantStage = () => {
      if (stats.streakDays < 3) return { icon: '🌱', label: 'Seedling Phase', msg: "Needs consistency to grow." };
      if (stats.streakDays < 7) return { icon: '🌿', label: 'Sprouting Phase', msg: "Growing strong!" };
      if (stats.streakDays < 14) return { icon: '🌸', label: 'Flowering Phase', msg: "Beautiful progress." };
      return { icon: '🌳', label: 'Thriving Phase', msg: "An ancient campus guardian." };
  };
  const plant = getPlantStage();

  return (
    <div className="space-y-6 animate-slide-up pb-24 relative">
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
             
             {/* Garden Display (Visual Streak) */}
             <div className="bg-gradient-to-br from-brand-50 to-stone-50 rounded-2xl p-4 border border-brand-100 shadow-sm w-full relative overflow-hidden">
                <div className="flex justify-between items-center text-sm font-bold mb-2 relative z-10">
                    <span className="text-brand-800 flex items-center gap-2">
                        My Garden
                    </span>
                    <span className="bg-white px-2 py-0.5 rounded-full text-[10px] text-brand-600 border border-brand-200 shadow-sm">{stats.streakDays} Day Streak</span>
                </div>
                <div className="flex items-center justify-between relative z-10">
                    <div className="text-left">
                        <div className="text-4xl mb-1 filter drop-shadow-sm animate-float">{plant.icon}</div>
                        <div className="text-xs font-bold text-stone-700">{plant.label}</div>
                        <div className="text-[10px] text-stone-400 italic">"{plant.msg}"</div>
                    </div>
                    
                    {/* Progress Circle for Next Stage */}
                    <div className="relative w-16 h-16 flex items-center justify-center">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                            <path className="text-brand-100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
                            <path className="text-brand-500" strokeDasharray={`${Math.min(100, (stats.streakDays / 14) * 100)}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                        </svg>
                        <span className="absolute text-[10px] font-bold text-brand-700">Level {Math.floor(stats.streakDays / 3) + 1}</span>
                    </div>
                </div>
                
                {/* Decorative background elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-100/50 rounded-full blur-2xl -mr-10 -mt-10"></div>
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

              <div 
                onClick={() => setShowTechModal(true)}
                className="p-5 flex justify-between items-center hover:bg-brand-50 transition-colors cursor-pointer group bg-stone-50/50"
              >
                 <div className="flex items-center space-x-3">
                    <span className="text-lg">🏗️</span>
                    <span className="text-sm font-bold text-stone-600 group-hover:text-brand-700">Platform Architecture</span>
                 </div>
                 <span className="text-stone-300 group-hover:text-brand-500">→</span>
              </div>
              
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

      {/* Tech Stack Modal */}
      {showTechModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
           <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl animate-slide-up max-h-[85vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-6">
                  <div>
                      <h3 className="text-xl font-serif font-bold text-slate-800">Platform Architecture</h3>
                      <p className="text-xs text-slate-500 uppercase tracking-widest mt-1">Powered by Google Cloud</p>
                  </div>
                  <button onClick={() => setShowTechModal(false)} className="bg-slate-100 p-2 rounded-full text-slate-500 hover:bg-slate-200">✕</button>
              </div>

              <div className="space-y-4">
                  {TECH_STACK.map((category, idx) => (
                      <div key={idx} className="bg-stone-50 rounded-2xl p-4 border border-stone-100">
                          <div className="flex items-center space-x-2 mb-3">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg ${category.color} bg-opacity-20`}>
                                  {category.icon}
                              </div>
                              <h4 className="font-bold text-slate-700 text-sm">{category.title}</h4>
                          </div>
                          <div className="flex flex-wrap gap-2">
                              {category.techs.map((tech) => (
                                  <span key={tech} className="px-2 py-1 bg-white border border-stone-200 rounded-lg text-[10px] font-medium text-slate-600 shadow-sm">
                                      {tech}
                                  </span>
                              ))}
                          </div>
                      </div>
                  ))}
              </div>

              <div className="mt-6 bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-start space-x-3">
                  <span className="text-xl">🛡️</span>
                  <div>
                      <h4 className="font-bold text-blue-800 text-xs uppercase tracking-wider">Privacy First & AI Safety</h4>
                      <p className="text-xs text-blue-700 mt-1 leading-relaxed">
                          We use <strong>VPC Service Controls</strong> for isolation and <strong>Perspective API</strong> for safe interaction. Patterns are detected via <strong>Vertex AI</strong> to provide proactive support while maintaining user anonymity.
                      </p>
                  </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
