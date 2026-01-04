import React, { useState, useEffect, useRef } from 'react';
import { CHECK_IN_OPTIONS, AVATARS } from '../constants';
import { getPeerGreeting, getPeerReply } from '../services/geminiService';

interface OneOnOneChatProps {
  userMood: string | null;
  onExit: () => void;
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'peer';
  timestamp: Date;
}

export const OneOnOneChat: React.FC<OneOnOneChatProps> = ({ userMood, onExit }) => {
  const [status, setStatus] = useState<'searching' | 'connected' | 'ended'>('searching');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [peerAvatar, setPeerAvatar] = useState<any>(null);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const currentSignal = CHECK_IN_OPTIONS.find(o => o.id === userMood) || CHECK_IN_OPTIONS[0];

  useEffect(() => {
    // Simulate finding a peer
    const timer = setTimeout(() => {
      setStatus('connected');
      const randomAvatar = AVATARS[Math.floor(Math.random() * AVATARS.length)];
      setPeerAvatar(randomAvatar);
      
      // Initial greeting
      setIsTyping(true);
      setTimeout(async () => {
        const greeting = await getPeerGreeting(currentSignal.id);
        setMessages([{
            id: 'init',
            text: greeting,
            sender: 'peer',
            timestamp: new Date()
        }]);
        setIsTyping(false);
      }, 1500);

    }, 2500);

    return () => clearTimeout(timer);
  }, [currentSignal]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    
    // Simulate peer reply
    setIsTyping(true);
    // Random delay for "thinking"
    const delay = Math.floor(Math.random() * 2000) + 1500; 
    
    setTimeout(async () => {
        const reply = await getPeerReply(userMsg.text, currentSignal.id);
        setMessages(prev => [...prev, {
            id: Date.now().toString(),
            text: reply,
            sender: 'peer',
            timestamp: new Date()
        }]);
        setIsTyping(false);
    }, delay);
  };

  const handleLeave = () => {
      setStatus('ended');
      setTimeout(onExit, 1000);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] animate-slide-up rounded-3xl overflow-hidden bg-slate-900 shadow-2xl border border-slate-700 relative text-white">
      
      {status === 'searching' && (
          <div className="absolute inset-0 z-20 bg-slate-900 flex flex-col items-center justify-center p-6 text-center space-y-6">
              <div className="relative">
                 <div className="w-24 h-24 rounded-full border-4 border-indigo-500/30 animate-ping absolute inset-0"></div>
                 <div className="w-24 h-24 rounded-full border-4 border-t-indigo-500 border-r-indigo-500/50 border-b-indigo-500/10 border-l-indigo-500/50 animate-spin"></div>
                 <div className="absolute inset-0 flex items-center justify-center text-4xl">
                    {currentSignal.icon}
                 </div>
              </div>
              <div>
                  <h2 className="text-xl font-bold text-white">Scanning Campus...</h2>
                  <p className="text-indigo-300 text-sm mt-2">Looking for someone else feeling <br/> <span className="font-bold text-white">"{currentSignal.label}"</span></p>
              </div>
          </div>
      )}

      {status === 'ended' && (
          <div className="absolute inset-0 z-20 bg-slate-900/90 backdrop-blur flex flex-col items-center justify-center text-center p-6 animate-fade-in">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center text-2xl mb-4">👋</div>
              <h2 className="text-xl font-bold text-white">Chat Ended</h2>
              <p className="text-slate-400 text-sm mt-2">Hope you feel a little lighter.</p>
          </div>
      )}

      {/* Header */}
      <div className="bg-slate-800 p-4 border-b border-slate-700 flex justify-between items-center shadow-md z-10">
        <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-inner ${peerAvatar?.color || 'bg-slate-700'}`}>
                {peerAvatar?.icon || '?'}
            </div>
            <div>
                <h2 className="text-sm font-bold text-white">Anonymous Peer</h2>
                <div className="flex items-center space-x-1">
                   <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                   <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">Also {currentSignal.label}</p>
                </div>
            </div>
        </div>
        <button onClick={handleLeave} className="text-xs text-slate-400 hover:text-white px-3 py-1 bg-slate-700 rounded-full transition-colors">
            End Chat
        </button>
      </div>

      {/* Chat Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-900/50">
        <div className="text-center py-4">
            <span className="text-[10px] bg-slate-800 text-slate-400 px-3 py-1 rounded-full border border-slate-700">
                This chat is private and disappears when you leave.
            </span>
        </div>

        {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-appear`}>
                <div className={`max-w-[80%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                    msg.sender === 'user'
                    ? 'bg-indigo-600 text-white rounded-tr-none' 
                    : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-tl-none'
                }`}>
                    {msg.text}
                </div>
            </div>
        ))}

        {isTyping && (
             <div className="flex justify-start animate-fade-in">
                 <div className="bg-slate-800 border border-slate-700 rounded-2xl rounded-tl-none p-4 flex items-center space-x-1">
                     <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                     <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                     <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                 </div>
             </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 bg-slate-800 border-t border-slate-700">
        <div className="relative">
            <input 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Message..."
                className="w-full bg-slate-900 border border-slate-700 rounded-full py-3.5 pl-5 pr-12 text-sm text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
            />
            <button 
                onClick={handleSend}
                disabled={!inputText.trim()}
                className="absolute right-1.5 top-1.5 w-9 h-9 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-md disabled:opacity-50 hover:bg-indigo-500 transition-colors"
            >
                ↑
            </button>
        </div>
      </div>
    </div>
  );
};