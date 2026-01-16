import React, { useState } from 'react';
import { UserProfile } from '../types';

interface LoginProps {
  onLogin: (user: UserProfile) => void;
  onSwitchToSignup: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin, onSwitchToSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock Login Logic
    const mockUser: UserProfile = {
        email: email || 'student@university.edu',
        nickname: email.split('@')[0] || 'Student',
        avatarId: 0,
        uniqueId: '#STU01',
        location: null,
        stats: {
            focusMinutes: 120,
            streakDays: 5,
            communitiesJoined: 2,
            sessionsCompleted: 12,
            communityPoints: 350
        }
    };
    onLogin(mockUser);
  };

  const handleGoogleLogin = () => {
      const googleUser: UserProfile = {
        email: 'google.student@university.edu',
        nickname: 'Google Student',
        avatarId: 1,
        uniqueId: '#GGL24',
        location: null,
        stats: { focusMinutes: 0, streakDays: 0, communitiesJoined: 0, sessionsCompleted: 0, communityPoints: 0 }
    };
    onLogin(googleUser);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-stone-100 relative overflow-hidden">
       {/* Background Deco */}
       <div className="absolute top-[-20%] left-[-20%] w-96 h-96 bg-brand-200/40 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
       <div className="absolute bottom-[-20%] right-[-20%] w-96 h-96 bg-orange-200/40 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>

       <div className="bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-xl w-full max-w-sm border border-white relative z-10 animate-slide-up">
          <div className="text-center mb-8">
              <div className="w-16 h-16 bg-brand-600 rounded-2xl mx-auto flex items-center justify-center text-3xl mb-4 shadow-lg shadow-brand-200">
                🌿
              </div>
              <h1 className="text-3xl font-serif font-bold text-brand-900">Common Ground</h1>
              <p className="text-stone-500 text-sm mt-2">Welcome back to your sanctuary.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                  <label className="text-xs font-bold text-stone-400 uppercase ml-1">Student Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@university.edu"
                    className="w-full mt-1 p-3 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none transition-all"
                  />
              </div>
              <div>
                  <label className="text-xs font-bold text-stone-400 uppercase ml-1">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full mt-1 p-3 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none transition-all"
                  />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-brand-600 text-white rounded-xl font-bold shadow-lg shadow-brand-200/50 hover:bg-brand-700 hover:-translate-y-0.5 transition-all"
              >
                Sign In
              </button>
          </form>

          <div className="mt-6">
              <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t border-stone-200"></div>
                  <span className="flex-shrink-0 mx-4 text-stone-400 text-xs font-bold uppercase">Or</span>
                  <div className="flex-grow border-t border-stone-200"></div>
              </div>
              <button
                onClick={handleGoogleLogin}
                className="w-full py-3.5 bg-white border border-stone-200 text-stone-600 rounded-xl font-bold hover:bg-stone-50 transition-all flex items-center justify-center gap-2 mt-2"
              >
                <span>G</span> Continue with Google
              </button>
          </div>

          <div className="mt-8 text-center">
              <p className="text-sm text-stone-500">
                New here? <button onClick={onSwitchToSignup} className="font-bold text-brand-600 hover:underline">Create account</button>
              </p>
          </div>
       </div>
    </div>
  );
};