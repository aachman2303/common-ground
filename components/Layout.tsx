
import React from 'react';
import { ViewState, UserProfile } from '../types';
import { AVATARS } from '../constants';
import { ArrowLeft } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentView: ViewState;
  onViewChange: (view: ViewState) => void;
  user: UserProfile | null;
  canGoBack?: boolean;
  onBack?: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentView, onViewChange, user, canGoBack, onBack }) => {
  const navItems = [
    { id: ViewState.CHECK_IN, label: 'Pulse', icon: '📝' },
    { id: ViewState.MAP, label: 'Map', icon: '🗺️' },
    { id: ViewState.GAME_ARCADE, label: 'Arcade', icon: '🎮' },
    { id: ViewState.SOCIAL_LOUNGE, label: 'Lounge', icon: '🛋️' }, 
    { id: ViewState.STUDY_ROOM, label: 'Focus', icon: '🕯️' }, 
    { id: ViewState.CALENDAR, label: 'Plan', icon: '📅' },
  ];

  const userAvatar = user ? AVATARS[user.avatarId].icon : '👤';

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7] text-stone-800 max-w-md mx-auto shadow-2xl shadow-stone-200/50 overflow-hidden relative font-sans selection:bg-brand-200 selection:text-brand-900">
      
      {/* Organic Background Blobs - Softer & Warmer */}
      <div className="absolute top-[-10%] left-[-20%] w-96 h-96 bg-orange-100/40 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
      <div className="absolute top-[-10%] right-[-20%] w-96 h-96 bg-brand-100/40 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-[-10%] left-[20%] w-80 h-80 bg-stone-200/40 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>

      {/* Header - Refined Glassmorphism */}
      <header className="absolute top-0 w-full z-20 px-6 py-5 flex justify-between items-center bg-white/60 backdrop-blur-xl border-b border-white/40 sticky">
        <div className="flex items-center gap-3">
            {canGoBack && onBack && (
                <button 
                  onClick={onBack} 
                  className="p-2 -ml-2 rounded-full hover:bg-stone-100/50 text-stone-600 transition-colors active:scale-95"
                  aria-label="Go back"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
            )}
            <div onClick={() => onViewChange(ViewState.CHECK_IN)} className="cursor-pointer">
              <h1 className="text-2xl font-serif font-bold text-stone-800 tracking-tight">Common Ground</h1>
            </div>
        </div>
        <div className="flex items-center space-x-3">
           {user && (
             <div 
               className="bg-white/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/60 flex items-center space-x-1.5 cursor-pointer hover:bg-white/60 transition-colors shadow-sm"
               onClick={() => onViewChange(ViewState.SOCIAL_LOUNGE)}
             >
                <span className="text-[10px] font-bold text-cozy-rust uppercase tracking-wider">Karma</span>
                <span className="text-xs font-bold text-stone-800">{user.stats?.communityPoints || 0}</span>
             </div>
           )}
           <button 
             onClick={() => onViewChange(ViewState.PROFILE)}
             className="w-10 h-10 rounded-full bg-white border-2 border-white shadow-sm flex items-center justify-center text-xl hover:scale-105 transition-transform cursor-pointer overflow-hidden"
           >
             {userAvatar}
           </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-5 pb-32 pt-24 scroll-smooth relative z-10 scrollbar-hide">
        {children}
      </main>

      {/* Bottom Navigation - Floating Pill */}
      {currentView !== ViewState.PROFILE && (
        <div className="absolute bottom-6 left-4 right-4 z-20">
          <nav className="bg-white/90 backdrop-blur-xl rounded-[2rem] p-2 shadow-soft border border-white/50 overflow-x-auto scrollbar-hide">
            <div className="flex justify-between items-center min-w-max px-2 space-x-1">
              {navItems.map((item) => {
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onViewChange(item.id)}
                    className={`flex flex-col items-center justify-center w-14 h-14 rounded-2xl transition-all duration-300 flex-shrink-0 relative group ${
                      isActive 
                        ? 'text-brand-800 bg-brand-50 shadow-inner' 
                        : 'text-stone-400 hover:text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    <span className={`text-xl transform transition-transform duration-300 ${isActive ? 'scale-110 -translate-y-0.5' : 'group-hover:scale-110'}`}>
                        {item.icon}
                    </span>
                    {isActive && (
                        <div className="w-1 h-1 bg-brand-500 rounded-full absolute bottom-2 animate-pop"></div>
                    )}
                  </button>
                );
              })}
            </div>
          </nav>
        </div>
      )}
    </div>
  );
};
