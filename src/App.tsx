/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { NeuralPlaylist, MusicControls } from './components/MusicPlayer';
import { SnakeGame } from './components/SnakeGame';
import { motion } from 'motion/react';
import { DUMMY_TRACKS } from './types';

export default function App() {
  // Music State
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const handleTimeUpdate = () => {
    if (audioRef.current) setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) setDuration(audioRef.current.duration);
  };

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
    setIsPlaying(true);
  };

  const onSeek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  return (
    <div className="w-full h-screen h-[100dvh] flex flex-col bg-[#050507] text-[#e0e0ff] overflow-hidden">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleNext}
      />

      {/* Header Navigation */}
      <nav className="h-16 border-b border-white/10 flex items-center justify-between px-8 glass-panel z-30">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 neon-bg-green rounded-sm rotate-45 animate-pulse" />
          <h1 className="text-xl font-bold tracking-tighter neon-text-cyan">NEON_SYNTH.SNAKE</h1>
        </div>
        
        <div className="flex gap-12 items-center">
          <div className="text-center group cursor-pointer">
            <p className="text-[8px] uppercase tracking-[0.3em] opacity-40 mb-1">SYSTEM_STATUS</p>
            <div className="text-2xl font-black neon-text-cyan flex items-center justify-center gap-3 animate-glitch group-hover:is-glitching italic tracking-tighter">
               OPERATIONAL <div className="w-2 h-2 rounded-full bg-[#00f2ff] shadow-[0_0_10px_#00f2ff] animate-pulse" />
            </div>
          </div>
          <div className="text-center">
            <p className="text-[8px] uppercase tracking-[0.3em] opacity-40 mb-1">ENCRYPTION</p>
            <p className="text-lg font-bold text-white tracking-widest uppercase">AES-256_ACTIVE</p>
          </div>
        </div>
      </nav>

      <main className="flex-1 flex overflow-hidden relative">
        {/* Left Sidebar - Neural Playlist */}
        <aside className="w-80 glass-panel border-r border-white/5 p-8 flex flex-col gap-6 overflow-y-auto">
          <NeuralPlaylist 
            currentTrackIndex={currentTrackIndex} 
            onSelectTrack={(idx) => {
              setCurrentTrackIndex(idx);
              setIsPlaying(true);
            }} 
          />
          
          <div className="mt-auto p-4 rounded neon-border bg-cyan-400/5">
            <p className="text-[10px] uppercase tracking-[0.2em] text-cyan-400 mb-1 font-bold">Protocol Info</p>
            <p className="text-[11px] opacity-60 leading-relaxed">
              Neural sync active. All audio streams filtered through AI-Gen lattices.
            </p>
          </div>
        </aside>

        {/* Center Section - Immersive Game Canvas */}
        <section className="flex-1 relative flex items-center justify-center bg-black overflow-hidden">
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at center, #00f2ff 0%, transparent 70%)' }} />
          <div className="absolute inset-0 game-grid opacity-20 pointer-events-none" />
          
          <div className="z-10 animate-in fade-in zoom-in duration-1000">
            <SnakeGame />
          </div>
        </section>

        {/* Right Sidebar - System Stats */}
        <aside className="w-72 glass-panel border-l border-white/5 p-8 flex flex-col overflow-y-auto">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] opacity-70 mb-6">System Status</h2>
          
          <div className="space-y-6">
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-[11px] opacity-50 uppercase tracking-widest">
                <span>Uptime</span>
                <span className="text-white">01:42:09</span>
              </div>
              <div className="w-full h-0.5 bg-white/5 overflow-hidden">
                 <motion.div className="h-full bg-cyan-400" initial={{ width: 0 }} animate={{ width: '65%' }} />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-[11px] opacity-50 uppercase tracking-widest">
                <span>Latency</span>
                <span className="text-green-400">12ms</span>
              </div>
              <div className="w-full h-0.5 bg-white/5 overflow-hidden">
                 <motion.div className="h-full bg-green-400" initial={{ width: 0 }} animate={{ width: '15%' }} />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-[11px] opacity-50 uppercase tracking-widest">
                <span>Neural Bandwidth</span>
                <span className="text-white">880 GB/s</span>
              </div>
              <div className="w-full h-0.5 bg-white/5 overflow-hidden">
                 <motion.div className="h-full bg-cyan-400" initial={{ width: 0 }} animate={{ width: '85%' }} />
              </div>
            </div>
          </div>

          <div className="mt-12">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-50 mb-4">Neural Nodes</h3>
            <div className="grid grid-cols-4 gap-2">
               {Array.from({ length: 12 }).map((_, i) => (
                 <motion.div 
                   key={i}
                   animate={{ opacity: [0.2, 1, 0.2] }}
                   transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
                   className={`aspect-square rounded-[1px] ${i % 3 === 0 ? 'bg-cyan-500' : 'bg-white/10'}`}
                 />
               ))}
            </div>
          </div>

          <div className="mt-auto">
             <div className="text-[10px] opacity-30 font-mono italic">
                LOG:// connection_established<br/>
                LOG:// kernel_panic_avoided<br/>
                LOG:// audio_core_in_sync
             </div>
          </div>
        </aside>
      </main>

      {/* Footer Controls */}
      <MusicControls 
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration}
        onToggle={() => setIsPlaying(!isPlaying)}
        onNext={handleNext}
        onPrev={handlePrev}
        onSeek={onSeek}
      />
    </div>
  );
}
