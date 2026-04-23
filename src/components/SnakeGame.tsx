import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, RefreshCw, Play, Pause } from 'lucide-react';

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SPEED = 150;
const SPEED_INCREMENT = 2;

type Point = { x: number; y: number };

export const SnakeGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Point>({ x: 15, y: 15 });
  const [direction, setDirection] = useState<Point>({ x: 0, y: -1 });
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  
  const gameLoopRef = useRef<number>(0);
  const lastUpdateRef = useRef<number>(0);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      };
      const isColliding = currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
      if (!isColliding) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood({ x: 15, y: 15 });
    setDirection({ x: 0, y: -1 });
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
    setSpeed(INITIAL_SPEED);
  };

  const moveSnake = useCallback(() => {
    if (gameOver || isPaused) return;

    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = {
        x: head.x + direction.x,
        y: head.y + direction.y
      };

      // Check collisions with walls
      if (
        newHead.x < 0 || 
        newHead.x >= GRID_SIZE || 
        newHead.y < 0 || 
        newHead.y >= GRID_SIZE
      ) {
        setGameOver(true);
        return prevSnake;
      }

      // Check collisions with self
      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check if food is eaten
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(prev => {
            const next = prev + 10;
            if (next > highScore) setHighScore(next);
            return next;
        });
        setFood(generateFood(newSnake));
        setSpeed(prev => Math.max(50, prev - SPEED_INCREMENT));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, gameOver, isPaused, generateFood, highScore]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
        case 's':
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
        case 'a':
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
        case 'd':
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
        case ' ': // Space to pause
          setIsPaused(prev => !prev);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  const update = (timestamp: number) => {
    if (!lastUpdateRef.current) lastUpdateRef.current = timestamp;
    const elapsed = timestamp - lastUpdateRef.current;

    if (elapsed > speed) {
      moveSnake();
      lastUpdateRef.current = timestamp;
    }

    gameLoopRef.current = requestAnimationFrame(update);
  };

  useEffect(() => {
    gameLoopRef.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(gameLoopRef.current);
  }, [moveSnake, speed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#050507';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Grid (Theme Grid)
    ctx.strokeStyle = 'rgba(0, 242, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * CELL_SIZE, 0);
      ctx.lineTo(i * CELL_SIZE, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * CELL_SIZE);
      ctx.lineTo(canvas.width, i * CELL_SIZE);
      ctx.stroke();
    }

    // Draw Food (Magenta)
    ctx.fillStyle = '#ff00ff';
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#ff00ff';
    ctx.beginPath();
    ctx.arc(food.x * CELL_SIZE + CELL_SIZE/2, food.y * CELL_SIZE + CELL_SIZE/2, (CELL_SIZE - 6)/2, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw Snake (Neon Green)
    snake.forEach((segment, index) => {
      ctx.fillStyle = '#39ff14';
      ctx.shadowBlur = index === 0 ? 20 : 10;
      ctx.shadowColor = '#39ff14';
      ctx.fillRect(segment.x * CELL_SIZE + 2, segment.y * CELL_SIZE + 2, CELL_SIZE - 4, CELL_SIZE - 4);
    });

    ctx.shadowBlur = 0;
  }, [snake, food]);

  return (
    <div className="flex flex-col items-center gap-6 p-10 glass-panel rounded-none neon-border relative overflow-hidden">
      <div className="absolute top-4 left-4 text-[10px] opacity-30 font-mono">X: {snake[0].x.toString().padStart(3, '0')} Y: {snake[0].y.toString().padStart(3, '0')}</div>
      <div className="absolute bottom-4 right-4 text-[10px] opacity-30 font-mono tracking-widest">BUFFER: {gameOver ? 'TERMINATED' : 'ACTIVE'}</div>

      <div className="relative">
        <canvas
          ref={canvasRef}
          width={GRID_SIZE * CELL_SIZE}
          height={GRID_SIZE * CELL_SIZE}
          className="bg-black/40 border border-[#00f2ff]/20"
        />
        
        <AnimatePresence>
          {(gameOver || isPaused) && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm z-20"
            >
              {gameOver ? (
                <>
                  <motion.h2 
                    className="text-4xl font-black neon-text-magenta mb-4 uppercase tracking-tighter"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    SYSTEM_FAILURE
                  </motion.h2>
                  <button
                    onClick={resetGame}
                    className="px-8 py-3 neon-border bg-white/5 hover:bg-white/10 text-white font-bold uppercase tracking-[0.2em] transition-all hover:scale-105"
                  >
                    REBOOT_LINK
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setIsPaused(false)}
                    className="w-20 h-20 rounded-full border border-[#00f2ff]/50 flex items-center justify-center group hover:bg-[#00f2ff]/10"
                  >
                    <Play size={32} className="neon-text-cyan ml-1" />
                  </button>
                  <p className="neon-text-cyan mt-4 uppercase tracking-[0.3em] text-[10px]">Awaiting Instructions</p>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
