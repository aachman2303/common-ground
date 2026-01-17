
import React, { useState } from 'react';
import { CHECK_IN_OPTIONS } from '../constants';
import { ArrowRight } from 'lucide-react';

interface CheckInProps {
  onComplete: (mood: string) => void;
}

export const CheckIn: React.FC<CheckInProps> = ({ onComplete }) => {
  const [step, setStep] = useState<'select' | 'customize' | 'posting'>('select');
  const [selectedMoodId, setSelectedMoodId] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [activeSticker, setActiveSticker] = useState<string | null>(null);

  const selectedMood = CHECK_IN_OPTIONS.find(o => o.id === selectedMoodId);

  const handleSelect = (id: string) => {
    setSelectedMoodId(id);
    setStep('customize');
  };

  const handlePost = () => {
    if (!selectedMoodId) return;
    setStep('posting');
    setTimeout(() => {
        onComplete(selectedMoodId);
    }, 2000);
  };

  const STICKERS = [
      { id: 'lib', icon: '📚', label: 'Library' },
      { id: 'coffee', icon: '☕', label: 'Fueling' },
      { id: 'music', icon: '🎧', label: 'Locked In' },
      { id: 'night', icon: '🦉', label: 'Late Night' },
  ];

  if (step === 'posting') {
      return (
          <div className="flex flex-col items-center justify-center h-[60vh] animate-fade-in text-center px-6">
              <div className="relative">
                  <div className="w-24 h-24 rounded-full border-4 border-stone-100 border-t-brand-500 animate-spin mb-6"></div>
                  <div className="absolute inset-0 flex items-center justify-center text-4xl animate-bounce">
                      {selectedMood?.icon}
                  </div>
              </div>
              <h2 className="text-3xl font-serif font-bold text-stone-800 mb-2">Sharing Vibe...</h2>
              <p className="text-stone-500 font-medium">Connecting you with {selectedMood?.count} others.</p>
          </div>
      );
  }

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-20%] right-[-20%] w-80 h-80 bg-brand-100/30 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-[-10%] left-[-20%] w-80 h-80 bg-orange-100/30 rounded-full blur-3xl -z-10"></div>

      {step === 'select' && (
        <div className="flex-1 flex flex-col animate-slide-up">
            <div className="px-2 pt-2 pb-6">
                <h1 className="text-4xl font-serif font-bold text-stone-800 tracking-tight mb-2">Your Story</h1>
                <p className="text-stone-500 font-medium text-lg opacity-80">How is the campus treating you?</p>
            </div>

            <div className="flex-1 grid grid-cols-2 gap-4 px-1 pb-20 overflow-y-auto scrollbar-hide">
                {CHECK_IN_OPTIONS.map((option, idx) => (
                    <button
                        key={option.id}
                        onClick={() => handleSelect(option.id)}
                        className="relative group aspect-[4/5] rounded-[2rem] border border-stone-100 bg-white p-6 flex flex-col items-center justify-center shadow-soft hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                        style={{ animationDelay: `${idx * 50}ms` }}
                    >
                        {/* Soft Gradient Overlay on Hover */}
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-stone-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        
                        <span className="text-6xl mb-6 transform group-hover:scale-110 transition-transform duration-500 filter drop-shadow-sm">{option.icon}</span>
                        <span className="font-bold text-stone-800 text-sm relative z-10 leading-tight">{option.label}</span>
                        <span className="text-[10px] font-bold text-stone-400 mt-2 relative z-10 bg-stone-50 px-2 py-1 rounded-full">{option.count} posts</span>
                        
                        <div className="absolute bottom-4 right-4 w-8 h-8 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                            <ArrowRight size={14} />
                        </div>
                    </button>
                ))}
            </div>
        </div>
      )}

      {step === 'customize' && selectedMood && (
        <div className="flex-1 flex flex-col animate-fade-in relative z-10">
            {/* Header Controls */}
            <div className="flex justify-between items-center px-4 py-2">
                <button onClick={() => setStep('select')} className="text-stone-400 hover:text-stone-600 font-bold text-xs uppercase tracking-widest">
                    Cancel
                </button>
                <div className="flex space-x-2">
                    <span className="w-2 h-2 rounded-full bg-brand-500"></span>
                    <span className="w-2 h-2 rounded-full bg-stone-200"></span>
                </div>
            </div>

            {/* Canvas Area */}
            <div className="flex-1 px-4 py-4 flex items-center justify-center">
                <div className="w-full aspect-[3/4] max-h-[500px] bg-white rounded-[2.5rem] shadow-2xl border border-stone-100 relative overflow-hidden flex flex-col items-center justify-center p-8 group">
                    {/* Dynamic Background */}
                    <div className={`absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/noise.png')]`}></div>
                    <div className={`absolute inset-0 opacity-30 bg-gradient-to-br ${
                        selectedMood.id === 'heavy_load' ? 'from-red-50 to-orange-50' :
                        selectedMood.id === 'steady_pace' ? 'from-green-50 to-emerald-50' :
                        'from-blue-50 to-indigo-50'
                    }`}></div>

                    {/* Content */}
                    <div className="relative z-10 text-center transform group-hover:scale-[1.01] transition-transform duration-500">
                        <div className="text-9xl mb-8 filter drop-shadow-md animate-float">{selectedMood.icon}</div>
                        <h2 className="text-3xl font-serif font-bold text-stone-800 mb-6">{selectedMood.label}</h2>
                        
                        {/* Interactive Sticker */}
                        {activeSticker && (
                            <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-md px-5 py-2.5 rounded-2xl shadow-sm border border-white mb-6 animate-pop">
                                <span className="text-lg">{STICKERS.find(s => s.id === activeSticker)?.icon}</span>
                                <span className="text-xs font-bold text-stone-600 uppercase tracking-wider">{STICKERS.find(s => s.id === activeSticker)?.label}</span>
                            </div>
                        )}

                        {/* Caption Input */}
                        <div className="relative w-full max-w-[240px] mx-auto">
                            <input
                                value={caption}
                                onChange={(e) => setCaption(e.target.value)}
                                placeholder="Add a thought..."
                                maxLength={60}
                                className="w-full bg-stone-50/50 hover:bg-stone-50 focus:bg-white placeholder:text-stone-400 text-stone-800 text-center font-medium p-4 rounded-2xl border-none focus:ring-2 focus:ring-brand-100 transition-all shadow-inner"
                                autoFocus
                            />
                            <div className="absolute -bottom-6 right-2 text-[10px] text-stone-300 font-bold tracking-widest">{caption.length}/60</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sticker Drawer */}
            <div className="px-4 py-2">
                <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-3 ml-2">Add Sticker</p>
                <div className="flex space-x-3 overflow-x-auto pb-4 px-2 scrollbar-hide">
                    {STICKERS.map(s => (
                        <button
                            key={s.id}
                            onClick={() => setActiveSticker(s.id === activeSticker ? null : s.id)}
                            className={`flex-shrink-0 px-5 py-3 rounded-2xl flex items-center space-x-2 border transition-all ${
                                activeSticker === s.id 
                                ? 'bg-stone-800 text-white border-stone-800 shadow-lg transform -translate-y-1' 
                                : 'bg-white text-stone-600 border-stone-200 hover:border-brand-300 hover:bg-stone-50'
                            }`}
                        >
                            <span className="text-xl">{s.icon}</span>
                            <span className="text-xs font-bold">{s.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Post Button */}
            <div className="px-6 pb-6">
                <button
                    onClick={handlePost}
                    className="w-full py-4 bg-stone-900 text-white rounded-2xl font-bold text-lg shadow-xl shadow-stone-300 flex items-center justify-center space-x-3 hover:bg-black transition-all active:scale-95 group"
                >
                    <span>Share to Campus Map</span>
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>
      )}
    </div>
  );
};
