
import React, { useState } from 'react';
import { UserProfile, RankInfo } from '../types';
import { AVATARS } from '../constants';
import { Bell, EyeOff, Volume2, Moon, ChevronRight, Server, LogOut } from 'lucide-react';

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

  // Settings State
  const [settings, setSettings] = useState({
    notifications: true,
    incognito: false,
    sound: true,
    darkMode: false,
  });

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Calculate Rank
  const currentMinutes = user.stats?.focusMinutes || 0;
  const currentRankIndex = RANKS.findIndex((r, i) => 
    currentMinutes >= r.minMinutes && (!RANKS[i+1] || currentMinutes < RANKS[i+1].minMinutes)
  );
  const currentRank = RANKS[currentRankIndex !== -1 ? currentRankIndex : 0];
  const nextRank = RANKS[currentRankIndex + 1];
  
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
      if (stats.streakDays < 3) return { icon: '🌱', label: 'Seedling', msg: "Needs consistency to grow." };
      if (stats.streakDays < 7) return { icon: '🌿', label: 'Sprouting', msg: "Growing strong!" };
      if (stats.streakDays < 14) return { icon: '🌸', label: 'Flowering', msg: "Beautiful progress." };
      return { icon: '🌳', label: 'Thriving', msg: "An ancient campus guardian." };
  };
  const plant = getPlantStage();

  const activeRewards = user.activeRewards || [];

  return (
    <div className="space-y-6 animate-slide-up pb-24 relative">
      {/* Header Card */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-white shadow-xl shadow-stone-200 border border-stone-100 group">
         {/* Decorative Background Image */}
         <div className="absolute inset-0 h-48">
             <img 
               src="https://images.unsplash.com/photo-1490750967868-58cb75069ed6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
               alt="Cozy Plant Background" 
               className="w-full h-full object-cover opacity-80 transition-transform duration-1000 group-hover:scale-105"
             />
             <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/40 to-white"></div>
         </div>

         <div className="relative pt-28 px-6 pb-8 text-center">
             <div className="relative inline-block mb-4">
                <div className="w-32 h-32 rounded-[2rem] bg-white border-4 border-white shadow-2xl flex items-center justify-center text-6xl animate-float relative z-10 transform rotate-3">
                    {AVATARS[user.avatarId].icon}
                </div>
                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-brand-500 rounded-full border-4 border-white flex items-center justify-center text-xs text-white font-bold z-20 shadow-md">
                    ✓
                </div>
             </div>
             
             <h2 className="text-4xl font-serif font-bold text-stone-800 tracking-tight">{user.nickname}</h2>
             <p className="text-sm text-stone-400 font-mono tracking-wider mb-8 bg-stone-50 inline-block px-4 py-1.5 rounded-full mt-3 border border-stone-100">{user.uniqueId}</p>
             
             {/* Garden Display (Visual Streak) */}
             <div className="bg-gradient-to-br from-[#FDFBF7] to-white rounded-[2rem] p-6 border border-brand-100 shadow-soft w-full relative overflow-hidden group/garden">
                <div className="flex justify-between items-center text-sm font-bold mb-4 relative z-10">
                    <span className="text-brand-800 flex items-center gap-2 font-serif text-lg">
                        My Garden
                    </span>
                    <span className="bg-brand-50 px-3 py-1 rounded-full text-xs text-brand-700 border border-brand-100 shadow-sm">{stats.streakDays} Day Streak</span>
                </div>
                <div className="flex items-center justify-between relative z-10">
                    <div className="text-left">
                        <div className="text-6xl mb-2 filter drop-shadow-md animate-float transition-transform group-hover/garden:scale-110">{plant.icon}</div>
                        <div className="text-sm font-bold text-stone-700">{plant.label} Phase</div>
                        <div className="text-xs text-stone-400 italic mt-0.5">"{plant.msg}"</div>
                    </div>
                    
                    {/* Progress Circle for Next Stage */}
                    <div className="relative w-20 h-20 flex items-center justify-center">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                            <path className="text-stone-100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                            <path className="text-brand-400" strokeDasharray={`${Math.min(100, (stats.streakDays / 14) * 100)}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                        </svg>
                        <div className="absolute text-center">
                             <span className="block text-[8px] font-bold text-stone-400 uppercase tracking-widest">Level</span>
                             <span className="block text-xl font-serif font-bold text-brand-700 leading-none">{Math.floor(stats.streakDays / 3) + 1}</span>
                        </div>
                    </div>
                </div>
                
                {/* Decorative background elements */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-brand-50/50 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
             </div>
         </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-white/50 p-1.5 rounded-[1.5rem] backdrop-blur-sm border border-white shadow-sm">
          <button 
             onClick={() => setActiveTab('stats')}
             className={`flex-1 py-3 text-xs font-bold rounded-2xl transition-all duration-300 ${activeTab === 'stats' ? 'bg-white text-stone-800 shadow-sm transform scale-100' : 'text-stone-400 hover:text-stone-600 scale-95'}`}
          >
              Journey
          </button>
          <button 
             onClick={() => setActiveTab('settings')}
             className={`flex-1 py-3 text-xs font-bold rounded-2xl transition-all duration-300 ${activeTab === 'settings' ? 'bg-white text-stone-800 shadow-sm transform scale-100' : 'text-stone-400 hover:text-stone-600 scale-95'}`}
          >
              Settings
          </button>
      </div>

      {activeTab === 'stats' && (
          <div className="space-y-6 animate-fade-in">
              {/* Active Rewards Section */}
              {activeRewards.length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-3 px-2">Active Perks</h3>
                    <div className="space-y-3">
                        {activeRewards.map(reward => (
                            <div key={reward.id} className="bg-gradient-to-r from-indigo-50 to-purple-50 p-5 rounded-[2rem] border border-indigo-100 shadow-sm flex items-start space-x-5 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-100/50 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                                <div className="text-3xl bg-white w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm relative z-10 group-hover:scale-110 transition-transform">
                                    {reward.icon}
                                </div>
                                <div className="flex-1 relative z-10">
                                    <h4 className="font-bold text-indigo-900 text-sm font-serif">{reward.title}</h4>
                                    <p className="text-xs text-indigo-700/70 mt-1 leading-relaxed">{reward.description}</p>
                                    <div className="mt-2 inline-flex items-center space-x-1 text-[10px] font-bold text-indigo-600 bg-white/60 px-2 py-0.5 rounded-lg border border-indigo-100">
                                        <span>⏳</span>
                                        <span>Expires in {reward.expiresInHours}h</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                  </div>
              )}

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-6 rounded-[2rem] border border-stone-100 shadow-soft hover:shadow-lg transition-all group">
                      <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform shadow-inner">⏳</div>
                      <div className="text-3xl font-bold text-stone-800 font-serif">{(currentMinutes / 60).toFixed(1)}<span className="text-lg">h</span></div>
                      <div className="text-[10px] text-stone-400 uppercase tracking-widest font-bold mt-1">Focus Time</div>
                  </div>
                  <div className="bg-white p-6 rounded-[2rem] border border-stone-100 shadow-soft hover:shadow-lg transition-all group">
                      <div className="w-12 h-12 rounded-2xl bg-yellow-50 text-yellow-600 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform shadow-inner">✨</div>
                      <div className="text-3xl font-bold text-stone-800 font-serif">{user.stats?.communityPoints || 0}</div>
                      <div className="text-[10px] text-stone-400 uppercase tracking-widest font-bold mt-1">Karma Points</div>
                  </div>
              </div>

              {/* Badges Section */}
              <div>
                  <div className="flex items-center justify-between px-2 mb-3">
                      <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest">Achievements</h3>
                      <span className="text-[10px] bg-stone-200 text-stone-500 px-2.5 py-0.5 rounded-full font-bold">
                          {ALL_BADGES.filter(b => b.unlocked).length}/{ALL_BADGES.length}
                      </span>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                      {ALL_BADGES.map((badge, i) => (
                          <div 
                            key={badge.id} 
                            className={`flex flex-col items-center p-4 rounded-[1.5rem] border transition-all duration-500 relative overflow-hidden ${
                                badge.unlocked 
                                    ? 'bg-white border-brand-100 shadow-sm hover:shadow-md hover:-translate-y-1' 
                                    : 'bg-stone-50 border-stone-100 opacity-60 grayscale'
                            }`}
                          >
                              {/* Shine effect for unlocked */}
                              {badge.unlocked && <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500"></div>}
                              
                              <div className="text-3xl mb-2 filter drop-shadow-sm">{badge.icon}</div>
                              <span className="text-[10px] font-bold text-stone-800 text-center leading-tight mb-1">{badge.label}</span>
                              <span className="text-[8px] text-stone-400 text-center leading-tight">{badge.desc}</span>
                              
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
                      <div className="w-12 h-1 bg-brand-500/50 mx-auto mt-6 rounded-full"></div>
                  </div>
              </div>
          </div>
      )}

      {activeTab === 'settings' && (
          <div className="space-y-4 animate-fade-in">
              {/* Preferences Group */}
              <div className="bg-white rounded-[2rem] border border-stone-100 shadow-soft overflow-hidden p-2">
                  {[
                      { id: 'notifications', label: 'Notifications', icon: Bell, active: settings.notifications },
                      { id: 'incognito', label: 'Incognito Mode', icon: EyeOff, active: settings.incognito },
                      { id: 'sound', label: 'Sound Effects', icon: Volume2, active: settings.sound },
                      { id: 'darkMode', label: 'Dark Mode', icon: Moon, active: settings.darkMode },
                  ].map((item) => (
                    <div 
                        key={item.id} 
                        onClick={() => toggleSetting(item.id as keyof typeof settings)}
                        className="p-4 flex justify-between items-center hover:bg-stone-50 rounded-2xl transition-all cursor-pointer group"
                    >
                        <div className="flex items-center space-x-4">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${item.active ? 'bg-brand-50 text-brand-600' : 'bg-stone-50 text-stone-400 group-hover:bg-stone-100 group-hover:text-stone-600'}`}>
                                <item.icon size={20} />
                            </div>
                            <span className="text-sm font-bold text-stone-700 group-hover:text-stone-900 transition-colors">{item.label}</span>
                        </div>
                        
                        {/* Custom Toggle Switch */}
                        <div className={`w-12 h-7 rounded-full relative transition-colors duration-300 ease-out border ${item.active ? 'bg-brand-500 border-brand-500' : 'bg-stone-100 border-stone-200'}`}>
                            <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-300 ease-out ${item.active ? 'translate-x-5' : 'translate-x-0.5'}`}></div>
                        </div>
                    </div>
                  ))}
              </div>

              {/* System & Account Group */}
              <div className="bg-white rounded-[2rem] border border-stone-100 shadow-soft overflow-hidden p-2 space-y-1">
                  <div 
                    onClick={() => setShowTechModal(true)}
                    className="p-4 flex justify-between items-center hover:bg-stone-50 rounded-2xl transition-all cursor-pointer group"
                  >
                     <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                            <Server size={20} />
                        </div>
                        <div>
                            <span className="block text-sm font-bold text-stone-700 group-hover:text-stone-900">Platform Architecture</span>
                            <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Google Cloud</span>
                        </div>
                     </div>
                     <ChevronRight size={18} className="text-stone-300 group-hover:text-brand-500 transition-colors" />
                  </div>

                  <div 
                    onClick={onLogout}
                    className="p-4 flex justify-between items-center hover:bg-red-50 rounded-2xl transition-all cursor-pointer group"
                  >
                     <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center group-hover:bg-red-100 transition-colors">
                            <LogOut size={20} />
                        </div>
                        <span className="text-sm font-bold text-stone-700 group-hover:text-red-600 transition-colors">Sign Out</span>
                     </div>
                  </div>
              </div>
              
              <p className="text-center text-[10px] text-stone-300 mt-6 uppercase tracking-widest font-bold">Version 1.0.0 • Common Ground</p>
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
