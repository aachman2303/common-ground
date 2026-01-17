
import React, { useState, useEffect, useRef } from 'react';
import { getStudyMotivation } from '../services/geminiService';
import { AVATARS } from '../constants';
import { UserProfile } from '../types';

interface StudyRoomProps {
  user: UserProfile | null;
  onSessionComplete: (minutes: number) => void;
}

const AMBIENT_SOUNDS = [
  { id: 'rain', label: 'Rain', icon: '🌧️', url: 'https://assets.mixkit.co/active_storage/sfx/2393/2393-preview.mp3' },
  { id: 'cafe', label: 'Cafe', icon: '☕', url: 'https://assets.mixkit.co/active_storage/sfx/440/440-preview.mp3' },
  { id: 'fire', label: 'Fire', icon: '🔥', url: 'https://assets.mixkit.co/active_storage/sfx/1330/1330-preview.mp3' },
];

const VIBES = [
    { id: 'default', label: 'Clean', color: 'bg-white' },
    { id: 'lofi', label: 'Lo-Fi', color: 'bg-purple-50/50' },
    { id: 'dark', label: 'Night', color: 'bg-stone-800 text-white' },
    { id: 'nature', label: 'Nature', color: 'bg-green-50/50' }
];

export const StudyRoom: React.FC<StudyRoomProps> = ({ user, onSessionComplete }) => {
  const [isActive, setIsActive] = useState(false);
  const [initialTime, setInitialTime] = useState(25 * 60);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [motivation, setMotivation] = useState<string>("");
  const [loadingQuote, setLoadingQuote] = useState(false);
  const [rouletteMode, setRouletteMode] = useState<'idle' | 'searching' | 'matched'>('idle');
  const [buddy, setBuddy] = useState<any>(null);
  const [activeSoundId, setActiveSoundId] = useState<string | null>(null);
  const [isPlayingSound, setIsPlayingSound] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [selectedBadge, setSelectedBadge] = useState<string | null>(null);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [currentVibe, setCurrentVibe] = useState('default');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Stats for badges
  const stats = user?.stats || { focusMinutes: 0, streakDays: 0, communitiesJoined: 0, sessionsCompleted: 0 };

  const ACHIEVEMENTS = [
    { id: '1', icon: '🌙', label: 'Late-night Scholar', desc: 'Focus session past midnight', unlocked: stats.sessionsCompleted >= 5 },
    { id: '2', icon: '👥', label: 'Community Pillar', desc: 'Studied with 100 peers', unlocked: stats.communitiesJoined >= 5 },
    { id: '3', icon: '🔥', label: 'Deep Work', desc: '2 hour continuous streak', unlocked: stats.focusMinutes >= 120 },
    { id: '4', icon: '🧘', label: 'Zen Master', desc: 'Completed 50 sessions', unlocked: stats.sessionsCompleted >= 50 },
    { id: '5', icon: '🌱', label: 'Early Bird', desc: 'Session before 8 AM', unlocked: false },
  ];

  // Timer Ring Calculations
  const size = 260;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = timeLeft / initialTime;
  const strokeDashoffset = circumference * (1 - progress);

  useEffect(() => {
    let interval: any;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      onSessionComplete(initialTime / 60);
      setSessionCompleted(true);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, initialTime, onSessionComplete]);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const changeDuration = (minutes: number) => {
    const newTime = minutes * 60;
    setInitialTime(newTime);
    setTimeLeft(newTime);
    setIsActive(false);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(initialTime);
  };

  const toggleTimer = () => setIsActive(!isActive);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleGetMotivation = async () => {
    setLoadingQuote(true);
    const quote = await getStudyMotivation();
    setMotivation(quote);
    setLoadingQuote(false);
  };

  const startRoulette = () => {
    setRouletteMode('searching');
    setTimeout(() => {
        const randomAvatar = AVATARS[Math.floor(Math.random() * AVATARS.length)];
        setBuddy(randomAvatar);
        setRouletteMode('matched');
        const sessionDuration = 30 * 60;
        setInitialTime(sessionDuration);
        setTimeLeft(sessionDuration);
        setIsActive(true);
    }, 2500);
  };

  const toggleSound = (sound: typeof AMBIENT_SOUNDS[0]) => {
    if (activeSoundId === sound.id) {
      if (isPlayingSound) {
        audioRef.current?.pause();
        setIsPlayingSound(false);
      } else {
        audioRef.current?.play().catch(e => console.error("Resume failed:", e));
        setIsPlayingSound(true);
      }
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      try {
        const audio = new Audio(sound.url);
        audio.loop = true;
        audio.volume = volume;
        audio.crossOrigin = "anonymous";
        audio.onerror = (e) => {
            console.error("Audio loading error:", e);
            setIsPlayingSound(false);
            setActiveSoundId(null);
        };
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.then(() => setIsPlayingSound(true)).catch(error => setIsPlayingSound(false));
        }
        audioRef.current = audio;
        setActiveSoundId(sound.id);
      } catch (err) { console.error(err); }
    }
  };

  const activeVibeObj = VIBES.find(v => v.id === currentVibe) || VIBES[0];
  const isDarkMode = currentVibe === 'dark';

  return (
    <div className={`space-y-6 flex flex-col min-h-full animate-appear relative transition-colors duration-500 rounded-3xl p-4 ${activeVibeObj.color}`}>
      
      {/* Session Completed Overlay */}
      {sessionCompleted && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-3xl animate-fade-in">
           <div className="bg-white p-8 rounded-3xl shadow-2xl border border-brand-100 text-center max-w-xs mx-4 animate-pop">
              <div className="text-5xl mb-4">🎉</div>
              <h3 className="text-2xl font-serif font-bold text-brand-800 mb-2">Session Complete!</h3>
              <p className="text-stone-600 mb-4">
                You focused for <span className="font-bold text-brand-600">{initialTime / 60} minutes</span>.
              </p>
              <div className="bg-brand-50 p-3 rounded-xl mb-6 border border-brand-100">
                 <p className="text-xs text-brand-500 font-bold uppercase tracking-wider">Rewards</p>
                 <p className="font-bold text-brand-700 text-lg">+{Math.floor(initialTime / 60) + 10} Points</p>
              </div>
              <button 
                onClick={() => {
                  setSessionCompleted(false);
                  resetTimer();
                }}
                className="w-full py-3 bg-brand-600 text-white rounded-xl font-bold hover:bg-brand-700 transition-colors shadow-lg shadow-brand-200"
              >
                Continue
              </button>
           </div>
        </div>
      )}

      {/* Header & Vibe Check */}
      <div className="flex justify-between items-center">
         <div>
            <h2 className={`text-lg font-serif font-bold ${isDarkMode ? 'text-white' : 'text-stone-700'}`}>Sanctuary</h2>
            <div className={`text-[10px] font-bold uppercase tracking-wider ${isDarkMode ? 'text-stone-400' : 'text-stone-400'}`}>
                Focus Mode
            </div>
         </div>
         <div className="flex space-x-1 bg-black/5 p-1 rounded-full">
            {VIBES.map(v => (
                <button 
                    key={v.id}
                    onClick={() => setCurrentVibe(v.id)}
                    className={`w-6 h-6 rounded-full text-[10px] flex items-center justify-center transition-all ${currentVibe === v.id ? 'bg-white shadow-sm scale-110 text-stone-800' : 'text-transparent hover:bg-white/50'}`}
                    title={v.label}
                >
                    {v.id === 'default' ? '☀️' : v.id === 'lofi' ? '🟣' : v.id === 'dark' ? '🌙' : '🌿'}
                </button>
            ))}
         </div>
      </div>

      {/* Roulette */}
      <div className={`min-h-[140px] backdrop-blur rounded-3xl p-4 flex items-center justify-center border shadow-soft relative overflow-hidden transition-all duration-500 ${isDarkMode ? 'bg-white/10 border-white/10' : 'bg-white/60 border-white'}`}>
        {rouletteMode === 'idle' && (
           <div className="flex flex-col items-center space-y-4 animate-fade-in">
             <div className="flex -space-x-4 items-end justify-center h-14">
                {AVATARS.map((avatar, i) => (
                  <div 
                    key={i} 
                    className={`w-12 h-12 rounded-full border-2 border-white flex items-center justify-center text-xl shadow-md animate-float ${avatar.color}`}
                    style={{ 
                        animationDelay: `${i * 0.3}s`,
                        zIndex: 10 - i 
                    }}
                  >
                    {avatar.icon}
                  </div>
                ))}
             </div>
             <button onClick={startRoulette} className="text-xs font-bold text-brand-600 bg-brand-50 px-6 py-3 rounded-xl hover:bg-brand-100 transition-colors shadow-sm">
                Study Buddy Roulette (30m)
             </button>
          </div>
        )}
        {rouletteMode === 'searching' && (
            <div className="text-center animate-pulse">
                <div className="w-12 h-12 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin mx-auto mb-3"></div>
                <p className="text-xs font-bold text-brand-700 uppercase tracking-widest">Finding a partner...</p>
            </div>
        )}
        {rouletteMode === 'matched' && buddy && (
            <div className="flex items-center space-x-4 animate-pop">
                 <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-white border-4 border-brand-200 flex items-center justify-center text-xs font-bold text-brand-600 shadow-md animate-float" style={{ animationDelay: '0s' }}>
                        YOU
                    </div>
                 </div>
                 <div className="flex flex-col items-center space-y-1">
                    <div className="h-0.5 w-8 bg-brand-200"></div>
                    <span className="text-[10px] font-bold text-brand-400">CONNECTED</span>
                 </div>
                 <div className="text-center">
                    <div 
                        className={`w-16 h-16 rounded-full border-4 ${buddy.border} ${buddy.color} flex items-center justify-center text-3xl shadow-md animate-float`}
                        style={{ animationDelay: '1s' }}
                    >
                        {buddy.icon}
                    </div>
                    <p className="text-[10px] font-bold mt-2 text-stone-500 bg-white/80 px-2 py-0.5 rounded-full shadow-sm">{buddy.subject}</p>
                 </div>
            </div>
        )}
      </div>

      {/* Timer with SVG Progress Ring */}
      <div className="flex-1 flex flex-col items-center justify-center py-4">
        <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
          
          {/* SVG Ring */}
          <svg width={size} height={size} className="absolute transform -rotate-90">
             {/* Background Circle */}
             <circle
                stroke={isDarkMode ? '#44403c' : '#e7e5e4'} 
                strokeWidth={strokeWidth}
                fill="transparent"
                r={radius}
                cx={size / 2}
                cy={size / 2}
             />
             {/* Progress Circle */}
             <circle
                stroke="#588173" // brand-500
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                r={radius}
                cx={size / 2}
                cy={size / 2}
                style={{ transition: 'stroke-dashoffset 1s linear' }}
             />
          </svg>
          
          {/* Center Content */}
          <div className={`flex flex-col items-center z-10 w-48 h-48 rounded-full justify-center shadow-soft border ${isDarkMode ? 'bg-stone-900 border-stone-700 text-white' : 'bg-white border-stone-50'}`}>
            <span className={`text-5xl font-serif font-bold tracking-tight font-variant-numeric tabular-nums ${isDarkMode ? 'text-white' : 'text-brand-800'}`}>
              {formatTime(timeLeft)}
            </span>
            <span className="text-xs text-brand-400 font-bold uppercase tracking-widest mt-1">
                {isActive ? 'Flowing' : 'Paused'}
            </span>
             <button 
                onClick={resetTimer}
                disabled={timeLeft === initialTime && !isActive}
                className={`mt-2 text-[10px] uppercase font-bold tracking-wider transition-all duration-300 ${
                  timeLeft !== initialTime || isActive 
                    ? 'text-red-400 hover:text-red-600 cursor-pointer' 
                    : 'text-transparent cursor-default'
                }`}
            >
                Reset
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-3 mt-8">
            {[25, 30, 45, 60].map((mins) => (
                <button
                    key={mins}
                    onClick={() => changeDuration(mins)}
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xs font-bold transition-all ${
                        initialTime === mins * 60
                        ? 'bg-brand-600 text-white shadow-lg shadow-brand-200 transform scale-110'
                        : isDarkMode ? 'bg-stone-800 text-stone-400 hover:bg-stone-700' : 'bg-white text-stone-400 hover:bg-stone-50'
                    }`}
                >
                    {mins}
                </button>
            ))}
        </div>
      </div>

      {/* Motivation */}
      <div className="min-h-[40px] text-center px-6">
         {motivation ? (
           <p className={`text-sm font-serif italic animate-fade-in ${isDarkMode ? 'text-stone-300' : 'text-stone-600'}`}>"{motivation}"</p>
         ) : (
           <button 
            onClick={handleGetMotivation}
            disabled={loadingQuote}
            className="text-xs text-brand-400 font-bold uppercase tracking-widest hover:text-brand-600 transition-colors"
           >
             {loadingQuote ? "Whispering..." : "Need encouragement?"}
           </button>
         )}
      </div>

      {/* Sounds */}
      <div className={`p-5 rounded-3xl shadow-soft space-y-4 ${isDarkMode ? 'bg-stone-800' : 'bg-white'}`}>
        <div className="flex justify-between items-center px-1">
           <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest">Ambiance</h3>
           {activeSoundId && (
             <input 
                 type="range" min="0" max="1" step="0.05" value={volume} 
                 onChange={(e) => setVolume(parseFloat(e.target.value))}
                 className="w-20 h-1 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-brand-500"
               />
           )}
        </div>
        <div className="flex space-x-3">
          {AMBIENT_SOUNDS.map((sound) => {
            const isActive = activeSoundId === sound.id;
            return (
              <button
                key={sound.id}
                onClick={() => toggleSound(sound)}
                className={`flex-1 py-4 rounded-2xl transition-all duration-300 flex flex-col items-center justify-center space-y-1 ${
                  isActive 
                    ? 'bg-brand-50 text-brand-800 ring-2 ring-brand-100 shadow-inner' 
                    : isDarkMode ? 'bg-stone-700 text-stone-400 hover:bg-stone-600' : 'bg-stone-50 text-stone-400 hover:bg-stone-100'
                }`}
              >
                <span className={`text-xl ${isActive && isPlayingSound ? 'animate-pulse' : ''}`}>{sound.icon}</span>
                <span className="text-[10px] font-bold">{sound.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Action */}
      <div className="flex space-x-4">
        <button 
          onClick={toggleTimer}
          className={`flex-1 py-4 rounded-2xl font-bold shadow-lg transition-all active:scale-95 ${
            isActive 
              ? 'bg-calm-yellow text-white shadow-yellow-200/50' 
              : 'bg-brand-600 text-white shadow-brand-200/50 hover:bg-brand-700'
          }`}
        >
          {isActive ? 'Pause' : 'Begin Focus'}
        </button>
        <button 
            onClick={() => {
                setRouletteMode('idle');
                setBuddy(null);
                setIsActive(false);
            }}
            className={`w-14 flex items-center justify-center rounded-2xl transition-colors shadow-sm ${isDarkMode ? 'bg-stone-800 text-stone-400 hover:text-red-400' : 'bg-white text-stone-400 hover:text-red-400'}`}
        >
          ✕
        </button>
      </div>
    </div>
  );
};
