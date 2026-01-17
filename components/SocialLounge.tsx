
import React, { useState } from 'react';
import { UserProfile, FeedPost, LeaderboardEntry } from '../types';
import { AVATARS, MOCK_FEED_POSTS } from '../constants';
import { HelpingHandChat } from './HelpingHandChat';
import { Heart, MessageCircle, BarChart2, Share2 } from 'lucide-react';

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
      // Basic mock voting logic
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
      {/* Tab Navigation */}
      <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-stone-100">
          <button onClick={() => setActiveTab('feed')} className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all ${activeTab === 'feed' ? 'bg-brand-50 text-brand-700 shadow-sm' : 'text-stone-400'}`}>
              ⚡ Pulse Feed
          </button>
          <button onClick={() => setActiveTab('helping')} className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all ${activeTab === 'helping' ? 'bg-cozy-latte/30 text-cozy-rust shadow-sm' : 'text-stone-400'}`}>
              🤝 Helping Hand
          </button>
          <button onClick={() => setActiveTab('leaderboard')} className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all ${activeTab === 'leaderboard' ? 'bg-yellow-50 text-yellow-700 shadow-sm' : 'text-stone-400'}`}>
              🏆 Fame
          </button>
      </div>

      {/* PULSE FEED */}
      {activeTab === 'feed' && (
          <div className="animate-fade-in space-y-5 pb-20">
              {/* Trending Ticker */}
              <div className="overflow-x-auto whitespace-nowrap scrollbar-hide pb-2">
                  <div className="flex space-x-2">
                      <span className="px-3 py-1.5 bg-gradient-to-r from-orange-100 to-red-100 text-orange-700 rounded-full text-[10px] font-bold border border-orange-200 shadow-sm animate-pulse-slow">🔥 #FinalsAreComing</span>
                      <span className="px-3 py-1.5 bg-white text-stone-600 rounded-full text-[10px] font-bold border border-stone-200">☕ #CaffeineWatch</span>
                      <span className="px-3 py-1.5 bg-white text-stone-600 rounded-full text-[10px] font-bold border border-stone-200">🌧️ #RainyStudy</span>
                      <span className="px-3 py-1.5 bg-white text-stone-600 rounded-full text-[10px] font-bold border border-stone-200">💤 #NapSpots</span>
                  </div>
              </div>

              {feed.map((post) => (
                  <div key={post.id} className="bg-white rounded-3xl overflow-hidden shadow-soft border border-stone-100 transition-transform duration-300 hover:scale-[1.01]">
                      {/* Post Header */}
                      <div className="p-4 flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                              <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-sm shadow-inner">
                                  {post.avatarIcon || '👤'}
                              </div>
                              <div>
                                  <h4 className="font-bold text-xs text-stone-800">{post.author}</h4>
                                  <p className="text-[9px] text-stone-400">{post.timestamp}</p>
                              </div>
                          </div>
                          <button className="text-stone-300 hover:text-stone-600">•••</button>
                      </div>

                      {/* Content */}
                      {post.type === 'confession' && (
                          <div className={`p-8 text-center ${post.content.color} flex flex-col justify-center min-h-[160px]`}>
                              <span className="text-2xl mb-2 opacity-20">❝</span>
                              <p className="font-serif font-bold text-lg leading-snug">{post.content.text}</p>
                          </div>
                      )}

                      {post.type === 'image' && (
                          <div className="relative">
                              <img src={post.content.imageUrl} alt="Post" className="w-full object-cover max-h-80" />
                              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 pt-12">
                                  <p className="text-white text-sm font-medium shadow-black/50 drop-shadow-md">{post.content.text}</p>
                              </div>
                          </div>
                      )}

                      {post.type === 'poll' && (
                          <div className="px-4 pb-2">
                              <h3 className="font-bold text-stone-800 mb-3">{post.content.text}</h3>
                              <div className="space-y-2">
                                  {post.content.options?.map((option, idx) => {
                                      const totalVotes = post.content.options!.reduce((acc, curr) => acc + curr.votes, 0);
                                      const percentage = Math.round((option.votes / totalVotes) * 100) || 0;
                                      return (
                                          <div key={idx} onClick={() => handleVote(post.id, idx)} className="relative h-10 bg-stone-50 rounded-lg overflow-hidden cursor-pointer group border border-stone-200 hover:border-brand-200 transition-all">
                                              <div 
                                                className="absolute top-0 left-0 h-full bg-brand-100 transition-all duration-1000 ease-out"
                                                style={{ width: `${percentage}%` }}
                                              ></div>
                                              <div className="absolute inset-0 flex items-center justify-between px-3 text-xs font-bold text-stone-700 relative z-10">
                                                  <span>{option.label}</span>
                                                  <span className="text-stone-400 group-hover:text-brand-600 transition-colors">{percentage}%</span>
                                              </div>
                                          </div>
                                      );
                                  })}
                              </div>
                              <p className="text-[9px] text-stone-400 mt-2 text-right">
                                  {post.content.options!.reduce((acc, curr) => acc + curr.votes, 0)} votes
                              </p>
                          </div>
                      )}

                      {/* Actions */}
                      <div className="p-3 flex items-center justify-between border-t border-stone-50">
                          <div className="flex space-x-4">
                              <button 
                                onClick={() => handleLike(post.id)}
                                className={`flex items-center space-x-1 text-xs font-bold transition-all ${post.isLiked ? 'text-red-500' : 'text-stone-400 hover:text-red-400'}`}
                              >
                                  <Heart size={16} fill={post.isLiked ? "currentColor" : "none"} />
                                  <span>{post.likes}</span>
                              </button>
                              <button className="flex items-center space-x-1 text-xs font-bold text-stone-400 hover:text-brand-600 transition-colors">
                                  <MessageCircle size={16} />
                                  <span>{post.comments}</span>
                              </button>
                          </div>
                          <button className="text-stone-400 hover:text-stone-600 transition-colors">
                              <Share2 size={16} />
                          </button>
                      </div>
                  </div>
              ))}
              
              <div className="text-center py-4">
                  <p className="text-xs text-stone-400 font-bold uppercase tracking-widest animate-pulse">You're all caught up</p>
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
