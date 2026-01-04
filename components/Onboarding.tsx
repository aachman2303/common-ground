import React, { useState } from 'react';
import { UserProfile } from '../types';
import { AVATARS } from '../constants';

interface OnboardingProps {
  onComplete: (user: UserProfile) => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [avatarId, setAvatarId] = useState(0);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationStatus, setLocationStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const generateId = () => '#' + Math.random().toString(36).substring(2, 8).toUpperCase();

  const handleLocationRequest = () => {
    setLocationStatus('loading');
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
          setLocationStatus('success');
          setTimeout(() => setStep(3), 800);
        },
        (error) => {
          console.error("Geo error:", error);
          setLocationStatus('error');
          // Proceed anyway after error
          setTimeout(() => setStep(3), 1000);
        }
      );
    } else {
      setLocationStatus('error');
      setTimeout(() => setStep(3), 1000);
    }
  };

  const handleFinish = () => {
    onComplete({
      email,
      nickname: nickname || 'Anonymous Student',
      avatarId,
      location,
      uniqueId: generateId(),
      stats: {
        focusMinutes: 0,
        streakDays: 0,
        communitiesJoined: 0,
        sessionsCompleted: 0,
        communityPoints: 0
      }
    });
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen p-6 text-center space-y-8 overflow-hidden bg-stone-100">
      
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1528459801416-a9e53bbf4e05?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            alt="Calm Nature" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-100 via-stone-100/80 to-transparent"></div>
      </div>

      <div className="relative z-10 glass-panel p-8 rounded-3xl shadow-xl max-w-sm w-full backdrop-blur-md">
        {/* Progress Dots */}
        <div className="flex justify-center space-x-2 mb-6">
          {[1, 2, 3].map(i => (
            <div key={i} className={`w-2 h-2 rounded-full transition-all duration-500 ${step >= i ? 'bg-brand-500 w-4' : 'bg-stone-300'}`}></div>
          ))}
        </div>

        {step === 1 && (
          <div className="space-y-6 animate-slide-up">
            <div>
              <h1 className="text-3xl font-serif font-bold text-brand-800 mb-2">Common Ground</h1>
              <p className="text-stone-500 text-sm leading-relaxed">Where personal struggle meets shared strength.</p>
            </div>
            <div className="text-left">
              <label className="text-xs font-bold text-stone-500 uppercase ml-1">Student Email</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@university.edu"
                className="w-full mt-1 p-3 rounded-xl border border-stone-200 bg-white/70 focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none transition-all"
              />
            </div>
            <button 
              disabled={!email.includes('@')}
              onClick={() => setStep(2)}
              className="w-full py-3 bg-brand-600 text-white rounded-xl font-bold shadow-lg shadow-brand-200/50 hover:bg-brand-700 hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:shadow-none transition-all duration-300"
            >
              Begin Journey
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8 animate-slide-up">
            <div>
              <div className="w-24 h-24 bg-white/50 text-brand-600 rounded-full flex items-center justify-center text-5xl mx-auto mb-4 animate-float shadow-soft border border-white">
                📍
              </div>
              <h2 className="text-xl font-bold text-stone-800">Find Your Crowd</h2>
              <p className="text-stone-500 mt-2 text-sm">We use your location to connect you with nearby safe zones and study groups.</p>
            </div>
            
            <button 
              onClick={handleLocationRequest}
              className={`w-full py-3 rounded-xl font-bold shadow-lg transition-all flex items-center justify-center space-x-2 ${
                locationStatus === 'loading' ? 'bg-stone-100 text-stone-400' :
                locationStatus === 'success' ? 'bg-calm-green text-white shadow-green-200' :
                'bg-brand-600 text-white hover:bg-brand-700 shadow-brand-200/50 hover:-translate-y-0.5'
              }`}
            >
              {locationStatus === 'loading' && <span className="animate-spin">⌛</span>}
              <span>
                {locationStatus === 'idle' && 'Enable Location'}
                {locationStatus === 'loading' && 'Locating...'}
                {locationStatus === 'success' && 'Location Found!'}
                {locationStatus === 'error' && 'Location Skipped'}
              </span>
            </button>
            <button onClick={() => setStep(3)} className="text-xs text-stone-400 font-bold hover:text-stone-600 uppercase tracking-widest">
              Skip for now
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-slide-up">
            <div>
              <h2 className="text-xl font-bold text-stone-800">Create Your Identity</h2>
              <p className="text-stone-500 mt-2 text-sm">Choose how you appear in the sanctuary.</p>
            </div>

            <div className="grid grid-cols-4 gap-3 p-2">
              {AVATARS.map((av, idx) => (
                <button 
                  key={idx}
                  onClick={() => setAvatarId(idx)}
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-xl transition-all duration-300 ${
                    avatarId === idx 
                      ? `ring-4 ring-brand-300 scale-125 ${av.color} z-10 shadow-lg` 
                      : 'bg-white/50 hover:bg-white hover:scale-110'
                  }`}
                >
                  {av.icon}
                </button>
              ))}
            </div>

            <div className="text-left">
              <label className="text-xs font-bold text-stone-500 uppercase ml-1">Nickname</label>
              <input 
                type="text" 
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="e.g. Midnight Scholar"
                className="w-full mt-1 p-3 rounded-xl border border-stone-200 bg-white/70 focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none transition-all"
              />
            </div>

            <button 
              onClick={handleFinish}
              disabled={!nickname}
              className="w-full py-3 bg-brand-600 text-white rounded-xl font-bold shadow-lg shadow-brand-200/50 hover:bg-brand-700 hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 transition-all duration-300"
            >
              Enter Campus
            </button>
          </div>
        )}
      </div>
    </div>
  );
};