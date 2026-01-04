import React from 'react';
import { ViewState, UserProfile } from '../types';
import { AVATARS } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
  currentView: ViewState;
  onViewChange: (view: ViewState) => void;
  user: UserProfile | null;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentView, onViewChange, user }) => {
  const navItems = [
    { id: ViewState.CHECK_IN, label: 'Pulse', icon: '📝' },
    { id: ViewState.MAP, label: 'Map', icon: '🗺️' },
    { id: ViewState.COMMUNITY_HUB, label: 'Clubs', icon: '⛺' },
    { id: ViewState.SOCIAL_LOUNGE, label: 'Lounge', icon: '🛋️' }, 
    { id: ViewState.STUDY_ROOM, label: 'Focus', icon: '🕯️' }, 
    { id: ViewState.CALENDAR, label: 'Plan', icon: '📅' },
    { id: ViewState.CHAT, label: 'Tutor', icon: '🎓' },
  ];

  const userAvatar = user ? AVATARS[user.avatarId].icon : '👤';

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-800 max-w-md mx-auto shadow-2xl shadow-stone-300/50 overflow-hidden relative">
      
      {/* Organic Background Blobs - Cozier Colors */}
      <div className="absolute top-[-10%] left-[-10%] w-72 h-72 bg-brand-100/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
      <div className="absolute top-[-10%] right-[-10%] w-72 h-72 bg-cozy-latte/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-[-10%] left-[20%] w-72 h-72 bg-cozy-clay/10 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>

      {/* Header - Glassmorphism */}
      <header className="absolute top-0 w-full z-20 px-6 py-5 flex justify-between items-center glass-panel rounded-b-3xl">
        <div onClick={() => onViewChange(ViewState.CHECK_IN)} className="cursor-pointer">
          <h1 className="text-2xl font-serif font-bold text-brand-800 tracking-tight">Common Ground</h1>
        </div>
        <div className="flex items-center space-x-3">
           {user && (
             <div 
               className="bg-white/50 backdrop-blur-md px-3 py-1 rounded-full border border-white flex items-center space-x-1 cursor-pointer hover:bg-white/80 transition-colors"
               onClick={() => onViewChange(ViewState.SOCIAL_LOUNGE)}
             >
                <span className="text-xs font-bold text-cozy-rust">✨ {user.stats?.communityPoints || 0}</span>
             </div>
           )}
           <button 
             onClick={() => onViewChange(ViewState.PROFILE)}
             className="w-10 h-10 rounded-full bg-white/80 border border-white shadow-sm flex items-center justify-center text-xl hover:scale-105 transition-transform cursor-pointer"
           >
             {userAvatar}
           </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-5 pb-28 pt-24 scroll-smooth relative z-10">
        {children}
      </main>

      {/* Bottom Navigation - Floating Pill with Scroll */}
      {currentView !== ViewState.PROFILE && (
        <div className="absolute bottom-6 left-4 right-4 z-20">
          <nav className="glass-panel rounded-3xl px-2 py-3 shadow-soft bg-white/90 overflow-x-auto scrollbar-hide">
            <div className="flex justify-between items-center min-w-max px-2 space-x-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onViewChange(item.id)}
                  className={`flex flex-col items-center justify-center space-y-1 w-14 p-2 rounded-2xl transition-all duration-300 flex-shrink-0 ${
                    currentView === item.id 
                      ? 'text-brand-700 bg-brand-50 shadow-sm transform -translate-y-1' 
                      : 'text-stone-400 hover:text-brand-500 hover:bg-stone-50'
                  }`}
                >
                  <span className="text-xl filter drop-shadow-sm">{item.icon}</span>
                  <span className={`text-[9px] font-bold uppercase tracking-widest ${currentView === item.id ? 'opacity-100' : 'opacity-0 scale-0'} transition-all duration-300`}>
                    {item.label}
                  </span>
                </button>
              ))}
            </div>
          </nav>
        </div>
      )}
    </div>
  );
};
