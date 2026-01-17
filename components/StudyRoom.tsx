
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
    { id: 'default', label: 'Clean', color: 'bg-[#FDFBF7]', text: 'text-stone-800' },
    { id: 'lofi', label: 'Lo-Fi', color: 'bg-purple-50', text: 'text-purple-900' },
    { id: 'dark', label: 'Night', color: 'bg-stone-900', text: 'text-stone-100' },
    { id: 'nature', label: 'Nature', color: 'bg-green-50', text: 'text-green-900' }
];

// Mini Game Constants
const GAME_ICONS = [
    { type: 'distraction', icon: '📱', points: 10 },
    { type: 'distraction', icon: '🎮', points: 10 },
    { type: 'distraction', icon: '🛌', points: 10 },
    { type: 'focus', icon: '📚', points: -5 },
    { type: 'focus', icon: '💧', points: -5 },
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
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [currentVibe, setCurrentVibe] = useState('default');
  
  // Game State
  const [showGame, setShowGame] = useState(false);
  const [gameScore, setGameScore] = useState(0);
  const [floatingItems, setFloatingItems] = useState<{id: number, icon: string, type: string, x: number, y: number}[]>([]);
  const gameIntervalRef = useRef<any>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Timer Ring Calculations
  const size = 280;
  const strokeWidth = 16;
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

  // Game Logic
  const startGame = () => {
      setShowGame(true);
      setGameScore(0);
      setFloatingItems([]);
      
      gameIntervalRef.current = setInterval(() => {
          if (Math.random() > 0.3) {
             const itemType = GAME_ICONS[Math.floor(Math.random() * GAME_ICONS.length)];
             const newItem = {
                 id: Date.now(),
                 icon: itemType.icon,
                 type: itemType.type,
                 x: Math.random() * 80 + 10, 
                 y: 100 
             };
             setFloatingItems(prev => [...prev, newItem]);
          }
          
          setFloatingItems(prev => prev.map(item => ({...item, y: item.y - 2})).filter(item => item.y > -10));
      }, 100);
  };

  const stopGame = () => {
      clearInterval(gameIntervalRef.current);
      setShowGame(false);
  };

  const handleGameClick = (id: number, type: string) => {
      if (type === 'distraction') {
          setGameScore(prev => prev + 10);
      } else {
          setGameScore(prev => Math.max(0, prev - 5));
      }
      setFloatingItems(prev => prev.filter(item => item.id !== id));
  };

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      clearInterval(gameIntervalRef.current);
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

  const toggleTimer = () => {
      if (isActive) {
          setIsActive(false);
      } else {
          setIsActive(true);
          setShowGame(false);
      }
  };

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

  const getRewardPreview = () => {
      const minutes = initialTime / 60;
      if (minutes >= 60) return { icon: "🎧", label: "Premium Theme Pack" };
      if (minutes >= 30) return { icon: "🎮", label: "Retro Arcade Game" };
      return { icon: "⭐️", label: "Karma Points Only" };
  };
  const rewardPreview = getRewardPreview();

  return (
    <div className={`flex flex-col min-h-full animate-appear relative transition-colors duration-700 rounded-[2.5rem] p-6 shadow-inner ${activeVibeObj.color}`}>
      
      {/* GAME OVERLAY */}
      {showGame && (
          <div className="absolute inset-0 z-40 bg-slate-900/95 rounded-[2.5rem] overflow-hidden flex flex-col items-center justify-center">
              <div className="absolute top-6 right-6 text-white font-bold text-2xl font-mono">Score: {gameScore}</div>
              <div className="absolute top-6 left-6">
                  <button onClick={stopGame} className="text-white text-xs bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full font-bold transition-colors">Exit Game</button>
              </div>
              
              <div className="text-center mb-10 pointer-events-none">
                  <h3 className="text-3xl font-serif font-bold text-white mb-2">Pop the Distractions!</h3>
                  <p className="text-white/60 text-sm">Don't pop the books!</p>
              </div>

              {floatingItems.map(item => (
                  <button
                    key={item.id}
                    onClick={() => handleGameClick(item.id, item.type)}
                    className="absolute text-5xl animate-pop transition-transform hover:scale-110 active:scale-90"
                    style={{ left: `${item.x}%`, top: `${item.y}%` }}
                  >
                      {item.icon}
                  </button>
              ))}
          </div>
      )}

      {/* Session Completed Overlay */}
      {sessionCompleted && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-md rounded-[2.5rem] animate-fade-in p-6">
           <div className="bg-white p-8 rounded-[2rem] shadow-2xl border border-brand-100 text-center w-full max-w-xs animate-pop">
              <div className="text-6xl mb-6">🎉</div>
              <h3 className="text-3xl font-serif font-bold text-brand-800 mb-3">Session Complete!</h3>
              <p className="text-stone-600 mb-6 font-medium">
                You focused for <span className="font-bold text-brand-600">{initialTime / 60} minutes</span>.
              </p>
              
              {initialTime / 60 >= 25 ? (
                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-5 rounded-2xl mb-6 border border-indigo-100 relative overflow-hidden group hover:shadow-md transition-all">
                     <div className="absolute -top-4 -right-4 text-6xl opacity-10 group-hover:scale-110 transition-transform">🎁</div>
                     <p className="text-xs text-indigo-500 font-bold uppercase tracking-wider mb-2">Reward Unlocked</p>
                     <div className="flex items-center justify-center space-x-3 mb-2">
                         <span className="text-3xl">{getRewardPreview().icon}</span>
                         <span className="font-bold text-indigo-900 text-lg">{getRewardPreview().label}</span>
                     </div>
                  </div>
              ) : (
                  <div className="bg-brand-50 p-4 rounded-2xl mb-6 border border-brand-100">
                     <p className="text-xs text-brand-500 font-bold uppercase tracking-wider mb-1">Rewards</p>
                     <p className="font-bold text-brand-800 text-lg">+{Math.floor(initialTime / 60) + 10} Karma Points</p>
                  </div>
              )}

              <button 
                onClick={() => {
                  setSessionCompleted(false);
                  resetTimer();
                }}
                className="w-full py-4 bg-brand-600 text-white rounded-2xl font-bold hover:bg-brand-700 transition-colors shadow-lg shadow-brand-200"
              >
                Claim & Continue
              </button>
           </div>
        </div>
      )}

      {/* Header & Vibe Check */}
      <div className="flex justify-between items-center mb-6">
         <div>
            <h2 className={`text-2xl font-serif font-bold tracking-tight ${activeVibeObj.text}`}>Sanctuary</h2>
            <div className={`text-[10px] font-bold uppercase tracking-widest opacity-60 ${activeVibeObj.text}`}>
                Focus Mode
            </div>
         </div>
         <div className={`flex space-x-1 p-1.5 rounded-full ${isDarkMode ? 'bg-white/10' : 'bg-stone-100'}`}>
            {VIBES.map(v => (
                <button 
                    key={v.id}
                    onClick={() => setCurrentVibe(v.id)}
                    className={`w-8 h-8 rounded-full text-sm flex items-center justify-center transition-all ${currentVibe === v.id ? 'bg-white shadow-md scale-110 text-stone-800' : 'text-transparent hover:bg-white/20'}`}
                    title={v.label}
                >
                    {v.id === 'default' ? '☀️' : v.id === 'lofi' ? '🟣' : v.id === 'dark' ? '🌙' : '🌿'}
                </button>
            ))}
         </div>
      </div>

      {/* Roulette / Game Invite */}
      {!isActive && !showGame && (
         <div className={`mb-6 backdrop-blur-md rounded-2xl p-4 flex items-center justify-center border shadow-sm relative overflow-hidden transition-all duration-500 ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-white/60 border-white'}`}>
             <div className="flex space-x-3">
                 <button onClick={startRoulette} className="bg-brand-50 text-brand-800 px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-brand-100 transition-colors shadow-sm">
                     Study Roulette 🎲
                 </button>
                 <button onClick={startGame} className="bg-orange-50 text-orange-800 px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-orange-100 transition-colors shadow-sm">
                     Pop Distractions 🎮
                 </button>
             </div>
         </div>
      )}
      
      {/* Active Roulette Status */}
      {rouletteMode === 'searching' && (
          <div className="text-center animate-pulse py-4">
               <div className="text-xs font-bold text-brand-500 uppercase tracking-widest">Finding partner...</div>
          </div>
      )}
      {rouletteMode === 'matched' && buddy && (
         <div className="flex justify-center items-center space-x-3 py-4 animate-pop bg-white/10 rounded-2xl mb-4 border border-white/20">
             <span className={`text-xs font-bold ${activeVibeObj.text}`}>Studying with</span>
             <div className={`w-8 h-8 rounded-full border-2 ${buddy.border} ${buddy.color} flex items-center justify-center`}>{buddy.icon}</div>
         </div>
      )}

      {/* Timer with SVG Progress Ring */}
      <div className="flex-1 flex flex-col items-center justify-center py-2">
        <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
          
          {/* SVG Ring */}
          <svg width={size} height={size} className="absolute transform -rotate-90">
             <circle
                stroke={isDarkMode ? 'rgba(255,255,255,0.1)' : '#e5e7eb'} 
                strokeWidth={strokeWidth}
                fill="transparent"
                r={radius}
                cx={size / 2}
                cy={size / 2}
             />
             <circle
                stroke="#5F8174" // brand-500
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
          <div className={`flex flex-col items-center z-10 w-52 h-52 rounded-full justify-center shadow-[inset_0_2px_15px_rgba(0,0,0,0.05)] border-4 ${isDarkMode ? 'bg-stone-800 border-stone-700' : 'bg-white border-stone-50'}`}>
            <span className={`text-6xl font-serif font-bold tracking-tighter font-variant-numeric tabular-nums ${activeVibeObj.text}`}>
              {formatTime(timeLeft)}
            </span>
            <span className={`text-xs font-bold uppercase tracking-widest mt-2 ${isDarkMode ? 'text-stone-400' : 'text-brand-400'}`}>
                {isActive ? 'Flowing' : 'Paused'}
            </span>
             
             {/* Reward Hint */}
             {!isActive && (
                 <div className="mt-3 flex items-center space-x-1.5 text-[10px] font-bold text-stone-500 bg-stone-100 px-3 py-1 rounded-full border border-stone-200">
                     <span>🔒</span>
                     <span>{rewardPreview.label}</span>
                 </div>
             )}
          </div>
        </div>

        {/* Duration Selectors */}
        <div className="flex items-center space-x-4 mt-8">
            {[25, 30, 45, 60].map((mins) => (
                <button
                    key={mins}
                    onClick={() => changeDuration(mins)}
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center text-sm font-bold transition-all ${
                        initialTime === mins * 60
                        ? 'bg-brand-600 text-white shadow-lg shadow-brand-200 transform scale-110'
                        : isDarkMode ? 'bg-white/10 text-stone-300 hover:bg-white/20' : 'bg-white text-stone-400 hover:bg-stone-50 border border-stone-100'
                    }`}
                >
                    {mins}
                </button>
            ))}
        </div>
      </div>

      {/* Motivation */}
      <div className="min-h-[50px] text-center px-4 flex items-center justify-center">
         {motivation ? (
           <p className={`text-sm font-serif italic animate-fade-in ${activeVibeObj.text} opacity-80`}>"{motivation}"</p>
         ) : (
           <button 
            onClick={handleGetMotivation}
            disabled={loadingQuote}
            className={`text-xs font-bold uppercase tracking-widest transition-colors opacity-50 hover:opacity-100 ${activeVibeObj.text}`}
           >
             {loadingQuote ? "Whispering..." : "Need encouragement?"}
           </button>
         )}
      </div>

      {/* Sounds */}
      <div className={`p-5 rounded-[2rem] shadow-sm space-y-3 transition-colors ${isDarkMode ? 'bg-white/5 border border-white/5' : 'bg-white border border-stone-100'}`}>
        <div className="flex justify-between items-center px-2">
           <h3 className={`text-[10px] font-bold uppercase tracking-widest opacity-60 ${activeVibeObj.text}`}>Ambiance</h3>
           {activeSoundId && (
             <input 
                 type="range" min="0" max="1" step="0.05" value={volume} 
                 onChange={(e) => setVolume(parseFloat(e.target.value))}
                 className="w-24 h-1 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-brand-500"
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
                className={`flex-1 py-3 rounded-2xl transition-all duration-300 flex flex-col items-center justify-center space-y-1 ${
                  isActive 
                    ? 'bg-brand-50 text-brand-800 ring-1 ring-brand-200 shadow-inner' 
                    : isDarkMode ? 'bg-white/5 text-stone-400 hover:bg-white/10' : 'bg-stone-50 text-stone-400 hover:bg-stone-100'
                }`}
              >
                <span className={`text-xl ${isActive && isPlayingSound ? 'animate-pulse' : ''}`}>{sound.icon}</span>
                <span className="text-[9px] font-bold">{sound.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Action */}
      <div className="flex space-x-4 mt-2">
        <button 
          onClick={toggleTimer}
          className={`flex-1 py-4 rounded-2xl font-bold text-lg shadow-xl transition-all active:scale-95 ${
            isActive 
              ? 'bg-amber-200 text-amber-900 shadow-amber-100/50 hover:bg-amber-300' 
              : 'bg-stone-800 text-white shadow-stone-400/30 hover:bg-black'
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
            className={`w-16 flex items-center justify-center rounded-2xl transition-colors shadow-sm ${isDarkMode ? 'bg-white/10 text-stone-400 hover:text-red-400' : 'bg-white text-stone-400 hover:text-red-400 border border-stone-100'}`}
        >
          ✕
        </button>
      </div>
    </div>
  );
};
