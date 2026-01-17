
import React, { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';

interface TetheredGameProps {
  onExit: () => void;
}

export const TetheredGame: React.FC<TetheredGameProps> = ({ onExit }) => {
  const [gameState, setGameState] = useState<'playing' | 'won' | 'lost'>('playing');
  const [height, setHeight] = useState(0);
  
  const sceneRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Refs for Game Engine to avoid React state re-renders in game loop
  const engineRef = useRef<Matter.Engine | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);
  
  // Input State Refs (Host/Client would sync this)
  const keysRef = useRef<{ [key: string]: boolean }>({});

  useEffect(() => {
    // --- MATTER.JS SETUP ---
    const Engine = Matter.Engine,
          Render = Matter.Render,
          Runner = Matter.Runner,
          Bodies = Matter.Bodies,
          Composite = Matter.Composite,
          Constraint = Matter.Constraint,
          Body = Matter.Body,
          Vector = Matter.Vector;

    // Create Engine
    const engine = Engine.create();
    engine.gravity.y = 1.2; // Slightly heavier gravity for better platforming feel
    engineRef.current = engine;

    // Canvas Dimensions
    const width = sceneRef.current?.clientWidth || 360;
    const height = sceneRef.current?.clientHeight || 640;

    // --- GAME ENTITIES ---

    // Players
    const playerA = Bodies.rectangle(width / 2 - 40, height - 100, 30, 30, {
      friction: 0.05,
      restitution: 0.0,
      render: { fillStyle: '#60A5FA' }, // Blue
      label: 'PlayerA'
    });

    const playerB = Bodies.rectangle(width / 2 + 40, height - 100, 30, 30, {
      friction: 0.05,
      restitution: 0.0,
      render: { fillStyle: '#F472B6' }, // Pink
      label: 'PlayerB'
    });

    // The Rope (Constraint)
    const rope = Constraint.create({
      bodyA: playerA,
      bodyB: playerB,
      stiffness: 0.05, // Elasticity
      damping: 0.05,
      length: 120,
      render: {
        visible: false, // We will draw this manually for neon effect
      }
    });

    // Platforms
    const platforms: Matter.Body[] = [];
    const wallThickness = 100;
    
    // Initial Floor
    const floor = Bodies.rectangle(width / 2, height + 50, width, 100, { isStatic: true, label: 'Floor' });
    platforms.push(floor);

    // Walls
    const leftWall = Bodies.rectangle(-wallThickness/2, 0, wallThickness, 20000, { isStatic: true });
    const rightWall = Bodies.rectangle(width + wallThickness/2, 0, wallThickness, 20000, { isStatic: true });
    platforms.push(leftWall, rightWall);

    // Procedural Platform Generation
    let currentY = height - 150;
    for (let i = 0; i < 50; i++) {
        currentY -= (100 + Math.random() * 80); // Gap between platforms
        const pWidth = 80 + Math.random() * 100;
        const pX = Math.random() * (width - pWidth) + pWidth/2;
        
        platforms.push(
            Bodies.rectangle(pX, currentY, pWidth, 20, { 
                isStatic: true,
                render: { fillStyle: '#F8FAFC' },
                label: 'Platform'
            })
        );
    }
    
    // Win Condition Sensor
    const winSensor = Bodies.rectangle(width/2, currentY - 200, width, 50, { 
        isStatic: true, 
        isSensor: true, 
        label: 'WinSensor',
        render: { fillStyle: '#4ADE80' }
    });
    platforms.push(winSensor);

    Composite.add(engine.world, [playerA, playerB, rope, ...platforms]);

    // --- GAME LOOP & INPUT HANDLING ---

    // Key Listeners
    const handleKeyDown = (e: KeyboardEvent) => { keysRef.current[e.code] = true; };
    const handleKeyUp = (e: KeyboardEvent) => { keysRef.current[e.code] = false; };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Custom Render Loop (using requestAnimationFrame directly on canvas context)
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    
    let animationId: number;
    let cameraY = 0;
    let deathFloorY = height + 100;

    const renderLoop = () => {
        if (!ctx || !canvas) return;

        // 1. Physics Update
        Engine.update(engine, 1000 / 60);

        // 2. Input Logic (Apply Forces)
        const speed = 0.003;
        const jumpForce = -0.045;

        // Player A Controls (WASD)
        if (keysRef.current['KeyA']) Body.applyForce(playerA, playerA.position, { x: -speed, y: 0 });
        if (keysRef.current['KeyD']) Body.applyForce(playerA, playerA.position, { x: speed, y: 0 });
        if (keysRef.current['KeyW']) {
             // Basic ground check (velocity approx 0)
             if (Math.abs(playerA.velocity.y) < 0.5) Body.applyForce(playerA, playerA.position, { x: 0, y: jumpForce });
        }

        // Player B Controls (Arrows)
        if (keysRef.current['ArrowLeft']) Body.applyForce(playerB, playerB.position, { x: -speed, y: 0 });
        if (keysRef.current['ArrowRight']) Body.applyForce(playerB, playerB.position, { x: speed, y: 0 });
        if (keysRef.current['ArrowUp']) {
             if (Math.abs(playerB.velocity.y) < 0.5) Body.applyForce(playerB, playerB.position, { x: 0, y: jumpForce });
        }

        // 3. Game Logic
        
        // Camera Follow (Average Y of players)
        const targetY = (playerA.position.y + playerB.position.y) / 2;
        const offset = height / 2 - targetY;
        cameraY += (offset - cameraY) * 0.1; // Smooth lerp

        // Death Floor Rising
        deathFloorY -= 0.5; // Slow rise
        if (playerA.position.y > deathFloorY || playerB.position.y > deathFloorY) {
            setGameState('lost');
            return; // Stop loop
        }
        
        // Win Condition
        if (playerA.position.y < currentY || playerB.position.y < currentY) {
            setGameState('won');
            return;
        }

        // Update Score UI
        setHeight(Math.floor(Math.abs(Math.min(0, targetY - (height - 100)) / 10)));

        // 4. Drawing
        ctx.clearRect(0, 0, width, height);
        ctx.save();
        ctx.translate(0, cameraY); // Apply camera

        // Draw Platforms
        ctx.fillStyle = '#F8FAFC';
        platforms.forEach(p => {
            if (p.label === 'WinSensor') ctx.fillStyle = 'rgba(74, 222, 128, 0.3)';
            else if (p.label === 'Floor') ctx.fillStyle = '#334155';
            else ctx.fillStyle = '#F8FAFC';
            
            ctx.beginPath();
            const vertices = p.vertices;
            ctx.moveTo(vertices[0].x, vertices[0].y);
            for (let j = 1; j < vertices.length; j++) {
                ctx.lineTo(vertices[j].x, vertices[j].y);
            }
            ctx.lineTo(vertices[0].x, vertices[0].y);
            ctx.fill();
        });

        // Draw Rope (Neon Effect)
        const dist = Vector.magnitude(Vector.sub(playerA.position, playerB.position));
        const tension = Math.min(dist / 120, 1); // 0 to 1
        
        ctx.shadowBlur = 10;
        ctx.shadowColor = tension > 0.9 ? '#F43F5E' : '#60A5FA';
        ctx.strokeStyle = tension > 0.9 ? '#F43F5E' : '#60A5FA';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(playerA.position.x, playerA.position.y);
        ctx.lineTo(playerB.position.x, playerB.position.y);
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Draw Player A
        ctx.fillStyle = '#60A5FA'; // Blue
        ctx.fillRect(playerA.position.x - 15, playerA.position.y - 15, 30, 30);
        
        // Draw Player B
        ctx.fillStyle = '#F472B6'; // Pink
        ctx.fillRect(playerB.position.x - 15, playerB.position.y - 15, 30, 30);

        // Draw Death Floor (Visual)
        ctx.fillStyle = 'rgba(244, 63, 94, 0.2)'; // Red glow
        ctx.fillRect(0, deathFloorY, width, height * 2);
        
        ctx.restore();
        animationId = requestAnimationFrame(renderLoop);
    };

    renderLoop();

    // Cleanup
    return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
        cancelAnimationFrame(animationId);
        Engine.clear(engine);
    };
  }, []); // Run once on mount

  return (
    <div className="fixed inset-0 z-50 bg-slate-900 text-white flex flex-col" ref={sceneRef}>
      
      {/* HUD */}
      <div className="absolute top-4 left-4 right-4 flex justify-between z-10 pointer-events-none">
          <div>
              <h2 className="text-xl font-bold font-serif text-white shadow-glow">Tethered</h2>
              <div className="flex space-x-4 text-xs mt-1 opacity-80">
                  <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 bg-blue-400 rounded-sm"></div>
                      <span>WASD</span>
                  </div>
                  <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 bg-pink-400 rounded-sm"></div>
                      <span>ARROWS</span>
                  </div>
              </div>
          </div>
          <div className="text-right">
              <div className="text-2xl font-mono font-bold text-emerald-400">{height}m</div>
          </div>
      </div>

      {/* Canvas */}
      <canvas 
        ref={canvasRef} 
        width={window.innerWidth > 450 ? 450 : window.innerWidth} 
        height={window.innerHeight}
        className="mx-auto shadow-2xl"
      />

      {/* Overlays */}
      {(gameState === 'lost' || gameState === 'won') && (
          <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-sm flex flex-col items-center justify-center p-8 animate-fade-in z-20">
              <div className="text-6xl mb-4">{gameState === 'won' ? '🚀' : '💀'}</div>
              <h2 className="text-4xl font-serif font-bold mb-2">
                  {gameState === 'won' ? 'Ascension Complete' : 'Connection Severed'}
              </h2>
              <p className="text-slate-400 mb-8">Max Height: {height}m</p>
              
              <div className="space-y-3 w-full max-w-xs">
                  <button 
                    onClick={() => window.location.reload()} // Quick restart hack for prototype
                    className="w-full py-4 bg-white text-slate-900 rounded-xl font-bold hover:scale-105 transition-transform"
                  >
                      Retry (-50pts)
                  </button>
                  <button 
                    onClick={onExit}
                    className="w-full py-4 border border-slate-700 text-slate-300 rounded-xl font-bold hover:bg-slate-800 transition-colors"
                  >
                      Return to Lounge
                  </button>
              </div>
          </div>
      )}
    </div>
  );
};
