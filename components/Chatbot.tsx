import React, { useState, useRef, useEffect } from 'react';
import { sendMessageToTutor } from '../services/geminiService';
import { ChatMessage } from '../types';

export const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      text: "I am your dedicated Academic Tutor. I specialize in solving complex problems. Upload an image of your homework or type a question.",
      isUser: false,
      timestamp: new Date(),
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [attachment, setAttachment] = useState<string | null>(null); // base64
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
              setAttachment(reader.result as string);
          };
          reader.readAsDataURL(file);
      }
  };

  const handleSend = async () => {
    if (!inputText.trim() && !attachment) return;

    // Remove prefix for API call if it's a data URL, but keep it for display
    const rawBase64 = attachment ? attachment.split(',')[1] : undefined;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date(),
      attachment: attachment ? { type: 'image', data: attachment } : undefined
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setAttachment(null);
    setIsThinking(true);

    try {
      const responseText = await sendMessageToTutor(userMsg.text, rawBase64);
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error("Chat error:", error);
    } finally {
      setIsThinking(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-180px)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-md">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
            </svg>
          </div>
          <div>
            <h2 className="font-bold text-slate-800">Academic Tutor</h2>
            <div className="flex items-center space-x-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
              <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-wide">Gemini 3.0 Pro</p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2 pb-4 scroll-smooth">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed shadow-sm ${
                msg.isUser
                  ? 'bg-brand-600 text-white rounded-tr-none'
                  : 'bg-white border border-slate-100 text-slate-700 rounded-tl-none'
              }`}
            >
              {msg.attachment && (
                  <div className="mb-2 rounded-lg overflow-hidden border border-white/20">
                      <img src={msg.attachment.data} alt="Upload" className="max-w-full h-auto" />
                  </div>
              )}
              {msg.text.split('\n').map((line, i) => (
                <p key={i} className={i > 0 ? 'mt-2' : ''}>{line}</p>
              ))}
              <div className={`text-[10px] mt-2 opacity-50 ${msg.isUser ? 'text-brand-100' : 'text-slate-400'}`}>
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        
        {isThinking && (
          <div className="flex justify-start animate-fade-in">
            <div className="bg-white border border-indigo-100 rounded-2xl rounded-tl-none p-4 shadow-sm flex items-center space-x-3">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
              <span className="text-xs font-bold text-indigo-600 animate-pulse">Analyzing...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="mt-2 relative">
        {attachment && (
            <div className="absolute bottom-16 left-0 bg-white border border-slate-200 p-2 rounded-xl shadow-lg flex items-center space-x-2 animate-slide-up">
                <img src={attachment} className="w-10 h-10 rounded object-cover" alt="Preview" />
                <button onClick={() => setAttachment(null)} className="text-red-500 font-bold text-xs hover:bg-red-50 p-1 rounded">✕</button>
            </div>
        )}
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Type or upload..."
          className="w-full bg-white border border-slate-200 rounded-xl pl-12 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none h-14 shadow-sm placeholder:text-slate-400"
        />
        
        {/* Upload Button */}
        <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*"
            onChange={handleFileChange} 
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="absolute left-2 top-2 p-2 rounded-lg text-slate-400 hover:text-indigo-600 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
          </svg>
        </button>

        <button
          onClick={handleSend}
          disabled={(!inputText.trim() && !attachment) || isThinking}
          className={`absolute right-2 top-2 p-2 rounded-lg transition-colors ${
            (!inputText.trim() && !attachment) || isThinking
              ? 'bg-slate-100 text-slate-300'
              : 'bg-indigo-600 text-white hover:bg-indigo-700'
          }`}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </div>
    </div>
  );
};
