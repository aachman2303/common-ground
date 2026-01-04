import React, { useState, useEffect, useRef } from 'react';
import { AVATARS } from '../constants';

interface HelpingHandChatProps {
  role: 'vent' | 'listen';
  onExit: () => void;
}

interface Message {
  id: string;
  text: string;
  sender: 'me' | 'them';
}

export const HelpingHandChat: React.FC<HelpingHandChatProps> = ({ role, onExit }) => {
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [rating, setRating] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
        setTimeLeft((prev) => {
            if (prev <= 1) {
                clearInterval(timer);
                setShowFeedback(true);
                return 0;
            }
            return prev - 1;
        });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
      const m = Math.floor(seconds / 60);
      const s = seconds % 60;
      return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleSend = () => {
      if(!input.trim()) return;
      setMessages([...messages, { id: Date.now().toString(), text: input, sender: 'me' }]);
      setInput('');
      
      // Mock Reply
      setTimeout(() => {
          setMessages(prev => [...prev, { 
              id: Date.now().toString(), 
              text: role === 'vent' ? "I hear you. That sounds really tough." : "It feels like everything is piling up at once.", 
              sender: 'them' 
          }]);
      }, 2000);
  };

  if (showFeedback) {
      return (
          <div className="bg-white rounded-3xl p-8 text-center shadow-soft animate-pop border border-stone-100">
              <div className="text-4xl mb-4">🌟</div>
              <h3 className="font-bold text-xl text-stone-800 mb-2">Session Ended</h3>
              <p className="text-stone-500 text-sm mb-6">
                  {role === 'vent' ? "Did your listener help you feel heard?" : "Thank you for lending an ear."}
              </p>
              
              {role === 'vent' && (
                  <div className="flex justify-center space-x-2 mb-6">
                      {[1, 2, 3, 4, 5].map(star => (
                          <button 
                            key={star} 
                            onClick={() => setRating(star)}
                            className={`text-2xl transition-transform hover:scale-125 ${rating >= star ? 'grayscale-0' : 'grayscale opacity-30'}`}
                          >
                              ⭐
                          </button>
                      ))}
                  </div>
              )}

              <button 
                onClick={onExit}
                className="w-full py-3 bg-brand-600 text-white rounded-xl font-bold shadow-lg shadow-brand-200"
              >
                  {role === 'vent' ? "Submit & Close" : "Return to Lounge"}
              </button>
          </div>
      );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-180px)] bg-stone-50 rounded-2xl overflow-hidden border border-stone-200 shadow-inner">
       {/* Header */}
       <div className="bg-white p-4 border-b border-stone-100 flex justify-between items-center shadow-sm">
           <div className="flex items-center space-x-2">
               <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
               <span className="font-bold text-sm text-stone-700">
                   {role === 'vent' ? 'Anonymous Listener' : 'Anonymous Peer'}
               </span>
           </div>
           <div className={`font-mono font-bold ${timeLeft < 60 ? 'text-red-500' : 'text-stone-400'}`}>
               {formatTime(timeLeft)}
           </div>
       </div>

       {/* Messages */}
       <div className="flex-1 overflow-y-auto p-4 space-y-4">
           {messages.length === 0 && (
               <div className="text-center mt-10 opacity-50">
                   <p className="text-xs font-bold uppercase tracking-widest text-stone-400">Session Started</p>
                   <p className="text-sm text-stone-500 mt-2">
                       {role === 'vent' ? "Go ahead, let it out. This is a safe space." : "Waiting for them to share..."}
                   </p>
               </div>
           )}
           {messages.map((msg) => (
               <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                   <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.sender === 'me' ? 'bg-brand-600 text-white rounded-tr-none' : 'bg-white border border-stone-100 text-stone-700 rounded-tl-none'}`}>
                       {msg.text}
                   </div>
               </div>
           ))}
       </div>

       {/* Input */}
       <div className="p-3 bg-white border-t border-stone-100 flex space-x-2">
           <input 
             value={input}
             onChange={(e) => setInput(e.target.value)}
             onKeyDown={(e) => e.key === 'Enter' && handleSend()}
             placeholder="Type a message..."
             className="flex-1 bg-stone-50 border border-stone-100 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-brand-300"
           />
           <button onClick={handleSend} className="bg-stone-800 text-white w-10 h-10 rounded-xl flex items-center justify-center font-bold">↑</button>
       </div>
       <button onClick={() => setShowFeedback(true)} className="text-[10px] text-stone-400 font-bold uppercase text-center py-2 hover:text-red-400">End Session Early</button>
    </div>
  );
};
