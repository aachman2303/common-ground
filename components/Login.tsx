
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
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [loginError, setLoginError] = useState(false);
  
  // Refs for eye tracking
  const containerRef = useRef<HTMLDivElement>(null);
  const pupilsRef = useRef<(SVGCircleElement | null)[]>([]);

  // Add a pupil to the ref array
  const addToPupilsRef = (el: SVGCircleElement | null) => {
    if (el && !pupilsRef.current.includes(el)) {
      pupilsRef.current.push(el);
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      
      pupilsRef.current.forEach((pupil) => {
        if (!pupil) return;
        const rect = pupil.getBoundingClientRect();
        const eyeX = rect.left + rect.width / 2;
        const eyeY = rect.top + rect.height / 2;
        
        // Calculate angle
        const angle = Math.atan2(e.clientY - eyeY, e.clientX - eyeX);
        
        // Calculate distance (clamped to keep inside eye)
        const maxDistance = 3;
        const distance = Math.min(maxDistance, Math.hypot(e.clientX - eyeX, e.clientY - eyeY) / 15);
        
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;
        
        pupil.setAttribute("transform", `translate(${x}, ${y})`);
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation simulation
    if (!email.includes('@') || password.length < 6) {
        setLoginError(true);
        setTimeout(() => setLoginError(false), 2000);
        return;
    }

    // Simulate login success
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

  // SVG Paths for Mouths
  const mouthSmile = "M10,10 Q20,25 30,10";
  const mouthFrown = "M10,20 Q20,5 30,20";
  const mouthO = "M15,10 A5,5 0 1,1 15,20 A5,5 0 1,1 15,10"; // Small O

  return (
    <div className="flex min-h-screen bg-stone-50 font-sans text-stone-800 items-center justify-center p-4 lg:p-0" ref={containerRef}>
      <style>
        {`
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
          }
          .animate-shake {
            animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
          }
          .eye-cover {
            transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          }
        `}
      </style>

      <div className={`w-full max-w-5xl bg-white rounded-3xl shadow-2xl flex flex-col lg:flex-row overflow-hidden border border-stone-100 ${loginError ? 'animate-shake' : ''}`}>
        
        {/* Left Half: The Blobs */}
        <div className="lg:w-1/2 bg-indigo-50 relative flex items-center justify-center p-10 min-h-[400px]">
           {/* Abstract Background */}
           <div className="absolute top-10 left-10 w-32 h-32 bg-purple-200/50 rounded-full blur-3xl mix-blend-multiply"></div>
           <div className="absolute bottom-10 right-10 w-40 h-40 bg-orange-200/50 rounded-full blur-3xl mix-blend-multiply"></div>

           <svg width="100%" height="100%" viewBox="0 0 400 400" className="overflow-visible">
               
               {/* 1. PURPLE TALL MONSTER (Top Left) */}
               <g transform="translate(60, 60)">
                   <rect x="0" y="0" width="80" height="160" rx="40" fill="#7839EE" /> {/* Purple */}
                   {/* Hands (Hidden behind body initially, move up to cover eyes) */}
                   <g className="eye-cover" transform={isPasswordFocused ? "translate(0, -60)" : "translate(0, 0)"}>
                       <circle cx="20" cy="140" r="12" fill="#7839EE" stroke="#5B21B6" strokeWidth="2" />
                       <circle cx="60" cy="140" r="12" fill="#7839EE" stroke="#5B21B6" strokeWidth="2" />
                   </g>
                   {/* Face */}
                   <g transform="translate(15, 40)">
                       {/* Eyes */}
                       <circle cx="15" cy="15" r="12" fill="white" />
                       <circle ref={addToPupilsRef} cx="15" cy="15" r="4" fill="#1e1b4b" />
                       
                       <circle cx="45" cy="15" r="12" fill="white" />
                       <circle ref={addToPupilsRef} cx="45" cy="15" r="4" fill="#1e1b4b" />
                       
                       {/* Mouth */}
                       <path 
                         d={loginError ? mouthFrown : mouthSmile} 
                         fill="none" 
                         stroke="#1e1b4b" 
                         strokeWidth="3" 
                         strokeLinecap="round" 
                         transform="translate(10, 30)"
                         className="transition-all duration-300"
                       />
                   </g>
               </g>

               {/* 2. BLACK SQUARE MONSTER (Middle Right) */}
               <g transform="translate(180, 100)">
                   <rect x="0" y="0" width="100" height="100" rx="20" fill="#2D3436" /> {/* Black */}
                   {/* Hands */}
                   <g className="eye-cover" transform={isPasswordFocused ? "translate(0, -50)" : "translate(0, 0)"}>
                       <ellipse cx="20" cy="80" rx="15" ry="10" fill="#2D3436" stroke="#000" strokeWidth="2" />
                       <ellipse cx="80" cy="80" rx="15" ry="10" fill="#2D3436" stroke="#000" strokeWidth="2" />
                   </g>
                   {/* Face */}
                   <g transform="translate(20, 20)">
                       <circle cx="20" cy="20" r="14" fill="white" />
                       <circle ref={addToPupilsRef} cx="20" cy="20" r="5" fill="black" />
                       
                       <circle cx="50" cy="20" r="14" fill="white" />
                       <circle ref={addToPupilsRef} cx="50" cy="20" r="5" fill="black" />

                       <path 
                         d={loginError ? mouthO : mouthSmile} 
                         fill="none" 
                         stroke="white" 
                         strokeWidth="3" 
                         strokeLinecap="round" 
                         transform="translate(20, 45)"
                         className="transition-all duration-300"
                       />
                   </g>
               </g>

               {/* 3. ORANGE BLOB (Bottom Left) */}
               <g transform="translate(50, 240)">
                   <path d="M0,60 A60,60 0 0,1 120,60 L120,60 Z" fill="#FF8F50" /> {/* Orange semi-circle inverted? No, creating a blob shape */}
                   <path d="M10,60 Q60,-20 110,60 Q60,100 10,60" fill="#FF8F50" />
                   {/* Hands */}
                   <g className="eye-cover" transform={isPasswordFocused ? "translate(0, -35)" : "translate(0, 0)"}>
                        <circle cx="30" cy="60" r="15" fill="#FF8F50" stroke="#C2410C" strokeWidth="2"/>
                        <circle cx="90" cy="60" r="15" fill="#FF8F50" stroke="#C2410C" strokeWidth="2"/>
                   </g>
                   {/* Face */}
                   <g transform="translate(40, 30)">
                       <circle cx="10" cy="10" r="10" fill="white" />
                       <circle ref={addToPupilsRef} cx="10" cy="10" r="3" fill="black" />
                       
                       <circle cx="35" cy="10" r="10" fill="white" />
                       <circle ref={addToPupilsRef} cx="35" cy="10" r="3" fill="black" />

                       <path 
                         d={loginError ? mouthFrown : mouthSmile} 
                         fill="none" 
                         stroke="#7C2D12" 
                         strokeWidth="3" 
                         strokeLinecap="round" 
                         transform="translate(8, 20)"
                         className="transition-all duration-300"
                       />
                   </g>
               </g>

               {/* 4. YELLOW BLOB (Bottom Right) */}
               <g transform="translate(240, 220)">
                   <circle cx="50" cy="50" r="50" fill="#F2C94C" />
                   {/* Hands */}
                   <g className="eye-cover" transform={isPasswordFocused ? "translate(0, -40)" : "translate(0, 0)"}>
                       <circle cx="20" cy="70" r="12" fill="#F2C94C" stroke="#B45309" strokeWidth="2" />
                       <circle cx="80" cy="70" r="12" fill="#F2C94C" stroke="#B45309" strokeWidth="2" />
                   </g>
                   {/* Face */}
                   <g transform="translate(25, 30)">
                        <circle cx="15" cy="15" r="12" fill="white" />
                        <circle ref={addToPupilsRef} cx="15" cy="15" r="4" fill="black" />

                        <circle cx="45" cy="15" r="12" fill="white" />
                        <circle ref={addToPupilsRef} cx="45" cy="15" r="4" fill="black" />

                        <path 
                            d={loginError ? mouthFrown : mouthSmile} 
                            fill="none" 
                            stroke="#78350F" 
                            strokeWidth="3" 
                            strokeLinecap="round" 
                            transform="translate(15, 30)"
                            className="transition-all duration-300"
                        />
                   </g>
               </g>

           </svg>
        </div>

        {/* Right Half: Form */}
        <div className="lg:w-1/2 p-10 lg:p-16 flex flex-col justify-center">
            <div className="text-center mb-8">
                <div className="w-12 h-12 bg-black rounded-xl mx-auto mb-4 flex items-center justify-center text-2xl text-white shadow-lg">👋</div>
                <h1 className="text-3xl font-bold text-stone-900">Welcome Back!</h1>
                <p className="text-stone-500 mt-2">Please enter your details</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-2">Email</label>
                    <input 
                        type="text" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className={`w-full p-4 rounded-xl border-2 outline-none transition-all ${loginError ? 'border-red-300 bg-red-50' : 'border-stone-100 focus:border-black'}`}
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-2">Password</label>
                    <div className="relative">
                        <input 
                            type={showPassword ? "text" : "password"} 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onFocus={() => setIsPasswordFocused(true)}
                            onBlur={() => setIsPasswordFocused(false)}
                            placeholder="••••••••"
                            className={`w-full p-4 rounded-xl border-2 outline-none transition-all ${loginError ? 'border-red-300 bg-red-50' : 'border-stone-100 focus:border-black'}`}
                        />
                        <button 
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-stone-400 hover:text-stone-800"
                        >
                            {showPassword ? 'Hide' : 'Show'}
                        </button>
                    </div>
                </div>

                <div className="flex justify-between items-center text-sm">
                    <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className="rounded border-stone-300 text-black focus:ring-black" />
                        <span className="text-stone-600">Remember for 30 days</span>
                    </label>
                    <button type="button" className="font-bold text-black hover:underline">Forgot password?</button>
                </div>

                <div className="space-y-3 pt-2">
                    <button 
                        type="submit" 
                        className={`w-full py-4 rounded-xl font-bold text-white transition-all transform active:scale-95 shadow-lg ${loginError ? 'bg-red-500 shake' : 'bg-black hover:bg-stone-800'}`}
                    >
                        {loginError ? 'Oops! Check details' : 'Log in'}
                    </button>
                    <button 
                        type="button" 
                        className="w-full py-4 rounded-xl font-bold text-stone-700 bg-white border-2 border-stone-100 hover:bg-stone-50 transition-colors flex items-center justify-center space-x-2"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                        <span>Log in with Google</span>
                    </button>
                </div>
            </form>

            <div className="text-center mt-8">
                <p className="text-stone-500 text-sm">Don't have an account? <button onClick={onSwitchToSignup} className="font-bold text-black hover:underline">Sign Up</button></p>
            </div>
        </div>
      </div>
    </div>
  );
};
