
import React, { useState, useEffect, useRef } from 'react';

interface CoopGameProps {
  onExit: () => void;
}

export const CoopGame: React.FC<CoopGameProps> = ({ onExit }) => {
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'ended'>('intro');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [feedback, setFeedback] = useState<string>("");
  const [timeLeft, setTimeLeft] = useState(60);

  // Animation Refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>(0);
  const stateRef = useRef({
      circleRadius: 20,
      direction: 1, // 1 expanding, -1 contracting
      targetRadius: 100,
      tolerance: 15,
      speed: 0.8,
      lastTapTime: 0,
      ripples: [] as { x: number, y: number, r: number, alpha: number }[],
      partnerSync: 0, // 0 to 100%
  });

  // Start Game Loop
  useEffect(() => {
    if (gameState === 'playing') {
       const render = () => {
           const canvas = canvasRef.current;
           const ctx = canvas?.getContext('2d');
           const state = stateRef.current;

           if (canvas && ctx) {
               // Update State
               state.circleRadius += state.speed * state.direction;
               
               // Reverse Direction at bounds
               if (state.circleRadius > 140) {
                   state.direction = -1;
               } else if (state.circleRadius < 10) {
                   state.direction = 1;
               }

               // Simulated Partner "Tap" visual
               // If circle is in target zone, partner has a chance to create a visual ripple
               if (Math.abs(state.circleRadius - state.targetRadius) < 5 && Math.random() > 0.95) {
                    state.ripples.push({ x: canvas.width/2, y: canvas.height/2, r: state.targetRadius, alpha: 0.6 });
               }

               // Draw Background
               ctx.clearRect(0, 0, canvas.width, canvas.height);
               
               const centerX = canvas.width / 2;
               const centerY = canvas.height / 2;

               // Draw Target Ring (The Harmony Zone)
               ctx.beginPath();
               ctx.arc(centerX, centerY, state.targetRadius, 0, Math.PI * 2);
               ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
               ctx.lineWidth = 4;
               ctx.stroke();

               // Draw Breathing Circle
               ctx.beginPath();
               ctx.arc(centerX, centerY, state.circleRadius, 0, Math.PI * 2);
               ctx.fillStyle = 'rgba(94, 129, 116, 0.4)'; // Brand color
               ctx.fill();
               ctx.lineWidth = 3;
               ctx.strokeStyle = '#5F8174';
               ctx.stroke();

               // Draw Ripples (Feedback)
               state.ripples.forEach((ripple, index) => {
                   ripple.r += 2;
                   ripple.alpha -= 0.02;
                   
                   ctx.beginPath();
                   ctx.arc(ripple.x, ripple.y, ripple.r, 0, Math.PI * 2);
                   ctx.strokeStyle = `rgba(255, 255, 255, ${ripple.alpha})`;
                   ctx.lineWidth = 2;
                   ctx.stroke();

                   if (ripple.alpha <= 0) state.ripples.splice(index, 1);
               });
           }
           animationFrameRef.current = requestAnimationFrame(render);
       };
       render();
    }
    return () => cancelAnimationFrame(animationFrameRef.current);
  }, [gameState]);

  // Timer
  useEffect(() => {
      if (gameState === 'playing') {
          const timer = setInterval(() => {
              setTimeLeft(prev => {
                  if (prev <= 1) {
                      setGameState('ended');
                      return 0;
                  }
                  return prev - 1;
              });
          }, 1000);
          return () => clearInterval(timer);
      }
  }, [gameState]);

  const handleTap = () => {
      if (gameState !== 'playing') return;
      
      const state = stateRef.current;
      const diff = Math.abs(state.circleRadius - state.targetRadius);

      if (diff < state.tolerance) {
          // Success
          const points = Math.floor((1 - diff/state.tolerance) * 100);
          setScore(prev => prev + points);
          setStreak(prev => prev + 1);
          setFeedback(points > 90 ? "Perfect Harmony! ✨" : "In Sync");
          
          // Visual feedback
          state.ripples.push({ x: 150, y: 150, r: state.circleRadius, alpha: 1 });
          
          // Speed up slightly with streak
          state.speed = Math.min(2.5, 0.8 + (streak * 0.05));

      } else {
          // Miss
          setStreak(0);
          setFeedback("Drifting...");
          state.speed = 0.8; // Reset speed
      }
  };

  return (
    <div className="h-[calc(100vh-140px)] rounded-[2.5rem] bg-slate-900 text-white overflow-hidden relative shadow-2xl border border-slate-700">
        
        {/* Background Ambient */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-800 to-slate-900 z-0"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-brand-500/10 rounded-full blur-3xl z-0"></div>

        {gameState === 'intro' && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-8 text-center animate-fade-in">
                <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center text-5xl mb-6 shadow-glow border border-white/20">
                    🌊
                </div>
                <h1 className="text-3xl font-serif font-bold mb-2">Harmony Ripple</h1>
                <p className="text-slate-300 mb-8 leading-relaxed">
                    Unwind with your peer. <br/>
                    Tap together when the breathing circle hits the <span className="text-brand-300 font-bold">Ring</span>.
                </p>
                <button 
                    onClick={() => setGameState('playing')}
                    className="px-8 py-4 bg-brand-600 text-white rounded-2xl font-bold shadow-lg shadow-brand-500/30 hover:bg-brand-500 transition-all hover:scale-105"
                >
                    Start Sync
                </button>
            </div>
        )}

        {gameState === 'playing' && (
            <div className="relative z-10 w-full h-full flex flex-col" onMouseDown={handleTap} onTouchStart={handleTap}>
                {/* HUD */}
                <div className="flex justify-between items-center p-6">
                    <div>
                        <div className="text-xs text-slate-400 uppercase tracking-widest font-bold">Sync Score</div>
                        <div className="text-2xl font-mono font-bold text-brand-300">{score}</div>
                    </div>
                    <div className="text-center">
                         <div className={`text-xl font-serif font-bold transition-all duration-300 ${feedback.includes('Drifting') ? 'text-rose-400' : 'text-white'}`}>
                             {feedback || "Find the rhythm"}
                         </div>
                    </div>
                    <div className="text-right">
                        <div className="text-xs text-slate-400 uppercase tracking-widest font-bold">Time</div>
                        <div className="text-xl font-mono font-bold">{timeLeft}s</div>
                    </div>
                </div>

                {/* Canvas Area */}
                <div className="flex-1 flex items-center justify-center relative cursor-pointer">
                    <canvas 
                        ref={canvasRef} 
                        width={300} 
                        height={300} 
                        className="rounded-full"
                    />
                    <div className="absolute bottom-10 text-xs text-slate-500 font-bold uppercase tracking-widest animate-pulse">
                        Tap to Sync
                    </div>
                </div>

                {/* Peer Indicator */}
                <div className="p-6 flex justify-center items-center space-x-3 opacity-80">
                    <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500 flex items-center justify-center text-xs">
                        P
                    </div>
                    <div className="text-xs font-bold text-slate-400">Peer is syncing...</div>
                </div>
            </div>
        )}

        {gameState === 'ended' && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-8 text-center animate-fade-in bg-slate-900/90 backdrop-blur-sm">
                <div className="text-6xl mb-4">✨</div>
                <h2 className="text-2xl font-bold font-serif mb-1">Session Complete</h2>
                <div className="text-4xl font-mono font-bold text-brand-300 mb-6">{score}</div>
                
                <p className="text-slate-300 text-sm mb-8">
                    Your rhythm matched perfectly. <br/> You've earned 50 Karma Points.
                </p>
                
                <div className="flex space-x-3 w-full">
                    <button 
                        onClick={() => {
                            setGameState('playing');
                            setScore(0);
                            setStreak(0);
                            setTimeLeft(60);
                        }}
                        className="flex-1 py-3 bg-slate-700 text-white rounded-xl font-bold hover:bg-slate-600 transition-colors"
                    >
                        Replay
                    </button>
                    <button 
                        onClick={onExit}
                        className="flex-1 py-3 bg-brand-600 text-white rounded-xl font-bold hover:bg-brand-500 transition-colors shadow-lg"
                    >
                        Finish
                    </button>
                </div>
            </div>
        )}
    </div>
  );
};
