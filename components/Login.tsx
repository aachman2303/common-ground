import React, { useState } from 'react';
import { UserProfile } from '../types';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';

interface LoginProps {
  onLogin: (user: UserProfile) => void;
  onSwitchToSignup: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin, onSwitchToSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate network request
    setTimeout(() => {
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
        setIsLoading(false);
    }, 1500);
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      const googleUser: UserProfile = {
        email: 'google.student@university.edu',
        nickname: 'Google Student',
        avatarId: 1,
        uniqueId: '#GGL24',
        location: null,
        stats: { focusMinutes: 0, streakDays: 0, communitiesJoined: 0, sessionsCompleted: 0, communityPoints: 0 }
      };
      onLogin(googleUser);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-stone-100 relative overflow-hidden font-sans">
       {/* Background Deco */}
       <div className="absolute top-[-20%] left-[-20%] w-96 h-96 bg-brand-200/40 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
       <div className="absolute bottom-[-20%] right-[-20%] w-96 h-96 bg-orange-200/40 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
       <div className="absolute top-[40%] left-[20%] w-72 h-72 bg-stone-200/40 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>

       <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl w-full max-w-sm border border-white/60 relative z-10 animate-slide-up">
          
          {/* Header Section */}
          <div className="text-center mb-8 relative">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-brand-500 to-brand-700 rounded-2xl text-4xl shadow-lg shadow-brand-500/30 mb-4 transform hover:scale-105 transition-transform duration-500">
                🌿
              </div>
              <h1 className="text-3xl font-serif font-bold text-stone-800 tracking-tight">Common Ground</h1>
              <p className="text-stone-500 text-sm mt-2 font-medium">Your campus sanctuary for focus & connection.</p>
              
              {/* Trust Badge */}
              <div className="mt-4 inline-flex items-center space-x-1.5 bg-brand-50 border border-brand-100 px-3 py-1 rounded-full">
                <CheckCircle2 size={12} className="text-brand-600" />
                <span className="text-[10px] font-bold text-brand-700 uppercase tracking-wide">University Verified Portal</span>
              </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Input */}
              <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-400 uppercase ml-1 tracking-wider">Student Email</label>
                  <div className="relative group">
                    <div className="absolute left-4 top-3.5 text-stone-400 group-focus-within:text-brand-600 transition-colors">
                        <Mail size={20} />
                    </div>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@university.edu"
                        disabled={isLoading}
                        className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-stone-200 bg-stone-50/50 focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 outline-none transition-all duration-300 placeholder:text-stone-400 text-stone-800 font-medium disabled:opacity-70"
                    />
                  </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1">
                  <div className="flex justify-between items-center ml-1">
                    <label className="text-xs font-bold text-stone-400 uppercase tracking-wider">Password</label>
                    <button type="button" className="text-xs text-brand-600 font-bold hover:text-brand-800 transition-colors">Forgot?</button>
                  </div>
                  <div className="relative group">
                    <div className="absolute left-4 top-3.5 text-stone-400 group-focus-within:text-brand-600 transition-colors">
                        <Lock size={20} />
                    </div>
                    <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        disabled={isLoading}
                        className="w-full pl-12 pr-12 py-3.5 rounded-xl border border-stone-200 bg-stone-50/50 focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 outline-none transition-all duration-300 placeholder:text-stone-400 text-stone-800 font-medium disabled:opacity-70"
                    />
                    <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-3.5 text-stone-400 hover:text-stone-600 transition-colors focus:outline-none"
                    >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center space-x-2 ml-1 cursor-pointer" onClick={() => setRememberMe(!rememberMe)}>
                 <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all duration-200 ${rememberMe ? 'bg-brand-600 border-brand-600' : 'bg-white border-stone-300'}`}>
                    {rememberMe && <CheckCircle2 size={14} className="text-white" />}
                 </div>
                 <span className="text-sm text-stone-500 font-medium select-none">Remember me for 30 days</span>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-brand-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-brand-200/50 hover:bg-brand-700 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                    <>
                        <Loader2 size={18} className="animate-spin" />
                        <span>Verifying Credentials...</span>
                    </>
                ) : (
                    <>
                        <span>Sign In Securely</span>
                        <ArrowRight size={18} />
                    </>
                )}
              </button>
          </form>

          <div className="mt-8">
              <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t border-stone-200"></div>
                  <span className="flex-shrink-0 mx-4 text-stone-400 text-[10px] font-bold uppercase tracking-widest">Or Continue With</span>
                  <div className="flex-grow border-t border-stone-200"></div>
              </div>
              <button
                type="button"
                disabled={isLoading}
                onClick={handleGoogleLogin}
                className="w-full py-3.5 bg-white border border-stone-200 text-stone-600 rounded-xl font-bold hover:bg-stone-50 hover:border-stone-300 transition-all flex items-center justify-center gap-3 mt-3 shadow-sm hover:shadow active:scale-[0.99]"
              >
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
                <span>University Google Account</span>
              </button>
          </div>

          <div className="mt-8 text-center bg-stone-50/50 py-4 -mx-8 -mb-8 rounded-b-3xl border-t border-stone-100/50">
              <p className="text-sm text-stone-500">
                First time here? <button onClick={onSwitchToSignup} className="font-bold text-brand-600 hover:text-brand-800 hover:underline transition-colors">Create your student ID</button>
              </p>
          </div>
       </div>
    </div>
  );
};