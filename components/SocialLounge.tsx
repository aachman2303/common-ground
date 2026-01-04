import React, { useState, useEffect } from 'react';
import { UserProfile, Meme, LeaderboardEntry } from '../types';
import { AVATARS } from '../constants';
import { HelpingHandChat } from './HelpingHandChat';

interface SocialLoungeProps {
  user: UserProfile;
}

const MOCK_MEMES: Meme[] = [
    { id: '1', imageUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=400&q=80', caption: 'When the caffeine hits at 3AM', uploader: 'NightOwl', likes: 24, laughs: 15, hearts: 5, timestamp: new Date() },
    { id: '2', imageUrl: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=400&q=80', caption: 'Me looking at the syllabus', uploader: 'StressMonster', likes: 10, laughs: 32, hearts: 2, timestamp: new Date() },
    { id: '3', imageUrl: 'https://images.unsplash.com/photo-1495615080073-6b89c98beddb?auto=format&fit=crop&w=400&q=80', caption: 'Group project meeting be like', uploader: 'LeaderOne', likes: 45, laughs: 8, hearts: 12, timestamp: new Date() },
];

const MOCK_LEADERBOARD: LeaderboardEntry[] = [
    { id: 'u1', rank: 1, nickname: 'KindSoul_99', points: 1250, badges: ['Campus Sage', 'Helper'], avatarId: 4 },
    { id: 'u2', rank: 2, nickname: 'MemeLord', points: 980, badges: ['Comedian'], avatarId: 1 },
    { id: 'u3', rank: 3, nickname: 'StudyBuddy', points: 850, badges: ['Scholar'], avatarId: 5 },
    { id: 'u4', rank: 4, nickname: 'ZenMaster', points: 720, badges: ['Listener'], avatarId: 2 },
    { id: 'u5', rank: 5, nickname: 'You', points: 450, badges: ['Rising Star'], avatarId: 0 },
];

export const SocialLounge: React.FC<SocialLoungeProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'fridge' | 'helping' | 'leaderboard'>('fridge');
  const [inHelpingChat, setInHelpingChat] = useState(false);
  const [helpRole, setHelpRole] = useState<'vent' | 'listen' | null>(null);

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-stone-100">
          <button onClick={() => setActiveTab('fridge')} className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all ${activeTab === 'fridge' ? 'bg-brand-50 text-brand-700 shadow-sm' : 'text-stone-400'}`}>
              🧊 The Fridge
          </button>
          <button onClick={() => setActiveTab('helping')} className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all ${activeTab === 'helping' ? 'bg-cozy-latte/30 text-cozy-rust shadow-sm' : 'text-stone-400'}`}>
              🤝 Helping Hand
          </button>
          <button onClick={() => setActiveTab('leaderboard')} className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all ${activeTab === 'leaderboard' ? 'bg-yellow-50 text-yellow-700 shadow-sm' : 'text-stone-400'}`}>
              🏆 Hall of Fame
          </button>
      </div>

      {/* THE FRIDGE (MEMES) */}
      {activeTab === 'fridge' && (
          <div className="animate-fade-in space-y-4">
              <div className="bg-white p-4 rounded-2xl border border-stone-100 flex justify-between items-center shadow-sm">
                  <div>
                      <h3 className="font-bold text-stone-800">Campus Humor</h3>
                      <p className="text-xs text-stone-500">Post memes, earn points.</p>
                  </div>
                  <button className="bg-stone-800 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-black transition-colors">
                      + Upload
                  </button>
              </div>

              <div className="columns-2 gap-3 space-y-3 pb-20">
                  {MOCK_MEMES.map((meme) => (
                      <div key={meme.id} className="break-inside-avoid bg-white rounded-xl overflow-hidden border border-stone-100 shadow-soft">
                          <img src={meme.imageUrl} alt="Meme" className="w-full object-cover" />
                          <div className="p-3">
                              <p className="text-xs font-bold text-stone-800 leading-tight mb-2">{meme.caption}</p>
                              <div className="flex justify-between items-center">
                                  <div className="flex space-x-2 text-[10px] text-stone-500 font-bold">
                                      <span className="cursor-pointer hover:text-red-500 transition-colors">❤️ {meme.hearts}</span>
                                      <span className="cursor-pointer hover:text-yellow-500 transition-colors">😂 {meme.laughs}</span>
                                  </div>
                                  <span className="text-[9px] text-stone-400">@{meme.uploader}</span>
                              </div>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      )}

      {/* HELPING HAND */}
      {activeTab === 'helping' && (
          <div className="animate-fade-in h-full">
              {!inHelpingChat ? (
                  <div className="bg-white rounded-3xl p-6 shadow-soft border border-cozy-latte/20 text-center space-y-6">
                      <div className="w-20 h-20 bg-cozy-latte/30 rounded-full flex items-center justify-center text-4xl mx-auto">
                          🕯️
                      </div>
                      <div>
                          <h2 className="text-2xl font-serif font-bold text-stone-800">Need a hand?</h2>
                          <p className="text-stone-500 text-sm mt-2">
                              Connect anonymously for 10 minutes. <br/> Listeners earn community points.
                          </p>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-4">
                          <button 
                             onClick={() => { setHelpRole('vent'); setInHelpingChat(true); }}
                             className="py-4 rounded-xl bg-stone-100 text-stone-600 font-bold hover:bg-stone-200 transition-colors"
                          >
                              I need to vent 😤
                          </button>
                          <button 
                             onClick={() => { setHelpRole('listen'); setInHelpingChat(true); }}
                             className="py-4 rounded-xl bg-cozy-rust text-white font-bold shadow-lg shadow-orange-200 hover:bg-yellow-700 transition-colors"
                          >
                              I can listen (Earn Points) 👂
                          </button>
                      </div>
                      <p className="text-[10px] text-stone-400 uppercase tracking-widest">Community Guidelines Apply</p>
                  </div>
              ) : (
                  <HelpingHandChat role={helpRole!} onExit={() => setInHelpingChat(false)} />
              )}
          </div>
      )}

      {/* LEADERBOARD */}
      {activeTab === 'leaderboard' && (
          <div className="animate-fade-in space-y-4 pb-20">
              <div className="bg-gradient-to-r from-yellow-100 to-orange-100 p-6 rounded-2xl shadow-sm border border-yellow-200 text-center">
                  <h3 className="font-serif font-bold text-yellow-900 text-xl">Top Contributors</h3>
                  <p className="text-xs text-yellow-800 opacity-80">Earn points by helping others and posting great content.</p>
              </div>

              <div className="space-y-2">
                  {MOCK_LEADERBOARD.map((entry, index) => (
                      <div key={entry.id} className={`flex items-center p-3 rounded-xl border ${entry.nickname === 'You' ? 'bg-brand-50 border-brand-200 ring-1 ring-brand-200' : 'bg-white border-stone-100'}`}>
                          <div className={`w-8 h-8 flex items-center justify-center font-bold rounded-lg mr-3 ${index === 0 ? 'bg-yellow-400 text-white' : index === 1 ? 'bg-stone-300 text-white' : index === 2 ? 'bg-orange-300 text-white' : 'bg-stone-100 text-stone-400'}`}>
                              {entry.rank}
                          </div>
                          <div className="w-10 h-10 rounded-full bg-stone-100 border border-white shadow-sm flex items-center justify-center text-lg mr-3">
                              {AVATARS[entry.avatarId].icon}
                          </div>
                          <div className="flex-1">
                              <h4 className="font-bold text-stone-800 text-sm">{entry.nickname}</h4>
                              <div className="flex space-x-1 mt-0.5">
                                  {entry.badges.map(b => (
                                      <span key={b} className="text-[9px] px-1.5 py-0.5 bg-stone-100 text-stone-500 rounded uppercase font-bold tracking-wider">{b}</span>
                                  ))}
                              </div>
                          </div>
                          <div className="text-right">
                              <span className="font-mono font-bold text-brand-600">{entry.points}</span>
                              <span className="text-[9px] text-stone-400 block uppercase">pts</span>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      )}
    </div>
  );
};
