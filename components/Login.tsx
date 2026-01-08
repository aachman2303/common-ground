
import React, { useState, useEffect, useRef } from 'react';
import { UserProfile } from '../types';

interface LoginProps {
  onLogin: (user: UserProfile) => void;
  onSwitchToSignup: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin, onSwitchToSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Refs for eye tracking
  const containerRef = useRef<HTMLDivElement>(null);
  const leftEyeRef = useRef<SVGCircleElement>(null);
  const rightEyeRef = useRef<SVGCircleElement>(null);
  const bigEyeRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      
      const moveEye = (eye: SVGCircleElement | null, speed: number = 3) => {
        if (!eye) return;
        const rect = eye.getBoundingClientRect();
        const eyeX = rect.left + rect.width / 2;
        const eyeY = rect.top + rect.height / 2;
        
        // Calculate angle
        const angle = Math.atan2(e.clientY - eyeY, e.clientX - eyeX);
        
        // Calculate distance (clamped)
        const distance = Math.min(speed, Math.hypot(e.clientX - eyeX, e.clientY - eyeY) / 10);
        
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;
        
        eye.setAttribute("transform", `translate(${x}, ${y})`);
      };

      moveEye(leftEyeRef.current);
      moveEye(rightEyeRef.current);
      moveEye(bigEyeRef.current, 6); // Big eye moves a bit more
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login
    const mockUser: UserProfile = {
        email: email || 'student@university.edu',
        nickname: email.split('@')[0] || 'Returning Student',
        avatarId: 0,
        uniqueId: '#RET88',
        location: null,
        stats: {
            focusMinutes: 1250,
            streakDays: 12,
            communitiesJoined: 3,
            sessionsCompleted: 42,
            communityPoints: 850
        }
    };
    onLogin(mockUser);
  };

  return (
    <div className="flex min-h-screen bg-stone-50 font-sans text-stone-800 selection:bg-brand-200 selection:text-brand-900" ref={containerRef}>
      
      {/* Left Half: Interactive Illustration */}
      <div className="hidden lg:flex w-1/2 bg-brand-50/50 items-center justify-center relative overflow-hidden border-r border-stone-100">
        {/* Organic Background Blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-brand-100/40 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-cozy-latte/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[20%] left-[20%] w-[400px] h-[400px] bg-stone-200/40 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>

        <div className="relative z-10 p-10 flex flex-col items-center">
            <svg width="420" height="420" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-2xl">
                {/* Character 1: The Sage Blob (Brand Color) */}
                <g className="animate-float">
                    <path d="M120 280C120 324.183 84.1828 360 40 360C-4.18278 360 -40 324.183 -40 280C-40 235.817 -4.18278 200 40 200C84.1828 200 120 235.817 120 280Z" fill="#5F8174"/> {/* brand-500 */}
                    {/* Eyes */}
                    <circle cx="20" cy="260" r="14" fill="white"/>
                    <circle ref={leftEyeRef} cx="20" cy="260" r="6" fill="#262422"/>
                    
                    <circle cx="60" cy="260" r="14" fill="white"/>
                    <circle ref={rightEyeRef} cx="60" cy="260" r="6" fill="#262422"/>
                    
                    {/* Blush */}
                    <circle cx="10" cy="285" r="4" fill="rgba(255,255,255,0.2)"/>
                    <circle cx="70" cy="285" r="4" fill="rgba(255,255,255,0.2)"/>
                </g>

                {/* Character 2: The Earthy Tall Guy (Cozy Rust/Clay) */}
                <g className="animate-float" style={{ animationDelay: '1.5s' }}>
                    <rect x="180" y="80" width="130" height="280" rx="60" fill="#D4A373"/> {/* cozy-clay */}
                    {/* Big Cyclops Eye */}
                    <circle cx="245" cy="170" r="36" fill="white"/>
                    <circle ref={bigEyeRef} cx="245" cy="170" r="14" fill="#262422"/>
                    {/* Glasses rim */}
                    <circle cx="245" cy="170" r="36" stroke="#262422" strokeWidth="3" fill="none" opacity="0.1"/>
                    {/* Smile */}
                    <path d="M225 240 Q245 255 265 240" stroke="white" strokeWidth="5" strokeLinecap="round" opacity="0.8"/>
                </g>

                {/* Decorative Elements */}
                <circle cx="340" cy="90" r="16" fill="#A3BDB1" className="animate-pulse-slow"/> {/* brand-300 */}
                <path d="M60 110 L85 150 L35 150 Z" fill="#BC6C25" className="animate-spin" style={{ transformOrigin: '60px 130px', animationDuration: '15s' }}/> {/* cozy-rust */}
            </svg>
            
            <div className="text-center mt-6 relative">
                 <div className="absolute -top-6 -right-12 bg-white/80 backdrop-blur-md px-4 py-2 rounded-2xl shadow-soft border border-white animate-bounce" style={{ animationDuration: '3s' }}>
                    <span className="text-xs font-bold text-brand-600">👋 1,204 online</span>
                 </div>
                 <h2 className="text-3xl font-serif font-bold text-stone-800 tracking-tight">Your quiet place<br/>in the noise.</h2>
            </div>
        </div>
      </div>

      {/* Right Half: Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-8 lg:px-24 xl:px-32 relative">
        <div className="w-full max-w-sm space-y-8 animate-appear">
            <div className="text-center lg:text-left">
                <div className="w-12 h-12 bg-stone-900 rounded-2xl flex items-center justify-center text-2xl text-white mb-6 mx-auto lg:mx-0 shadow-xl shadow-stone-200">
                    🌱
                </div>
                <h1 className="text-4xl font-serif font-bold text-stone-900 tracking-tight mb-2">Welcome back</h1>
                <p className="text-stone-500 text-base">Enter your details to find your common ground.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-5">
                    <div className="group">
                        <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-2 ml-1 group-focus-within:text-brand-600 transition-colors">Student Email</label>
                        <input 
                            type="email" 
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="student@university.edu"
                            className="w-full px-5 py-4 rounded-2xl border-2 border-stone-100 bg-stone-50/50 text-stone-800 placeholder:text-stone-400 focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-100 outline-none transition-all duration-300"
                        />
                    </div>
                    <div className="group">
                        <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-2 ml-1 group-focus-within:text-brand-600 transition-colors">Password</label>
                        <div className="relative">
                            <input 
                                type={showPassword ? "text" : "password"} 
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full px-5 py-4 rounded-2xl border-2 border-stone-100 bg-stone-50/50 text-stone-800 placeholder:text-stone-400 focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-100 outline-none transition-all duration-300 pr-12"
                            />
                            <button 
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-stone-400 hover:text-brand-600 transition-colors p-2"
                            >
                                {showPassword ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <label className="flex items-center space-x-2.5 cursor-pointer group">
                        <div className="relative">
                            <input type="checkbox" className="peer sr-only" />
                            <div className="w-5 h-5 border-2 border-stone-300 rounded-md peer-checked:bg-stone-800 peer-checked:border-stone-800 transition-all"></div>
                            <svg className="absolute top-1 left-1 w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                        </div>
                        <span className="text-sm text-stone-600 font-medium group-hover:text-stone-900 transition-colors">Keep me signed in</span>
                    </label>
                    <a href="#" className="text-sm font-bold text-stone-500 hover:text-brand-600 transition-colors">Forgot password?</a>
                </div>

                <div className="space-y-4 pt-2">
                    <button 
                        type="submit" 
                        className="w-full py-4 bg-stone-900 text-white rounded-2xl font-bold shadow-lg shadow-stone-300/50 hover:bg-black hover:scale-[1.02] hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2"
                    >
                        <span>Sign In</span>
                        <span className="text-stone-400">→</span>
                    </button>
                    
                    <button 
                        type="button"
                        className="w-full py-4 bg-white border-2 border-stone-100 text-stone-700 rounded-2xl font-bold hover:bg-stone-50 hover:border-stone-200 transition-all duration-300 flex items-center justify-center space-x-2 group"
                    >
                        <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                        </svg>
                        <span>Continue with Google</span>
                    </button>
                </div>
            </form>

            <div className="text-center pt-6">
                <p className="text-stone-400 text-sm">
                    New to Common Ground? {' '}
                    <button onClick={onSwitchToSignup} className="text-stone-800 font-bold hover:text-brand-600 hover:underline transition-colors">Create account</button>
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};
