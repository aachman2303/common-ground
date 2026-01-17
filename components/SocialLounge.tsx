
import React, { useState } from 'react';
import { UserProfile, FeedPost, LeaderboardEntry } from '../types';
import { AVATARS, MOCK_FEED_POSTS } from '../constants';
import { HelpingHandChat } from './HelpingHandChat';
import { Heart, MessageCircle, Share2 } from 'lucide-react';

interface SocialLoungeProps {
  user: UserProfile;
}

const MOCK_LEADERBOARD: LeaderboardEntry[] = [
    { id: 'u1', rank: 1, nickname: 'KindSoul_99', points: 1250, badges: ['Campus Sage', 'Helper'], avatarId: 4 },
    { id: 'u2', rank: 2, nickname: 'MemeLord', points: 980, badges: ['Comedian'], avatarId: 1 },
    { id: 'u3', rank: 3, nickname: 'StudyBuddy', points: 850, badges: ['Scholar'], avatarId: 5 },
    { id: 'u4', rank: 4, nickname: 'ZenMaster', points: 720, badges: ['Listener'], avatarId: 2 },
    { id: 'u5', rank: 5, nickname: 'You', points: 450, badges: ['Rising Star'], avatarId: 0 },
];

export const SocialLounge: React.FC<SocialLoungeProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'feed' | 'helping' | 'leaderboard'>('feed');
  const [inHelpingChat, setInHelpingChat] = useState(false);
  const [helpRole, setHelpRole] = useState<'vent' | 'listen' | null>(null);
  const [feed, setFeed] = useState<FeedPost[]>(MOCK_FEED_POSTS);

  const handleVote = (postId: string, optionIdx: number) => {
      setFeed(prev => prev.map(post => {
          if (post.id === postId && post.content.options) {
              const newOptions = [...post.content.options];
              newOptions[optionIdx].votes += 1;
              return { ...post, content: { ...post.content, options: newOptions }};
          }
          return post;
      }));
  };

  const handleLike = (postId: string) => {
      setFeed(prev => prev.map(post => 
          post.id === postId ? { ...post, likes: post.isLiked ? post.likes - 1 : post.likes + 1, isLiked: !post.isLiked } : post
      ));
  };

  return (
    <div className="space-y-6">
      {/* Aesthetic Tab Navigation */}
      <div className="flex bg-stone-100/50 p-1.5 rounded-[1.5rem] shadow-inner border border-stone-200/50 backdrop-blur-sm">
          {['feed', 'helping', 'leaderboard'].map((tab) => (
             <button 
                key={tab}
                onClick={() => setActiveTab(tab as any)} 
                className={`flex-1 py-3 text-xs font-bold rounded-2xl transition-all duration-300 ${
                    activeTab === tab 
                    ? 'bg-white text-stone-800 shadow-sm transform scale-100' 
                    : 'text-stone-400 hover:text-stone-600 scale-95'
                }`}
            >
              {tab === 'feed' && '⚡ Pulse'}
              {tab === 'helping' && '🤝 Hand'}
              {tab === 'leaderboard' && '🏆 Fame'}
            </button>
          ))}
      </div>

      {/* PULSE FEED */}
      {activeTab === 'feed' && (
          <div className="animate-fade-in space-y-6 pb-20">
              {/* Trending Ticker */}
              <div className="overflow-x-auto whitespace-nowrap scrollbar-hide pb-2 -mx-2 px-2">
                  <div className="flex space-x-3">
                      <span className="px-4 py-2 bg-gradient-to-r from-orange-50 to-red-50 text-orange-700 rounded-full text-[10px] font-bold border border-orange-100 shadow-sm animate-pulse-slow">🔥 #FinalsAreComing</span>
                      <span className="px-4 py-2 bg-white text-stone-600 rounded-full text-[10px] font-bold border border-stone-100 shadow-sm">☕ #CaffeineWatch</span>
                      <span className="px-4 py-2 bg-white text-stone-600 rounded-full text-[10px] font-bold border border-stone-100 shadow-sm">🌧️ #RainyStudy</span>
                  </div>
              </div>

              {feed.map((post) => (
                  <div key={post.id} className="bg-white rounded-[2rem] overflow-hidden shadow-soft border border-stone-100 transition-all duration-300 hover:shadow-lg group">
                      {/* Post Header */}
                      <div className="p-5 flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 rounded-full bg-stone-50 flex items-center justify-center text-lg border border-stone-100">
                                  {post.avatarIcon || '👤'}
                              </div>
                              <div>
                                  <h4 className="font-bold text-sm text-stone-800">{post.author}</h4>
                                  <p className="text-[10px] text-stone-400 font-medium tracking-wide">{post.timestamp}</p>
                              </div>
                          </div>
                          <button className="text-stone-300 hover:text-stone-600 px-2">•••</button>
                      </div>

                      {/* Content */}
                      {post.type === 'confession' && (
                          <div className={`p-10 text-center ${post.content.color} flex flex-col justify-center min-h-[200px] relative overflow-hidden`}>
                              <div className="absolute top-4 left-4 text-6xl opacity-10 font-serif">“</div>
                              <p className="font-serif font-bold text-xl leading-relaxed relative z-10">{post.content.text}</p>
                              <div className="absolute bottom-4 right-4 text-6xl opacity-10 font-serif rotate-180">“</div>
                          </div>
                      )}

                      {post.type === 'image' && (
                          <div className="relative">
                              <img src={post.content.imageUrl} alt="Post" className="w-full object-cover max-h-96" />
                              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-6 pt-20">
                                  <p className="text-white text-lg font-serif font-medium drop-shadow-md">{post.content.text}</p>
                              </div>
                          </div>
                      )}

                      {post.type === 'poll' && (
                          <div className="px-6 pb-4">
                              <h3 className="font-serif font-bold text-xl text-stone-800 mb-4">{post.content.text}</h3>
                              <div className="space-y-3">
                                  {post.content.options?.map((option, idx) => {
                                      const totalVotes = post.content.options!.reduce((acc, curr) => acc + curr.votes, 0);
                                      const percentage = Math.round((option.votes / totalVotes) * 100) || 0;
                                      return (
                                          <div key={idx} onClick={() => handleVote(post.id, idx)} className="relative h-12 bg-stone-50 rounded-xl overflow-hidden cursor-pointer group/opt border border-stone-100 hover:border-brand-200 transition-all">
                                              <div 
                                                className="absolute top-0 left-0 h-full bg-brand-100/50 transition-all duration-1000 ease-out"
                                                style={{ width: `${percentage}%` }}
                                              ></div>
                                              <div className="absolute inset-0 flex items-center justify-between px-4 text-sm font-bold text-stone-700 relative z-10">
                                                  <span>{option.label}</span>
                                                  <span className="text-stone-400 group-hover/opt:text-brand-600 transition-colors">{percentage}%</span>
                                              </div>
                                          </div>
                                      );
                                  })}
                              </div>
                              <p className="text-[10px] text-stone-400 mt-3 text-right font-medium uppercase tracking-wider">
                                  {post.content.options!.reduce((acc, curr) => acc + curr.votes, 0)} votes
                              </p>
                          </div>
                      )}

                      {/* Actions */}
                      <div className="px-5 py-4 flex items-center justify-between border-t border-stone-50 mt-2">
                          <div className="flex space-x-6">
                              <button 
                                onClick={() => handleLike(post.id)}
                                className={`flex items-center space-x-2 text-xs font-bold transition-all ${post.isLiked ? 'text-rose-500' : 'text-stone-400 hover:text-rose-400'}`}
                              >
                                  <Heart size={20} fill={post.isLiked ? "currentColor" : "none"} />
                                  <span>{post.likes}</span>
                              </button>
                              <button className="flex items-center space-x-2 text-xs font-bold text-stone-400 hover:text-brand-600 transition-colors">
                                  <MessageCircle size={20} />
                                  <span>{post.comments}</span>
                              </button>
                          </div>
                          <button className="text-stone-300 hover:text-stone-600 transition-colors p-2 -mr-2">
                              <Share2 size={20} />
                          </button>
                      </div>
                  </div>
              ))}
              
              <div className="text-center py-6">
                  <div className="w-16 h-1 bg-stone-200 rounded-full mx-auto mb-2"></div>
                  <p className="text-xs text-stone-400 font-bold uppercase tracking-widest">You're all caught up</p>
              </div>
          </div>
      )}

      {/* HELPING HAND */}
      {activeTab === 'helping' && (
          <div className="animate-fade-in h-full">
              {!inHelpingChat ? (
                  <div className="bg-white rounded-[2.5rem] p-8 shadow-soft border border-stone-100 text-center space-y-8 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-cozy-latte/20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
                      
                      <div className="w-24 h-24 bg-stone-50 rounded-full flex items-center justify-center text-5xl mx-auto shadow-inner border border-stone-100">
                          🕯️
                      </div>
                      <div>
                          <h2 className="text-3xl font-serif font-bold text-stone-800">Need a hand?</h2>
                          <p className="text-stone-500 font-medium mt-3 leading-relaxed">
                              Connect anonymously for 10 minutes. <br/> A safe space to vent or support.
                          </p>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-4">
                          <button 
                             onClick={() => { setHelpRole('vent'); setInHelpingChat(true); }}
                             className="py-5 rounded-2xl bg-stone-50 text-stone-700 font-bold hover:bg-stone-100 transition-colors border border-stone-100 text-lg"
                          >
                              I need to vent 😤
                          </button>
                          <button 
                             onClick={() => { setHelpRole('listen'); setInHelpingChat(true); }}
                             className="py-5 rounded-2xl bg-cozy-rust text-white font-bold shadow-lg shadow-orange-200/50 hover:bg-yellow-700 transition-colors text-lg"
                          >
                              I can listen (Earn Points) 👂
                          </button>
                      </div>
                      <p className="text-[10px] text-stone-400 uppercase tracking-widest font-bold">Community Guidelines Apply</p>
                  </div>
              ) : (
                  <HelpingHandChat role={helpRole!} onExit={() => setInHelpingChat(false)} />
              )}
          </div>
      )}

      {/* LEADERBOARD */}
      {activeTab === 'leaderboard' && (
          <div className="animate-fade-in space-y-5 pb-20">
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-8 rounded-[2rem] shadow-sm border border-yellow-100 text-center relative overflow-hidden">
                  <div className="absolute -top-10 -left-10 w-40 h-40 bg-yellow-200/30 rounded-full blur-3xl"></div>
                  <h3 className="font-serif font-bold text-yellow-900 text-2xl relative z-10">Hall of Fame</h3>
                  <p className="text-sm text-yellow-800/80 mt-1 relative z-10 font-medium">Recognizing our kindest souls.</p>
              </div>

              <div className="space-y-3">
                  {MOCK_LEADERBOARD.map((entry, index) => (
                      <div key={entry.id} className={`flex items-center p-4 rounded-2xl border transition-all hover:scale-[1.01] ${entry.nickname === 'You' ? 'bg-brand-50/50 border-brand-200 shadow-sm' : 'bg-white border-stone-100 shadow-soft'}`}>
                          <div className={`w-10 h-10 flex items-center justify-center font-bold rounded-xl mr-4 shadow-sm text-sm ${index === 0 ? 'bg-yellow-400 text-white' : index === 1 ? 'bg-stone-300 text-white' : index === 2 ? 'bg-orange-300 text-white' : 'bg-stone-100 text-stone-400'}`}>
                              #{entry.rank}
                          </div>
                          <div className="w-12 h-12 rounded-full bg-stone-50 border-2 border-white shadow-sm flex items-center justify-center text-2xl mr-4">
                              {AVATARS[entry.avatarId].icon}
                          </div>
                          <div className="flex-1">
                              <h4 className="font-bold text-stone-800">{entry.nickname}</h4>
                              <div className="flex flex-wrap gap-1 mt-1">
                                  {entry.badges.map(b => (
                                      <span key={b} className="text-[9px] px-2 py-0.5 bg-stone-100 text-stone-500 rounded-md uppercase font-bold tracking-wider border border-stone-200">{b}</span>
                                  ))}
                              </div>
                          </div>
                          <div className="text-right">
                              <span className="font-mono font-bold text-brand-700 text-lg block">{entry.points}</span>
                              <span className="text-[9px] text-stone-400 uppercase font-bold tracking-wide">Karma</span>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      )}
    </div>
  );
};
