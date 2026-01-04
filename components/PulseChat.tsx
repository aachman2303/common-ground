import React, { useState, useEffect, useRef } from 'react';
import { ViewState } from '../types';
import { CHECK_IN_OPTIONS, AVATARS } from '../constants';
import { getGroupIcebreaker } from '../services/geminiService';

interface PulseChatProps {
  userMood: string | null;
  onExit: () => void;
}

interface PulseMessage {
  id: string;
  sender: string;
  avatarIcon: string;
  text: string;
  isUser: boolean;
  isSystem?: boolean;
}

export const PulseChat: React.FC<PulseChatProps> = ({ userMood, onExit }) => {
  const [timeLeft, setTimeLeft] = useState(300);
  const [messages, setMessages] = useState<PulseMessage[]>([]);
  const [input, setInput] = useState('');
  const [icebreaker, setIcebreaker] = useState('');
  const [peerCount, setPeerCount] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const signal = CHECK_IN_OPTIONS.find(o => o.id === userMood) || CHECK_IN_OPTIONS[0];

  useEffect(() => {
    getGroupIcebreaker(signal.id).then(setIcebreaker);
    setTimeout(() => {
        setPeerCount(Math.floor(Math.random() * 4) + 3);
        addSystemMessage(`You are connected with ${Math.floor(Math.random() * 4) + 3} peers feeling "${signal.label}".`);
    }, 1000);

    const mockInterval = setInterval(() => {
        if (Math.random() > 0.7) {
            const randomAvatar = AVATARS[Math.floor(Math.random() * AVATARS.length)];
            const mockResponses = [
                "Yeah, same here.", "Library is packed.", "Just need to finish this.", "Coffee?", "We got this.", "Glad it's not just me."
            ];
            addPeerMessage(randomAvatar.icon, mockResponses[Math.floor(Math.random() * mockResponses.length)]);
        }
    }, 5000);
    return () => clearInterval(mockInterval);
  }, [signal]);

  useEffect(() => {
    if (timeLeft <= 0) { onExit(); return; }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, onExit]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const addSystemMessage = (text: string) => {
    setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'System', avatarIcon: '⚙️', text, isUser: false, isSystem: true }]);
  };
  const addPeerMessage = (icon: string, text: string) => {
      setMessages(prev => [...prev, { id: Date.now().toString() + Math.random(), sender: 'Anonymous', avatarIcon: icon, text, isUser: false }]);
  };
  const handleSend = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'You', avatarIcon: '👤', text: input, isUser: true }]);
    setInput('');
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] animate-slide-up rounded-3xl overflow-hidden bg-white shadow-soft border border-white">
      
      {/* Header */}
      <div className="bg-stone-50 p-4 border-b border-stone-100 flex justify-between items-center">
        <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-xl">{signal.icon}</div>
            <div>
                <h2 className="text-sm font-bold text-stone-800">Pulse Room</h2>
                <div className="flex items-center space-x-1">
                   <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                   <p className="text-[10px] text-stone-500 font-medium">Live • {peerCount} Online</p>
                </div>
            </div>
        </div>
        <div className="text-right">
             <div className="font-mono font-bold text-stone-700">{formatTime(timeLeft)}</div>
             <p className="text-[9px] text-stone-400 uppercase tracking-widest">Remaining</p>
        </div>
      </div>

      {/* Chat Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-stone-50/30">
        {icebreaker && (
            <div className="bg-brand-50 border border-brand-100 p-4 rounded-2xl text-center mx-4 mb-4">
                <p className="text-[10px] font-bold text-brand-400 uppercase tracking-widest mb-1">Icebreaker</p>
                <p className="text-sm font-serif italic text-brand-800">"{icebreaker}"</p>
            </div>
        )}

        {messages.map((msg) => {
            if (msg.isSystem) {
                return <div key={msg.id} className="text-center my-4"><span className="text-[10px] font-bold text-stone-400 bg-stone-100 px-3 py-1 rounded-full uppercase tracking-wider">{msg.text}</span></div>;
            }
            return (
                <div key={msg.id} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
                    {!msg.isUser && <div className="w-8 h-8 rounded-full bg-white border border-stone-100 flex items-center justify-center text-sm mr-2 shadow-sm">{msg.avatarIcon}</div>}
                    <div className={`max-w-[75%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                        msg.isUser 
                        ? 'bg-stone-800 text-white rounded-tr-none' 
                        : 'bg-white text-stone-700 border border-stone-100 rounded-tl-none'
                    }`}>
                        {msg.text}
                    </div>
                </div>
            )
        })}
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-stone-100">
        <div className="relative">
            <input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Share respectfully..."
                className="w-full bg-stone-50 border border-stone-100 rounded-full py-3.5 pl-5 pr-12 text-sm focus:ring-2 focus:ring-brand-200 focus:bg-white transition-all outline-none"
            />
            <button 
                onClick={handleSend}
                disabled={!input.trim()}
                className="absolute right-1.5 top-1.5 w-9 h-9 bg-stone-800 text-white rounded-full flex items-center justify-center shadow-md disabled:opacity-50 hover:bg-black transition-colors"
            >
                ↑
            </button>
        </div>
        <button onClick={onExit} className="w-full text-center mt-3 text-[10px] font-bold text-stone-400 hover:text-stone-600 uppercase tracking-widest">
            Leave Quietly
        </button>
      </div>
    </div>
  );
};